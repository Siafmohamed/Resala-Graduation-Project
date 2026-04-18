export type Duration = "شهري" | "سنوي" | "حسب الحالة";
export type SponsorshipCategory = "أسرة" | "طالب" | "يتيم" | "مريض" | "موسمي" | "عاجل" | "emergency";

export interface Sponsorship {
  id: number;
  name: string; // Sponsorship title
  description: string;
  imageUrl?: string; // Web page reference like https://example.com/image.jpg
  icon?: string; // SVG format icon
  targetAmount: number;
  collectedAmount?: number;
  active: boolean;
  category: SponsorshipCategory;
  duration?: Duration;
}

export interface EmergencyCase extends Sponsorship {
  category: "emergency";
  patientName?: string;
  medicalCondition?: string;
}

export interface CreateSponsorshipPayload {
  name: string;
  description: string;
  targetAmount: number;
  imageUrl?: string;
  icon?: string;
  category?: SponsorshipCategory;
}

export interface UpdateSponsorshipPayload extends Partial<CreateSponsorshipPayload> {
  active?: boolean;
}
