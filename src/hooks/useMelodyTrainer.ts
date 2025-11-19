import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { PitchDetector } from "pitchy";

type MusicStyle = {
  timeSignature: [number, number];
  notes: number[]; // MIDI numbers
};

const MUSIC_STYLES: Record<string, MusicStyle> = {
  // Makossa: Urban dance music from Douala with syncopated bass-driven grooves
  makossa: { timeSignature: [4, 4], notes: [64, 66, 68, 69, 68, 66, 64] }, // E4-F#4-G#4-A4 pentatonic feel

  // Bikutsi: Fast-paced Beti rhythm with interlocking patterns
  bikutsi: { timeSignature: [6, 8], notes: [60, 62, 63, 65, 67, 65, 63] }, // C4-D4-Eb4-F4-G4 African scale

  // Njang: Traditional ceremonial music
  njang: { timeSignature: [4, 4], notes: [57, 59, 60, 62, 60, 59, 57] }, // A3-B3-C4-D4 modal pattern

  // Assiko: Bassa healing rhythm played on bottles and drums
  assiko: { timeSignature: [4, 4], notes: [62, 62, 64, 65, 64, 62, 60] }, // D4 repetition characteristic

  // Mbolé: Traditional style with local roots
  mbole: { timeSignature: [4, 4], notes: [59, 59, 59, 62, 64, 62, 59] }, // B3 drone-like pattern
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
    // Makossa: 130-170 BPM (research-based), Bikutsi: faster tempo for 6/8 time
    const bpm = style.timeSignature[0] === 6 ? 140 : genreKey === "makossa" ? 150 : 110;
    Tone.Transport.bpm.value = bpm;

    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,    // Quick attack for percussive feel
        decay: 0.1,      // Short decay
        sustain: 0.4,    // Medium sustain
        release: 0.3,    // Smooth release
      },
    }).toDestination();
    activeToneRefs.current.push(synth);

    const noteDurationTone = "8n";
    const noteDurationSec = Tone.Time(noteDurationTone).toSeconds();
    const pauseDurationSec = Tone.Time("6n").toSeconds(); // Rest between repeats

    const notes = style.notes;
    const seqDuration = notes.length * noteDurationSec;
    const seqWithPause = seqDuration + pauseDurationSec; // Include pause in timing
    const repeats = 5;

    sampleBuffersRef.current = notes.map(() => []);
    await startMicrophone(2048);

    setIsPlaying(true);

    const startTime = Tone.now() + 0.1;

    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < notes.length; i++) {
        const midi = notes[i];
        // Use seqWithPause for proper spacing between repetitions
        const time = startTime + r * seqWithPause + i * noteDurationSec;
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
        const posInSeq = clamped % seqWithPause; // Use seqWithPause to account for rests
        // Only capture during active note playing (not during pause)
        if (posInSeq < seqDuration) {
          const noteIndex = Math.floor(posInSeq / noteDurationSec) % notes.length;
          sampleBuffersRef.current[noteIndex].push(freq);
        }
      }
      requestAnimationFrame(detectionLoop);
    };

    requestAnimationFrame(detectionLoop);

    await new Promise((res) =>
      setTimeout(res, Math.ceil((seqWithPause * repeats + 0.2) * 1000))
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
      const rmsDiff = Math.sqrt(
        midiDetectedSamples.reduce(
          (acc, val) => acc + Math.pow(val - notes[i], 2),
          0
        ) / midiDetectedSamples.length
      );
      const noteScore = Math.max(0, Math.round(100 - rmsDiff * 25)); // sharper scoring with RMS
      perNoteScores.push(noteScore);
    }

    const overall = Math.round(
      perNoteScores.reduce((a, b) => a + b, 0) / perNoteScores.length
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
