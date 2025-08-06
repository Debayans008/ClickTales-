import React, { useState } from "react";
// import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
// import { initializeApp } from "firebase/app";
// TODO: Add your Firebase config and logic here

const FirebaseUploader = ({ image, onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const uploadPhoto = async () => {
    setLoading(true);
    // TODO: Upload image to Firebase Storage
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onUpload && onUpload();
    }, 2000);
  };

  return (
    <div className="mt-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={uploadPhoto}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload to Cloud"}
      </button>
      {success && <span className="ml-2 text-green-600">Uploaded!</span>}
    </div>
  );
};

export default FirebaseUploader;