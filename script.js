const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 4;

const ball = {
    // ball starts in the center of the game
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    // ball velocity (start going to the top-right corner)
    dx: 4,
    dy: -4
};

const paddle = {
    x: canvas.width / 2 -20,
    y:canvas.height - 20, 
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};

const brickSpecs= {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

//Create bricks, help from MDN
const bricks = [];
for (let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for(let j= 0; j< brickColumnCount; j++){
        const x = i * (brickSpecs.w + brickSpecs.padding) + brickSpecs.offsetX;
        const y = j * (brickSpecs.h + brickSpecs.padding) + brickSpecs.offsetY;
        bricks[i][j] = { x, y, ...brickSpecs }; 
    }
}

//Draw ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

//Draw paddle on canvas
function drawPaddle() {
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'black';
    ctx.fill();}

//Score
function drawScore(){
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}` , canvas.width - 100, 40);
}

//Makes bricks disappear when ball collides
function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? 'black' : 'transparent';
            ctx.fill();
            ctx.closePath();
        });
    });
}

//Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    //Wall detection
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0){
        paddle.x = 0;
    }
}

//Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // prevent ball from going through walls by changing its velocity
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; //ball.dx = ball.dx * -1
    }

   // prevent ball from going through walls by changing its velocity
    if(ball.y + ball.size > canvas.height || ball.y - ball.size <0){
        ball.dy *= -1; 
    }
    
    //Paddle Collision
    if(
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ){
        ball.dy = -ball.speed;
    }

    //Brick collision with help from MDN
    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible){
                if(
                    ball.x - ball.size > brick.x && //left brick 
                    ball.x + ball.size < brick.x  + brick.w && //right brick
                    ball.y + ball.size > brick.y && //top brick 
                    ball.y - ball.size < brick.y  + brick.h //bottom brick 
                ){
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });

    
    if(ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

//Increase score
function increaseScore() {
    score++;
}

//Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

//Draw everything 
function draw() {

    ctx.clearRect(0,0,canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//Update canvas drawing and animation
function update() {
    movePaddle();
    moveBall();

    //Draw everything
    draw();

    requestAnimationFrame(update);
}

update();
      
document.addEventListener('keydown', Keydown);//when user presses the arrow keys
function Keydown(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx = paddle.speed
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}
document.addEventListener('keyup', Keyup);//when the user releases the arrow key
function Keyup(e){
    if(
        e.key === 'ArrowLeft' ||
        e.key === 'Left' ||
        e.key === 'ArrowRight' ||
        e.key === 'Right' 
    
    ){
        paddle.dx = 0;//keep the paddle from going all the way to the selected side continuously
    }
}
