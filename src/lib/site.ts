export type ProgrammeAccent = "green" | "orange" | "blue" | "purple";

export type Programme = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  accent: ProgrammeAccent;
  icon: "utensils" | "graduation" | "heart-pulse" | "home" | "hand-heart";
  summary: string;
  description: string;
  bullets: string[];
  cta: string;
  meta: string;
  image: string;
  imageAlt: string;
  featuredOnHome: boolean;
  showOnProgrammes: boolean;
};

export const org = {
  name: "Obroni Akunafo Kuo",
  shortName: "OAK",
  motto: "Obaa Kunani — Awurade Ne Me Boafo",
  tagline: "Hope · Dignity · Love",
  founded: 2016,
  regNo: "CG024292019",
  tin: "C0021813361",
  email: "obroniakunafuo@gmail.com",
  phones: ["0241 936 699", "0541 597 436"],
  phoneLinks: ["+233241936699", "+233541597436"],
  whatsapp: "+233541597436",
  address: "Mim, Ahafo Region, Ghana",
  addressFull: "Head Office, Mim, Ahafo Region, Ghana",
  bank: {
    name: "Ecobank Ghana",
    accountName: "Obroni Akunafo Kuo",
    accountNumber: "0011020008964",
    currency: "GHS",
  },
  momo: {
    provider: "MTN Mobile Money",
    number: "0541597436",
    accountName: "Collins Afriyie",
  },
  socials: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "WhatsApp", href: "https://wa.me/233541597436", icon: "whatsapp" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Gallery", href: "/gallery" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Stories", href: "/stories" },
] as const;

export const impactStats = [
  {
    value: "800–1,000",
    label: "Beneficiaries reached",
    note: "+18% year on year",
    trend: "+18%",
  },
  { value: "10+", label: "Years of service", note: "+24% growth", trend: "+24%" },
  {
    value: "200+",
    label: "Persons with disabilities",
    note: "+31% inclusion",
    trend: "+31%",
  },
  {
    value: "2016",
    label: "Still active since",
    note: "Registered NGO",
    trend: "10 yrs",
  },
] as const;

export const trustPoints = [
  { title: "Audited annually", icon: "shield-check" },
  { title: "SSL secured", icon: "lock" },
  { title: "Transparent financials", icon: "file-check" },
  { title: "Registered NGO — CG024292019", icon: "badge-check" },
] as const;

