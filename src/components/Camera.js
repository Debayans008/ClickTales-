import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Countdown from "./Countdown";
import VoiceController from "./VoiceController";
import Compliment from "./Compliment";

const Camera = ({ onCapture, filter }) => {
  const webcamRef = useRef(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [captured, setCaptured] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCaptured(imageSrc);
    onCapture(imageSrc);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    capture();
  };

  return (
    <div className="flex flex-col items-center">
      <VoiceController onVoiceCapture={() => setShowCountdown(true)} />
      {!captured && !showCountdown && (
        <div className="mb-4 flex items-center gap-2">
          <span className="font-semibold text-indigo-600">Timer:</span>
          <select
            value={countdownSeconds}
            onChange={(e) => setCountdownSeconds(Number(e.target.value))}
            className="ml-2 px-2 py-1 border rounded focus:ring-indigo-400"
          >
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
          </select>
        </div>
      )}
      {captured ? (
        <>
          <img
            src={captured}
            alt="Captured"
            className={`rounded-xl shadow-lg border-4 border-indigo-200 ${filter}`}
            width={480}
            height={360}
            style={{ maxWidth: "100%" }}
          />
          <Compliment />
          <div className="flex gap-4 mt-4">
            <button
              className="bg-gray-200 text-indigo-700 px-4 py-2 rounded"
              onClick={() => setCaptured(null)}
            >
              Retake
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              onClick={() => onCapture(captured)}
            >
              Use Photo
            </button>
          </div>
        </>
      ) : (
        !showCountdown && (
          <button
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => setShowCountdown(true)}
          >
            Capture
          </button>
        )
      )}
      {!captured && (
        <div className={showCountdown ? "invisible h-0" : ""}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className={`rounded-xl shadow-lg border-4 border-indigo-200 ${filter}`}
            width={480}
            height={360}
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {showCountdown && (
        <Countdown
          seconds={countdownSeconds}
          onComplete={handleCountdownComplete}
        />
      )}
    </div>
  );
};

export default Camera;
