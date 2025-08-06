import React, { useState } from "react";
// import { addDoc, collection } from "firebase/firestore";
// import emailjs from "emailjs-com";
// TODO: Add your Firebase and EmailJS logic here

const TimeCapsule = ({ image }) => {
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState(false);

  const saveCapsule = async () => {
    // TODO: Save to Firestore and schedule email
    setSuccess(true);
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <h4 className="font-bold mb-2">Memory Time Capsule</h4>
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Write your message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <input
        type="date"
        className="w-full p-2 border rounded mb-2"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={saveCapsule}
      >
        Save Capsule
      </button>
      {success && <span className="ml-2 text-green-600">Saved!</span>}
    </div>
  );
};

export default TimeCapsule;