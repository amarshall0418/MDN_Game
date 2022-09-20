// Use querySelector to look for class (grid).
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
const boardHeight = 300;
let score = 0;

//Paddle constants
const paddleStart = [230, 10];
let currentPosition = paddleStart;

//Ball constants
const ballStart = [270, 30];
const ballDiameter = 20;
let ballCurrentPosition = ballStart;
let timerId;
let xDirection = 2;
let yDirection = 2;

/*Create one block*/
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

/* All the Blocks*/
const blocks = [
  //Row One
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  //Row Two
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  //Row Three
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

/* Drawing Blocks*/
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div"); //JS method used to create elements (stored 'div' as block)
    block.classList.add("block"); //adds block class to the 'div'
    block.style.left = blocks[i].bottomLeft[0] + "px"; //gets the block's bottom left corner (anchor point)
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block); //grabs grid from index, and adds a 'block' to it
  }
}

addBlocks();

/*Add paddle */
const paddle = document.createElement("div");
paddle.classList.add("paddle");
drawPaddle();
grid.appendChild(paddle);

//Draw Paddle
function drawPaddle() {
  paddle.style.left = currentPosition[0] + "px";
  paddle.style.bottom = currentPosition[1] + "px";
}

/* Moving Paddle */
function movePaddle(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        //stops the paddle from leaving grid
        currentPosition[0] -= 10;
        drawPaddle();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        //anchor is on bottom left corner, so subtract width
        currentPosition[0] += 10;
        drawPaddle();
      }
      break;
  }
}

document.addEventListener("keydown", movePaddle); //listen for any key is pushed

/*Draw the Ball*/
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

/*Create Ball */
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

/*Move Ball*/
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkCollisions();
}

timerId = setInterval(moveBall, 30);

//Collision Check
function checkCollisions() {
  // check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
    }
  }
  //check for wall collisions
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    changeDirection();
  }
  // Check for paddle collions
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  //Check for game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You lose!";
    document.removeEventListener("keydown", movePaddle);

    // Check for win
    if (blocks.length === 0) {
      scoreDisplay.innerHTML = "You win!!";
      clearInterval(timerId);
      document.removeEventListener("keydown", movePaddle);
    }
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection == 2) {
    yDirection = -2;
    //yDirection = -2;
    return;
  }

  if (xDirection == 2 && yDirection == -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
