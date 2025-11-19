import { useState } from "react";
import PitchAnalyzer from "./PitchAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";

const DRILL_EXERCISES = [
  {
    id: "c-major-scale",
    name: "C Major Scale",
    description: "Practice singing the C major scale: C-D-E-F-G-A-B-C",
    pitches: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25], // C4 to C5
    level: "beginner",
  },
  {
    id: "perfect-fifth",
    name: "Perfect Fifth",
    description: "Practice singing perfect fifths: C-G intervals",
    pitches: [261.63, 392.0], // C4 to G4
    level: "beginner",
  },
  {
    id: "chromatic-run",
    name: "Chromatic Run",
    description: "Sing chromatic notes from C to G",
    pitches: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0],
    level: "intermediate",
  },
  {
    id: "octave-jump",
    name: "Octave Jumps",
    description: "Practice jumping octaves accurately",
    pitches: [261.63, 523.25, 261.63, 523.25], // C4-C5-C4-C5
    level: "advanced",
  },
];

interface DrillPracticeProps {
  onComplete?: (score: number) => void;
}

export default function DrillPractice({ onComplete }: DrillPracticeProps) {
  const [selectedExercise, setSelectedExercise] = useState(DRILL_EXERCISES[0]);
  const [currentPitchIndex, setCurrentPitchIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [practiceMode, setPracticeMode] = useState<"guided" | "free">("guided");

  const currentPitch = selectedExercise.pitches[currentPitchIndex];
  const progress =
    ((currentPitchIndex + 1) / selectedExercise.pitches.length) * 100;

  const playCurrentPitch = () => {
    // Create audio context for playing reference pitch
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(currentPitch, audioContext.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);

    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const nextPitch = () => {
    if (currentPitchIndex < selectedExercise.pitches.length - 1) {
      setCurrentPitchIndex((prev) => prev + 1);
    } else {
      // Exercise complete
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      setExerciseComplete(true);
      onComplete?.(averageScore);
    }
  };

  const previousPitch = () => {
    if (currentPitchIndex > 0) {
      setCurrentPitchIndex((prev) => prev - 1);
    }
  };

  const restartExercise = () => {
    setCurrentPitchIndex(0);
    setExerciseStarted(false);
    setScores([]);
    setExerciseComplete(false);
    setShowInstructions(true);
    setSessionStartTime(null);
  };

  const startExercise = () => {
    setExerciseStarted(true);
    setSessionStartTime(Date.now());
    setShowInstructions(false);
    playCurrentPitch();
  };

  const getPitchName = (frequency: number): string => {
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const a4 = 440;
    const c0 = a4 * Math.pow(2, -4.75);

    if (frequency > 0) {
      const h = 12 * Math.log2(frequency / c0);
      const octave = Math.floor(h / 12);
      const n = Math.round(h) % 12;
      return noteNames[n] + octave;
    }
    return "";
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Drill Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRILL_EXERCISES.map((exercise) => (
              <Card
                key={exercise.id}
                className={`cursor-pointer transition-all ${
                  selectedExercise.id === exercise.id
                    ? "ring-2 ring-purple-500 bg-slate-900"
                    : "hover:bg-slate-900"
                }`}
                onClick={() => {
                  setSelectedExercise(exercise);
                  restartExercise();
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <Badge className={getLevelColor(exercise.level)}>
                      {exercise.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exercise.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {exercise.pitches.length} notes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedExercise.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {selectedExercise.description}
              </p>
            </div>
            <Badge className={getLevelColor(selectedExercise.level)}>
              {selectedExercise.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!exerciseStarted ? (
            showInstructions ? (
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    How to Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Instructions:</h4>
                    <ol className="space-y-1 text-sm list-decimal list-inside">
                      <li>
                        Listen to the reference pitch by clicking "Play
                        Reference"
                      </li>
                      <li>Sing the same pitch into your microphone</li>
                      <li>Watch the real-time feedback for accuracy</li>
                      <li>Use "Live Analysis" mode for instant feedback</li>
                      <li>Progress through all notes in the exercise</li>
                    </ol>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Practice Mode:</h4>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          practiceMode === "guided" ? "default" : "outline"
                        }
                        onClick={() => setPracticeMode("guided")}
                        size="sm"
                      >
                        Guided Practice
                      </Button>
                      <Button
                        variant={
                          practiceMode === "free" ? "default" : "outline"
                        }
                        onClick={() => setPracticeMode("free")}
                        size="sm"
                      >
                        Free Practice
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600">
                      {practiceMode === "guided"
                        ? "Step-by-step progression with guidance"
                        : "Practice any note in any order"}
                    </p>
                  </div>
                  <div className="pt-4 flex justify-center">
                    <Button
                      onClick={startExercise}
                      size="lg"
                      className="text-lg px-8"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <Button
                  onClick={startExercise}
                  size="lg"
                  className="text-lg px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Exercise
                </Button>
              </div>
            )
          ) : exerciseComplete ? (
            <div className="text-center py-8 space-y-6">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
              <div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">
                  Exercise Complete!
                </h3>
                <p className="text-lg text-gray-600">
                  Congratulations on finishing {selectedExercise.name}
                </p>
              </div>

              {/* Results Summary */}
              <Card className="bg-green-50 dark:bg-green-900/20 max-w-md mx-auto">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {scores.length > 0
                          ? (
                              scores.reduce((a, b) => a + b, 0) / scores.length
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedExercise.pitches.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Notes Completed
                      </div>
                    </div>
                  </div>
                  {sessionStartTime && (
                    <div className="text-center mt-4 pt-4 border-t">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Session Time:{" "}
                          {Math.round((Date.now() - sessionStartTime) / 1000)}s
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button onClick={restartExercise}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => {
                    const nextIndex =
                      (DRILL_EXERCISES.findIndex(
                        (e) => e.id === selectedExercise.id,
                      ) +
                        1) %
                      DRILL_EXERCISES.length;
                    setSelectedExercise(DRILL_EXERCISES[nextIndex]);
                    restartExercise();
                  }}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Next Exercise
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {currentPitchIndex + 1} of {selectedExercise.pitches.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current Pitch */}
              <Card className="bg-slate-900">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Current Target</h3>
                    <div className="text-4xl font-bold text-blue-600">
                      {getPitchName(currentPitch)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentPitch.toFixed(2)} Hz
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={playCurrentPitch} disabled={isPlaying}>
                        <Volume2 className="w-4 h-4 mr-2" />
                        {isPlaying ? "Playing..." : "Play Reference"}
                      </Button>
                      <Button
                        onClick={previousPitch}
                        disabled={currentPitchIndex === 0}
                        size="sm"
                      >
                        Previous
                      </Button>
                      <Button onClick={nextPitch} size="sm">
                        Skip
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Mode Options */}
              {practiceMode === "free" && (
                <Card className="bg-yellow-50 dark:bg-yellow-900/20">
                  <CardHeader>
                    <CardTitle>Free Practice Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Jump to any note in this exercise:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.pitches.map((pitch, index) => (
                          <Button
                            key={index}
                            variant={
                              index === currentPitchIndex
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPitchIndex(index)}
                            className="min-w-[60px]"
                          >
                            {getPitchName(pitch)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pitch Analyzer */}
              <PitchAnalyzer targetPitch={currentPitch} mode="drill" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

