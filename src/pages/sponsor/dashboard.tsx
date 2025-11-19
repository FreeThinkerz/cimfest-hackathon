import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Database, Brain, Building2, BookOpen, Music2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "National Music Database",
      description: "Explore Cameroon's top and rising artists",
      icon: Database,
      path: "/artists",
      gradient: "from-primary to-primary-glow",
    },
    {
      title: "AI Music Training & Talent Scoring",
      description: "Develop your skills with AI-powered training",
      icon: Brain,
      path: "/training",
      gradient: "from-secondary to-accent",
    },
    {
      title: "Record Label & Talent Portal",
      description: "Connect with industry professionals",
      icon: Building2,
      path: "/label-portal",
      gradient: "from-accent to-primary",
    },
    {
      title: "Promotional Education Guide",
      description: "Learn data-driven promotional strategies",
      icon: BookOpen,
      path: "/promotional-guide",
      gradient: "from-primary to-secondary",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 animate-float">
            <Music2 className="w-8 h-8 text-background" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gradient">
            CamMusic Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to Cameroon's music industry ecosystem
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                onClick={() => navigate(section.path)}
                className="group cursor-pointer card-gradient border-border hover:border-primary p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-background" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Artists</div>
          </div>
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            <div className="text-3xl font-bold text-secondary mb-1">100+</div>
            <div className="text-sm text-muted-foreground">
              Training Modules
            </div>
          </div>
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "600ms" }}
          >
            <div className="text-3xl font-bold text-accent mb-1">25+</div>
            <div className="text-sm text-muted-foreground">
              Industry Partners
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
