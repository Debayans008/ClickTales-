import React, { useEffect } from "react";

const VoiceController = ({ onVoiceCapture }) => {
  useEffect(() => {
    const recognition = window.SpeechRecognition
      ? new window.SpeechRecognition()
      : window.webkitSpeechRecognition
      ? new window.webkitSpeechRecognition()
      : null;
    if (!recognition) return;

    recognition.continuous = true;
    recognition.onresult = event => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript.trim().toLowerCase();
        if (transcript.includes("cheese") || transcript.includes("take photo")) {
          onVoiceCapture();
        }
      }
    };
    recognition.start();
    return () => recognition.stop();
  }, [onVoiceCapture]);

  return (
    <div className="text-xs text-gray-500 mb-2">
      🎤 Say "cheese" or "take photo" to capture!
    </div>
  );
};

export default VoiceController;