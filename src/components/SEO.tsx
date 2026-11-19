import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://ghettofoundationkenya.org";

const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Ghetto Foundation | Community-Led Change in Mathare, Nairobi",
    description: "Ghetto Foundation is a grassroots organisation founded in Mathare, Nairobi. We advance community-led research, youth empowerment, social justice and community resilience.",
  },
  "/partnerup": {
    title: "PartnerUp! Community-Led Research | Ghetto Foundation",
    description: "Discover PartnerUp!, Ghetto Foundation's community-led research and action approach in Mathare, Nairobi, where residents lead research and turn evidence into action.",
  },
  "/partnerup/democreate": {
    title: "DEMOCREATE | Youth Democratic Education | Ghetto Foundation",
    description: "Learn how Ghetto Foundation contributes to DEMOCREATE, a Horizon Europe project advancing democratic participation and education with young people.",
  },
  "/partnerup/clupp": {
    title: "CLUPP Safety & Security in Mathare | Ghetto Foundation",
    description: "Community-led urban planning, household research, disaster preparedness and youth peer leadership across four Mathare wards in Nairobi.",
  },
  "/partnerup/securing-the-local": {
    title: "Securing the Local | Ghetto Foundation",
    description: "How Ghetto Foundation worked with young people in Mathare to connect youth-led safety initiatives with wider community and institutional collaboration.",
  },
  "/partnerup/assumptions": {
    title: "Assumptions Research Project | Ghetto Foundation",
    description: "Community-led research examining how institutions include or exclude youth-led organisations in informal settlements.",
  },
  "/partnerup/resilience-pathways": {
    title: "Resilience Pathways in Nairobi Settlements | Ghetto Foundation",
    description: "Research on resilience, adaptation and transformation in Mathare and Korogocho, co-produced with community researchers and academic partners.",
  },
  "/youth": {
    title: "Youth Empowerment in Mathare | Ghetto Foundation",
    description: "Ghetto Foundation supports young women and men in Mathare through leadership, livelihoods, skills, community organising and youth-led initiatives.",
  },
  "/youth/ghetto-youth": {
    title: "Ghetto Youth Leadership Programme | Ghetto Foundation",
    description: "The Ghetto Youth programme builds leadership, communication and organising skills among young people in Mathare, Nairobi.",
  },
  "/youth/economic-empowerment": {
    title: "Youth Economic Empowerment | Ghetto Foundation",
    description: "Ghetto Foundation's work supporting young people in Mathare to build skills, livelihoods and economic opportunities.",
  },
  "/youth/uji-sato": {
    title: "Uji Sato Community Food Programme | Ghetto Foundation",
    description: "Uji Sato brings children, families and volunteers together around communal porridge and community care in Mathare, Nairobi.",
  },
  "/social-justice": {
    title: "Social Justice and Human Rights in Mathare | Ghetto Foundation",
    description: "Ghetto Foundation works with Mathare residents to defend the right to life, safety, housing and participation through community-led social justice.",
  },
  "/social-justice/right-to-life": {
    title: "Right to Life | Ghetto Foundation",
    description: "Explore Ghetto Foundation's right-to-life and community justice work in Mathare, Nairobi.",
  },
  "/social-justice/mathare-resilience-hub": {
    title: "Mathare Resilience Hub | Ghetto Foundation",
    description: "The Mathare Resilience Hub vision brings together vocational learning, a community library, research resources, safe spaces and social justice support.",
  },
  "/social-justice/ghetto-stories": {
    title: "Ghetto Stories | Voices and Stories from Mathare",
    description: "Ghetto Stories shares Mathare residents' experiences through written stories, audio testimonies and photography, preserving community knowledge and history.",
  },
  "/publications": {
    title: "Research, Publications and News | Ghetto Foundation",
    description: "Read Ghetto Foundation news and research on Mathare, community-led action, youth, resilience, urban development and social justice.",
  },
  "/about": {
    title: "About Ghetto Foundation | Mathare, Nairobi, Kenya",
    description: "Meet Ghetto Foundation, a grassroots membership organisation founded in Mathare in 2009, working on community-led research, youth empowerment and social justice.",
  },
  "/donate": {
    title: "Donate to Ghetto Foundation | Support Community-Led Change",
    description: "Support Ghetto Foundation's community-led work in Mathare, Nairobi, including youth empowerment, research, social justice and community resilience.",
  },
};

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

const SEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pages[pathname] ?? {
      title: "Page Not Found | Ghetto Foundation",
      description: "The page you are looking for could not be found on the Ghetto Foundation website.",
    };
    const canonical = SITE + (pathname === "/" ? "/" : pathname.replace(/\/$/, ""));
    document.title = page.title;

    setMeta("description", page.description);
    setMeta("robots", pages[pathname] ? "index,follow" : "noindex,follow");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "Ghetto Foundation", "property");
    setMeta("og:title", page.title, "property");
    setMeta("og:description", page.description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", page.title);
    setMeta("twitter:description", page.description);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.getElementById("ghetto-foundation-schema") as HTMLScriptElement | null;
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "ghetto-foundation-schema";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NGO",
      "@id": SITE + "/#organization",
      name: "Ghetto Foundation",
      url: SITE + "/",
      description: "A grassroots membership organisation founded in Mathare, Nairobi, working on community-led research, youth empowerment, social justice and community resilience.",
      foundingDate: "2009",
      email: "management@ghettofoundationkenya.org",
      telephone: "+254720847102",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mathare, Nairobi",
        addressRegion: "Nairobi County",
        addressCountry: "KE",
      },
      areaServed: {
        "@type": "Place",
        name: "Mathare, Nairobi, Kenya",
      },
    });
  }, [pathname]);

  return null;
};

export default SEO;
