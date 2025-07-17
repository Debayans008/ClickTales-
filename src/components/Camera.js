import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Compliment from './compliments';
import CollageBuilder from './CollageBuilder.js'; // 🧩 Add this

const Camera = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [timer, setTimer] = useState(3);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showCollage, setShowCollage] = useState(false);

  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('clicktales-gallery');
    return saved ? JSON.parse(saved).slice(0, 4) : [];
  });

  const capture = () => {
    setCountdown(timer);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          const screenshot = webcamRef.current.getScreenshot();
          if (screenshot) {
            setImage(screenshot);
            const updatedGallery = [screenshot, ...gallery].slice(0, 4);
            setGallery(updatedGallery);
            localStorage.setItem('clicktales-gallery', JSON.stringify(updatedGallery));
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const retake = () => setImage(null);

  const toggleSelect = (img) => {
    if (selectedImages.includes(img)) {
      setSelectedImages(selectedImages.filter(i => i !== img));
    } else {
      if (selectedImages.length < 4) {
        setSelectedImages([...selectedImages, img]);
      } else {
        alert("You can only select up to 4 images for collage.");
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>ClickTales Camera</h2>

      {!image ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={{ facingMode: 'user' }}
            style={{
              borderRadius: '12px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          />

          {countdown && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
              }}
            >
              {countdown}
            </div>
          )}

          <button
            onClick={capture}
            disabled={countdown !== null}
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '64px',
              height: '64px',
              backgroundColor: 'transparent',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: countdown ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              opacity: countdown ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: '24px', color: 'white' }}>📷</span>
          </button>

          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              gap: '6px',
            }}
          >
            {[2, 3, 5, 10].map((val) => (
              <button
                key={val}
                onClick={() => setTimer(val)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  backgroundColor: timer === val ? '#e9b0a4ff' : '#ffffff99',
                  border: 'none',
                  color: '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {val}s
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <img src={image} alt="Captured" width={400} style={{ borderRadius: '12px' }} />
          <Compliment />
          <br />
          <button onClick={retake}>🔁 Retake</button>
        </>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Latest 4 Photos</h3>
          <p style={{ fontSize: '14px', color: '#777' }}>Tap to select photos for collage</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {gallery.map((img, index) => (
              <div
                key={index}
                onClick={() => toggleSelect(img)}
                style={{
                  border: selectedImages.includes(img) ? '4px solid #ff7f50' : '2px solid transparent',
                  borderRadius: '12px',
                  padding: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={img}
                  alt={`snap-${index}`}
                  width={200}
                  height="auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            ))}
          </div>

          {selectedImages.length >= 2 && (
            <button
              onClick={() => setShowCollage(true)}
              style={{
                marginTop: '20px',
                backgroundColor: '#ff7f50',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              🧩 Create Collage ({selectedImages.length})
            </button>
          )}
        </div>
      )}

      {/* Collage Modal */}
      {showCollage && (
        <CollageBuilder
          images={selectedImages}
          onClose={() => {
            setShowCollage(false);
            setSelectedImages([]);
          }}
        />
      )}
    </div>
  );
};

export default Camera;
