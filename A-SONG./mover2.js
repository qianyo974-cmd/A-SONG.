class Mover2 {
  constructor(randomRes) {
    this.mass = random(1, 6);
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.locs = [];
    this.trailLength = 100;
    this.result = result;
    this.notesForm = randomRes;
  }

  applyForce(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display(t) {

//     let c1 = random(100, 200);
//     let c2 = random(100, 200);
//     let c3 = random(200, 255);

//     fill(c1, c2, c3);
    fill(255);
    noStroke();
    textFont(myFont);
    textSize(90);
    text(this.notesForm, this.position.x, this.position.y);
  }
  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  }

}