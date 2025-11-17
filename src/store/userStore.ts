import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TalentLevel = 'basic' | 'intermediate' | 'advanced';

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  passed: boolean;
}

export interface TalentScores {
  pitchAccuracy: number;
  rhythmStability: number;
  vocalStrength: number;
  melodyPotential: number;
  harmonyReadiness: number;
  overallScore: number;
}

export interface UserProfile {
  id: string;
  stageName: string;
  fullName: string;
  genre: string;
  region: string;
  level: TalentLevel;
  talentScores: TalentScores | null;
  lessonsCompleted: LessonProgress[];
  createdAt: string;
}

interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateLessonProgress: (lessonId: string, progress: Omit<LessonProgress, 'lessonId'>) => void;
  updateTalentScores: (scores: TalentScores) => void;
  updateLevel: (level: TalentLevel) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateLessonProgress: (lessonId, progress) =>
        set((state) => {
          if (!state.user) return state;
          const existingIndex = state.user.lessonsCompleted.findIndex(
            (l) => l.lessonId === lessonId
          );
          const updatedLessons = [...state.user.lessonsCompleted];
          if (existingIndex >= 0) {
            updatedLessons[existingIndex] = { lessonId, ...progress };
          } else {
            updatedLessons.push({ lessonId, ...progress });
          }
          return {
            user: {
              ...state.user,
              lessonsCompleted: updatedLessons,
            },
          };
        }),
      updateTalentScores: (scores) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              talentScores: scores,
            },
          };
        }),
      updateLevel: (level) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              level,
            },
          };
        }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
