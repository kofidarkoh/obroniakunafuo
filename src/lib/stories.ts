export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type Story = {
  slug: string;
  title: string;
  category: string;
  location: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  blocks: StoryBlock[];
  pullQuote: { text: string; attribution: string };
  programmes: string[];
  status: "draft" | "published";
};

export const stories: Story[] = [
  {
    slug: "a-decade-of-restored-hope",
    title:
      "A Decade of Restored Hope — Widows, Orphans and the Aged in the Ahafo Region",
    category: "Community",
    location: "Ahafo Region",
    date: "2026-09-15",
    readTime: "5 min read",
    image: "/images/hero-community.jpg",
    imageAlt:
      "Women and community members gathered beneath a tree in the Ahafo Region",
    excerpt:
      "Ten years after Mr. Bernard Adu Tutu began visiting widows and elderly women in Mim, Obroni Akunafo Kuo has become a lifeline for hundreds of families across the Ahafo Region.",
    blocks: [
      {
        type: "p",
        text: "In 2016, Mr. Bernard Adu Tutu began visiting widows and elderly women in Mim, in Ghana's Ahafo Region. What started as personal acts of compassion — sharing food, sitting with the isolated, helping families in crisis — grew into something larger than any one person could sustain alone.",
      },
      {
        type: "p",
        text: "By 2019, Obroni Akunafo Kuo was formally registered as a non-governmental organisation. The name — which translates loosely as \"The Community of Friends\" — reflected a founding belief: that vulnerability is not a personal failure, but a community responsibility.",
      },
      {
        type: "quote",
        text: "True community means we are each other's keeper. No one should suffer alone — not a widow, not an orphan, not the aged.",
      },
      {
        type: "p",
        text: "Over the decade that followed, the organisation expanded steadily. Food relief, education support, healthcare access and shelter provision became the four pillars of its work — each programme responding to a specific vulnerability observed directly within the community.",
      },
      {
        type: "p",
        text: "In 2023, the scope widened further: persons with disabilities were formally included as beneficiaries. Today, more than 200 PWDs across the Ahafo Region benefit from the organisation's outreach and direct support — a number that continues to grow.",
      },
      {
        type: "p",
        text: "As Obroni Akunafo Kuo marks its tenth anniversary in 2026, GHC 492,745.68 has been committed to programme spending — with 72.5% directed to direct beneficiary support. The organisation remains non-partisan, non-discriminatory and independently audited.",
      },
      { type: "h2", text: "Four programmes. One mission." },
      {
        type: "p",
        text: "Food & Relief, Education, Healthcare and Shelter — each programme was built around a real need observed in the community, and each is delivered with the belief that dignity is non-negotiable.",
      },
    ],
    pullQuote: {
      text: "The mobile clinic came to my village. For the first time in years, I saw a doctor without travelling four hours.",
      attribution: "Community beneficiary — Ahafo Region",
    },
    status: "published",
    programmes: ["Food & Relief", "Education", "Healthcare", "Shelter"],
  },
  {
    slug: "abena-k-food-support",
    title: "Abena's second beginning",
    category: "Success story",
    location: "Mim, Ahafo Region",
    date: "2026-08-04",
    readTime: "3 min read",
    image: "/images/programmes/widows.jpg",
    imageAlt: "A widow working at a market stall in the Ahafo Region",
    excerpt:
      "After losing her husband, Abena had no income and three children to feed. Food support and a small trading grant helped her family find its footing again.",
    blocks: [
      {
        type: "p",
        text: "When Abena's husband passed away, the family lost more than a father. They lost the income that kept the household running, and the security that came with it. With three children to feed, Abena began skipping meals so they could eat.",
      },
      {
        type: "p",
        text: "A neighbour told her about Obroni Akunafo Kuo. The team visited, listened, and began with the most urgent need: a monthly food parcel, clothing for the children and someone to talk to.",
      },
      {
        type: "quote",
        text: "They came with food, clothing and someone who actually listened. That changed everything for us.",
      },
      {
        type: "p",
        text: "As the family stabilised, Abena joined a widow empowerment group. With a small seed grant she started trading at the local market. Today she covers her children's school costs and is saving with the group.",
      },
    ],
    pullQuote: {
      text: "I am not waiting for help any more. I am building something for my children.",
      attribution: "Abena K. — Mim, Ahafo Region",
    },
    status: "published",
    programmes: ["Food & Relief", "Widow Empowerment", "Education"],
  },
  {
    slug: "kofi-a-education",
    title: "A doctor in the making",
    category: "Success story — Education",
    location: "Ahafo Region",
    date: "2026-07-12",
    readTime: "3 min read",
    image: "/images/programmes/education.jpg",
    imageAlt: "Schoolchildren in uniform outside a classroom in Ghana",
    excerpt:
      "Kofi lost both parents before he reached junior high school. Three years of sponsored school fees kept him in class — and his ambition alive.",
    blocks: [
      {
        type: "p",
        text: "Kofi was fourteen when both of his parents passed away. His grandmother took him in, but the school fees were beyond what she could manage on her own.",
      },
      {
        type: "p",
        text: "Obroni Akunafo Kuo's education team reviewed his case and committed to covering his fees, uniform and books. The support continued for three years, through junior high school and into senior high.",
      },
      {
        type: "quote",
        text: "My school fees were paid after both my parents passed. Now I am in junior high school and I want to be a doctor so I can help people the way they helped me.",
      },
      {
        type: "p",
        text: "Kofi is now preparing for senior high school. His grandmother says the difference is visible: he studies every evening and talks about medical school.",
      },
    ],
    pullQuote: {
      text: "Education is the surest route out of poverty. Kofi's story is why we keep funding it.",
      attribution: "OAK Education team",
    },
    status: "published",
    programmes: ["Education", "Food & Relief"],
  },
  {
    slug: "maama-ama-healthcare",
    title: "Never forgotten",
    category: "Health",
    location: "Ahafo Region",
    date: "2026-06-20",
    readTime: "3 min read",
    image: "/images/people/ama.jpg",
    imageAlt: "An elderly woman preparing food at home in the Ahafo Region",
    excerpt:
      "Maama Ama is 74 and lives alone. Monthly home visits bring her medicine, a check-in and the companionship she thought she had lost.",
    blocks: [
      {
        type: "p",
        text: "Maama Ama has lived alone since her husband died. Her children work far away, and the nearest clinic is a journey she can no longer make easily. For a while, she says, she felt invisible.",
      },
      {
        type: "p",
        text: "Our healthcare volunteers now visit her every month. They check her blood pressure, bring her medication and help with small household tasks. Mostly, they sit and talk.",
      },
      {
        type: "quote",
        text: "The volunteers visit me every month, bring medicine, and sit with me. I no longer feel forgotten by the world.",
      },
      {
        type: "p",
        text: "Home visits are a small intervention with an outsized effect. For older people living alone, regular contact is as important as the medicine itself.",
      },
    ],
    pullQuote: {
      text: "Dignity means not being forgotten. Our home visits are built around that belief.",
      attribution: "OAK Healthcare team",
    },
    status: "published",
    programmes: ["Healthcare", "Support for the Aged"],
  },
  {
    slug: "success-story-education",
    title: "Three siblings, one second chance",
    category: "Success story",
    location: "Ahafo Region",
    date: "2026-05-18",
    readTime: "4 min read",
    image: "/images/people/founder.jpg",
    imageAlt: "A young Ghanaian student in school uniform",
    excerpt:
      "School fee support helped three children stay in school after their grandmother became their guardian.",
    blocks: [
      {
        type: "p",
        text: "When their grandmother became their guardian, three siblings faced the same choice that ends education for too many children in the region: school or food.",
      },
      {
        type: "p",
        text: "OAK covered their fees and supplied uniforms and books for the school year. The siblings are now all in class, and the eldest is preparing for her final exams.",
      },
      {
        type: "quote",
        text: "I want to finish school and become a teacher. I want to stand in front of a class and tell them they can do it too.",
      },
      {
        type: "p",
        text: "Education remains our core mandate. In the last reporting period, 72.5% of total expenditure went to education — from basic school to nursing and university.",
      },
    ],
    pullQuote: {
      text: "A uniform and a fee receipt can be the difference between a future and a dead end.",
      attribution: "OAK Education team",
    },
    status: "published",
    programmes: ["Education"],
  },
  {
    slug: "community-outreach",
    title: "Care that comes to the village",
    category: "Community",
    location: "Ahafo Region",
    date: "2026-04-09",
    readTime: "4 min read",
    image: "/images/hero-community.jpg",
    imageAlt: "Community members gathered for an outreach event",
    excerpt:
      "Mobile healthcare reached 1,200 beneficiaries this year — including elderly women who hadn't seen a doctor in years.",
    blocks: [
      {
        type: "p",
        text: "Distance and cost keep many families in the Ahafo Region away from formal healthcare. Our mobile outreach brings screening, advice and medication directly to communities.",
      },
      {
        type: "p",
        text: "This year's outreach reached 1,200 people. For some, it was the first time they had seen a health professional in years.",
      },
      {
        type: "quote",
        text: "The mobile clinic came to my village. For the first time in years, I saw a doctor without travelling four hours.",
      },
      {
        type: "p",
        text: "Outreach is delivered with local volunteers and community leaders, so follow-up continues after the team leaves.",
      },
    ],
    pullQuote: {
      text: "Bringing care closer to home is one of the simplest, most effective things we do.",
      attribution: "OAK Healthcare team",
    },
    status: "published",
    programmes: ["Healthcare", "Community Outreach"],
  },
  {
    slug: "pwd-inclusion",
    title: "A wider circle of care",
    category: "PWD inclusion",
    location: "Ahafo Region · 2023",
    date: "2026-03-02",
    readTime: "4 min read",
    image: "/images/programmes/widows.jpg",
    imageAlt: "Community members at an OAK support event",
    excerpt:
      "Over 200 persons with disabilities were added to OAK's beneficiary programme in 2023.",
    blocks: [
      {
        type: "p",
        text: "In 2023, Obroni Akunafo Kuo formally widened its beneficiary base to include persons with disabilities. The change followed months of consultation with families and community leaders.",
      },
      {
        type: "p",
        text: "More than 200 PWDs now receive direct support — from education grants and mobility aids to food parcels and home visits.",
      },
      {
        type: "quote",
        text: "Inclusion is not a programme add-on. It is a commitment to see every person in our community.",
      },
      {
        type: "p",
        text: "The work continues to grow, with disability inclusion now embedded across all four programme areas.",
      },
    ],
    pullQuote: {
      text: "Every person deserves to be seen, supported and treated with dignity.",
      attribution: "OAK programme team",
    },
    status: "published",
    programmes: ["Disability Inclusion", "Education", "Healthcare"],
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}

export function getMoreStories(slug: string, limit = 3) {
  return stories.filter((story) => story.slug !== slug).slice(0, limit);
}
