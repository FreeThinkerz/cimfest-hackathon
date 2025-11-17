import { useState } from "react";
import { PitchDetector } from "pitchy";

export function usePitchAnalysis() {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeAudio = async (file: File, targetMidi?: number[]) => {
    setLoading(true);
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

      if (clarity >= 0.6 && pitch > 50 && pitch < 2000) {
        pitches.push(pitch);
        clarities.push(clarity);
      }
    }

    const midiNotes = pitches.map(f => 69 + 12 * Math.log2(f / 440));

    const accuracy = targetMidi ? computeAccuracy(midiNotes, targetMidi) : 100;
    const stability = computeStability(midiNotes);
    const clarityScore = computeClarity(clarities);

    const finalScore = (accuracy * 0.5) + (stability * 0.2) + (clarityScore * 0.3);

    setAnalysis({ pitches, clarities, accuracy, stability, clarityScore });
    setScore(finalScore);
    setLoading(false);
  };

  return { analyzeAudio, score, analysis, loading };
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
  const variance = midiNotes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / midiNotes.length;
  const stdDev = Math.sqrt(variance);
  return Math.max(0, 100 - stdDev * 25);
};

const computeClarity = (clarityValues: number[]) => {
  const avg = clarityValues.reduce((a, b) => a + b) / clarityValues.length;
  return avg * 100;
};

