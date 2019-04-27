import React, { useEffect, useRef, useState } from 'react';

export default function Canvas({ src, username }) {
  const [hasJs, setJsState] = useState(false);
  const ref = useRef(null);
  const mini = src.replace('_normal', '_mini');

  useEffect(() => {
    var ctx = ref.current.getContext('2d');
    // load image
    var image = new Image();
    image.onload = function() {
      // draw the image into the canvas
      setJsState(true);
      ctx.drawImage(image, 0, 0);
    };
    image.src = mini;
  }, [mini]);

  return (
    <>
      <img
        src={mini}
        alt={`Profile pic for ${username}`}
        style={{
          display: hasJs ? 'none' : 'block',
          visibility: hasJs ? 'hidden' : 'visible'
        }}
      />
      <canvas
        ref={ref}
        className="canvas"
        width="24"
        height="24"
        style={{
          display: hasJs ? 'block' : 'none',
          visibility: hasJs ? 'visible' : 'hidden'
        }}
      />
    </>
  );
}
