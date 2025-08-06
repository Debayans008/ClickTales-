import React from "react";

const filters = [
  { name: "None", class: "" },
  { name: "Sepia", class: "filter-sepia" },
  { name: "B&W", class: "filter-grayscale" },
  { name: "Saturate", class: "filter-saturate" }
];

const FiltersCarousel = ({ selected, onSelect }) => (
  <div className="flex gap-2 mt-4">
    {filters.map(f => (
      <button
        key={f.name}
        className={`px-3 py-1 rounded ${selected === f.class ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        onClick={() => onSelect(f.class)}
      >
        {f.name}
      </button>
    ))}
  </div>
);

export default FiltersCarousel;