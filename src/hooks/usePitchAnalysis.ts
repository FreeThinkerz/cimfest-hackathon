import { useState, useRef, useCallback } from "react";
import { PitchDetector } from "pitchy";

export interface PitchAnalysisResult {
  pitches: number[];
  clarities: number[];
  accuracy: number;
  stability: number;
  clarityScore: number;
  midiNotes: number[];
  averagePitch: number;
  pitchRange: { min: number; max: number };
}

export interface RealtimeAnalysisData {
  currentPitch: number;
  currentClarity: number;
  currentMidi: number;
  targetPitch?: number;
  pitchDifference?: number;
  isOnPitch: boolean;
}

export function usePitchAnalysis() {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<PitchAnalysisResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [realtimeData, setRealtimeData] = useState<RealtimeAnalysisData | null>(
    null
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  const analyzeAudio = async (file: File, targetMidi?: number[]) => {
    setLoading(true);
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const detector = PitchDetector.forFloat32Array(2048);
      const pitches: number[] = [];
      const clarities: number[] = [];

      for (let i = 0; i < channelData.length - 2048; i += 2048) {
        const frame = channelData.slice(i, i + 2048);
        const [pitch, clarity] = detector.findPitch(frame, sampleRate);

        if (clarity >= 0.5 && pitch > 50 && pitch < 2000) {
          pitches.push(pitch);
          clarities.push(clarity);
        }
      }

      const midiNotes = pitches.map((f) => 69 + 12 * Math.log2(f / 440));
      const averagePitch = pitches.reduce((a, b) => a + b, 0) / pitches.length;
      const pitchRange = {
        min: Math.min(...pitches),
        max: Math.max(...pitches),
      };

      const accuracy = targetMidi
        ? computeAccuracy(midiNotes, targetMidi)
        : computeGeneralAccuracy(midiNotes);
      const stability = computeStability(midiNotes);
      const clarityScore = computeClarity(clarities);

      const finalScore = accuracy * 0.4 + stability * 0.3 + clarityScore * 0.3;

      const analysisResult: PitchAnalysisResult = {
        pitches,
        clarities,
        accuracy,
        stability,
        clarityScore,
        midiNotes,
        averagePitch,
        pitchRange,
      };

      // send the pitches and analysis results to the backend

      const response = await fetch("http://192.168.1.154:8000/api/pitch", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ data: JSON.stringify(analysisResult) }),
      });
      console.log("response from the fetch", response);
      if (response.ok) {
        console.log("data was sent to the backend directly");
      }

      setAnalysis(analysisResult);
      setScore(finalScore);

      await audioContext.close();
    } catch (error) {
      console.error("Error analyzing audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRealtimeAnalysis = useCallback(async (targetPitch?: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false },
      });

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();

      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      detectorRef.current = PitchDetector.forFloat32Array(
        analyserRef.current.fftSize
      );

      setIsListening(true);

      const analyzeFrame = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        const bufferLength = analyserRef.current.fftSize;
        const buffer = new Float32Array(bufferLength);
        analyserRef.current.getFloatTimeDomainData(buffer);

        const [pitch, clarity] = detectorRef.current.findPitch(
          buffer,
          audioContextRef.current.sampleRate
        );

        if (clarity >= 0.3 && pitch > 50 && pitch < 2000) {
          const midiNote = 69 + 12 * Math.log2(pitch / 440);
          const pitchDifference = targetPitch
            ? Math.abs(pitch - targetPitch)
            : 0;
          const isOnPitch = targetPitch ? pitchDifference < 20 : true;

          setRealtimeData({
            currentPitch: pitch,
            currentClarity: clarity,
            currentMidi: midiNote,
            targetPitch,
            pitchDifference,
            isOnPitch,
          });
        }

        animationIdRef.current = requestAnimationFrame(analyzeFrame);
      };

      analyzeFrame();
    } catch (error) {
      console.error("Error starting realtime analysis:", error);
    }
  }, []);

  const stopRealtimeAnalysis = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setRealtimeData(null);
  }, []);

  return {
    analyzeAudio,
    score,
    analysis,
    loading,
    startRealtimeAnalysis,
    stopRealtimeAnalysis,
    isListening,
    realtimeData,
  };
}

// 📌 Helpers
const computeAccuracy = (detected: number[], target: number[]) => {
  let total = 0;
  let count = Math.min(detected.length, target.length);

  for (let i = 0; i < count; i++) {
    const diff = Math.abs(detected[i] - target[i]);
    total += Math.max(0, 100 - diff * 20);
  }
  return total / count;
};

const computeStability = (midiNotes: number[]) => {
  if (midiNotes.length < 2) return 100;
  const mean = midiNotes.reduce((a, b) => a + b) / midiNotes.length;
  const variance =
    midiNotes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / midiNotes.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, 100 - stdDev * 25);
};

const computeClarity = (clarityValues: number[]) => {
  const avg = clarityValues.reduce((a, b) => a + b) / clarityValues.length;
  return avg * 100;
};

const computeGeneralAccuracy = (midiNotes: number[]) => {
  if (midiNotes.length === 0) return 0;

  // For general accuracy, we evaluate consistency and reasonable pitch range
  const mean = midiNotes.reduce((a, b) => a + b) / midiNotes.length;
  const isInVocalRange = mean >= 35 && mean <= 85; // Typical vocal range in MIDI

  // Score based on staying in vocal range and having reasonable note detection
  const rangeScore = isInVocalRange ? 80 : 50;
  const consistencyScore = computeStability(midiNotes) * 0.2;

  return Math.min(100, rangeScore + consistencyScore);
};
