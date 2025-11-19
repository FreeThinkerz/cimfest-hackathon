import { useState, useRef, useCallback, useMemo } from "react";
import { PitchDetector } from "pitchy";

interface PitchData {
  pitch: number;
  clarity: number;
  timestamp: number;
  amplitude: number;
}

export const usePitchy = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<PitchData>>([]);
  const [error, setError] = useState<string | null>(null);

  const pitches = useMemo(() => data.map((d) => d.pitch), [data]);
  const clarities = useMemo(() => data.map((d) => d.clarity), [data]);
  const average_pitch = useMemo(
    () => pitches.reduce((acc, p) => acc + p, 0) / pitches.length,
    [pitches]
  );

  // Calculate standard deviation (this is the stability measure)
  const variance = useMemo(
    () => pitches.reduce((sum, p) => sum + Math.pow(p - average_pitch, 2), 0),
    [data]
  );
  const standardDeviation = Math.sqrt(variance);

  // Calculate coefficient of variation (normalized stability)
  const coefficientOfVariation = (standardDeviation / average_pitch) * 100;

  const analyzeMedia = async (file: File) => {
    setLoading(true);
    setError(null);
    setData([]);

    try {
      // Convert file -> ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Decode audio
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const sampleRate = audioBuffer.sampleRate;
      const channelData = audioBuffer.getChannelData(0); // use first channel

      // Pitchy setup
      const frameSize = 2048;
      const detector = PitchDetector.forFloat32Array(frameSize);

      const results = [];
      const buffer = new Float32Array(frameSize);

      // Slide through the audio
      for (let i = 0; i < channelData.length - frameSize; i += frameSize) {
        // Copy frame
        buffer.set(channelData.slice(i, i + frameSize));

        // Pitchy detection
        const [pitch, clarity] = detector.findPitch(buffer, sampleRate);

        if (pitch > 0 && clarity > 0.2) {
          // Timestamp (seconds)
          const timestamp = i / sampleRate;

          // Amplitude estimate
          const amplitude = Math.max(...buffer.map((v) => Math.abs(v)));

          results.push({ pitch, clarity: clarity * 100, timestamp, amplitude });
        }
      }

      setData(results);
    } catch (err) {
      console.error(err);
      setError("Failed to process audio file.");
    }

    setLoading(false);
  };

  // Compute average
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const computeClarity = (clarities: Array<number>) => {
    return clarities.reduce((acc, c) => acc + c, 0) / clarities.length;
  };

  // Pitch accuracy = how close values are to the average pitch (in %)
  function computePitchAccuracy(pitches: number[]) {
    if (pitches.length < 2) return 0;

    const avg = mean(pitches);

    // smaller difference = higher accuracy
    const diffs = pitches.map((p) => Math.abs(p - avg));
    const avgDiff = mean(diffs);

    // normalize: 0 difference → 100%
    const accuracy = Math.max(0, 100 - avgDiff);

    return accuracy;
  }

  /**
   * Calculate weighted stability considering clarity scores
   * Higher clarity readings have more weight
   */
  function calculateWeightedStability() {
    const pitches = data.map((d) => d.pitch);
    const clarities = data.map((d) => d.clarity);

    // Calculate weighted average
    const totalWeight = clarities.reduce((sum, c) => sum + c, 0);
    const weightedAvg =
      pitches.reduce((sum, p, i) => sum + p * clarities[i], 0) / totalWeight;

    // Calculate weighted variance
    const weightedVariance =
      pitches.reduce(
        (sum, p, i) => sum + clarities[i] * Math.pow(p - weightedAvg, 2),
        0
      ) / totalWeight;

    return Math.sqrt(weightedVariance);
  }

  /**
   * Get stability rating based on standard deviation
   */
  function getStabilityRating(SD: number, coefficientOfVariation: number) {
    if (SD < 5) {
      return "Excellent";
    } else if (SD < 15) {
      return "Very Good";
    } else if (SD < 30) {
      return "Good";
    } else if (SD < 50) {
      return "Fair";
    } else if (SD < 75) {
      return "Moderate";
    } else {
      return "Needs Improvement";
    }
  }

  /**
   * Calculate pitch stability from an array of pitch data
   * @param {Array} pitches - Array of objects with { pitch, clarity } or { frequency, clarity }
   * @returns {Object} Stability metrics
   */
  function computePitchStability() {
    if (data.length === 0) {
      return {
        stability: null,
        averagePitch: null,
        standardDeviation: null,
        coefficientOfVariation: null,
        pitchRange: null,
        message: "No valid pitch data found",
      };
    }

    // Extract pitch values
    const pitches = data.map((d) => d.pitch);

    // Calculate pitch range
    const minPitch = Math.min(...pitches);
    const maxPitch = Math.max(...pitches);
    const pitchRange = maxPitch - minPitch;

    // Calculate weighted stability (considering clarity)
    const weightedStability = calculateWeightedStability();

    return {
      stability: standardDeviation,
      standardDeviation: standardDeviation,
      coefficientOfVariation: coefficientOfVariation,
      weightedStability: weightedStability,
      pitchRange: pitchRange,
      minPitch: minPitch,
      maxPitch: maxPitch,
      sampleCount: data.length,
      message: `Pitch stability: ${standardDeviation.toFixed(
        2
      )} Hz (${rating})`,
    };
  }

  // Determine stability rating
  const rating = getStabilityRating(standardDeviation, coefficientOfVariation);

  return {
    analyzeMedia,
    data,
    pitches,
    clarities,
    computeClarity,
    computePitchStability,
    computePitchAccuracy,
    rating,
    loading,
    error,
  };
};

