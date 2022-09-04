var canvas;
    var canvasContext;

    var ballX = 50;
    var ballY = 50;
    var ballSpeedX = 10;
    var ballSpeedY = 4;

    var paddle1Y = 200;
    var paddle2Y = 200;
    const paddleHeight = 100;
    const paddleWidth = 10;

    var player1Score = 0;
    var player2Score = 0;

    const winningScore = 5;
    var showWinScreen = false;
    var winner;
        
    function calMousePos(evt){
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = evt.clientX - rect.left - root.scrollLeft;
        var mouseY = evt.clientY - rect.top - root.scrollTop;
        return{
            x:mouseX,
            y:mouseY
        }
    }

    function handleMouseClick(evt){
        if(showWinScreen == true){
            player1Score = 0;
            player2Score = 0;
            showWinScreen = false;
        }
    }

    window.onload = function(){
        canvas = document.getElementById('gameCanvas');
        canvasContext = canvas.getContext('2d');
        canvasContext.font = '20px Arial';
        var framesPerSec = 30;
        setInterval(function(){
            moveEverything();
            drawEverything();
        } , 1000/framesPerSec);

        canvas.addEventListener('mousedown',handleMouseClick);

        canvas.addEventListener("mousemove",function(evt){
            var mousePos = calMousePos(evt);
            paddle1Y = mousePos.y - (paddleHeight/2);
        });
    }

    function computerMovement(){
        var paddle2YCenter = paddle2Y + paddleHeight/2;
        if(paddle2YCenter < ballY-35){
            paddle2Y += 10;
        }else if(paddle2YCenter > ballY+35){
            paddle2Y -= 10;
        }
    }

    function moveEverything(){
        if(showWinScreen == true){
            return;
        }

        computerMovement();

        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        if(ballX <=0){
            if(ballY >= paddle1Y && ballY <= paddle1Y+paddleHeight){
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle1Y + paddleHeight/2);
                ballSpeedY = deltaY*0.35;
            }else{
                player2Score +=1;
                if(player2Score==winningScore){
                    msg="Game Over!!";
                }
                ballReset();
            }
        }

        if(ballX >= canvas.width){
            if(ballY >= paddle2Y && ballY <= paddle2Y+paddleHeight){
                ballSpeedX = -ballSpeedX;
                var deltaY = ballY - (paddle2Y + paddleHeight/2);
                ballSpeedY = deltaY*0.35;
            }else{
                player1Score +=1;
                if(player1Score==winningScore){
                    msg="YOU WON!!";
                }
                ballReset();
            }   
        }
        
        if(ballY >= canvas.height || ballY <=0){
            ballSpeedY = -ballSpeedY;
        }
    }

    function drawNet(){
        for(var i=0;i<canvas.height;i+=30){
            drawRect(canvas.width/2-1.5,i,3,20,'white');
        }
    }

    function drawEverything(){
        drawRect(0, 0, canvas.width, canvas.height, 'black');
        
        if(showWinScreen == true){
            canvasContext.fillStyle = 'white';
            canvasContext.font = "50px sans-serif";
            canvasContext.fillText(msg,canvas.width/2 -150,150);
            canvasContext.font = "30px sans-serif";
            canvasContext.fillText("Click to continue!",canvas.width/2 -130,350);
            return;
        }

        drawNet();

        drawRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
        drawRect(canvas.width-paddleWidth, paddle2Y, paddleWidth, paddleHeight, 'white');
        drawCircle(ballX, ballY, 10, 'white');
        canvasContext.fillText("You: "+player1Score,200,50);
        canvasContext.fillText("Computer: "+player2Score,canvas.width-300,50);

    }

    function drawRect(x , y , width , height, fillColor){
        canvasContext.fillStyle = fillColor;
        canvasContext.fillRect(x, y, width, height);
    }

    function drawCircle(centerX, centerY, radius, fillColor){
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
        canvasContext.fill();
    }

    function ballReset(){

        if(player2Score == winningScore || player1Score == winningScore){
            showWinScreen = true;
        }
        
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
    }