export const programmes: Programme[] = [
  {
    slug: "food-support-relief",
    title: "Food Support & Relief",
    shortTitle: "Food & Relief",
    category: "Food Support",
    accent: "green",
    icon: "utensils",
    summary:
      "Nutritious food parcels and emergency relief for households facing hunger.",
    description:
      "No one in our communities should go to bed hungry. Our food support programme provides regular food relief to widows, orphans, the aged and persons with disabilities across the Ahafo Region — ensuring that the most vulnerable have access to basic nutrition and essential supplies.",
    bullets: [
      "Regular food packages for widows and elderly women",
      "Clothing and essential household items distribution",
      "Seasonal outreach and festive relief programmes",
      "Community partnerships with churches and local leaders",
      "Dedicated support for Persons With Disabilities",
    ],
    cta: "Support this programme",
    meta: "800+ households · Monthly relief",
    image: "/images/programmes/food.jpg",
    imageAlt: "Food parcels being distributed to a family",
    featuredOnHome: true,
    showOnProgrammes: true,
  },
  {
    slug: "education-sponsorship",
    title: "Education Sponsorship",
    shortTitle: "Education",
    category: "Education",
    accent: "orange",
    icon: "graduation",
    summary:
      "School fees, uniforms, books and mentoring so children can stay in school.",
    description:
      "Education is the most powerful tool we can give a child. Our education programme sponsors orphans and vulnerable children — covering school fees, uniforms, books and learning materials — to ensure that losing a parent does not mean losing the future.",
    bullets: [
      "School fees sponsorship for orphans and vulnerable children",
      "School uniforms, books and stationery provision",
      "Mentorship and academic support for sponsored students",
      "Recognition and encouragement for academic achievement",
    ],
    cta: "Support a child's education",
    meta: "50+ students · Fees, kits & mentoring",
    image: "/images/programmes/education.jpg",
    imageAlt: "Students in a classroom setting",
    featuredOnHome: true,
    showOnProgrammes: true,
  },
  {
    slug: "healthcare-support",
    title: "Healthcare Support",
    shortTitle: "Healthcare",
    category: "Health",
    accent: "blue",
    icon: "heart-pulse",
    summary:
      "Medical outreach, home visits, medication and companionship for those who cannot reach care.",
    description:
      "Good health is a right, not a privilege. Our healthcare support programme provides medical assistance, home visits and health outreach to widows, the aged and persons with disabilities — many of whom cannot easily access healthcare facilities on their own.",
    bullets: [
      "Medical outreach and health screening visits",
      "Home visits and psychosocial support for the aged",
      "Medication access and healthcare referrals",
      "Disability inclusion and support for 200+ PWDs across Ahafo",
      "Companionship and wellbeing programmes for the elderly",
    ],
    cta: "Support healthcare access",
    meta: "GHC 85,198 · Medical support",
    image: "/images/programmes/health.jpg",
    imageAlt: "Health worker visiting an elderly person at home",
    featuredOnHome: true,
    showOnProgrammes: true,
  },
  {
    slug: "shelter-housing-support",
    title: "Shelter & Housing Support",
    shortTitle: "Shelter",
    category: "Shelter",
    accent: "purple",
    icon: "home",
    summary:
      "Safe, dignified housing through repairs, roofing and emergency shelter.",
    description:
      "A safe home is the foundation of a dignified life. Our shelter support programme assists widows and vulnerable elderly community members with basic home repairs, maintenance and emergency shelter provisions — ensuring that no one faces the rainy season without a safe roof.",
    bullets: [
      "Basic home repairs and structural maintenance",
      "Roof repairs and weatherproofing for vulnerable households",
      "Emergency shelter support and temporary accommodation",
      "Targeting households most at risk across the Ahafo Region",
    ],
    cta: "Support shelter access",
    meta: "Repairs · Roofing · Emergency shelter",
    image: "/images/programmes/shelter.jpg",
    imageAlt: "A repaired home with a new roof",
    featuredOnHome: false,
    showOnProgrammes: true,
  },
  {
    slug: "widow-empowerment",
    title: "Widow Empowerment",
    shortTitle: "Widow Empowerment",
    category: "Empowerment",
    accent: "green",
    icon: "hand-heart",
    summary:
      "Skills, seed capital and sisterhood so widows can build independent livelihoods.",
    description:
      "Widowhood can strip a woman of income, land and confidence. Our empowerment programme combines practical skills training, small business seed capital, savings groups and counselling so women can support their families with dignity.",
    bullets: [
      "Vocational and business skills training",
      "Seed capital for small enterprises",
      "Savings groups and peer mentoring",
      "Counselling and social support",
    ],
    cta: "Empower a widow",
    meta: "Skills · Seed capital · Mentoring",
    image: "/images/programmes/widows.jpg",
    imageAlt: "Women in a skills training workshop",
    featuredOnHome: true,
    showOnProgrammes: false,
  },
];

export const homeProgrammeOrder = [
  "food-support-relief",
  "healthcare-support",
  "education-sponsorship",
  "widow-empowerment",
];

export const programmePageOrder = [
  "food-support-relief",
  "education-sponsorship",
  "healthcare-support",
  "shelter-housing-support",
];

export const programmeFilters = [
  "Food Support",
  "Education",
  "Health",
  "Shelter",
] as const;

export const approach = [
  {
    step: "01",
    title: "Identify",
    body: "We work with community leaders and churches to identify the most vulnerable individuals who need support.",
  },
  {
    step: "02",
    title: "Connect",
    body: "We build personal relationships with each beneficiary — because care is never just about material support.",
  },
  {
    step: "03",
    title: "Support",
    body: "We deliver food, education, healthcare and shelter support — consistently and with dignity at the centre.",
  },
  {
    step: "04",
    title: "Follow through",
    body: "We stay engaged — visiting homes, following up on sponsored children, and continuing relationships over time.",
  },
] as const;

export const values = [
  {
    no: "01",
    title: "Compassion",
    body: "We lead with empathy, meeting people where they are without judgement.",
  },
  {
    no: "02",
    title: "Dignity",
    body: "Every person deserves respect, privacy and a voice in the support they receive.",
  },
  {
    no: "03",
    title: "Accountability",
    body: "We steward every cedi with care and report openly on how it is used.",
  },
  {
    no: "04",
    title: "Community",
    body: "We work with communities, not for them — local knowledge shapes our work.",
  },
] as const;

