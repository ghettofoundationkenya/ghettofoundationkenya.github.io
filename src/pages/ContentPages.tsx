import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { about, news, publications, Section } from "@/content/site";
import aboutImg from "@/assets/gf/about.jpg";
import publicationsImg from "@/assets/gf/publications.jpg";

const Hero = ({ image, badge, title, lead }: { image: string; badge: string; title: string; lead: string }) => (
  <section className="relative py-24 px-4 overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(" + image + ")" }} />
    <div className="absolute inset-0 bg-black/60" />
    <div className="relative z-10 max-w-5xl mx-auto text-center">
      <Badge variant="outline" className="mb-4 text-white border-white/50 bg-white/10">{badge}</Badge>
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">{title}</h1>
      <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{lead}</p>
    </div>
  </section>
);

const Paragraphs = ({ items }: { items: string[] }) => (
  <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
    {items.map((p, i) => <p key={i}>{p}</p>)}
  </div>
);

// Overview page of a programme (PartnerUp!, Youth, Social Justice)
export const SectionPage = ({ section }: { section: Section }) => (
  <Layout>
    <Hero image={section.image} badge={section.badge} title={section.title} lead={section.lead} />
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto"><Paragraphs items={section.body} /></div>
    </section>
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">{section.subHeading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.pages.map((p) => (
            <Link key={p.slug} to={section.path + "/" + p.slug} className="group block">
              <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-community-warm transition-colors">{p.title}</h3>
                  <p className="text-gray-600 mb-4">{p.tagline}</p>
                  <span className="inline-flex items-center text-community-warm font-medium">
                    Read more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

// A single project or programme page
export const DetailPage = ({ section }: { section: Section }) => {
  const { slug } = useParams();
  const page = section.pages.find((p) => p.slug === slug);
  if (!page) return <Navigate to={section.path} replace />;
  return (
    <Layout>
      <Hero image={page.image} badge={section.menuLabel} title={page.title} lead={page.tagline} />
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          {page.facts && (
            <dl className="grid sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6">
              {page.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-semibold text-community-warm">{f.label}</dt>
                  <dd className="text-gray-800">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <img src={page.image} alt={page.title} className="w-full rounded-xl shadow-md" />
          <Paragraphs items={page.body} />
          {page.points && (
            <div className="grid sm:grid-cols-2 gap-4">
              {page.points.map((pt) => (
                <Card key={pt.title}><CardContent className="p-5">
                  <h3 className="font-semibold mb-1">{pt.title}</h3>
                  <p className="text-gray-600">{pt.text}</p>
                </CardContent></Card>
              ))}
            </div>
          )}
          {page.link && (
            <a href={page.link.url} target="_blank" rel="noopener noreferrer">
              <Button className="btn-hero">{page.link.label} <ExternalLink className="ml-2 w-4 h-4" /></Button>
            </a>
          )}
          <div className="pt-6 border-t">
            <Link to={section.path} className="text-community-warm font-medium hover:underline">
              ← All of {section.menuLabel}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const PublicationsPage = () => (
  <Layout>
    <Hero image={publicationsImg} badge="Publications & Media" title="Publications & Media" lead="News from Ghetto Foundation, and the research we have co-authored." />
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">News</h2>
          <div className="space-y-6">
            {news.map((n) => (
              <Card key={n.title}><CardContent className="p-6">
                <p className="text-sm font-semibold text-community-warm mb-1">{n.date}</p>
                <h3 className="text-xl font-bold mb-2">{n.title}</h3>
                <p className="text-gray-700">{n.text}</p>
                {n.link && <Link to={n.link} className="inline-block mt-3 text-community-warm font-medium hover:underline">Read more →</Link>}
              </CardContent></Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Publications</h2>
          <ul className="space-y-4">
            {publications.map((p) => (
              <li key={p.citation} className="text-gray-700 leading-relaxed border-l-4 border-community-warm pl-4">
                {p.citation}{" "}
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-community-warm font-medium hover:underline">Read →</a>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </Layout>
);

export const AboutPage = () => (
  <Layout>
    <Hero image={aboutImg} badge="About Us" title="About Ghetto Foundation" lead="A grassroots organisation from Mathare, Nairobi, since 2009." />
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-14">
        <div id="history">
          <h2 className="text-3xl font-bold mb-6">Our history</h2>
          <Paragraphs items={about.history} />
        </div>
        <div id="team">
          <h2 className="text-3xl font-bold mb-6">Our team</h2>
          <div className="space-y-4">
            {about.team.map((m) => (
              <Card key={m.name}><CardContent className="p-6">
                <h3 className="text-xl font-bold">{m.name}</h3>
                <p className="text-community-warm font-medium mb-2">{m.role}</p>
                <p className="text-gray-700">{m.bio}</p>
              </CardContent></Card>
            ))}
          </div>
        </div>
        <div id="partners">
          <h2 className="text-3xl font-bold mb-6">Our partners</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {about.partners.map((p) => (
              <li key={p} className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">{p}</li>
            ))}
          </ul>
        </div>
        <div id="contact">
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
          <div className="space-y-3 text-lg text-gray-800">
            <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-community-warm" />{about.contact.address}</p>
            <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-community-warm" /><a href={"tel:" + about.contact.phone.split(" ").join("")} className="hover:underline">{about.contact.phone}</a></p>
            <p className="flex items-center gap-3"><Mail className="w-5 h-5 text-community-warm" /><a href={"mailto:" + about.contact.email} className="hover:underline">{about.contact.email}</a></p>
          </div>
          <a href={"mailto:" + about.contact.email}>
            <Button className="btn-hero mt-6">Send us an email <Mail className="ml-2 w-4 h-4" /></Button>
          </a>
          <p className="text-gray-600 mt-6">Want to volunteer or partner with us? Email us and tell us a little about yourself.</p>
        </div>
      </div>
    </section>
  </Layout>
);
