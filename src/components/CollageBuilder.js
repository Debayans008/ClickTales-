import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const CollageBuilder = ({ images, onClose }) => {
  const collageRef = useRef();

  const downloadCollage = () => {
    html2canvas(collageRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'clicktales_collage.jpg';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      overflow: 'auto', // 💡 Add scrolling to the whole modal if needed
    }}>
      <div style={{
        background: '#1e1e1e',
        padding: '30px 20px',
        borderRadius: '16px',
        textAlign: 'center',
        maxWidth: '360px',
        width: '90%',
        maxHeight: '90vh', // 💡 Set a maximum height
        overflowY: 'auto',  // 💡 Make content scrollable if taller than screen
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}>
        <h3 style={{ color: '#fff', marginBottom: '20px' }}>🎞️ Your Filmstrip Collage</h3>

        {/* Film Strip Style */}
        <div
          ref={collageRef}
          style={{
            backgroundColor: '#000',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            border: '10px solid #333',
            boxShadow: 'inset 0 0 10px #111',
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#222',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <img
                src={img}
                alt={`collage-${i}`}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={downloadCollage} style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            marginRight: '12px',
            cursor: 'pointer',
          }}>
            📥 Download Collage
          </button>

          <button onClick={onClose} style={{
            backgroundColor: '#888',
            color: 'white',
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}>
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollageBuilder;
