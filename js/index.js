// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Initial car position and dimensions
let carX = canvas.width / 2 - 25;
const carY = canvas.height - 100;
const carWidth = 50;
const carHeight = 100;

// Array to store obstacles, animation ID for requestAnimationFrame, and initial score
let obstacles = [];
let animationId;
let score = 0;

// Load road and car images
const roadImage = new Image();
roadImage.src = "./images/road.png";
const carImage = new Image();
carImage.src = "./images/car.png";

// Start the game only after both images are loaded
roadImage.onload = () => {
  carImage.onload = () => {
    document.querySelector('#start-button').addEventListener('click', startGame);
  };
};

// Obstacle class to create and manage obstacles
class Obstacle {
  constructor(x, width) {
    this.x = x;
    this.y = 0;
    this.width = width;
    this.height = 20;
  }

  // Draw the obstacle on the canvas
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Move the obstacle down the canvas
  move() {
    this.y += 5;
  }
}

// Generate obstacles at random intervals and positions
function generateObstacle() {
  const minWidth = 50;
  const maxWidth = 150;
  const width = Math.floor(Math.random() * (maxWidth - minWidth) + minWidth);
  const x = Math.floor(Math.random() * (canvas.width - width));
  obstacles.push(new Obstacle(x, width));
}

// Handle car movement based on arrow key presses
function moveCar(event) {
  if (event.key === 'ArrowLeft' && carX > 0) {
    carX -= 10;
  } else if (event.key === 'ArrowRight' && carX < canvas.width - carWidth) {
    carX += 10;
  }
}

// Main game loop to update the canvas
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the road background
  ctx.drawImage(roadImage, 0, 0, canvas.width, canvas.height);

  // Draw the car
  ctx.drawImage(carImage, carX, carY, carWidth, carHeight);

  // Move and draw each obstacle
  obstacles.forEach((obstacle, index) => {
    obstacle.move();
    obstacle.draw();

    // Remove obstacle if it goes off the canvas and increment score
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
    }

    // Collision detection between car and obstacles
    if (
      carX < obstacle.x + obstacle.width &&
      carX + carWidth > obstacle.x &&
      carY < obstacle.y + obstacle.height &&
      carY + carHeight > obstacle.y
    ) {
      cancelAnimationFrame(animationId);
      alert(`Game Over! Your score: ${score}`);
    }
  });

  // Display the current score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Request the next frame of animation
  animationId = requestAnimationFrame(updateCanvas);
}

// Start the game and initialize variables
function startGame() {
  document.querySelector('.game-intro').style.display = 'none';
  document.querySelector('#game-board').style.display = 'block';

  score = 0;
  obstacles = [];
  updateCanvas();
}

// Generate new obstacles periodically
setInterval(generateObstacle, 2000);

// Add event listener for car movement
window.addEventListener('keydown', moveCar);