export interface PitchAnalysisResult {
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
  const [isListening, setIsListening] = useState(false);
  const [realtimeData, setRealtimeData] = useState<RealtimeAnalysisData | null>(
    null
  );
  const [result, setResult] = useState<
    Array<{ pitch: number; clarity: number; note: number }>
  >([]);
  const [average, setAverage] = useState<{ pitch: number; clarity: number }>({
    pitch: 0,
    clarity: 0,
  });
  const [score, setScore] = useState<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  console.log("audio context", audioContextRef.current);
  const analyzeAudio = async (file: File, targetMidi?: number[]) => {
    console.log("file that we want to analyse", file);
    setLoading(true);
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const detector = PitchDetector.forFloat32Array(2048);

      for (let i = 0; i < channelData.length - 2048; i += 2048) {
        const frame = channelData.slice(i, i + 2048);
        const [pitch, clarity] = detector.findPitch(frame, sampleRate);
        if (clarity >= 0.5 && pitch > 50 && pitch < 2000) {
          setResult((value) => [
            ...value,
            {
              pitch,
              clarity,
              note: 69 + 12 * Math.log2(pitch / 440),
            },
          ]);
        }
      }

      setAverage(
        result.reduce(
          (accumulator, current, index, array) => {
            const divident = index === array.length - 1 ? array.length : 1;

            return {
              pitch: (accumulator.pitch + current.pitch) / divident,
              clarity:
                ((accumulator.clarity + current.clarity) / divident) *
                (divident !== 1 ? 100 : divident),
            };
          },
          { pitch: 0, clarity: 0 }
        )
      );
      // const midiNotes = result.map((d) => d.note);
      // const accuracy = targetMidi?.length
      //   ? computeAccuracy(midiNotes, targetMidi)
      //   : computeGeneralAccuracy(midiNotes);
      // setScore(
      //   accuracy * 0.4 + computeStability(midiNotes) + computeClarity(midiNotes)
      // );

      // send the pitches and analysis results to the backend
      const data = new FormData();
      data.append("file", file);
      data.append("data", JSON.stringify(result));
      data.append("average_pitch", String(average.pitch));
      data.append("average_clarity", String(average.clarity));

      const response = await fetch("http://192.168.1.154:8000/api/pitch", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: data,
      });
      console.log("response from the fetch", response);
      if (response.ok) {
        console.log("data was sent to the backend directly");
      }

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
    result,
    score,
    average,
    analyzeAudio,
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

const computeClarity = (clarityValues: number[] = []) => {
  console.log("clarity values", clarityValues);
  const avg =
    clarityValues.length > 0
      ? clarityValues?.reduce((a, b) => a + b) / clarityValues.length
      : 0;
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
