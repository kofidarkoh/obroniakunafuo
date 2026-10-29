export type SubmissionStatus = "new" | "reviewed" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  reason: string;
  message: string;
  preferredResponse: string;
  status: SubmissionStatus;
  createdAt: string;
  notes?: AdminNote[];
};

export type DonationFrequency = "once" | "monthly";
export type DonationMethod = "momo" | "bank";
export type DonationStatus = "pending" | "confirmed" | "cancelled";

export type Donation = {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  frequency: DonationFrequency;
  method: DonationMethod;
  reference: string;
  message?: string;
  status: DonationStatus;
  createdAt: string;
  confirmedAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
};

export type VolunteerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  involvement: string;
  skills?: string;
  motivation?: string;
  experience?: string;
  status: SubmissionStatus;
  createdAt: string;
  notes?: AdminNote[];
};

export type PartnershipEnquiry = {
  id: string;
  organisation: string;
  contactName: string;
  email: string;
  phone: string;
  area: string;
  supportType: string;
  message: string;
  meetingFormat: string;
  contactMethod: string;
  status: SubmissionStatus;
  createdAt: string;
  notes?: AdminNote[];
};

export type StoryStatus = "draft" | "published";

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
  pullQuote: {
    text: string;
    attribution: string;
  };
  programmes: string[];
  status: StoryStatus;
};

export type StoryBlock = {
  type: "p" | "h2" | "quote";
  text: string;
};

export type AdminNote = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type NotificationStatus = "draft" | "published";

export type Notification = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  status: NotificationStatus;
  createdAt: string;
};

export type Store = {
  contacts: ContactMessage[];
  donations: Donation[];
  volunteers: VolunteerApplication[];
  partnerships: PartnershipEnquiry[];
};
