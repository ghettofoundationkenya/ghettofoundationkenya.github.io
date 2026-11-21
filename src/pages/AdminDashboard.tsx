import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WebsiteDesignEditor from "@/components/WebsiteDesignEditor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, ChevronDown, Eye, FileText, Globe, ImagePlus, Layout, LogOut, Save, Type, Undo2, Redo2, Monitor, Smartphone, Tablet } from "lucide-react";

type PageItem = { slug: string; title: string; path: string; group: string };
type VisualEdit = { selector: string; kind: "text" | "image"; original: string; value: string; tag: string };
const GROUPS: { name: string; pages: PageItem[] }[] = [
 { name: "Main pages", pages: [{slug:"home",title:"Home",path:"/",group:"Main pages"},{slug:"about",title:"About",path:"/about",group:"Main pages"},{slug:"publications",title:"Publications & Media",path:"/publications",group:"Main pages"},{slug:"donate",title:"Donate",path:"/donate",group:"Main pages"}]},
 { name: "PartnerUp!", pages: [{slug:"partnerup",title:"PartnerUp!",path:"/partnerup",group:"PartnerUp!"},{slug:"partnerup/democreate",title:"DEMOCREATE",path:"/partnerup/democreate",group:"PartnerUp!"},{slug:"partnerup/clupp",title:"CLUPP Safety & Security",path:"/partnerup/clupp",group:"PartnerUp!"},{slug:"partnerup/securing-the-local",title:"Securing the Local",path:"/partnerup/securing-the-local",group:"PartnerUp!"},{slug:"partnerup/assumptions",title:"Assumptions",path:"/partnerup/assumptions",group:"PartnerUp!"},{slug:"partnerup/resilience-pathways",title:"Resilience Pathways",path:"/partnerup/resilience-pathways",group:"PartnerUp!"}]},
 { name: "Youth", pages: [{slug:"youth",title:"Youth",path:"/youth",group:"Youth"},{slug:"youth/ghetto-youth",title:"Ghetto Youth",path:"/youth/ghetto-youth",group:"Youth"},{slug:"youth/economic-empowerment",title:"Economic Empowerment",path:"/youth/economic-empowerment",group:"Youth"},{slug:"youth/uji-sato",title:"Uji Sato",path:"/youth/uji-sato",group:"Youth"}]},
 { name: "Social Justice", pages: [{slug:"social-justice",title:"Social Justice",path:"/social-justice",group:"Social Justice"},{slug:"social-justice/right-to-life",title:"Right to Life",path:"/social-justice/right-to-life",group:"Social Justice"},{slug:"social-justice/mathare-resilience-hub",title:"Mathare Resilience Hub",path:"/social-justice/mathare-resilience-hub",group:"Social Justice"},{slug:"social-justice/ghetto-stories",title:"Ghetto Stories",path:"/social-justice/ghetto-stories",group:"Social Justice"}]}
];
const allPages = GROUPS.flatMap(g => g.pages);
const selectorFor = (el: Element) => {
 const parts: string[] = []; let node: Element | null = el;
 while (node && node.tagName.toLowerCase() !== "html") {
   let part = node.tagName.toLowerCase();
   if (node.id) { part += "#" + CSS.escape(node.id); parts.unshift(part); break; }
   const parent = node.parentElement;
   if (parent) { const same = Array.from(parent.children).filter(x => x.tagName === node!.tagName); if (same.length > 1) part += ":nth-of-type(" + (same.indexOf(node) + 1) + ")"; }
   parts.unshift(part); node = parent;
 }
 return parts.join(" > ");
};
export default function AdminDashboard() {
 const nav = useNavigate(); const { toast } = useToast(); const frame = useRef<HTMLIFrameElement>(null);
 const [loading,setLoading] = useState(true); const [mode,setMode] = useState<"home"|"content"|"design">("home");
 const [slug,setSlug] = useState("home"); const [edits,setEdits] = useState<VisualEdit[]>([]);
 const [selected,setSelected] = useState<VisualEdit|null>(null); const [busy,setBusy] = useState(false);
 const [device,setDevice] = useState<"desktop"|"tablet"|"mobile">("desktop");
 const [savedDraft,setSavedDraft] = useState(false);
 const current = useMemo(() => allPages.find(p=>p.slug===slug) || allPages[0],[slug]);
 useEffect(() => { (async()=>{ const {data:{session}}=await supabase.auth.getSession(); if(!session){nav("/admin/login");return;}
   const allowed=["sndambuki155@gmail.com","management@ghettofoundationkenya.org"];
   if(!session.user.email || !allowed.includes(session.user.email.toLowerCase())){await supabase.auth.signOut();nav("/admin/login");return;}
   const {data,error}=await supabase.from("user_roles").select("role").eq("user_id",session.user.id).eq("role","admin").maybeSingle();
   if(error || !data){nav("/admin/login");return;} setLoading(false);
 })(); },[nav]);
 const getDocument = () => frame.current?.contentDocument || null;
 const refreshEditor = useCallback(() => {
   const doc=getDocument(); if(!doc) return;
   const markEditable=(root:ParentNode)=>{
     root.querySelectorAll?.("h1,h2,h3,h4,p,li,a,button").forEach(el=>{
       if(!(el as HTMLElement).innerText?.trim()) return;
       (el as HTMLElement).dataset.gfEditable="text";
       (el as HTMLElement).style.cursor="text";
     });
     root.querySelectorAll?.("img").forEach(el=>{(el as HTMLElement).dataset.gfEditable="image";(el as HTMLElement).style.cursor="pointer";});
     if(root instanceof Element && root.matches("h1,h2,h3,h4,p,li,a,button,img")){
       (root as HTMLElement).dataset.gfEditable=root.tagName.toLowerCase()==="img"?"image":"text";
     }
   };
   markEditable(doc);
   const style=doc.createElement("style");style.id="gf-editor-style";
   style.textContent='[data-gf-editable="text"]:hover{outline:2px dashed #f97316!important;outline-offset:3px;cursor:text!important}[data-gf-selected="true"]{outline:3px solid #f97316!important;outline-offset:3px}[data-gf-editable="image"]:hover{outline:3px dashed #f97316!important;outline-offset:3px}';
   doc.getElementById("gf-editor-style")?.remove();doc.head.appendChild(style);
   doc.body.onclick=(event)=>{
     const target=event.target as HTMLElement;const el=target.closest("[data-gf-editable]") as HTMLElement|null;
     if(!el)return;event.preventDefault();event.stopPropagation();
     doc.querySelectorAll('[data-gf-selected="true"]').forEach(x=>x.removeAttribute("data-gf-selected"));el.dataset.gfSelected="true";
     const kind=el.dataset.gfEditable==="image"?"image":"text";const selector=selectorFor(el);
     const value=kind==="image"?(el as HTMLImageElement).src:el.innerText;
     const item:VisualEdit={selector,kind,original:kind==="image"?(el as HTMLImageElement).getAttribute("src")||"":el.innerText,value,tag:el.tagName.toLowerCase()};
     setSelected(item);
     setEdits(prev=>{const found=prev.findIndex(x=>x.selector===selector);if(found<0)return [...prev,item];const next=[...prev];next[found]={...next[found],value};return next;});
     if(kind==="text"){el.contentEditable="true";el.focus();el.oninput=()=>{const v=el.innerText;setSelected(vs=>vs?.selector===selector?{...vs,value:v}:vs);setEdits(prev=>prev.map(x=>x.selector===selector?{...x,value:v}:x));};}
   };
   const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node instanceof Element)markEditable(node);})));
   observer.observe(doc.body,{childList:true,subtree:true});
 },[]);
 useEffect(()=>{ if(mode==="content" && frame.current){setEdits([]);setSelected(null);setSavedDraft(false);}},[mode,slug]);
 const applySelectedText=(value:string)=>{if(!selected)return;const doc=getDocument();const el=doc?.querySelector(selected.selector) as HTMLElement|null;if(el)el.innerText=value;setSelected(s=>s?{...s,value}:s);setEdits(prev=>prev.map(x=>x.selector===selected.selector?{...x,value}:x));setSavedDraft(false);};
 const replaceSelectedImage=async(file?:File)=>{if(!file||!selected||selected.kind!=="image")return;setBusy(true);try{const {processImage}=await import("@/lib/imageProcessing");const p=await processImage(file,{maxWidth:1800,maxHeight:1800,thumbSize:400,quality:.84});const path="page-edits/"+Date.now()+"."+p.ext;const {error}=await supabase.storage.from("media").upload(path,p.main,{contentType:p.mime,cacheControl:"31536000"});if(error)throw error;const url=supabase.storage.from("media").getPublicUrl(path).data.publicUrl;const el=getDocument()?.querySelector(selected.selector) as HTMLImageElement|null;if(el)el.src=url;setSelected(s=>s?{...s,value:url}:s);setEdits(prev=>prev.map(x=>x.selector===selected.selector?{...x,value:url}:x));setSavedDraft(false);toast({title:"Image replaced in preview"});}catch(e:any){toast({title:"Image upload failed",description:e.message,variant:"destructive"});}finally{setBusy(false);}};
 const saveDraft=async()=>{if(!edits.length){toast({title:"No changes to save"});return;}setBusy(true);
   const {data:existing,error:readError}=await supabase.from("site_pages" as any).select("id,content,title,page_type,status").eq("slug",slug).maybeSingle();
   if(readError){setBusy(false);toast({title:"Could not check page draft",description:readError.message,variant:"destructive"});return;}
   const oldContent=(existing?.content && typeof existing.content==="object")?existing.content:{};
   const content={...oldContent,visualEditsDraft:edits.map(({selector,kind,original,value,tag})=>({selector,kind,original,value,tag})),visualEditsUpdatedAt:new Date().toISOString()};
   const payload=existing?{content,updated_at:new Date().toISOString()}:{slug,title:current.title,page_type:"visual_overlay",content,status:"draft",updated_at:new Date().toISOString()};
   const result=existing?await supabase.from("site_pages" as any).update(payload).eq("slug",slug):await supabase.from("site_pages" as any).insert(payload);
   setBusy(false);if(result.error){toast({title:"Draft save failed",description:result.error.message,variant:"destructive"});return;}
   setSavedDraft(true);toast({title:"Draft saved",description:"Your edits are saved safely. The live website has not been changed."});
 };
 const publishVisualEdits=async()=>{if(!edits.length){toast({title:"No changes to publish"});return;}if(!window.confirm("Publish these text and image changes to the live website?"))return;setBusy(true);const {data:existing,error:readError}=await supabase.from("site_pages" as any).select("id,content").eq("slug",slug).maybeSingle();if(readError){setBusy(false);toast({title:"Could not prepare publishing",description:readError.message,variant:"destructive"});return;}const oldContent=existing?.content&&typeof existing.content==="object"?existing.content:{};const now=new Date().toISOString();const content={...oldContent,visualEdits:edits.map(({selector,kind,original,value,tag})=>({selector,kind,original,value,tag})),visualEditsPublishedAt:now};const payload={title:current.title,page_type:"visual_overlay",content,status:"published",published_at:now,updated_at:now};const result=existing?await supabase.from("site_pages" as any).update(payload).eq("slug",slug):await supabase.from("site_pages" as any).insert({slug,...payload});setBusy(false);if(result.error){toast({title:"Publish failed",description:result.error.message,variant:"destructive"});return;}setSavedDraft(true);toast({title:"Published to live website",description:"Your selected text and image changes are now published."});};
 const logout=async()=>{await supabase.auth.signOut();nav("/admin/login");};
 if(loading)return <div className="grid min-h-screen place-items-center bg-[#24170f] text-orange-100">Opening Website Studio…</div>;
 const frameWidth=device==="desktop"?"100%":device==="tablet"?"820px":"390px";
 return <div className="min-h-screen bg-[#24170f] text-orange-50">
 <header className="sticky top-0 z-40 border-b border-orange-200/15 bg-[#211710]/95 backdrop-blur"><div className="mx-auto flex max-w-[1700px] items-center justify-between px-4 py-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 p-2.5"><Layout className="h-6 w-6"/></div><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-orange-300">Ghetto Foundation</p><h1 className="text-lg font-black">Website Studio</h1></div></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="border-orange-100/20 bg-white/5 text-orange-50" onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Log out</Button></div></div></header>
 <main className="mx-auto max-w-[1700px] px-4 py-6">
 {mode==="home"?<><section className="mb-6 rounded-3xl border border-orange-100/15 bg-gradient-to-br from-[#7c2d12] via-[#c2410c] to-[#f59e0b] p-7 md:p-10"><p className="text-xs font-bold uppercase tracking-[.25em] text-orange-100/80">Administration workspace</p><h2 className="mt-2 text-4xl font-black md:text-5xl">Ghetto Foundation Website Studio</h2><p className="mt-3 max-w-2xl text-orange-50/85">Manage the words and images visitors see, or redesign the structure and appearance of your pages.</p></section><div className="grid gap-4 md:grid-cols-2"><button onClick={()=>setMode("content")} className="min-h-48 rounded-2xl border border-orange-200/20 bg-gradient-to-br from-[#4b1d0d] to-[#c2410c] p-7 text-left transition hover:-translate-y-1"><FileText className="mb-8 h-9 w-9 text-orange-200"/><h3 className="text-2xl font-black">Content Management</h3><p className="mt-2 max-w-lg text-sm text-orange-100/75">Choose a page and edit its existing content directly in a scrollable website preview.</p></button><button onClick={()=>setMode("design")} className="min-h-48 rounded-2xl border border-amber-200/20 bg-gradient-to-br from-[#713f12] to-[#f59e0b] p-7 text-left transition hover:-translate-y-1"><Layout className="mb-8 h-9 w-9 text-amber-100"/><h3 className="text-2xl font-black">Website Design</h3><p className="mt-2 max-w-lg text-sm text-white/85">Open the visual design workspace to manage sections, themes, layouts and page elements.</p></button></div><div className="mt-5 rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm text-orange-100/70">18 pages available · Manage page content and design from this workspace.</div></>:mode==="content"?<>
 <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><Button variant="ghost" className="text-orange-100 hover:bg-white/10" onClick={()=>setMode("home")}><ArrowLeft className="mr-2 h-4 w-4"/>Studio home</Button><div className="flex items-center gap-2 text-sm font-semibold text-orange-200"><FileText className="h-4 w-4"/>Content Management</div></div>
 <div className="mb-4 grid gap-3 md:grid-cols-[minmax(280px,1fr)_auto]"><div className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 p-1"><Select value={slug} onValueChange={s=>{setSlug(s);setEdits([]);setSelected(null);}}><SelectTrigger className="h-12 border-0 bg-[#2a1a11] text-base font-semibold text-white"><SelectValue placeholder="Select a website page"/></SelectTrigger><SelectContent>{GROUPS.map(g=><div key={g.name}><div className="px-2 py-1.5 text-xs font-bold uppercase text-orange-600">{g.name}</div>{g.pages.map(p=><SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>)}</div>)}</SelectContent></Select></div><div className="flex items-center justify-end gap-2 rounded-xl border border-orange-200/15 bg-[#302015] p-2"><Button size="sm" variant={device==="desktop"?"secondary":"ghost"} onClick={()=>setDevice("desktop")}><Monitor className="h-4 w-4"/></Button><Button size="sm" variant={device==="tablet"?"secondary":"ghost"} onClick={()=>setDevice("tablet")}><Tablet className="h-4 w-4"/></Button><Button size="sm" variant={device==="mobile"?"secondary":"ghost"} onClick={()=>setDevice("mobile")}><Smartphone className="h-4 w-4"/></Button><a href={current.path} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 px-2 text-xs text-orange-200"><Eye className="h-4 w-4"/>Open</a></div></div>
 <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]"><section className="min-w-0 overflow-hidden rounded-2xl border-2 border-orange-500 bg-[#39271c]"><div className="flex items-center justify-between border-b border-orange-200/15 px-4 py-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-300">Website preview · select text or image</p><h2 className="font-bold">{current.title}</h2></div><span className="text-xs text-orange-100/50">Scrollable page</span></div><div className="overflow-auto bg-[#1c1713] p-2 md:p-4"><div className="mx-auto overflow-hidden rounded-lg bg-white shadow-2xl transition-all" style={{width:frameWidth,maxWidth:"100%",height:"min(76vh,900px)"}}><iframe ref={frame} key={slug} title={current.title+" website preview"} src={current.path} onLoad={refreshEditor} className="h-full w-full border-0" /></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-200/15 bg-[#281b13] p-3"><p className="text-xs text-orange-100/60">{edits.length} selected element change{edits.length===1?"":"s"} · {savedDraft?"Draft saved":"Unsaved draft"}</p><div className="flex flex-wrap gap-2"><Button disabled={busy||edits.length===0} onClick={saveDraft} variant="outline" className="border-orange-200/25 text-orange-100"><Save className="mr-2 h-4 w-4"/>{busy?"Saving…":"Save draft changes"}</Button><Button disabled={busy||edits.length===0} onClick={publishVisualEdits} className="bg-emerald-600 font-bold text-white hover:bg-emerald-700"><Globe className="mr-2 h-4 w-4"/>{busy?"Publishing…":"Publish to Live"}</Button></div></div></section>
 <aside className="h-fit rounded-2xl border border-orange-200/15 bg-[#302015] p-4"><h3 className="mb-3 font-bold">Selected content</h3>{!selected?<div className="rounded-xl border border-dashed border-orange-200/25 p-5 text-center"><ImagePlus className="mx-auto mb-2 h-7 w-7 text-orange-300"/><p className="text-sm font-semibold">Select an element</p><p className="mt-1 text-xs leading-5 text-orange-100/55">Click a heading, paragraph, link, button or image inside the website preview.</p></div>:<div className="space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-orange-300"><Type className="h-4 w-4"/>{selected.kind} · {selected.tag}</div>{selected.kind==="text"?<Textarea value={selected.value} onChange={e=>applySelectedText(e.target.value)} rows={8} className="bg-[#1c1713] text-white"/>:<><img src={selected.value} alt="Selected page content" className="max-h-44 w-full rounded-lg object-contain bg-black/20"/><Input type="file" accept="image/*" disabled={busy} onChange={e=>replaceSelectedImage(e.target.files?.[0])} className="text-xs file:text-orange-100"/><p className="text-xs text-orange-100/50">Choose a replacement image. The change is applied to this preview only until saved.</p></> }<Button variant="outline" className="w-full border-orange-200/20 text-orange-100" onClick={()=>{const doc=getDocument();doc?.querySelectorAll('[data-gf-selected="true"]').forEach(x=>x.removeAttribute("data-gf-selected"));setSelected(null);}}><Check className="mr-2 h-4 w-4"/>Finish selection</Button></div>}</aside></div>
 <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100/80">Publishing: Save draft changes stores your work privately. Publish to Live applies the selected text and image changes to the existing page while preserving its original layout.</p>
 </>:<WebsiteDesignEditor page={current} pages={allPages} onBack={()=>setMode("home")} onSelectPage={setSlug} />}
 </main></div>;
}
