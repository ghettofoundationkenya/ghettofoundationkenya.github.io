// ─────────────────────────────────────────────────────────────
// ALL WEBSITE TEXT LIVES IN THIS FILE.
// To change a text: edit it here and save. The site updates itself.
// ─────────────────────────────────────────────────────────────

import partnerupImg from "@/assets/gf/partnerup.jpg";
import democreateImg from "@/assets/gf/democreate.jpg";
import cluppImg from "@/assets/gf/clupp.jpg";
import securingImg from "@/assets/gf/securing-the-local.jpg";
import assumptionsImg from "@/assets/gf/assumptions.jpg";
import resiliencePathwaysImg from "@/assets/gf/resilience-pathways.jpg";
import youthImg from "@/assets/gf/youth.jpg";
import ghettoYouthImg from "@/assets/gf/ghetto-youth.jpg";
import economicImg from "@/assets/gf/economic-empowerment.jpg";
import ujiSatoImg from "@/assets/gf/uji-sato.jpg";
import socialJusticeImg from "@/assets/gf/social-justice.jpg";
import rightToLifeImg from "@/assets/gf/right-to-life.jpg";
import resilienceHubImg from "@/assets/gf/resilience-hub.jpg";
import ghettoStoriesImg from "@/assets/gf/ghetto-stories.jpg";

export type Fact = { label: string; value: string };

export type SubPage = {
  slug: string;
  title: string;
  tagline: string; // one line, shown on cards
  image: string;
  facts?: Fact[];
  body: string[]; // paragraphs
  points?: { title: string; text: string }[];
  link?: { label: string; url: string };
};

export type Section = {
  path: string; // e.g. "/partnerup"
  menuLabel: string;
  badge: string;
  title: string;
  lead: string;
  image: string;
  body: string[];
  subHeading: string;
  pages: SubPage[];
};

// ── 1. PartnerUp! ────────────────────────────────────────────
export const partnerUp: Section = {
  path: "/partnerup",
  menuLabel: "PartnerUp!",
  badge: "Our methodology",
  title: "PartnerUp! Community-Led Research and Action",
  lead: "Residents set the questions, collect and analyse the data, and turn the findings into action.",
  image: partnerupImg,
  body: [
    "PartnerUp! is how Ghetto Foundation does research. It builds on Community-Led Research and Action (CLRA), which Ghetto Foundation co-developed with Dr Naomi van Stapele and activists of the Social Justice Movement in Kenya, in response to research that took knowledge out of Mathare without giving anything back.",
    "In PartnerUp!, people who live the situation are researchers and experts in their own right. Community researchers design the questions, gather and analyse the data, and decide with their neighbours what to do with the results. Academic and institutional partners join as partners, not as owners of the knowledge.",
    "Since 2010 Ghetto Foundation has co-produced research this way with Erasmus University Rotterdam, the University of Amsterdam, VU Amsterdam, University College London, Clingendael and the World Bank. The projects below all use PartnerUp!.",
  ],
  subHeading: "Projects using PartnerUp!",
  pages: [
    {
      slug: "democreate",
      title: "DEMOCREATE",
      tagline: "Young people shaping democratic education across Europe and Kenya.",
      image: democreateImg,
      facts: [
        { label: "Programme", value: "Horizon Europe" },
        { label: "Ghetto Foundation's role", value: "Leads the Youth Ambassador Programme" },
      ],
      body: [
        "DEMOCREATE is a Horizon Europe project on democratic participation and education. Ghetto Foundation is a full partner in the consortium.",
        "Ghetto Foundation leads the Youth Ambassador Programme. With Tampere University of Applied Sciences it co-leads the work on partnerships between formal and non-formal education in five European countries, bringing what Mathare's youth organisers know about learning outside school into European education.",
      ],
    },
    {
      slug: "clupp",
      title: "CLUPP Safety & Security",
      tagline: "Community-led safety and disaster resilience in four Mathare wards.",
      image: cluppImg,
      facts: [
        { label: "Period", value: "2026–2027" },
        { label: "Funder", value: "Kenya Community Development Foundation (KCDF)" },
        { label: "Wards", value: "Hospital, Mabatini, Mlango Kubwa, Utalii" },
      ],
      body: [
        "Ghetto Foundation facilitates four Community-Led Urban Planning Platforms (CLUPPs) within the Mathare Special Planning Area Research Collective (MSPARC). The Platforms bring residents together to plan for their own wards and negotiate with the authorities.",
        "Since July 2026 Ghetto Foundation has led a KCDF-funded project on climate hazards, infrastructure, crime and political tension across all four wards. Twelve trained community researchers run a quarterly household survey that revisits the same households, building a community-owned dataset. Hazards, hotspots and safe spaces have been mapped in every ward.",
        "With Kenya Red Cross, the Safety and Disaster Management Platform co-authored the Mabatini Ward Contingency Plan, now the model for the other three wards. Twenty youth peer leaders, ten women and ten men, are trained in early warning, de-escalation and mediation.",
      ],
    },
    {
      slug: "securing-the-local",
      title: "Securing the Local",
      tagline: "Bringing youth projects into multi-stakeholder collaborations.",
      image: securingImg,
      facts: [
        { label: "Period", value: "2016–2019" },
        { label: "Funder", value: "Conflict, Security and Stability Fund (CSSF)" },
      ],
      body: [
        "Securing the Local looked at how youth-led projects on safety and security in Mathare could become part of wider collaborations with government, NGOs and other actors, without losing the community's ownership.",
        "Ghetto Foundation led the community research, with young people from Mathare as researchers.",
      ],
    },
    {
      slug: "assumptions",
      title: "Assumptions",
      tagline: "How youth-led organisations are included, or left out, of the wider system.",
      image: assumptionsImg,
      facts: [
        { label: "Period", value: "2017–2020" },
        { label: "Funder", value: "NWO (Dutch Research Council)" },
      ],
      body: [
        "Assumptions studied the assumptions that governments, NGOs and the private sector make about young people in informal settlements, and how these shape whether youth-led organisations are included in the wider ecosystem.",
        "Community researchers from Ghetto Foundation co-designed the study and collected and analysed the data with their academic partners.",
      ],
    },
    {
      slug: "resilience-pathways",
      title: "Resilience Pathways",
      tagline: "Five decades of resilience in Mathare and Korogocho.",
      image: resiliencePathwaysImg,
      facts: [
        { label: "Period", value: "2022–2024" },
        { label: "Partner", value: "International Centre for Frugal Innovation, Erasmus University Rotterdam" },
        { label: "Sites", value: "Mathare and Korogocho, Nairobi" },
      ],
      body: [
        "Resilience Pathways traced how residents of Mathare and Korogocho have coped with crises since the 1970s, using community-based participatory research.",
        "The study found that resilience was relatively stable in the 1970s and 1980s, declined in the 1990s, and became more adaptive from the 2000s. Adaptive initiatives often rely on frugal practice: doing more with less, without harming others. Transformative initiatives are rare, because they need real change in norms and institutions.",
        "The findings were published in The European Journal of Development Research (2024), co-authored by Ghetto Foundation's director Samuel Kiriro.",
      ],
      link: {
        label: "Read the article",
        url: "https://pure.eur.nl/en/publications/resilience-pathways-of-informal-settlements-in-nairobi-stasis-dec/",
      },
    },
  ],
};

