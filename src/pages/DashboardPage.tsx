import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Brain, Building2, GraduationCap, Music } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const sections = [
    {
      title: 'National Music Database',
      description: 'Explore top and rising Cameroonian artists',
      icon: Database,
      path: '/nmd',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'AI Music Training & Talent Scoring',
      description: 'Develop your skills and get AI-powered feedback',
      icon: Brain,
      path: '/training',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Record Label & Talent Portal',
      description: 'Connect with labels and mentors',
      icon: Building2,
      path: '/label-portal',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Promotional Education Guide',
      description: 'Learn data-driven promotional strategies',
      icon: GraduationCap,
      path: '/promotional-guide',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-4">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome, {user?.stageName || 'Artist'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to music excellence starts here. Choose a pillar to explore
          </p>
        </div>

        {/* Four Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Card
              key={section.path}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-400 hover:scale-105"
              onClick={() => navigate(section.path)}
            >
              <CardHeader className="space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{section.title}</CardTitle>
                <CardDescription className="text-base">{section.description}</CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{user.genre}</div>
                  <div className="text-sm text-muted-foreground">Genre</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.region}</div>
                  <div className="text-sm text-muted-foreground">Region</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 capitalize">{user.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{user.lessonsCompleted.length}/3</div>
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
