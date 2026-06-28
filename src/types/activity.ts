export type CategoryName =
  | "Fine Motor"
  | "Sensory"
  | "Creativity"
  | "Practical Life"
  | "Language"
  | "Physical";

export type CategoryId =
  | "fine-motor"
  | "sensory"
  | "creativity"
  | "practical-life"
  | "language"
  | "physical";

export type Mess = "Low" | "Medium" | "High";

export type Activity = {
  slug: string;
  title: string;
  category: CategoryName;
  categoryId: CategoryId;
  ageMin: number; // months
  duration: number; // minutes
  mess: Mess;
  summary: string;
  materials: string[];
  steps: string[];
  benefits: string[];
  cleanup: string;
  imageUrl: string;
  thumbUrl: string;
  /** Looping animation rendered with Remotion (or AI-generated later); photo stays as poster. */
  videoUrl?: string | null;
  isFree: boolean;
  ratingCount: number;
  ratingSum: number;
  avgRating: number;
  saveCount: number;
};

export type Category = {
  id: CategoryId;
  name: CategoryName;
  order: number;
  imageUrl: string | null;
  activityCount: number;
};
