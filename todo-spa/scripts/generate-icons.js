import { createCanvas } from 'canvas';
//const { createCanvas } = require('canvas');
import fs from 'fs';
//const fs = require('fs');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill with black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/pwa-${size}x${size}.png`, buffer);
}

// Create both sizes
createIcon(192);
createIcon(512); 