// ── 2. Youth ─────────────────────────────────────────────────
export const youth: Section = {
  path: "/youth",
  menuLabel: "Youth",
  badge: "Programme",
  title: "Youth",
  lead: "Young women and men from Mathare founded Ghetto Foundation in 2009. Young people are still at its heart.",
  image: youthImg,
  body: [
    "Our youth work helps young people in Mathare lead, earn a living and look after their community.",
  ],
  subHeading: "Youth programmes",
  pages: [
    {
      slug: "ghetto-youth",
      title: "Ghetto Youth",
      tagline: "Our youth leadership programme.",
      image: ghettoYouthImg,
      body: [
        "Ghetto Youth is Ghetto Foundation's youth leadership programme. Young people build leadership, communication and organising skills, and take the lead in projects in their own wards.",
        "Through the CLUPP Safety & Security project, twenty youth peer leaders are trained in early warning, de-escalation and mediation, and now run trainings for other young people in their wards.",
      ],
    },
    {
      slug: "economic-empowerment",
      title: "Economic Empowerment",
      tagline: "Skills and livelihoods for young people.",
      image: economicImg,
      body: [
        "Economic Empowerment supports young people in Mathare to build skills and livelihoods.",
        "More about this programme will follow soon.",
      ],
    },
    {
      slug: "uji-sato",
      title: "Uji Sato",
      tagline: "Communal porridge that nourishes and brings neighbours together.",
      image: ujiSatoImg,
      body: [
        "Uji Sato is a communal porridge programme. Large pots of uji are cooked over open fires and shared with children and families in Mathare.",
        "Community volunteers cook, serve and organise each Uji Sato, so every person is served with dignity and care, and neighbours meet around a warm meal.",
      ],
    },
  ],
};

