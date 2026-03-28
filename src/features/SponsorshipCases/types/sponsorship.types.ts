export type Duration = "شهري" | "سنوي" | "حسب الحالة";
export type SponsorshipCategory = "أسرة" | "طالب" | "يتيم" | "مريض" | "موسمي" | "عاجل";

export interface Sponsorship {
  id: number;
  title: string;
  description: string;
  value: number;
  duration: Duration;
  total: number;
  active: boolean;
  seasonal?: string;
  urgent?: boolean;
  category?: SponsorshipCategory;
  image?: string;
  icon?: string;
}

export interface SponsorshipFormData {
  title: string;
  description: string;
  value: number;
  duration: Duration;
  category?: SponsorshipCategory;
  seasonal?: string;
  urgent?: boolean;
  image?: string;
  icon?: string;
}
