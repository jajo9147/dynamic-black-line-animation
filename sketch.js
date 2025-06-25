// P5.JS Designer: Cool Flow with Final Overlapping Logo
// This version uses overlapping parallelograms and a black line.
// The wave's frequency and amplitude are modulated by its horizontal position.

// --- Animation & GIF Settings ---
const SKETCH_FPS = 60; // Desired frame rate for the animation
const VISUAL_LOOP_DURATION_SECONDS = 8; // How long one full cycle of the animation is
const TOTAL_LOOP_FRAMES = SKETCH_FPS * VISUAL_LOOP_DURATION_SECONDS;

// --- Color Palette ---
const BLACK = '#000000';           // For the main line
const CUSTOM_BEIGE = '#F6F0E2';    // For the background
const VERIZON_RED = '#EE001E';     // For the logo and the markers

// Gradient colors for the logo's glow
const GLOW_YELLOW = '#FCE57E';
const GLOW_ORANGE = '#FF9A3D';

// An array to hold our marker objects
let markers = [];
const NUM_MARKERS = 6;

/**
 * Calculates the y-position of the wave at a given x-coordinate and time.
 * @param {number} x The horizontal position to calculate the y-value for.
 * @param {number} timeOffset A value (like loop progress) to drive the animation.
 * @returns {number} The calculated y-coordinate.
 */
function getWaveY(x, timeOffset) {
  let amplitude = map(x, 0, width, height * 0.3, 20);
  let freqMod = map(pow(x / width, 0.5), 0, 1, 25, 1);
  let y = sin((x * 0.01 * freqMod) + (timeOffset * TWO_PI)) * amplitude;
  return y;
}

/**
 * Draws the logo with overlapping legs for a unified base.
 * @param {number} progress The current progress of the main animation loop (0.0 to 1.0).
 */
function drawLogo(progress) {
  // --- Logo Properties ---
  const legWidth = 20;
  const legHeight = 65;
  const tiltShift = 25; // The horizontal distance the top of the leg is shifted

  // --- Animation ---
  let pulse = sin(progress * TWO_PI * 2);
  let scaleFactor = map(pulse, -1, 1, 1, 1.15);

  push(); // Isolate all transformations and styles for the logo

  // --- Positioning ---
  translate(width - 80, 85);
  scale(scaleFactor);
  noStroke();

  // --- Left Leg (with gradient) ---
  const ctx = drawingContext;
  const gradient = ctx.createLinearGradient(0, -legHeight, 0, 0);
  gradient.addColorStop(0, VERIZON_RED);
  gradient.addColorStop(0.5, GLOW_ORANGE);
  gradient.addColorStop(1, GLOW_YELLOW);
  ctx.fillStyle = gradient;

  // Draw the left leg. Its bottom edge goes from x=-20 to x=0.
  beginShape();
  vertex(0, 0);                             // Bottom-right
  vertex(-legWidth, 0);                     // Bottom-left
  vertex(-legWidth - tiltShift, -legHeight); // Top-left
  vertex(-tiltShift, -legHeight);            // Top-right
  endShape(CLOSE);

  // --- Right Leg (solid red, OVERLAPPING) ---
  fill(VERIZON_RED);

  // This leg is shifted to the left so it physically overlaps the left leg.
  // Its bottom edge now goes from x=-10 to x=10, covering the central seam.
  const overlap = legWidth / 2;
  beginShape();
  vertex(0 - overlap, 0);                           // Bottom-left (shifted left)
  vertex(legWidth - overlap, 0);                      // Bottom-right (shifted left)
  vertex(legWidth + tiltShift - overlap, -legHeight); // Top-right (shifted left)
  vertex(tiltShift - overlap, -legHeight);            // Top-left (shifted left)
  endShape(CLOSE);

  pop(); // Restore original drawing state
}


function setup() {
  createCanvas(windowWidth, 800);
  frameRate(SKETCH_FPS);

  for (let i = 0; i < NUM_MARKERS; i++) {
    markers.push({
      progress: i / NUM_MARKERS,
      speed: random(0.0005, 0.0015)
    });
  }

  console.log("Press 'S' to save a high-quality GIF of one full animation loop.");
}

function draw() {
  background(CUSTOM_BEIGE);

  // --- Animation Loop Timing ---
  const currentFrameInLoop = frameCount % TOTAL_LOOP_FRAMES;
  const loopProgress = currentFrameInLoop / TOTAL_LOOP_FRAMES;

  // --- 1. Draw the Wave and Markers ---
  push();
  translate(0, height / 2);

  // Draw the line
  noFill();
  // CHANGED: The line color is now set to BLACK.
  stroke(BLACK);
  strokeWeight(3);
  beginShape();
  for (let x = 0; x <= width; x += 2) {
    let y = getWaveY(x, loopProgress);
    vertex(x, y);
  }
  endShape();

  // Draw the markers with the red color
  noStroke();
  fill(VERIZON_RED);
  for (const marker of markers) {
    marker.progress += marker.speed;
    if (marker.progress > 1) {
      marker.progress -= 1;
    }
    let markerX = marker.progress * width;
    let markerY = getWaveY(markerX, loopProgress);
    circle(markerX, markerY, 15);
  }
  pop();

  // --- 2. Draw the Animated Gradient Logo ---
  drawLogo(loopProgress);
}


function keyPressed() {
  if (key === 's' || key === 'S') {
    let options = {
      units: 'frames',
      framesPerSecond: SKETCH_FPS
    };
    console.log(`Starting GIF capture: ${TOTAL_LOOP_FRAMES} frames at ${SKETCH_FPS} FPS.`);
    console.log("The browser tab may freeze during this process. Please be patient!");
    saveGif('Final_BlackLine_Animation.gif', TOTAL_LOOP_FRAMES, options);
  }
}