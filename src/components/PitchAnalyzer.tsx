import { useState, useRef, useMemo, useEffect } from "react";
import { usePitchAnalysis, usePitchy } from "../hooks/usePitchAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Square, Upload, Activity } from "lucide-react";

interface PitchAnalyzerProps {
  targetPitch?: number;
  mode?: "drill" | "assessment";
}

const PitchAnalyzer = ({
  targetPitch,
  mode = "assessment",
}: PitchAnalyzerProps) => {
  const {
    result,
    average,
    score,
    analyzeAudio,
    // loading,
    startRealtimeAnalysis,
    stopRealtimeAnalysis,
    isListening,
    realtimeData,
  } = usePitchAnalysis();

  const {
    analyzeMedia,
    loading,
    data,
    pitches,
    clarities,
    computeClarity,
    computePitchStability,
    computePitchAccuracy,
    rating,
  } = usePitchy();

  useEffect(() => console.log(rating), [rating]);

  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<
    "upload" | "record" | "realtime"
  >("upload");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      recordedChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunksRef.current, {
        type: "audio/webm",
      });
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      setFile(audioFile);
      setAudioURL(URL.createObjectURL(audioBlob));
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleAnalyzeButton = () => {
    console.log("file in the analyse folder", file);
    if (file) analyzeMedia(file);
  };

  const handleStartRealtime = () => {
    if (isListening) {
      stopRealtimeAnalysis();
    } else {
      startRealtimeAnalysis(targetPitch);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPitchStatus = () => {
    if (!realtimeData) return "No signal";
    if (realtimeData.isOnPitch) return "On pitch!";
    if (realtimeData.pitchDifference! > 50) return "Too far off";
    return "Close!";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Pitch & Clarity Analyzer
            {mode === "drill" && <Badge variant="secondary">Drill Mode</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={analysisMode === "upload" ? "default" : "ghost"}
              onClick={() => setAnalysisMode("upload")}
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button onClick={() => setAnalysisMode("record")} size="sm">
              <Square className="w-4 h-4 mr-2" />
              Record
            </Button>
            <Button
              variant={analysisMode === "realtime" ? "default" : "ghost"}
              onClick={() => setAnalysisMode("realtime")}
              size="sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              Live
            </Button>
          </div>

          {/* Upload Mode */}
          {analysisMode === "upload" && (
            <div className="space-y-4">
              <input
                type="file"
                accept="audio/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  setAudioURL(null);
                  setFile(e.target.files?.[0] || null);
                }}
              />
              <Button
                onClick={handleAnalyzeButton}
                disabled={!file || loading}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Audio"}
              </Button>
            </div>
          )}

          {/* Recording Mode */}
          {analysisMode === "record" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button
                    onClick={handleRecord}
                    variant="ghost"
                    className="flex-1"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStop} className="flex-1">
                    <Square className="w-4 h-4 mr-2" />
                    {}s Stop Recording
                  </Button>
                )}
              </div>

              {audioURL && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recorded Audio:</p>
                  <audio controls src={audioURL} className="w-full" />
                  <Button
                    onClick={handleAnalyzeButton}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Analyzing..." : "Analyze Recording"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Real-time Mode */}
          {analysisMode === "realtime" && (
            <div className="space-y-4">
              <div className="text-center">
                <Button
                  onClick={handleStartRealtime}
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Live Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Real-time feedback */}
              {realtimeData && (
                <Card className="bg-gray-50 dark:bg-gray-900">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">
                          {realtimeData.currentPitch.toFixed(1)} Hz
                        </div>
                        <div className="text-xs text-gray-600">
                          Current Pitch
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">
                          {(realtimeData.currentClarity * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Clarity</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {realtimeData.currentMidi.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-600">MIDI Note</div>
                      </div>
                      <div>
                        <Badge
                          variant={
                            realtimeData.isOnPitch ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {getPitchStatus()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {data.length ? (
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analysis Results</span>
                  <Badge className={getScoreColor(score)}>
                    {score.toFixed(1)}/100
                  </Badge> */}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {computePitchAccuracy(pitches).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Pitch Accuracy</div>
                    <Progress
                      value={computePitchAccuracy(pitches)}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {computePitchStability().weightedStability!.toFixed(2)} Hz
                    </div>
                    <div className="text-sm text-gray-600">Pitch Stability</div>
                    {/* <Progress
                      value={computePitchStability().stability!}
                      className="mt-2"
                    /> */}
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {computeClarity(clarities).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Voice Clarity</div>
                    <Progress
                      value={computeClarity(clarities)}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-semibold mb-2">Pitch Statistics</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        Average: {computePitchAccuracy(pitches).toFixed(1)} Hz
                      </div>
                      {/* <div>
                        Range:{" "}
                        {Math.min(...result.map((d) => d.pitch)).toFixed(1)} -
                        {""}
                        {Math.max(...result.map((d) => d.pitch)).toFixed(1)} Hz
                      </div>
                      <div>Notes detected: {result.length}</div> */}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Performance Feedback</h4>
                    <div className="space-y-1 text-sm">
                      {/* <div>
                        Accuracy:{" "}
                        {analysis.accuracy >= 85
                          ? "Excellent"
                          : analysis.accuracy >= 70
                            ? "Good"
                            : "Needs Practice"}
                      </div>
                      <div>
                        Stability:{" "}
                        {analysis.stability >= 80
                          ? "Very Stable"
                          : analysis.stability >= 60
                            ? "Stable"
                            : "Work on Consistency"}
                      </div>
                      <div>
                        Clarity:{" "}
                        {analysis.clarityScore >= 80
                          ? "Clear Voice"
                          : analysis.clarityScore >= 60
                            ? "Good Clarity"
                            : "Improve Diction"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p>no pitch and clarities</p>
          )}

          {/* Loading state */}
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">
                    Processing audio analysis...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PitchAnalyzer;
