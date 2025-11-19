import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp } from "lucide-react";

interface DrillProgressProps {
  exercisesCompleted?: number;
  totalExercises?: number;
  averageScore?: number;
  bestScore?: number;
  sessionsToday?: number;
  streak?: number;
}

export default function DrillProgress({
  exercisesCompleted = 0,
  totalExercises = 4,
  averageScore = 0,
  bestScore = 0,
  sessionsToday = 0,
  streak = 0,
}: DrillProgressProps) {
  const progressPercentage = (exercisesCompleted / totalExercises) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressMessage = () => {
    if (progressPercentage === 100) return "All exercises mastered! 🎉";
    if (progressPercentage >= 75) return "Almost there! Keep practicing! 💪";
    if (progressPercentage >= 50) return "Good progress! You're halfway! 🎵";
    if (progressPercentage >= 25) return "Getting started! Keep going! 🌟";
    return "Begin your pitch training journey! 🎯";
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Your Drill Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Exercise Completion</span>
            <span className="text-sm text-gray-600">
              {exercisesCompleted}/{totalExercises}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-gray-600 text-center">
            {getProgressMessage()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div
              className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
            >
              {averageScore.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Average Score</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className={`text-2xl font-bold ${getScoreColor(bestScore)}`}>
              {bestScore.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Best Score</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {sessionsToday}
            </div>
            <div className="text-xs text-gray-600">Sessions Today</div>
          </div>

          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{streak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4" />
            Recent Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {averageScore >= 90 && (
              <Badge
                variant="default"
                className="bg-yellow-100 text-yellow-800"
              >
                🏆 Excellence
              </Badge>
            )}
            {exercisesCompleted >= 1 && (
              <Badge variant="secondary">🎯 First Exercise</Badge>
            )}
            {exercisesCompleted >= totalExercises && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                🌟 All Exercises
              </Badge>
            )}
            {streak >= 3 && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                🔥 On Fire
              </Badge>
            )}
            {sessionsToday >= 3 && (
              <Badge
                variant="default"
                className="bg-purple-100 text-purple-800"
              >
                💪 Dedicated
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className=" rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Practice Tips
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Practice 10-15 minutes daily for best results</li>
            <li>• Use headphones for better pitch accuracy</li>
            <li>• Start with beginner exercises and progress gradually</li>
            <li>• Practice in a quiet environment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

