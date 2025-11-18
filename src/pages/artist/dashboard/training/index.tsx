import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { lessons } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Trophy,
  Music2,
} from "lucide-react";

export default function TrainingHubPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user) {
    navigate("/");
    return null;
  }

  // const completedCount = musicianProfile.lessonsCompleted.filter(
  //   (l) => l.completed,
  // ).length ?? 3;
  const completedCount = 3;
  const progress = (completedCount / lessons.length) * 100;

  const getLessonStatus = (lessonId: string) => {
    const lesson = user.lessonsCompleted?.find((l) => l.lessonId === lessonId);
    return lesson;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/artist-dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl mb-2">
                    AI Music Training Hub
                  </CardTitle>
                  <CardDescription className="text-base">
                    Develop your skills with AI-powered feedback
                  </CardDescription>
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-4">
                <div className="text-3xl font-bold capitalize">
                  {user?.talent_level}
                </div>
                <div className="text-xs font-semibold">Current Level</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Training Progress</span>
                <span className="text-muted-foreground">
                  {completedCount}/{lessons.length} Lessons Completed
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.artist_name}</div>
                <div className="text-xs text-muted-foreground">Stage Name</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.genre}</div>
                <div className="text-xs text-muted-foreground">Genre</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.region}</div>
                <div className="text-xs text-muted-foreground">Region</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-xl font-bold capitalize">
                  {user?.talent_level}
                </div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Training Modules</h2>
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id);
              const isCompleted = status?.completed || false;
              const isPassed = status?.passed || false;

              return (
                <Card
                  key={lesson.id}
                  className="group hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">
                              Lesson {index + 1}: {lesson.title}
                            </CardTitle>
                            {isCompleted && (
                              <Badge
                                variant={isPassed ? "success" : "destructive"}
                              >
                                {isPassed ? "Passed" : "Failed"}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {lesson.description}
                          </CardDescription>
                          {status && (
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">
                                Score:{" "}
                              </span>
                              <span className="font-bold">{status.score}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          navigate(`/training/lesson/${lesson.id}`)
                        }
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? "Retry" : "Start"}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("drill-practice")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Pitch Drill Practice</CardTitle>
                  <CardDescription>Interactive vocal exercises</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("melody-trainer")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Music2 className="w-8 h-8 text-pink-600" />
                <div>
                  <CardTitle>Melody Trainer</CardTitle>
                  <CardDescription>Cameroon music styles</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("scorecard")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <CardTitle>View Talent Scorecard</CardTitle>
                  <CardDescription>
                    See your AI-powered analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("level-progression")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle>Level Progression</CardTitle>
                  <CardDescription>
                    Check your advancement status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
