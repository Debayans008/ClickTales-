import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Sun, Moon } from "lucide-react";
import Webcam from "react-webcam";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// --- UI Components ---
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:from-indigo-600 hover:to-purple-600 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`p-6 bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- Countdown ---
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

// --- Hero ---
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

// --- Filters ---
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
    <div className="flex overflow-x-auto gap-4 py-4">
      {filters.map((f) => (
        <Card
          key={f.name}
          className={`cursor-pointer border-2 ${selected === f.class ? "border-indigo-500" : "border-transparent"} flex flex-col items-center`}
          onClick={() => onSelect(f.class)}
        >
          <div className={`w-16 h-16 bg-gray-200 ${f.class}`}></div>
          <p className="text-xs text-center mt-1">{f.name}</p>
        </Card>
      ))}
    </div>
  );
}

// --- Camera Preview ---
function CameraPreview({ onCapture, filter }) {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCaptured(imageSrc);
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    capture();
  };

  return (
    <Card className="flex flex-row items-center w-full max-w-3xl mx-auto gap-4 p-4">
      {/* Preview & controls (left side) */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {!captured && !showCountdown && (
          <div className="mb-4 flex items-center gap-2">
            <span className="font-semibold text-indigo-600">Timer:</span>
            <select
              value={countdownSeconds}
              onChange={e => setCountdownSeconds(Number(e.target.value))}
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
            <div className="flex gap-4 mt-4">
              <Button className="bg-gray-200 text-indigo-700" onClick={() => setCaptured(null)}>
                Retake
              </Button>
              <Button onClick={() => onCapture(captured)}>
                Use Photo
              </Button>
            </div>
          </>
        ) : (
          !showCountdown && (
            <Button className="mt-4" onClick={() => setShowCountdown(true)}>
              Capture
            </Button>
          )
        )}
      </div>
      {/* Camera (right side) */}
      <div className="flex-1 flex justify-center items-center">
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
        {showCountdown && <Countdown seconds={countdownSeconds} onComplete={handleCountdownComplete} />}
      </div>
    </Card>
  );
}

// --- Gallery Slideshow ---
function GallerySlideshow({ images }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  return (
    <Card className="flex flex-col items-center mt-8 w-full max-w-lg mx-auto">
      <div className="relative w-80 h-56 flex items-center justify-center">
        <img
          src={images[index]}
          alt={`Captured ${index}`}
          className="rounded-xl shadow-lg object-cover w-full h-full border-4 border-indigo-200"
        />
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-indigo-100"
          onClick={prev}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-indigo-100"
          onClick={next}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-indigo-500" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </Card>
  );
}

// --- Layout ---
function Layout({ children, dark, setDark }) {
  return (
    <div
      className={`${dark ? "dark bg-gray-900 text-white" : "bg-white text-black"} min-h-screen transition-all`}
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white bg-opacity-90">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          <span className="font-bold text-lg">ClickTales</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <button onClick={() => setDark((d) => !d)}>{dark ? <Moon /> : <Sun />}</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}

// --- HomePage ---
function HomePage() {
  const [started, setStarted] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [filter, setFilter] = useState("");

  // Fetch photos from backend on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/photos")
      .then(res => res.json())
      .then(data => setCapturedImages(data))
      .catch(err => console.error(err));
  }, []);

  // POST new photo to backend
  function handleCapture(img) {
    fetch("http://localhost:4000/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: img, filter }),
    })
      .then(res => res.json())
      .then(newPhoto => setCapturedImages(prev => [newPhoto, ...prev]))
      .catch(err => console.error(err));
  }

  // Example usage in a component
  async function uploadImageToFirebase(imageFile) {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  return (
    <>
      {!started ? (
        <Hero onStart={() => setStarted(true)} />
      ) : (
        <>
          <CameraPreview filter={filter} onCapture={handleCapture} />
          <FiltersCarousel selected={filter} onSelect={setFilter} />
          <GallerySlideshow images={capturedImages} />
        </>
      )}
    </>
  );
}

// --- App ---
function App() {
  const [dark, setDark] = useState(false);
  return (
    <BrowserRouter>
      <Layout dark={dark} setDark={setDark}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;