export const governance = [
  {
    no: "01",
    title: "Board of Trustees",
    body: "Provides strategic oversight, safeguards our mission and approves major decisions.",
  },
  {
    no: "02",
    title: "Executive Council",
    body: "Leads day-to-day delivery and reports to the Board on programmes and finances.",
  },
  {
    no: "03",
    title: "General Assembly",
    body: "Brings members together to review progress and set community priorities.",
  },
  {
    no: "04",
    title: "Annual Audit",
    body: "Independent review of our accounts, published for donors and partners.",
  },
] as const;

export const timeline = [
  {
    year: "2016",
    title: "A promise to our community",
    body: "Mr. Bernard Adu Tutu founds Obroni Akunafo Kuo in Mim, Ahafo Region, to support widows, orphans and the aged.",
  },
  {
    year: "2019",
    title: "Formally registered",
    body: "OAK is registered as a non-profit NGO in Ghana under registration number CG024292019.",
  },
  {
    year: "2023",
    title: "Disability inclusion",
    body: "Our work expands to reach more than 200 persons with disabilities with practical, dignified support.",
  },
  {
    year: "2026",
    title: "Ten years of impact",
    body: "We mark a decade of service with GHC 492,745.68 invested in programmes across the Ahafo Region.",
  },
] as const;

export const leadership = {
  founder: {
    name: "Mr. Bernard Adu Tutu",
    role: "Founder & Chairman",
    email: "obroniakunafuo@gmail.com",
    quote:
      "We started with a simple belief: that no one in our community should face hardship alone. Ten years on, that belief still guides every household we visit and every cedi we spend.",
  },
  secretary: {
    name: "Collins Afriyie",
    role: "Secretary",
  },
} as const;

export const faqs = [
  {
    q: "Where does my donation go?",
    a: "Your donation funds our four core programmes: food support and relief, education sponsorship, healthcare support and shelter. Our annual report shows exactly how every cedi was spent, including programme and administrative costs.",
  },
  {
    q: "Do I need to be in the Ahafo Region to help?",
    a: "Not at all. Our work is based in Mim, Ahafo Region, but supporters and volunteers join us from across Ghana and abroad. Remote volunteers can help with fundraising, communications and professional services.",
  },
  {
    q: "How do I know this is a legitimate organisation?",
    a: "Obroni Akunafo Kuo is a registered Ghanaian non-profit with registration number CG024292019 and TIN C0021813361. We are independently audited every year and publish our financial statements.",
  },
  {
    q: "Can international organisations partner with us?",
    a: "Yes. We welcome partnerships with international NGOs, foundations, diaspora groups and companies. We can provide our organisation profile, constitution and annual reports on request.",
  },
  {
    q: "Is there a minimum donation?",
    a: "No. Every contribution matters, whether it is GH₵10 or GH₵10,000. You can give once or set up a monthly pledge, and you will receive a reference to complete your transfer.",
  },
  {
    q: "What happens after I apply to volunteer?",
    a: "Our team reviews your application within 3–5 working days and contacts you to discuss the best fit. Successful volunteers are invited to a short orientation before joining a programme.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "When my husband passed, I did not know how I would feed my children. OAK came with food, then helped me start a small trade. Today I can provide for my family again.",
    name: "Efta Owusu",
    role: "Health programme",
    location: "Mim, Ahafo Region",
    initials: "EO",
    image: "/images/people/efta.jpg",
  },
  {
    quote:
      "They paid my school fees when I had lost hope of continuing. I am now training to become a nurse, and I want to come back and serve my community.",
    name: "Sister Agnes",
    role: "Education support",
    location: "Brong-Ahafo",
    initials: "SA",
    image: "/images/people/agnes.jpg",
  },
  {
    quote:
      "After the storm took our roof, OAK helped us rebuild. They did not just fix a house — they gave my grandchildren a safe place to sleep.",
    name: "Yaa Darko",
    role: "Shelter initiative",
    location: "Northern Region",
    initials: "YD",
    image: "/images/people/yaa.jpg",
  },
  {
    quote:
      "The home visits mean I am not forgotten. Someone checks on me, brings my medicine and sits with me. That is worth more than I can say.",
    name: "Maama Ama",
    role: "Healthcare support",
    location: "Mim, Ahafo Region",
    initials: "MA",
    image: "/images/people/ama.jpg",
  },
] as const;

