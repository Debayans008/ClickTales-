// File: src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Instagram, X, HelpCircle, Sun, Moon } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react";
import Webcam from "react-webcam";

// Dummy UI components (replace with ShadCN UI or your versions)
const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 rounded bg-indigo-600 text-white" {...props}>{children}</button>
);
const Card = ({ children, ...props }) => (
  <div className="p-4 bg-white rounded shadow" {...props}>{children}</div>
);
const Carousel = ({ children, ...props }) => (
  <div className="flex overflow-x-auto gap-4" {...props}>{children}</div>
);

function Hero({ onStart }) {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-300 rounded-3xl shadow-xl mb-8">
      <div className="flex-1">
        <h1 className="text-5xl font-extrabold text-white mb-4">Snap. Smile. Share.</h1>
        <p className="text-lg text-white/80 mb-6">
          The fun, fast, and friendly way to capture and share your best moments.
        </p>
        <Button onClick={onStart}>Start Photobooth</Button>
      </div>
      <motion.div className="flex-1 flex justify-center">
        <Camera className="w-32 h-32 text-white" />
      </motion.div>
    </section>
  );
}

function Countdown({ seconds = 3, onComplete }) {
  const [count, setCount] = useState(seconds);
  React.useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 700);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);
  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <motion.span className="text-8xl text-white font-bold">{count > 0 ? count : null}</motion.span>
    </motion.div>
  );
}

function CameraPreview({ onCapture, filter }) {
  const webcamRef = React.useRef(null);
  const [captured, setCaptured] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCaptured(imageSrc);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    capture();
  };

  return (
    <Card className="flex flex-col items-center">
      {!captured && !showCountdown && (
        <div className="mb-4">
          Timer:
          <select
            value={countdownSeconds}
            onChange={e => setCountdownSeconds(Number(e.target.value))}
            className="ml-2 px-2 py-1 border rounded"
          >
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
          </select>
        </div>
      )}
      {showCountdown && <Countdown seconds={countdownSeconds} onComplete={handleCountdownComplete} />}
      {!captured && !showCountdown ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className={`rounded-xl ${filter}`}
            width={320}
            height={240}
          />
          <Button className="mt-4" onClick={() => setShowCountdown(true)}>Capture</Button>
        </>
      ) : captured ? (
        <>
          <img src={captured} alt="Captured" className={`rounded-xl ${filter}`} width={320} height={240} />
          <div className="flex gap-4 mt-4">
            <Button onClick={() => setCaptured(null)}>Retake</Button>
            <Button onClick={() => onCapture(captured)}>Use Photo</Button>
          </div>
        </>
      ) : null}
    </Card>
  );
}

function FiltersCarousel({ selected, onSelect }) {
  const filters = [
    { name: "None", class: "" },
    { name: "Sepia", class: "filter sepia" },
    { name: "B&W", class: "filter grayscale" },
    { name: "Vibrant", class: "filter saturate-200" },
    { name: "Birthday", class: "border-4 border-pink-400" },
    { name: "Travel", class: "border-4 border-blue-400" },
  ];
  return (
    <Carousel>
      {filters.map((f) => (
        <Card
          key={f.name}
          className={`cursor-pointer border-2 ${selected === f.class ? "border-indigo-500" : "border-transparent"}`}
          onClick={() => onSelect(f.class)}
        >
          <div className={`w-16 h-16 bg-gray-200 ${f.class}`}></div>
          <p className="text-xs text-center mt-1">{f.name}</p>
        </Card>
      ))}
    </Carousel>
  );
}

function Layout({ children, dark, setDark }) {
  return (
    <div className={`${dark ? "dark bg-gray-900 text-white" : "bg-white text-black"} min-h-screen transition-all`}>
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          <span className="font-bold text-lg">ClickTales</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <button onClick={() => setDark(!dark)}>{dark ? <Moon /> : <Sun />}</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}

function GalleryPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Gallery</h2>
      <p>Gallery content goes here.</p>
    </div>
  );
}

function HomePage() {
  const [started, setStarted] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [filter, setFilter] = useState("");
  return (
    <>
      {!started ? (
        <Hero onStart={() => setStarted(true)} />
      ) : (
        <>
          <CameraPreview
            filter={filter}
            onCapture={(img) => setCapturedImages([...capturedImages, img])}
          />
          <FiltersCarousel selected={filter} onSelect={setFilter} />
        </>
      )}
    </>
  );
}

function App() {
  const [dark, setDark] = useState(false);
  return (
    <Router>
      <Layout dark={dark} setDark={setDark}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
