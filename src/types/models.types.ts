export type UserRole = 'MUSICIAN' | 'LABEL';

export interface Role {
  type: UserRole;
  permissions: string[];
}

export interface User {
  id: string | number;
  email: string;
  role: UserRole;
  profile: MusicianProfile | LabelProfile;
}

export interface MusicianProfile {
  stageName: string;
  fullName: string;
  genre: string;
  region: string;
  level: TalentLevel;
  talentScores: TalentScores | null;
  lessonsCompleted: LessonProgress[];
  createdAt: string;
}

export interface LabelProfile {
  companyName: string;
  contactPerson: string;
  genre: string[];
  regions: string[];
  establishedYear: number;
  createdAt: string;
}

export type TalentLevel = 'basic' | 'intermediate' | 'advanced';

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
