import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Brain, Music2, Zap } from "lucide-react";
import DrillPractice from "@/components/DrillPractice";
import DrillProgress from "@/components/DrillProgress";
import type { MusicianProfile } from "@/types/models.types";

export default function DrillPracticePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const musicianProfile = user?.profile as MusicianProfile;

  if (!user || !musicianProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDrillComplete = (score: number) => {
    // Here you could update user progress in the future
    console.log("Drill completed with score:", score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/training")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training Hub
        </Button>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">
                  Pitch Drill Practice
                </CardTitle>
                <CardDescription className="text-base">
                  Master your pitch accuracy with structured vocal exercises
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Overview */}
        <div className="mb-8">
          <DrillProgress
            exercisesCompleted={1}
            totalExercises={4}
            averageScore={75}
            bestScore={92}
            sessionsToday={1}
            streak={3}
          />
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Real-time pitch detection with instant feedback on accuracy and
                stability
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Structured Exercises</h3>
              <p className="text-sm text-gray-600">
                Progressive training from basic scales to advanced chromatic
                runs
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Feedback</h3>
              <p className="text-sm text-gray-600">
                Live visual feedback and detailed performance analytics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Drill Practice Component */}
        <DrillPractice onComplete={handleDrillComplete} />
      </div>
    </div>
  );
}
