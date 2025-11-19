import React from "react";
import { Music } from "lucide-react";

type HeroSectionProps = {
  userName: string;
  subtitle: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  subtitle,
}) => {
  return (
    <div className="text-center mb-12 space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-4">
        <Music className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Welcome, {userName}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default HeroSection;
