import React, { useEffect, useState } from "react";

const Countdown = ({ seconds, onComplete }) => {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="text-6xl font-bold text-indigo-600">{count}</div>
  );
};

export default Countdown;