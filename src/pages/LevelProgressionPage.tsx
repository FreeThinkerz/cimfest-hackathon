import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, TrendingUp, Award } from 'lucide-react';

export default function LevelProgressionPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const updateLevel = useUserStore((state) => state.updateLevel);

  if (!user) {
    navigate('/');
    return null;
  }

  const completedLessons = user.lessonsCompleted.filter((l) => l.completed);
  const passedLessons = user.lessonsCompleted.filter((l) => l.passed);
  const allLessonsCompleted = completedLessons.length >= 3;
  const allLessonsPassed = passedLessons.length >= 3;

  const averageScore = completedLessons.length > 0
    ? Math.round(completedLessons.reduce((sum, l) => sum + l.score, 0) / completedLessons.length)
    : 0;

  const canProgress = allLessonsPassed && averageScore >= 75;

  const requirements = [
    {
      label: 'Complete all 3 lessons',
      met: allLessonsCompleted,
      detail: `${completedLessons.length}/3 completed`,
    },
    {
      label: 'Pass all lessons',
      met: allLessonsPassed,
      detail: `${passedLessons.length}/3 passed`,
    },
    {
      label: 'Achieve 75% average score',
      met: averageScore >= 75,
      detail: `${averageScore}% average`,
    },
  ];

  const handleProgressLevel = () => {
    if (canProgress) {
      const nextLevel = user.level === 'basic' ? 'intermediate' : 'advanced';
      updateLevel(nextLevel);
    }
  };

  const levels = [
    { name: 'Basic', color: 'bg-blue-500' },
    { name: 'Intermediate', color: 'bg-purple-500' },
    { name: 'Advanced', color: 'bg-orange-500' },
  ];

  const currentLevelIndex = levels.findIndex((l) => l.name.toLowerCase() === user.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/training')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training Hub
        </Button>

        {/* Current Level */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <CardTitle className="text-3xl mb-2">Level Progression</CardTitle>
            <CardDescription className="text-lg">
              Track your advancement through the talent levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground mb-2">Current Level</div>
              <Badge variant="default" className="text-2xl px-8 py-3 capitalize">
                {user.level}
              </Badge>
            </div>

            {/* Level Timeline */}
            <div className="flex items-center justify-between mb-8">
              {levels.map((level, index) => (
                <div key={level.name} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      index <= currentLevelIndex ? level.color : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    {index < currentLevelIndex ? '✓' : index + 1}
                  </div>
                  <div className="text-sm mt-2 font-medium">{level.name}</div>
                  {index < levels.length - 1 && (
                    <div className="absolute w-full h-1 bg-gray-300 dark:bg-gray-700 top-6 left-1/2" style={{ width: 'calc(100% - 3rem)' }}>
                      {index < currentLevelIndex && (
                        <div className={`h-full ${level.color}`} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progression Requirements</CardTitle>
            <CardDescription>
              {canProgress
                ? 'Congratulations! You meet all requirements to advance'
                : 'Complete these requirements to advance to the next level'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requirements.map((req) => (
                <div
                  key={req.label}
                  className={`flex items-start gap-4 p-4 rounded-lg ${
                    req.met
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  {req.met ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{req.label}</div>
                    <div className="text-sm text-muted-foreground">{req.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Improvement Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!allLessonsCompleted && (
                <div className="flex gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Complete all training lessons to demonstrate your commitment</span>
                </div>
              )}
              {!allLessonsPassed && (
                <div className="flex gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Retry failed lessons until you achieve passing scores</span>
                </div>
              )}
              {averageScore < 75 && (
                <div className="flex gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>Practice to improve your average score above 75%</span>
                </div>
              )}
              {canProgress && (
                <div className="flex gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>You're ready to advance! Click the button below to progress</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canProgress ? (
            <>
              <Button
                size="lg"
                onClick={handleProgressLevel}
                disabled={user.level === 'advanced'}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <div className="font-bold">
                    {user.level === 'advanced' ? 'Maximum Level Reached' : 'Proceed to Next Level'}
                  </div>
                  <div className="text-xs opacity-90">
                    {user.level === 'basic' && 'Advance to Intermediate'}
                    {user.level === 'intermediate' && 'Advance to Advanced'}
                    {user.level === 'advanced' && 'You are at the highest level'}
                  </div>
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/training/scorecard')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <div className="font-bold">View Scorecard</div>
                  <div className="text-xs opacity-90">Check your detailed analysis</div>
                </div>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={() => navigate('/training')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <div className="font-bold">Retry Lessons</div>
                  <div className="text-xs opacity-90">Improve your scores</div>
                </div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/training/scorecard')}
                className="h-auto py-4"
              >
                <div className="text-center">
                  <div className="font-bold">View Scorecard</div>
                  <div className="text-xs opacity-90">See areas to improve</div>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