export const expenditure = [
  {
    category: "Education",
    amount: 357347.68,
    share: 72.5,
    color: "#2E8B2E",
  },
  {
    category: "Health & Hospital",
    amount: 107698,
    share: 21.9,
    color: "#2D6FE8",
  },
  {
    category: "Social Welfare",
    amount: 12000,
    share: 2.4,
    color: "#C2410C",
  },
  {
    category: "Community Support",
    amount: 10500,
    share: 2.1,
    color: "#9A69EB",
  },
  {
    category: "Admin / Transport",
    amount: 5200,
    share: 1.1,
    color: "#6B7280",
  },
] as const;

export const expenditureRows = [
  { date: "Sept 2024", item: "Basic Education", category: "Education", amount: 3986 },
  { date: "Oct 2024", item: "Apprenticeship Fees", category: "Education", amount: 12000 },
  { date: "Jan 2025", item: "Tertiary Education Fees", category: "Education", amount: 75062.04 },
  { date: "Apr 2025", item: "Secondary Education", category: "Education", amount: 9000 },
  { date: "Apr 2025", item: "Christian Journalist Support", category: "Community", amount: 5000 },
  { date: "Jun 2025", item: "Late Fee & Hospital Bill", category: "Health", amount: 10500 },
  { date: "Aug 2025", item: "Nursing Students Sem. 2 Fees", category: "Education", amount: 84732.16 },
  { date: "Aug 2025", item: "Casket & Burial Fee", category: "Health", amount: 3000 },
  { date: "Sept 2025", item: "Basic Education Support", category: "Education", amount: 9920.04 },
  { date: "Sept 2025", item: "Wedding Support", category: "Social", amount: 1000 },
  { date: "Sept 2025", item: "Nursing Students Freshers", category: "Education", amount: 25080 },
  { date: "Oct 2025", item: "Disability Education Support", category: "Education", amount: 15430 },
  { date: "Oct 2025", item: "Books & Handouts", category: "Education", amount: 2240 },
  { date: "Oct 2025", item: "Teacher Training Fees", category: "Education", amount: 24850.4 },
  { date: "Nov 2025", item: "Support to Methodist Church", category: "Community", amount: 5500 },
  { date: "Dec 2025", item: "Hospital Roofing — Goaso", category: "Health", amount: 85198 },
  { date: "Dec 2025", item: "Orphans Christmas Bonanza", category: "Social", amount: 11000 },
  { date: "Jan 2026", item: "University Students Fees", category: "Education", amount: 95047.04 },
  { date: "Jan 2026", item: "Eye Care", category: "Health", amount: 9000 },
  { date: "2025–26", item: "Transportation (GHC 100/week)", category: "Admin", amount: 5200 },
] as const;

export const incomeReceived = {
  label: "Individual donors",
  amount: 10500,
  note: "Fully utilised in June 2025 for late fee and hospital bills.",
} as const;

export const accomplishments = [
  {
    value: "50+",
    title: "Students supported",
    body: "School fees paid across basic, secondary, teacher training, nursing and university education levels.",
    icon: "graduation",
  },
  {
    value: "GHC 15,430",
    title: "Disability education",
    body: "Dedicated education support for persons with disabilities — a new and growing commitment since 2023.",
    icon: "accessibility",
  },
  {
    value: "GHC 85,198",
    title: "Hospital Roofing — Goaso",
    body: "Completed a major hospital roofing project at Goaso in December 2025, improving healthcare infrastructure.",
    icon: "hospital",
  },
  {
    value: "GHC 11,000",
    title: "Christmas Bonanza",
    body: "Orphans' Christmas celebration in December 2025 — bringing joy and connection to children without families.",
    icon: "gift",
  },
  {
    value: "GHC 9,000",
    title: "Eye care support",
    body: "Provided emergency eye care in January 2026, alongside hospital bill support and burial assistance.",
    icon: "eye",
  },
  {
    value: "72.5%",
    title: "Education — core mandate",
    body: "Education spending represents 72.5% of total expenditure, reflecting OAK's commitment to its founding mission.",
    icon: "pie-chart",
  },
] as const;

