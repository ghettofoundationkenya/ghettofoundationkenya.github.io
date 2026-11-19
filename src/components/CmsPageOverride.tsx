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
};

type CmsContent = {
  lead?: string;
  intro?: string;
  hero_badge?: string;
  sections?: CmsSection[];
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

const CmsPageView = ({ page }: { page: CmsPage }) => {
  const content = page.content || {};
  return (
    <Layout>
      <section className="relative isolate overflow-hidden px-4 py-24 text-white">
        {page.hero_image && <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url("${page.hero_image}")` }} />}
        <div className="absolute inset-0 -z-10 bg-slate-950/70" />
        <div className="mx-auto max-w-5xl text-center">
          {content.hero_badge && <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{content.hero_badge}</p>}
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{page.title}</h1>
          {content.lead && <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">{content.lead}</p>}
        </div>
      </section>
      {content.intro && <section className="px-4 py-14"><div className="mx-auto max-w-3xl"><Paragraphs body={content.intro} /></div></section>}
      {(content.sections || []).map((section, index) => (
        <section key={index} className={`px-4 py-14 ${section.background === "muted" ? "bg-gray-50" : "bg-white"}`}>
          <div className="mx-auto max-w-6xl">
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

export default function CmsPageOverride({ slug, fallback }: { slug: string; fallback: ReactNode }) {
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
  return page ? <CmsPageView page={page} /> : <>{fallback}</>;
}
