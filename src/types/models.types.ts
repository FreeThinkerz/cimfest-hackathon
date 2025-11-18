export type UserRole = "artist" | "sponsor";

// export interface Role {
//   type: UserRole;
//   permissions: string[];
// }

export interface User {
  id: string | number;
  name: string;
  artist_name: string;
  email: string;
  roles: UserRole[];
  talent_level: TalentLevel;
  region?: string;
  talentscores: TalentScores | null;
  lessonsCompleted?: LessonProgress[];
}

export interface LabelProfile {
  companyName: string;
  contactPerson: string;
  genre: string[];
  regions: string[];
  establishedYear: number;
  createdAt: string;
}

export type TalentLevel = "basic" | "intermediate" | "advanced";

export interface TalentScores {
  pitchAccuracy: number;
  rhythmStability: number;
  vocalStrength: number;
  melodyPotential: number;
  harmonyReadiness: number;
  overallScore: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  passed: boolean;
}
