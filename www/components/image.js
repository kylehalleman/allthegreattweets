import React, { useEffect, useRef } from 'react';

export default function Canvas({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    var ctx = ref.current.getContext('2d');
    // load image
    var image = new Image();
    image.onload = function() {
      // draw the image into the canvas
      ctx.drawImage(image, 0, 0);
    };
    image.src = src.replace('_normal', '_mini');
  }, [src]);
  return <canvas ref={ref} className="canvas" width="24" height="24" />;
}
