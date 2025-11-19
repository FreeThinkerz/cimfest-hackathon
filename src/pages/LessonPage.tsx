import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { lessons } from "@/data/mockData";
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
import { ArrowLeft, Mic, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import PitchAnalyzer from "@/components/PitchAnalyzer";
import type { MusicianProfile } from "@/types/models.types";

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const musicianProfile = user?.profile as MusicianProfile;

  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string[];
  } | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);

  console.log(hasRecorded);
  const lesson = lessons.find((l) => l.id === lessonId);
  const [useAdvancedAnalysis, setUseAdvancedAnalysis] = useState(false);

  if (!lesson || !user || !musicianProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/artist-dashboard/training")}>
              Back to Training Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPitchLesson = lessonId === "pitch-drill";

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 10) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const analyzeRecording = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis with mock results
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const passed = mockScore >= lesson.passingScore;

      let feedback: string[] = [];

      if (lessonId === "vocal-warmup") {
        feedback = passed
          ? [
              "Excellent breath control and support",
              "Consistent volume throughout",
              "Good vocal stability",
              "Clear tone quality",
            ]
          : [
              "Try maintaining steadier breath support",
              "Focus on consistent volume",
              "Practice more vocal warmup exercises",
            ];
      } else if (lessonId === "pitch-drill") {
        feedback = passed
          ? [
              `Outstanding pitch accuracy: ${mockScore}%`,
              "Excellent pitch matching ability",
              "Strong tonal memory",
              "Ready for advanced pitch exercises",
            ]
          : [
              "Work on pitch accuracy",
              "Practice ear training exercises",
              "Try matching pitches with a piano",
              "Focus on listening before singing",
            ];
      } else if (lessonId === "rhythm-clapping") {
        feedback = passed
          ? [
              `Excellent rhythm stability: ${mockScore}%`,
              "Great timing consistency",
              "Strong rhythmic sense",
              "Ready for complex patterns",
            ]
          : [
              "Practice with a metronome",
              "Focus on steady timing",
              "Count along with the beat",
              "Start with simpler patterns",
            ];
      }

      setResult({ score: mockScore, passed, feedback });
      setIsAnalyzing(false);

      // Update user progress would go here
      // For now, we'll just track locally in the component
      setResult({ score: mockScore, passed, feedback });
    }, 2000);
  };

  const playReferencePitch = () => {
    // Mock function - in real app would play audio
    console.log("Playing reference pitch");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/artist-dashboard/training")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training Hub
        </Button>

        {/* Lesson Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
                <CardDescription className="text-base">
                  {lesson.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Pass: {lesson.passingScore}%
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {!result ? (
          <>
            {/* Instructions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {lesson.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Reference Pitch (for pitch drill) */}
            {lessonId === "pitch-drill" && (
              <>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Reference Pitch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={playReferencePitch}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Play Reference Pitch
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Advanced Pitch Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Want more structured pitch practice? Try our interactive
                      drill exercises with real-time feedback.
                    </p>
                    <Button
                      onClick={() => navigate("/artist-dashboard/training/drill-practice")}
                      variant="outline"
                      className="w-full"
                    >
                      Open Drill Practice
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Analysis Section */}
            {isPitchLesson ? (
              <div className="mb-8">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>AI-Powered Pitch Analysis</CardTitle>
                    <CardDescription>
                      Use our advanced pitch detection system to practice and
                      get real-time feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={useAdvancedAnalysis ? "default" : "outline"}
                        onClick={() => setUseAdvancedAnalysis(true)}
                      >
                        Advanced Analysis
                      </Button>
                      <Button
                        variant={!useAdvancedAnalysis ? "default" : "outline"}
                        onClick={() => setUseAdvancedAnalysis(false)}
                      >
                        Simple Recording
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {useAdvancedAnalysis ? (
                  <PitchAnalyzer
                    targetPitch={440} // A4 note for drill
                    mode="drill"
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Simple Recording Mode</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-8">
                        {!hasRecorded ? (
                          <>
                            <div
                              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all ${
                                isRecording
                                  ? "bg-red-500 animate-pulse"
                                  : "bg-gradient-to-br from-purple-500 to-pink-500"
                              }`}
                            >
                              <Mic className="w-16 h-16 text-blue-500" />
                            </div>
                            {isRecording && (
                              <div className="text-4xl text-black font-bold mb-4">
                                recording
                                {recordingTime}s
                              </div>
                            )}
                            <Button
                              size="lg"
                              onClick={
                                isRecording ? stopRecording : startRecording
                              }
                              className="text-lg px-8 border-black"
                            >
                              {isRecording
                                ? "Stop Recording"
                                : "Start Recording"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-24 h-24 text-green-600 mb-4" />
                            <p className="text-lg font-semibold mb-6">
                              Recording Complete!
                            </p>
                            <div className="flex gap-4">
                              <Button
                                size="lg"
                                onClick={() => {
                                  setHasRecorded(false);
                                  setRecordingTime(0);
                                }}
                                variant="outline"
                              >
                                Re-record
                              </Button>
                              <Button
                                size="lg"
                                onClick={analyzeRecording}
                                disabled={isAnalyzing}
                              >
                                {isAnalyzing
                                  ? "Analyzing..."
                                  : "Analyze Performance"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>

                      {isAnalyzing && (
                        <div className="space-y-2">
                          <p className="text-center text-sm text-muted-foreground">
                            AI is analyzing your performance...
                          </p>
                          <Progress value={66} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              /* Standard Recording for other lessons */
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Record Your Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    {!hasRecorded ? (
                      <>
                        <div
                          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all ${
                            isRecording
                              ? "bg-red-500 animate-pulse"
                              : "bg-gradient-to-br from-purple-500 to-pink-500"
                          }`}
                        >
                          <Mic className="w-16 h-16" />
                        </div>
                        {isRecording && (
                          <div className="text-4xl font-bold mb-4">
                            {recordingTime}s
                          </div>
                        )}
                        <Button
                          size="lg"
                          onClick={isRecording ? stopRecording : startRecording}
                          className="text-lg px-8"
                        >
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-24 h-24 text-green-600 mb-4" />
                        <p className="text-lg font-semibold mb-6">
                          Recording Complete!
                        </p>
                        <div className="flex gap-4">
                          <Button
                            size="lg"
                            onClick={() => {
                              setHasRecorded(false);
                              setRecordingTime(0);
                            }}
                            variant="outline"
                          >
                            Re-record
                          </Button>
                          <Button
                            size="lg"
                            onClick={analyzeRecording}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing
                              ? "Analyzing..."
                              : "Analyze Performance"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {isAnalyzing && (
                    <div className="space-y-2">
                      <p className="text-center text-sm text-muted-foreground">
                        AI is analyzing your performance...
                      </p>
                      <Progress value={66} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Results */
          <Card className="mb-8">
            <CardHeader>
              <div className="text-center space-y-4">
                {result.passed ? (
                  <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-600 mx-auto" />
                )}
                <CardTitle className="text-3xl">
                  {result.passed ? "Congratulations!" : "Keep Practicing!"}
                </CardTitle>
                <div className="text-6xl font-bold text-purple-600">
                  {result.score}%
                </div>
                <Badge
                  variant={result.passed ? "success" : "destructive"}
                  className="text-lg px-4 py-2"
                >
                  {result.passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Feedback:</h3>
                <ul className="space-y-2">
                  {result.feedback.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-purple-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setHasRecorded(false);
                    setRecordingTime(0);
                  }}
                  className="flex-1"
                >
                  Retry Lesson
                </Button>
                <Button
                  onClick={() => navigate("/artist-dashboard/training")}
                  className="flex-1"
                >
                  Back to Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
