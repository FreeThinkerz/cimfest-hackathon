import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PitchDetector } from "pitchy";

type MusicStyle = {
  timeSignature: [number, number];
  notes: number[]; // MIDI numbers
};

const MUSIC_STYLES: Record<string, MusicStyle> = {
  makossa: { timeSignature: [4, 4], notes: [64, 66, 68, 69, 68, 66, 64] },
  bikutsi: { timeSignature: [6, 8], notes: [60, 62, 63, 65, 67, 65, 63] },
  njang: { timeSignature: [4, 4], notes: [57, 59, 60, 62, 60, 59, 57] },
  assiko: { timeSignature: [4, 4], notes: [62, 62, 64, 65, 64, 62, 60] },
  mbole: { timeSignature: [4, 4], notes: [59, 59, 59, 62, 64, 62, 59] },
};

function freqToMidi(freq: number) {
  return 69 + 12 * Math.log2(freq / 440);
}

function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function useMelodyTrainer() {
  const [currentGenre, setCurrentGenre] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<any>(null);
  const sampleBuffersRef = useRef<number[][]>([]);
  const stopFlagRef = useRef(false);
  const activeToneRefs = useRef<Tone.Synth[]>([]);

  useEffect(() => {
    return () => {
      stopFlagRef.current = true;
      stopMicrophone();
    };
  }, []);

  async function startMicrophone(bufferSize: number) {
    if (audioStreamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;
    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = bufferSize;
    source.connect(analyser);
    analyserRef.current = analyser;
    detectorRef.current = {
      detector: PitchDetector.forFloat32Array(analyser.fftSize),
      audioCtx,
    };
  }

  async function stopMicrophone() {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    analyserRef.current = null;
    detectorRef.current = null;
  }

  async function playGenre(genreKey: string) {
    const style = MUSIC_STYLES[genreKey];
    if (!style) return;
    setCurrentGenre(genreKey);
    setScore(null);
    stopFlagRef.current = false;

    await Tone.start();
    Tone.Transport.bpm.value = style.timeSignature[0] === 6 ? 140 : 110;

    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
    }).toDestination();
    activeToneRefs.current.push(synth);

    const noteDurationTone = "8n";
    const noteDurationSec = Tone.Time(noteDurationTone).toSeconds();

    const notes = style.notes;
    const seqDuration = notes.length * noteDurationSec;
    const repeats = 5;

    sampleBuffersRef.current = notes.map(() => []);
    await startMicrophone(2048);

    setIsPlaying(true);

    const startTime = Tone.now() + 0.1;

    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < notes.length; i++) {
        const midi = notes[i];
        const time = startTime + r * seqDuration + i * noteDurationSec;
        const freq = midiToFreq(midi);
        synth.triggerAttackRelease(freq, noteDurationTone, time);
      }
    }

    const analyser = analyserRef.current!;
    const { detector, audioCtx } = detectorRef.current!;
    const input = new Float32Array(analyser.fftSize);
    const playbackStartReal = audioCtx.currentTime;

    const detectionLoop = () => {
      if (stopFlagRef.current) return;
      analyser.getFloatTimeDomainData(input);
      const [freq, clarity] = detector.findPitch(input, audioCtx.sampleRate);
      if (clarity > 0.45 && freq > 50) {
        const elapsed =
          audioCtx.currentTime - playbackStartReal + (Tone.now() - startTime);
        const clamped = Math.max(0, elapsed);
        const posInSeq = clamped % seqDuration;
        const noteIndex = Math.floor(posInSeq / noteDurationSec) % notes.length;
        sampleBuffersRef.current[noteIndex].push(freq);
      }
      requestAnimationFrame(detectionLoop);
    };

    requestAnimationFrame(detectionLoop);

    await new Promise((res) =>
      setTimeout(res, Math.ceil((seqDuration * repeats + 0.2) * 1000)),
    );

    stopFlagRef.current = true;
    setIsPlaying(false);

    // Refined score assessment using RMS difference
    const perNoteScores: number[] = [];
    for (let i = 0; i < notes.length; i++) {
      const samples = sampleBuffersRef.current[i];
      if (!samples || samples.length === 0) {
        perNoteScores.push(0);
        continue;
      }
      const midiDetectedSamples = samples.map(freqToMidi);
      const meanDetected =
        midiDetectedSamples.reduce((a, b) => a + b, 0) /
        midiDetectedSamples.length;
      const rmsDiff = Math.sqrt(
        midiDetectedSamples.reduce(
          (acc, val) => acc + Math.pow(val - notes[i], 2),
          0,
        ) / midiDetectedSamples.length,
      );
      const noteScore = Math.max(0, Math.round(100 - rmsDiff * 25)); // sharper scoring with RMS
      perNoteScores.push(noteScore);
    }

    const overall = Math.round(
      perNoteScores.reduce((a, b) => a + b, 0) / perNoteScores.length,
    );
    setScore(overall);
  }

  async function stop() {
    stopFlagRef.current = true;
    setIsPlaying(false);
    // stop any playing synths
    activeToneRefs.current.forEach((synth) => synth.dispose());
    activeToneRefs.current = [];
    // stop Tone Transport
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    // stop microphone
    await stopMicrophone();
  }

  return {
    playGenre,
    stop,
    score,
    isPlaying,
    currentGenre,
    musicStyles: MUSIC_STYLES,
  };
}
