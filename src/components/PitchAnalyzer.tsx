import React, { useState, useRef } from "react";
import { usePitchAnalysis } from "../hooks/usePitchAnalysis";
import {Button} from "@/components/ui/button"

const PitchAnalyzer = () => {
  const { analyzeAudio, score, analysis, loading } = usePitchAnalysis();
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

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
      const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
      const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });

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
    if (file) analyzeAudio(file);
  };

  return (
    <div className="p-4 border rounded max-w-md w-full">
      <h2 className="text-xl font-bold mb-2">Pitch & Clarity Analyzer</h2>

      {/* Upload Section */}
      <input
        type="file"
        accept="audio/*"
        className="mt-2"
        onChange={(e) => {
          setAudioURL(null);
          setFile(e.target.files?.[0] || null);
        }}
      />

      {/* Recording Section */}
      <div className="mt-4">
        {!isRecording ? (
          <>
            <Button
              onClick={handleRecord}
              className="p-2 bg-green-600 text-white rounded"
            >
              🎙 Start Recording
            </Button>
          </>
        ) : (
          <Button
            onClick={handleStop}
            className="p-2 bg-red-600 text-white rounded"
          >
            🛑 Stop Recording
          </Button>
        )}
      </div>

      {/* Playback Section */}
      {audioURL && (
        <div className="mt-3">
          <p className="font-medium">Recorded Audio:</p>
          <audio controls src={audioURL} className="w-full mt-2" />
        </div>
      )}

      {/* Analyze Button */}
      <Button
        onClick={handleAnalyzeButton}
        disabled={!file}
        className="mt-3 p-2 bg-blue-500 disabled:bg-gray-400 text-white rounded"
      >
        Analyze Audio
      </Button>

      {/* Results */}
      {loading && <p className="mt-3">Processing audio...</p>}

      {score !== null && (
        <div className="mt-4 border p-3 rounded bg-gray-100">
          <p><strong>Final Score:</strong> {score.toFixed(1)} / 100</p>
          <p>Pitch Accuracy: {analysis.accuracy.toFixed(1)}</p>
          <p>Pitch Stability: {analysis.stability.toFixed(1)}</p>
          <p>Clarity: {analysis.clarityScore.toFixed(1)}</p>
        </div>
      )}
    </div>
  );
};

export default PitchAnalyzer;

