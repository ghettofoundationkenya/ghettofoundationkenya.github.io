import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type CmsSection = {
  type?: "text" | "image" | "cards" | "stats" | "quote" | "list" | "cta";
  heading?: string;
  body?: string | string[];
  image?: string;
  alt?: string;
  items?: Array<{ title?: string; text?: string; value?: string; image?: string; url?: string; label?: string }>;
  quote?: string;
  button_label?: string;
  button_url?: string;
  background?: "muted" | "plain";
  design?: { width?: number; align?: string; background?: string; padding?: number };
};

type CmsContent = {
  designWorkspace?: { version?: number; blocks?: Array<any>; theme?: { accent?: string; background?: string; text?: string; font?: string } };
  visualEdits?: Array<{ selector: string; kind: "text" | "image"; value: string }>;
  lead?: string;
  intro?: string;
  hero_badge?: string;
  sections?: CmsSection[];
  design?: { contentWidth?: number; sectionGap?: number; heroHeight?: number; alignment?: string };
};

type CmsPage = {
  title: string;
  hero_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  content: CmsContent;
};

const Paragraphs = ({ body }: { body?: string | string[] }) => {
  const paragraphs = Array.isArray(body) ? body : body ? [body] : [];
  return <div className="space-y-4 text-lg leading-relaxed text-gray-700">{paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>;
};

const DesignWorkspaceView = ({ page, workspace }: { page: CmsPage; workspace: NonNullable<CmsContent["designWorkspace"]> }) => {
  const theme = workspace.theme || {};
  const blocks = workspace.blocks || [];
  const embedUrl = (block: any): string => {
    const raw = (block.url || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:") return "";
      if (block.type === "youtube") {
        if (url.hostname.includes("youtu.be")) return "https://www.youtube.com/embed/" + url.pathname.replace(/^\//, "");
        if (url.hostname.includes("youtube.com")) return url.pathname === "/watch" ? "https://www.youtube.com/embed/" + url.searchParams.get("v") : raw;
      }
      if (block.type === "docs") return raw.replace(/\/edit(?:\?.*)?$/, "/preview");
      if (block.type === "slides") return raw.replace(/\/edit(?:\?.*)?$/, "/embed");
      if (block.type === "sheets") return raw.replace(/\/edit(?:\?.*)?$/, "/preview");
      return raw;
    } catch { return ""; }
  };
  return <Layout>
    <main className="min-h-screen" style={{ background: theme.background || "#ffffff", color: theme.text || "#202020", fontFamily: theme.font || "Inter, sans-serif" }}>
      <header className="border-b border-black/10 px-5 py-5"><div className="mx-auto max-w-6xl text-sm font-bold tracking-wide">GHETTO FOUNDATION <span className="float-right font-normal opacity-70">{page.title}</span></div></header>
      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <h1 className="mb-8 text-4xl font-bold md:text-5xl">{page.title}</h1>
        <div className="space-y-7">
          {blocks.map((b: any, index: number) => {
            const width = Math.min(100, Math.max(25, Number(b.width) || 100));
            const frameUrl = embedUrl(b);
            return <section key={b.id || index} className="mx-auto" style={{ width: width + "%" }}>
              {b.type === "text" && <div><h2 className="mb-3 text-2xl font-bold">{b.title}</h2><div className="whitespace-pre-wrap text-lg leading-relaxed">{b.text}</div></div>}
              {(b.type === "image" || b.type === "upload") && b.image && <figure><img src={b.image} alt={b.alt || b.title || page.title} loading="lazy" className="h-auto max-h-[680px] w-full rounded-xl object-cover"/>{b.alt && <figcaption className="mt-2 text-sm opacity-70">{b.alt}</figcaption>}</figure>}
              {b.type === "carousel" && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[b.image, ...(b.items || [])].filter(Boolean).map((src: string, i: number) => <img key={i} src={src} alt={b.alt || (b.title + " " + (i + 1))} loading="lazy" className="h-56 w-full rounded-xl object-cover"/> )}</div>}
              {b.type === "button" && b.url && <a href={b.url} className="inline-flex rounded-lg px-6 py-3 font-semibold text-white" style={{ background: theme.accent || "#e87524" }}>{b.title || "Learn more"}</a>}
              {b.type === "divider" && <hr className="border-current/20"/>}
              {b.type === "spacer" && <div aria-hidden="true" style={{ height: Math.min(400, Math.max(8, Number(b.height) || 64)) }}/>}
              {b.type === "collapsible" && <details className="rounded-xl border border-current/15 p-5"><summary className="cursor-pointer text-lg font-bold">{b.title}</summary><p className="mt-3 whitespace-pre-wrap leading-relaxed">{b.text}</p></details>}
              {b.type === "toc" && <nav className="rounded-xl bg-black/5 p-5"><strong>On this page</strong><ul className="mt-3 list-disc pl-5">{blocks.filter((x: any) => x.type === "text" && x.title).map((x: any) => <li key={x.id}>{x.title}</li>)}</ul></nav>}
              {b.type === "layout" && <div className="grid gap-5 md:grid-cols-2"><div className="rounded-xl border border-current/15 p-5"><h3 className="font-semibold">Column 1</h3><p className="mt-2 opacity-70">Add content to this layout in the design editor.</p></div><div className="rounded-xl border border-current/15 p-5"><h3 className="font-semibold">Column 2</h3><p className="mt-2 opacity-70">Add content to this layout in the design editor.</p></div></div>}
              {b.type === "social" && b.url && <a href={b.url} rel="noreferrer" target="_blank" className="font-semibold underline" style={{ color: theme.accent || "#e87524" }}>{b.title || "Follow us"}</a>}
              {b.type === "html" && <div className="rounded-xl border border-current/15 p-4"><p className="font-semibold">External embed</p>{b.url && <a href={b.url} target="_blank" rel="noreferrer" className="underline" style={{ color: theme.accent || "#e87524" }}>Open embedded content</a>}<p className="mt-2 text-xs opacity-60">For security, custom HTML is not executed on the public page.</p></div>}
              {["embed","youtube","calendar","map","docs","slides","sheets","forms","charts","drive","drive-folder"].includes(b.type) && <div className="overflow-hidden rounded-xl border border-current/15"><div className="px-4 py-3 text-sm font-semibold">{b.title || b.type}</div>{frameUrl ? <iframe src={frameUrl} title={b.title || b.type} loading="lazy" className="h-[420px] w-full border-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="strict-origin-when-cross-origin"/> : <div className="p-5 text-sm opacity-70">Add a valid HTTPS embed URL to display this content.</div>}</div>}
            </section>;
          })}
        </div>
      </section>
    </main>
  </Layout>;
};

const CmsPageView = ({ page }: { page: CmsPage }) => {
  const content = page.content || {};
  if (content.designWorkspace?.version === 1) return <DesignWorkspaceView page={page} workspace={content.designWorkspace} />;
  return (
    <Layout>
      <section className="relative isolate overflow-hidden px-4 py-24 text-white" style={{ minHeight: content.design?.heroHeight || undefined, display: "flex", alignItems: "center" }}>
        {page.hero_image && <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url("${page.hero_image}")` }} />}
        <div className="absolute inset-0 -z-10 bg-slate-950/70" />
        <div className="mx-auto w-full max-w-5xl text-center" style={{ maxWidth: content.design?.contentWidth ? `${content.design.contentWidth}%` : undefined, textAlign: (content.design?.alignment as any) || "center" }}>
          {content.hero_badge && <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{content.hero_badge}</p>}
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{page.title}</h1>
          {content.lead && <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">{content.lead}</p>}
        </div>
      </section>
      {content.intro && <section className="px-4 py-14"><div className="mx-auto max-w-3xl"><Paragraphs body={content.intro} /></div></section>}
      {(content.sections || []).map((section, index) => (
        <section key={index} className={`px-4 ${section.background === "muted" ? "bg-gray-50" : "bg-white"}`} style={{ paddingTop: content.design?.sectionGap ? `${content.design.sectionGap / 2}px` : "3.5rem", paddingBottom: content.design?.sectionGap ? `${content.design.sectionGap / 2}px` : "3.5rem" }}>
          <div className="mx-auto max-w-6xl" style={{ width: section.design?.width ? `${section.design.width}%` : undefined, textAlign: (section.design?.align as any) || undefined, padding: section.design?.padding ? `${section.design.padding}px` : undefined, background: section.design?.background === "muted" ? "#f3e5d8" : undefined, borderRadius: section.design?.background === "muted" ? "1rem" : undefined }}>
            {section.heading && <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">{section.heading}</h2>}
            {section.type === "image" && section.image && <img src={section.image} alt={section.alt || section.heading || page.title} loading="lazy" className="mx-auto max-h-[620px] w-full rounded-2xl object-cover shadow-md" />}
            {(!section.type || section.type === "text") && <div className="mx-auto max-w-3xl"><Paragraphs body={section.body} /></div>}
            {section.type === "list" && <div className="mx-auto max-w-3xl"><Paragraphs body={section.body} /><ul className="mt-6 list-disc space-y-3 pl-6 text-lg text-gray-700">{(section.items || []).map((item, i) => <li key={i}>{item.title && <strong>{item.title}: </strong>}{item.text || item.label}</li>)}</ul></div>}
            {section.type === "quote" && <blockquote className="mx-auto max-w-4xl border-l-4 border-community-warm pl-6 text-2xl italic leading-relaxed text-gray-700">{section.quote || (Array.isArray(section.body) ? section.body[0] : section.body)}</blockquote>}
            {section.type === "stats" && <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{(section.items || []).map((item, i) => <Card key={i}><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-community-warm">{item.value}</p><p className="mt-2 text-sm text-gray-600">{item.label || item.title}</p></CardContent></Card>)}</div>}
            {section.type === "cards" && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{(section.items || []).map((item, i) => <Card key={i} className="overflow-hidden">{item.image && <img src={item.image} alt={item.title || ""} loading="lazy" className="h-48 w-full object-cover" />}<CardContent className="p-6"><h3 className="mb-2 text-xl font-bold">{item.title}</h3><p className="text-gray-600">{item.text}</p>{item.url && <a href={item.url} className="mt-4 inline-flex items-center font-semibold text-community-warm">{item.label || "Learn more"} <ArrowRight className="ml-2 h-4 w-4" /></a>}</CardContent></Card>)}</div>}
            {section.type === "cta" && <div className="rounded-2xl bg-slate-900 px-6 py-10 text-center text-white"><Paragraphs body={section.body} />{section.button_url && <Button asChild className="mt-6 btn-hero"><a href={section.button_url}>{section.button_label || "Learn more"} {section.button_url.startsWith("http") ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}</a></Button>}</div>}
          </div>
        </section>
      ))}
      <div className="px-4 pb-12 text-center"><Link to="/" className="font-medium text-community-warm hover:underline">← Back to home</Link></div>
    </Layout>
  );
};

const VisualEditOverlay = ({ edits, children }: { edits: NonNullable<CmsContent["visualEdits"]>; children: ReactNode }) => {
  useEffect(() => {\n    const apply = () => edits.forEach((edit) => {\n      try {\n        const element = document.querySelector(edit.selector) as HTMLElement | HTMLImageElement | null;\n        if (!element) return;\n        if (edit.kind === "image" && element instanceof HTMLImageElement && element.getAttribute("src") !== edit.value) element.src = edit.value;\n        if (edit.kind === "text" && element.textContent !== edit.value) element.textContent = edit.value;\n      } catch { /* Ignore selectors that no longer exist on the source page. */ }\n    });\n    apply();\n    const observer = new MutationObserver(apply);\n    observer.observe(document.body, { childList: true, subtree: true });\n    return () => observer.disconnect();\n  }, [edits]);\n  return <>{children}</>;\n};\n\nexport default function CmsPageOverride({ slug, fallback }: { slug: string; fallback: ReactNode }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    setChecked(false);
    setPage(null);
    supabase.from("site_pages" as any).select("title, hero_image, seo_title, seo_description, content")
      .eq("slug", slug).eq("status", "published").maybeSingle()
      .then(({ data, error }: any) => {
        if (!active) return;
        if (!error && data) setPage(data as CmsPage);
        setChecked(true);
      });
    return () => { active = false; };
  }, [slug]);

  if (!checked) return <div className="min-h-screen bg-background" aria-label="Loading page" />;
  if (!page) return <>{fallback}</>;
  if (page.content?.designWorkspace?.version === 1) return <CmsPageView page={page} />;\n  if (page.content?.visualEdits?.length) return <VisualEditOverlay edits={page.content.visualEdits}>{fallback}</VisualEditOverlay>;\n  return <CmsPageView page={page} />;
}
