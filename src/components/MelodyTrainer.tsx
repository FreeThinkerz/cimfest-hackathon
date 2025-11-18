import React from "react";
import { useMelodyTrainer } from "@/hooks/useMelodyTrainer";

export default function CameroonMelodyTrainer() {
  const { playGenre, stop, score, isPlaying, musicStyles } = useMelodyTrainer();

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2>Cameroon Melody Trainer 🎙️</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {Object.keys(musicStyles).map((g) => (
          <button
            key={g}
            onClick={() => playGenre(g)}
            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
            disabled={isPlaying}
          >
            Play {g}
          </button>
        ))}
        <button
          type="button"
          onClick={() => stop()}
          style={{ padding: "8px 12px", borderRadius: 8 }}
        >
          Stop / Reset mic
        </button>
      </div>
      <div style={{ marginTop: 20 }}>
        <strong>Score:</strong>{" "}
        {score === null ? "Sing after playback to score" : `${score}%`}
      </div>
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        Tip: Allow microphone access. The system records pitch samples while the
        melody plays 5x, then shows an overall pitch match.
      </div>
    </div>
  );
}
