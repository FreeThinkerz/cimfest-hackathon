import React from "react";
import { useMelodyTrainer } from "@/hooks/useMelodyTrainer";
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
import { Music2, Square, Mic, Volume2, Trophy, Music } from "lucide-react";

const GENRE_INFO: Record<
  string,
  { name: string; description: string; emoji: string }
> = {
  makossa: {
    name: "Makossa",
    description: "Upbeat urban dance music from Douala",
    emoji: "🎺",
  },
  bikutsi: {
    name: "Bikutsi",
    description: "Traditional war dance rhythm",
    emoji: "🥁",
  },
  njang: {
    name: "Njang",
    description: "Grassfields melodic tradition",
    emoji: "🎵",
  },
  assiko: {
    name: "Assiko",
    description: "Coastal percussion-driven style",
    emoji: "🎶",
  },
  mbole: {
    name: "Mbole",
    description: "Central region vocal harmony",
    emoji: "🎤",
  },
};

export default function CameroonMelodyTrainer() {
  const { playGenre, stop, score, isPlaying, currentGenre, musicStyles } =
    useMelodyTrainer();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return { label: "Excellent!", variant: "success" as const };
    if (score >= 80) return { label: "Great!", variant: "success" as const };
    if (score >= 70) return { label: "Good", variant: "default" as const };
    if (score >= 60) return { label: "Fair", variant: "secondary" as const };
    return { label: "Keep Practicing", variant: "destructive" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Music2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Cameroon Melody Trainer
              </CardTitle>
              <CardDescription className="text-base">
                Practice traditional Cameroonian melodies and match their pitch
                patterns
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                How it works:
              </p>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li>• Select a Cameroonian music style to practice</li>
                <li>• Allow microphone access when prompted</li>
                <li>• Listen as the melody plays 5 times</li>
                <li>• Sing along to match the pitch patterns</li>
                <li>• Get your pitch matching score at the end</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genre Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-xl">Select Music Style</CardTitle>
          </div>
          <CardDescription>
            Choose a traditional Cameroonian music style to practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(musicStyles).map((genreKey) => {
              const info = GENRE_INFO[genreKey];
              const isActive = currentGenre === genreKey;

              return (
                <Button
                  key={genreKey}
                  onClick={() => playGenre(genreKey)}
                  disabled={isPlaying}
                  variant={isActive ? "default" : "ghost"}
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${
                    isActive
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-2xl">{info.emoji}</span>
                    <span className="font-semibold text-base">{info.name}</span>
                  </div>
                  <span className="text-xs opacity-90 text-left">
                    {info.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Playback Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-xl">Playback Control</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPlaying && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="animate-pulse">
                  <Music2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    Playing {GENRE_INFO[currentGenre || ""]?.name}...
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Sing along to match the melody
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Recording
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={stop}
            disabled={!isPlaying}
            variant="destructive"
            size="lg"
            className="w-full"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop & Reset
          </Button>
        </CardContent>
      </Card>

      {/* Score Display */}
      {score !== null && (
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-xl">Your Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div
                className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}
              >
                {score}%
              </div>
              <Badge
                variant={getScoreBadge(score).variant}
                className="text-base px-4 py-1"
              >
                {getScoreBadge(score).label}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Pitch Matching Accuracy
                </span>
                <span className="font-medium">{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>

            <div className="text-center text-sm text-muted-foreground pt-2 border-t">
              {score >= 80
                ? "🎉 Outstanding pitch control! Keep up the great work!"
                : score >= 60
                  ? "💪 Good effort! Practice more to improve your pitch accuracy."
                  : "🎯 Keep practicing! Try to match the melody more closely."}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
