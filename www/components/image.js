import React from 'react';

export default function Canvas({ src, username }) {
  const mini = src.replace('_normal', '_mini');

  return (
    <img src={mini} alt={`Profile pic for ${username}`} className="canvas" />
  );
}
