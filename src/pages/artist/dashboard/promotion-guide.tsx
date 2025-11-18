import { NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { promotionalStrategies, recordLabels } from "@/data/mockData";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowLeft,
  TrendingUp,
  Youtube,
  Music,
  Calendar,
  Target,
  Building2,
} from "lucide-react";

export default function PromotionalGuidePage() {
  const user = useUserStore((state) => state.user);

  const strategy =
    promotionalStrategies[user?.genre as keyof typeof promotionalStrategies] ||
    promotionalStrategies["Afrobeats"];
  const recommendedLabels = recordLabels.filter((label) =>
    label.focus.includes(user?.genre),
  );

  // Determine weaknesses based on talent scores
  const weaknesses = [];
  if (user?.talentscores) {
    if (user?.talentscores.pitchAccuracy < 75)
      weaknesses.push("pitch accuracy");
    if (user?.talentscores.rhythmStability < 75)
      weaknesses.push("rhythm stability");
    if (user?.talentscores.vocalStrength < 7) weaknesses.push("vocal strength");
  }

  const platformIcons = {
    TikTok: Music,
    YouTube: Youtube,
    Spotify: Music,
    Boomplay: Music,
    Facebook: Music,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <NavLink to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </NavLink>
        {/* Header */}
        <Card className="mb-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">
              Your Promotional Strategy
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Data-driven recommendations based on your genre and performance
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Artist Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.artist_name}</div>
                <div className="text-xs text-muted-foreground">Stage Name</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.genre}</div>
                <div className="text-xs text-muted-foreground">Genre</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-xl font-bold capitalize">
                  {user?.talent_level}
                </div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-xl font-bold">{user?.region}</div>
                <div className="text-xs text-muted-foreground">Region</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Platforms */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle>Recommended Platforms</CardTitle>
                <CardDescription>
                  Best channels for {user?.genre} artists to reach their
                  audience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strategy.platforms.map((platform, index) => {
                const Icon =
                  platformIcons[platform as keyof typeof platformIcons] ||
                  Music;
                return (
                  <div
                    key={platform}
                    className={`p-6 rounded-lg text-center ${
                      index === 0
                        ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-3 ${index === 0 ? "text-white" : "text-green-600"}`}
                    />
                    <div className="font-bold text-lg">{platform}</div>
                    {index === 0 && (
                      <Badge variant="secondary" className="mt-2">
                        Priority
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Strategy */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle>Content Strategy</CardTitle>
                <CardDescription>
                  What type of content works best for your genre
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {strategy.contentStrategy.map((content) => (
                <div
                  key={content}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center font-medium"
                >
                  {content}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold">Posting Frequency</div>
                <div className="text-sm text-muted-foreground">
                  {strategy.postingFrequency}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Tactics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Success Tactics</CardTitle>
            <CardDescription>
              Proven strategies for {user?.genre} artists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategy.keyTactics.map((tactic, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{tactic}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        {weaknesses.length > 0 && (
          <Card className="mb-8 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-orange-600">
                Personalized Advice
              </CardTitle>
              <CardDescription>
                Based on your AI talent assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  Your assessment shows opportunities for improvement in{" "}
                  {weaknesses.join(", ")}. Consider:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-orange-600">•</span>
                    <span>
                      Focus on acoustic/live sessions to showcase raw talent
                      while improving skills
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600">•</span>
                    <span>
                      Collaborate with producers who can enhance your strengths
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600">•</span>
                    <span>
                      Continue training modules to build confidence in weaker
                      areas
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Labels */}
        {recommendedLabels.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <CardTitle>Recommended Record Labels</CardTitle>
                  <CardDescription>
                    Labels in your region specializing in {user?.genre}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedLabels.map((label) => (
                  <div
                    key={label.name}
                    className="p-4 border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="font-bold text-lg mb-2">{label.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>{label.region}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {label.focus.map((genre) => (
                        <Badge
                          key={genre}
                          variant="secondary"
                          className="text-xs"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 30-Day Growth Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Your 30-Day Growth Strategy</CardTitle>
            <CardDescription>Action plan for the next month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-bold text-green-600">Week 1-2</div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Build Foundation</p>
                  <p className="text-sm text-muted-foreground">
                    Set up profiles on recommended platforms, create content
                    calendar, record 3-4 pieces of content
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-bold text-blue-600">Week 3</div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Launch & Engage</p>
                  <p className="text-sm text-muted-foreground">
                    Post consistently ({strategy.postingFrequency}), respond to
                    comments, collaborate with local artists
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-bold text-purple-600">Week 4</div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Analyze & Optimize</p>
                  <p className="text-sm text-muted-foreground">
                    Review analytics, identify best-performing content, adjust
                    strategy, plan next month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
