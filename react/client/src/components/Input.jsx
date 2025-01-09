import React from "react";

export default function Input({ placeholder, handleInput, name }) {
  return (
    <div>
      <input
        type="text"
        name={name}
        className="input-field"
        onChange={handleInput}
        placeholder={placeholder}
      />
    </div>
  );
}
