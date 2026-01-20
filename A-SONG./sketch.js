let play_song_ids = 3; // Controls which scene (A/B/no song) is active
let size;

let movers = [];
let moverNum = 30;
let attracting = true;

let sound;
let sound2;
let amplitude;
let myFont;

// Variables for second song //
let t = 1;
let result;
let isArriving = true;
let m;
let bubbles = [];
let bubbleNum = 130;
let textNum = 70;
let words = ["♬", '♪', '♩', "♬♬"];
let randomRes;

// Variables for first song //
let bubbles2 = [];
let targetx;
let targety;
let rotx = 0.0;
let roty = 0.0;
let u = 0;

function preload() {
  // Load custom font and sound files
  myFont = loadFont('Apple Symbols.ttf');
  sound = loadSound('nature2.MP3');
  sound2 = loadSound('nature.MP3');
}

function setup() {
  // Setup 3D canvas
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();

  // Create amplitude analyzer for sound reactivity
  amplitude = new p5.Amplitude();
  size = 100;

  // Initialize bubbles for Song 1
  for (let i = 0; i < bubbleNum; i++) {
    let boid = new BubblesBase(width / 1, height / 8, width / height, 5);
    bubbles2.push(boid);
  }

  // Initialize movers for Song 2
  for (let i = 0; i < moverNum; i++) {
    let boid = new Boid();
    movers.push(boid);
  }

  // Initialize falling bubbles (music symbols) for Song 2
  for (let i = 0; i < bubbleNum; i++) {
    let temp = floor(random(words.length));
    randomRes = words[temp];
    m = new Mover2(randomRes);
    bubbles.push(m);
  }
}

function draw() {
  background(0); // Reset background each frame

  // Switch between songs or title screen
  if (play_song_ids == 1) firstSong();
  else if (play_song_ids == 2) secondSong();
  else nosong();
}

// Draw background sheet (used in Song 2)
function drawsheet() {
  push();
  stroke(255);
  strokeWeight(0.8);
  fill(255);

  // Draw multiple horizontal staff lines
  for (let a = 0; a < 6; a++) {
    line(-width / 2, -height / 2 + 20 + 120 * a, width, -height / 2 + 20 + 120 * a);
    line(-width / 2, -height / 2 + 30 + 120 * a, width, -height / 2 + 30 + 120 * a);
    line(-width / 2, -height / 2 + 40 + 120 * a, width, -height / 2 + 40 + 120 * a);
    line(-width / 2, -height / 2 + 50 + 120 * a, width, -height / 2 + 50 + 120 * a);
    line(-width / 2, -height / 2 + 60 + 120 * a, width, -height / 2 + 60 + 120 * a);
  }
  pop();
}

// Title screen (no song)
function nosong() {
  if (play_song_ids == 3) {
    push();
    textFont(myFont);
    textSize(130);
    textAlign(CENTER, CENTER);
    fill(255);
    text('A SONG.', 0, -50); // Title

    // Author name
    textSize(32);
    textAlign(LEFT, CENTER);
    fill(255);
    text('——Yosheng Qian', 500, 350);
    pop();
  }
}

// ====== Song 1: floating rotating symbols ======
function firstSong() {
  if (play_song_ids == 1) {
    if (!sound.isPlaying()) sound.play(); // Play sound if not already playing

    // Analyze sound level and map to strength
    let level = amplitude.getLevel();
    let strength = map(level, 0, 0.3, 0, 8);

    push();
    // Camera rotation setup
    camera(width, height, u, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    targetx = width / 2;
    targety = height / 2;

    // Smooth camera motion
    rotx += (targetx - rotx) * 0.04;
    roty += (targety - roty) * 0.04;

    // Add subtle rotation and scaling affected by sound
    rotateX(rotx * 0.01 + strength * 0.02);
    rotateY(roty * 0.01 + strength * 0.02);
    scale(1 + strength * 0.05);

    // Draw all floating symbols
    for (let i = 0; i < bubbles2.length; i++) {
      bubbles2[i].update();
      bubbles2[i].render();
      rotateX(i * 2);
      rotateY(i * 2);
      rotateZ(i);
    }
    pop();
  } else {
    sound.stop();
  }
}

// Song 2: falling symbols affected by sound 
function secondSong() {
  if (play_song_ids == 2) {
    if (!sound2.isPlaying()) sound2.play();

    // Analyze sound level
    let level = amplitude.getLevel();
    let strength = map(level, 0, 0.3, 0, 3);

    push();
    drawsheet(); // Draw background lines
    translate(-width / 2, -height / 2);

    // Create movement forces
    let wind = createVector(-0.01, 0);
    let gravity = createVector(0, 0.03 + strength * 0.03);

    // Update and draw falling music symbols
    for (let i = 0; i < bubbles.length; i++) {
      if (isArriving) {
        bubbles[i].applyForce(wind);
        bubbles[i].applyForce(gravity);
        bubbles[i].checkEdges();
        bubbles[i].update();
      }
      bubbles[i].display(t);
    }
    pop();
  } else {
    sound2.stop();
    result = false;
  }
}

// Class for Song 1 floating bubbles 
class BubblesBase {
  constructor(x, y, z, up) {
    this.bx = x;
    this.by = y;
    this.bz = z;
    this.by = up;
  }

  update() {
    // Move upward slowly
    this.by -= 0.1;
  }

  render() {
    push();
    // Translate and rotate symbol in 3D
    translate(this.bx - width / 2.0, this.by - height / 2.0, this.bz);
    rotateX(frameCount * 0.05);
    rotateY(frameCount * 0.05);

    // Draw the symbol
    scale(1.5);
    fill(255);
    noStroke();
    textFont(myFont);
    textSize(90);
    text('♪ ♬', 0, 0);
    pop();
  }
}

// Key control
function keyPressed() {
  // Resume audio context if it’s suspended
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume().then(() => {
      console.log('AudioContext is running now.');
    }).catch(error => {
      console.error('Error resuming AudioContext:', error);
    });
  }

  // Switch between A, B, and title screen
  if (key === 'A' || key === 'a') play_song_ids = 1;
  else if (key === 'B' || key === 'b') play_song_ids = 2;
  else play_song_ids = 3;

  // Refresh scenes
  nosong();
  firstSong();
  secondSong();
}