export const livesChanged = [
  {
    slug: "abena-k-food-support",
    name: "Abena K.",
    meta: "Mim, Ahafo Region",
    programme: "Food Support",
    tag: "Widows programme",
    quote:
      "After my husband passed, I had no income and three children to feed. Obroni Akunafo Kuo came with food, clothing and someone who actually listened. That changed everything for us.",
    image: "/images/programmes/widows.jpg",
    accent: "green",
  },
  {
    slug: "kofi-a-education",
    name: "Kofi A., age 14",
    meta: "Ahafo Region",
    programme: "Education",
    tag: "Education programme",
    quote:
      "My school fees were paid by the organisation after both my parents passed. Now I am in junior high school and I want to be a doctor so I can help people the way they helped me.",
    image: "/images/programmes/education.jpg",
    accent: "orange",
  },
  {
    slug: "maama-ama-healthcare",
    name: "Maama Ama",
    meta: "Ahafo Region",
    programme: "Healthcare",
    tag: "Health programme",
    quote:
      "I am 74 years old and I live alone. The volunteers visit me every month, bring medicine, and sit with me. I no longer feel forgotten by the world.",
    image: "/images/people/ama.jpg",
    accent: "blue",
  },
] as const;

export const storiesTestimonials = [
  {
    quote:
      "The organisation truly cares. They don't just drop off food and leave — they sit, they talk, they check on you. That human connection is what I needed most after my husband passed.",
    name: "Widow beneficiary",
    role: "Food Support Programme · Ahafo Region",
    initials: "WB",
    color: "#2E6B2E",
  },
  {
    quote:
      "Volunteering with Obroni Akunafo Kuo changed how I see my community. I thought I was going to give — but what I received was far greater. A sense of purpose I had never felt before.",
    name: "Volunteer",
    role: "Community Outreach · Ahafo Region",
    initials: "VO",
    color: "#C2410C",
  },
  {
    quote:
      "As a community leader, I have seen many organisations come and go. This one stays. They know the families by name, they follow up, and they treat every person with respect.",
    name: "Community leader",
    role: "Ahafo Region",
    initials: "CL",
    color: "#2D6FE8",
  },
  {
    quote:
      "My son's school fees were paid for three years. He is now in senior high school. I don't have words for what that means to a mother who had nothing.",
    name: "Parent of sponsored child",
    role: "Education Programme · Ahafo Region",
    initials: "MP",
    color: "#6330D3",
  },
] as const;

export const annualReport = {
  period: "September 2024 – January 2026",
  preparedBy: "Collins Afriyie · Secretary, Obroni Akunafo Kuo",
  preparedOn: "29 January 2026",
  total: 492745.68,
  secretaryQuote:
    "We thank all individual donors and partners who contributed during this period. Your support made it possible to touch many lives. The overall expenditure of GHC 492,745.68 reflects our commitment to education as our core mandate.",
} as const;

export const contactReasons = [
  "General enquiry",
  "Donation question",
  "Volunteer enquiry",
  "Partnership enquiry",
  "Media/press enquiry",
  "Other",
] as const;

export const responseMethods = ["Email", "Phone call", "WhatsApp"] as const;

export const volunteerInterests = [
  "Community outreach",
  "Education",
  "Healthcare support",
  "Skills training",
  "Support for the aged",
  "Disability inclusion",
  "Fundraising/events",
  "Professional/technical",
  "Other",
] as const;

export const availabilityOptions = ["Weekdays", "Weekends", "Flexible"] as const;

export const involvementOptions = [
  "One-time",
  "Occasional",
  "Regular",
] as const;

export const partnerAreas = [
  "Education Support",
  "Healthcare Initiatives",
  "Food & essential relief",
  "Widow empowerment",
  "Disability inclusion",
  "Support for the aged",
  "Community outreach",
  "General/multiple areas",
] as const;

export const partnerSupportTypes = [
  "Financial contribution/sponsorship",
  "In-kind support",
  "Skills & expertise",
  "Staff volunteering",
  "Strategic partnership",
  "Other – describe below",
] as const;

export const meetingFormats = [
  "Video call",
  "Phone call",
  "In-person",
] as const;

export const contactMethods = ["Email", "Phone", "WhatsApp"] as const;

export const partnerDocuments = [
  {
    title: "Organisation Profile",
    body: "Our mission, programmes, governance and impact in one document.",
    href: "/documents/organisation-profile.pdf",
  },
  {
    title: "Constitution",
    body: "The governing rules and structure of Obroni Akunafo Kuo.",
    href: "/documents/constitution.pdf",
  },
] as const;
