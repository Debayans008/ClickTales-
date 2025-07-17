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
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h3>Your Collage</h3>
        <div
          ref={collageRef}
          style={{
            display: 'grid',
            gridTemplateColumns: images.length === 2 ? '1fr 1fr' : '1fr 1fr',
            gridTemplateRows: images.length > 2 ? '1fr 1fr' : '1fr',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`collage-${i}`}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          ))}
        </div>

        <button onClick={downloadCollage} style={{
          backgroundColor: '#4caf50',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          marginRight: '10px'
        }}>
          📥 Download Collage
        </button>

        <button onClick={onClose} style={{
          backgroundColor: '#aaa',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px'
        }}>
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default CollageBuilder;
