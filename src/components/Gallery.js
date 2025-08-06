import React, { useState, useEffect } from "react";

const PHOTO_LIMIT = 15;

const Gallery = ({ images }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("clicktales_photos") || "[]");
    setPhotos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("clicktales_photos", JSON.stringify(images));
    setPhotos(images);
  }, [images]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {photos.slice(0, PHOTO_LIMIT).map((img, i) => (
        <img key={i} src={img} alt={`gallery-${i}`} className="rounded shadow" />
      ))}
    </div>
  );
};

export default Gallery;