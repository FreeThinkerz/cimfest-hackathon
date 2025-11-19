import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Brain, GraduationCap, Music, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const userName = user?.artist_name ?? "Artist";

  const sections = [
    {
      title: "National Music Database",
      description: "Explore top and rising Cameroonian artists",
      icon: Database,
      path: "nmd",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Music Training & Talent Scoring",
      description: "Develop your skills and get AI-powered feedback",
      icon: Brain,
      path: "training",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <HeroSection
          userName={userName}
          subtitle="Your journey to music excellence starts here. Choose a pillar to explore"
        />

        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Card
              key={section.path}
              className=" hover:shadow-2xl  text-background transition-all duration-300 cursor-pointer border border-slate-600 bg-slate-500/10  hover:border-purple-400 hover:scale-105"
              onClick={() => navigate(section.path)}
            >
              <CardHeader className="space-y-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl ">{section.title}</CardTitle>
                <CardDescription className="text-base">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Explore →
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Stats */}
        {user && (
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="text-background transition-all duration-300 cursor-pointer border border-slate-600 bg-slate-500/10  ">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-600/40 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user?.genre}
                  </div>
                  <div className="text-sm text-muted-foreground">Genre</div>
                </div>
                <div className="text-center p-4 bg-blue-400/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user?.region}
                  </div>
                  <div className="text-sm text-muted-foreground">Region</div>
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 capitalize">
                    {user?.talent_level}
                  </div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center p-4 bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {user?.lessonsCompleted?.length ?? 0}/3
                  </div>
                  <div className="text-sm text-muted-foreground">Lessons</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