// ── 3. Social Justice ────────────────────────────────────────
export const socialJustice: Section = {
  path: "/social-justice",
  menuLabel: "Social Justice",
  badge: "Programme",
  title: "Social Justice",
  lead: "Ghetto Foundation is a founding member of the Mathare Network of Social Justice Centres and the Social Justice Movement in Kenya.",
  image: socialJusticeImg,
  body: [
    "We stand with residents for their rights: to life, to safety, to housing and to be heard. In April 2024, when the Mathare River floods displaced thousands of residents, Ghetto Foundation led the community-driven response: emergency relief, documenting displacement and advocating against forced evictions.",
  ],
  subHeading: "Social justice programmes",
  pages: [
    {
      slug: "right-to-life",
      title: "Right to Life",
      tagline: "Defending the right to life in Mathare.",
      image: rightToLifeImg,
      body: [
        "Right to Life is part of Ghetto Foundation's social justice work in Mathare.",
        "More about this programme will follow soon.",
      ],
    },
    {
      slug: "mathare-resilience-hub",
      title: "Mathare Resilience Hub",
      tagline: "A community centre for learning, safety and justice.",
      image: resilienceHubImg,
      body: [
        "The Mathare Resilience Hub will be a multi-purpose community centre at the heart of our work.",
      ],
      points: [
        { title: "Vocational training", text: "Skills for sustainable livelihoods." },
        { title: "Community library", text: "Learning resources and space for all ages." },
        { title: "Research & resource centre", text: "A home for community-led research and data." },
        { title: "Community response & safe space", text: "Support and conflict resolution." },
        { title: "Social justice centre office", text: "Advocacy and legal support for residents' rights." },
        { title: "Gathering area", text: "Room for meetings, events and community life." },
      ],
    },
    {
      slug: "ghetto-stories",
      title: "Ghetto Stories",
      tagline: "Mathare told by the people who live it.",
      image: ghettoStoriesImg,
      body: [
        "Ghetto Stories collects and shares the stories of Mathare residents, in their own words: written stories, audio testimonies and photo stories about daily life, struggle, resilience and change.",
        "The stories challenge the way Mathare is usually portrayed, and keep the community's history and knowledge alive.",
      ],
    },
  ],
};

export const sections = [partnerUp, youth, socialJustice];

// ── News (newest first). The first three appear on the homepage. ──
export type NewsItem = { date: string; title: string; text: string; link?: string };

export const news: NewsItem[] = [
  {
    date: "September 2026",
    title: "First household safety survey in four wards",
    text: "Twelve community researchers visited 116 households across Hospital, Mabatini, Mlango Kubwa and Utalii. The same households will be revisited every quarter.",
    link: "/partnerup/clupp",
  },
  {
    date: "2026",
    title: "Twenty youth peer leaders trained",
    text: "Ten young women and ten young men completed training in early warning, de-escalation and mediation, and now run trainings in their own wards.",
    link: "/youth/ghetto-youth",
  },
  {
    date: "July 2026",
    title: "CLUPP Safety & Security project starts",
    text: "With support from KCDF, Ghetto Foundation launched a one-year project on community-led safety and disaster resilience across four Mathare wards.",
    link: "/partnerup/clupp",
  },
];

// ── Publications ─────────────────────────────────────────────
export type Publication = { citation: string; url?: string };

export const publications: Publication[] = [
  {
    citation:
      "Van Tuijl, E., Fransen, J., Kiriro, S., Kioko, H., & Menya, A. (2026). Platforms for the urban poor: Platform frugality in Mathare informal settlement. Cities, 169, 106587.",
  },
  {
    citation:
      "Fransen, J., Hati, B., Van Stapele, N., Kiriro, S., & Nyumba, R. (2024). Resilience pathways of informal settlements in Nairobi: Stasis, decline, adaptation, and transformation. The European Journal of Development Research.",
    url: "https://pure.eur.nl/en/publications/resilience-pathways-of-informal-settlements-in-nairobi-stasis-dec/",
  },
  {
    citation:
      "Van Stapele, N., & Kiriro, S. (2024). Crime, policing, and youth orientations towards urban futures. In Research Handbook on Urban Sociology (pp. 326–340). Edward Elgar Publishing.",
  },
];

// ── About Us ─────────────────────────────────────────────────
export const about = {
  history: [
    "Ghetto Foundation is a grassroots membership organisation founded in 2009 by young women and men from Mathare, one of Nairobi's largest informal settlements, home to over 200,000 residents.",
    "It is a founding member of the Mathare Network of Social Justice Centres and of the Social Justice Movement in Kenya. Ghetto Foundation works from inside the settlement on community-led research, social justice, youth empowerment and community resilience.",
    "Ghetto Foundation has managed grants from European, Dutch, UK and Kenyan funders, with experience in project implementation, accounting, and monitoring and evaluation.",
  ],
  team: [
    {
      name: "Samuel Kiriro",
      role: "Founder and Director",
      bio: "Community organiser, human rights defender and community-led researcher with more than 15 years' experience in Mathare. Samuel facilitates the four Community-Led Urban Planning Platforms, led the community response to the 2024 floods, and co-authors peer-reviewed research with academic partners. He is a trained paralegal and certified counsellor.",
    },
  ],
  partners: [
    "Kenya Community Development Foundation (KCDF)",
    "Kenya Red Cross",
    "Mathare Special Planning Area Research Collective (MSPARC)",
    "Mathare Network of Social Justice Centres",
    "Social Justice Movement Kenya",
    "Erasmus University Rotterdam",
    "University of Amsterdam",
    "VU Amsterdam",
    "University College London",
    "Clingendael",
    "Kituo cha Sheria",
    "Movisie",
  ],
  contact: {
    email: "management@ghettofoundationkenya.org",
    phone: "+254 720 847 102",
    address: "Mathare, Nairobi, Kenya",
  },
};
