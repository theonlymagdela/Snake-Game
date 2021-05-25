const boardFields = {width: 22, height: 16};
const statusbarFields = {height: 2};

const fieldSize = 32;
const boardSize = {width: boardFields.width * fieldSize, height: boardFields.height * fieldSize};
const statusbarSize = {height: statusbarFields.height * fieldSize};

const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = boardSize.width;
ctx.canvas.height = boardSize.height + statusbarSize.height;

const gameColor = {
    backgroundScore: '#9DE0C5',
    backgroundBoard: '#00ad66',
    textScore: '#A4A4A4',
    snakeHead: '#F26E5E',
    snakeBody: '#FFA591',
    dot: '#AD0047'
};

const gameSound = {
    appleBite: new Audio('audio/beep-07.mp3'),
    gameOver: new Audio('audio/squeeze-toy-1.mp3')
};

let snake = [];
let apple = {x: 0, y: 0};

let score = 0;
let scoreImage = {x: fieldSize, y: fieldSize};

let moveDirection;
let gameSpeed = {value: 250, step: 2};

function randomApple() {
    apple.x = Math.floor(Math.random() * boardFields.width) * fieldSize;
    apple.y = Math.floor(Math.random() * boardFields.height + statusbarFields.height) * fieldSize;
}

function gameInit() {
    function createSnake() {
        snake[0] = {
            x: 9 * fieldSize,
            y: 10 * fieldSize
        };
    }

    function keyboardListenerAdd() {
        document.addEventListener("keydown", function(event) {
            let key = event.keyCode;
            if (key === 37 && moveDirection !== "RIGHT") {
                moveDirection = "LEFT";
            } else if (key === 38 && moveDirection !== "DOWN") {
                moveDirection = "UP";
            } else if (key === 39 && moveDirection !== "LEFT") {
                moveDirection = "RIGHT";
            } else if (key === 40 && moveDirection !== "UP") {
                moveDirection = "DOWN";
            }
        });
    }

    createSnake();
    randomApple();
    keyboardListenerAdd();
}

function gameEngine() {
    function drawBoard() {
        function drawBackground() {
            // statusbar
            ctx.fillStyle = gameColor.backgroundScore;
            ctx.fillRect(0,0, boardSize.width, statusbarSize.height);
            // board
            ctx.fillStyle = gameColor.backgroundBoard;
            ctx.fillRect(0, statusbarSize.height, boardSize.width, boardSize.height + statusbarSize.height);
        }

        function drawSnake() {
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0)? gameColor.snakeHead: gameColor.snakeBody;
                ctx.fillRect(snake[i].x, snake[i].y, fieldSize, fieldSize);
            }
        }

        function drawApple() {
            ctx.beginPath();
            ctx.fillStyle = gameColor.dot;
            ctx.arc(
                apple.x + 0.5 * fieldSize,
                apple.y + 0.5 * fieldSize,
                16,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        function drawScore() {
            // apple
            ctx.beginPath();
            ctx.fillStyle = gameColor.dot;
            ctx.arc(scoreImage.x, scoreImage.y, 16, 0, 2 * Math.PI);
            ctx.fill();
            // score text
            ctx.fillStyle = gameColor.textScore;
            ctx.font = '2em Futura';
            ctx.fillText(score, 2 * fieldSize, fieldSize * 1.38 );
        }

        drawBackground();
        drawSnake();
        drawApple();
        drawScore();
    }

    function getNewSnakeHeadPosition(headX, headY) {
        if (moveDirection === "LEFT") {
            headX -= fieldSize;
        } else if (moveDirection === "UP") {
            headY -= fieldSize;
        } else if (moveDirection === "RIGHT") {
            headX += fieldSize;
        } else if (moveDirection === "DOWN") {
            headY += fieldSize;
        }

        return {x: headX, y: headY}
    }

    function isSnakeBiteApple() {
        return newSnakeHeadPosition.x === apple.x
            && newSnakeHeadPosition.y === apple.y
            && apple.x === apple.x
            && apple.y === apple.y;
    }

    function snakeUpgrade() {
        function randomNewApple() {
            let appleInSnake = true;
            while (appleInSnake === true) {
                randomApple();
                for (let iPart in snake) {
                    if (snake[iPart].x === apple.x && snake[iPart].y === apple.y) {
                        appleInSnake = true;
                        break;
                    } else {
                        appleInSnake = false;
                    }
                }
            }
        }

        function speedGameUp() {
            clearInterval(game);
            gameSpeed.value = gameSpeed.value - gameSpeed.step;
            game = setInterval(gameEngine, gameSpeed.value);
        }

        gameSound.appleBite.play();
        score++;
        speedGameUp();
        randomNewApple();
    }

    function snakeCutTail() {
        snake.pop();
    }

    function moveSnake() {
        function isGameOver() {
            function collisionWithOneself(headSnake, wholeSnake) {
                for (let i = 0; i < wholeSnake.length; i++) {
                    if (headSnake.x === wholeSnake[i].x && headSnake.y === wholeSnake[i].y) { return true; }
                }
                return false;
            }

            return  newSnakeHeadPosition.x < 0
                || newSnakeHeadPosition.x > boardSize.width - fieldSize
                || newSnakeHeadPosition.y < statusbarSize.height
                || newSnakeHeadPosition.y > boardSize.height + fieldSize
                || collisionWithOneself(snakeNewHead, snake)
        }

        function endTheGame() {
            clearInterval(game);
            gameSound.gameOver.play();

            if (confirm("Game Over! Do you want to play again?")) {
                window.location.reload(true);
            }
        }

        let snakeNewHead = {x: newSnakeHeadPosition.x, y: newSnakeHeadPosition.y};
        if (isGameOver()) { endTheGame() }
        snake.unshift(snakeNewHead);
    }

    let newSnakeHeadPosition = getNewSnakeHeadPosition(snake[0].x, snake[0].y);
    isSnakeBiteApple()? snakeUpgrade(): snakeCutTail();
    moveSnake();

    drawBoard();
}

gameInit();
let game = setInterval(gameEngine, gameSpeed.value);
