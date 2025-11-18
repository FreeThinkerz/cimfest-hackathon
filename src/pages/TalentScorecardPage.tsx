import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Mic2, Music2, Radio, Sparkles, Trophy } from 'lucide-react';
import type { MusicianProfile } from '@/types/models.types';

export default function TalentScorecardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const musicianProfile = user?.profile as MusicianProfile;

  if (!user || !musicianProfile) {
    navigate('/');
    return null;
  }

  // Generate mock scores if not available
  const scores = musicianProfile.talentScores || {
    pitchAccuracy: Math.floor(Math.random() * 20) + 75,
    rhythmStability: Math.floor(Math.random() * 20) + 75,
    vocalStrength: Math.floor(Math.random() * 3) + 7,
    melodyPotential: Math.floor(Math.random() * 20) + 75,
    harmonyReadiness: Math.floor(Math.random() * 20) + 70,
    overallScore: Math.floor(Math.random() * 20) + 75,
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const metrics = [
    {
      label: 'Pitch Accuracy',
      value: scores.pitchAccuracy,
      icon: Music2,
      description: 'Ability to match and maintain correct pitch',
    },
    {
      label: 'Rhythm Stability',
      value: scores.rhythmStability,
      icon: Radio,
      description: 'Consistency and timing in rhythmic patterns',
    },
    {
      label: 'Vocal Strength',
      value: scores.vocalStrength,
      max: 10,
      icon: Mic2,
      description: 'Power and control in vocal projection',
    },
    {
      label: 'Melody Potential',
      value: scores.melodyPotential,
      icon: Sparkles,
      description: 'Ability to create and perform melodic lines',
    },
    {
      label: 'Harmony Readiness',
      value: scores.harmonyReadiness,
      icon: TrendingUp,
      description: 'Readiness for complex harmonic singing',
    },
  ];

  const weaknesses = metrics
    .filter((m) => m.value < 75)
    .map((m) => m.label);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/training')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training Hub
        </Button>

        {/* Overall Score Header */}
        <Card className="mb-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <Trophy className="w-16 h-16 mx-auto" />
            <CardTitle className="text-4xl">Your Talent Scorecard</CardTitle>
            <div className="text-8xl font-bold">{scores.overallScore}</div>
            <CardDescription className="text-white/90 text-lg">
              Overall Talent Score (0-100)
            </CardDescription>
            <Badge
              variant={scores.overallScore >= 85 ? 'success' : scores.overallScore >= 70 ? 'warning' : 'destructive'}
              className="text-lg px-6 py-2"
            >
              {scores.overallScore >= 85 ? 'Excellent' : scores.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardHeader>
        </Card>

        {/* Individual Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {metrics.map((metric) => {
            const isOutOf10 = metric.max === 10;
            const percentage = isOutOf10 ? (metric.value / 10) * 100 : metric.value;

            return (
              <Card key={metric.label} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreBg(percentage)}`}>
                        <metric.icon className={`w-6 h-6 ${getScoreColor(percentage)}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{metric.label}</CardTitle>
                        <CardDescription className="text-sm">{metric.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                        {isOutOf10 ? `${metric.value}/10` : `${metric.value}%`}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={percentage} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Strength Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Strength Map</CardTitle>
            <CardDescription>Visual representation of your abilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.map((metric) => {
                const isOutOf10 = metric.max === 10;
                const percentage = isOutOf10 ? (metric.value / 10) * 100 : metric.value;

                return (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.label}</span>
                      <span className={getScoreColor(percentage)}>
                        {isOutOf10 ? `${metric.value}/10` : `${metric.value}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          percentage >= 85
                            ? 'bg-green-600'
                            : percentage >= 70
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {weaknesses.length > 0 && (
          <Card className="mb-8 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-600">Improvement Recommendations</CardTitle>
              <CardDescription>Based on your current assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-base">
                  Based on your weaknesses in {weaknesses.join(', ')}, we recommend:
                </p>
                <ul className="space-y-2 ml-4">
                  {weaknesses.includes('Pitch Accuracy') && (
                    <li className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Redo the <strong>Pitch Drill</strong> module to improve pitch accuracy</span>
                    </li>
                  )}
                  {weaknesses.includes('Rhythm Stability') && (
                    <li className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Practice the <strong>Rhythm Clapping</strong> exercises daily</span>
                    </li>
                  )}
                  {weaknesses.includes('Vocal Strength') && (
                    <li className="flex gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Focus on <strong>Vocal Warmup</strong> techniques and breath control</span>
                    </li>
                  )}
                  <li className="flex gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Consider working with a mentor from our directory</span>
                  </li>
                </ul>
                <Button
                  onClick={() => navigate('/training')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Go to Training Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size="lg"
            onClick={() => navigate('/training/level-progression')}
            className="h-auto py-4"
          >
            <div className="text-left">
              <div className="font-bold">Check Level Progression</div>
              <div className="text-xs opacity-90">See if you qualify for the next level</div>
            </div>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/promotional-guide')}
            className="h-auto py-4"
          >
            <div className="text-left">
              <div className="font-bold">Get Promotional Advice</div>
              <div className="text-xs opacity-90">Personalized marketing strategies</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
