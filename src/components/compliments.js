import React from "react";

const compliments = [
  "Your smile is pure sunshine!",
  "You look stunning!",
  "Smile level: 100/10",
  "You light up the room!",
  "Picture perfect!"
];

const Compliment = () => {
  const compliment = compliments[Math.floor(Math.random() * compliments.length)];
  return (
    <div className="mt-4 text-lg font-semibold text-pink-600">
      {compliment}
    </div>
  );
};

export default Compliment;