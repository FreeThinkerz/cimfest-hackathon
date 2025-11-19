import { Music2 } from "lucide-react";
import { MainLayout } from "./main-layout";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 " />

        <div className="max-w-md w-full relative z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4 animate-glow-pulse">
              <Music2 className="w-10 h-10 text-background" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          <div className=" rounded-2xl p-8 space-y-6 text-background">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
