var GameSnake = (
    function (){

        var speed = 15;
        var tileCount = 20;
    
        var headX = tileCount/2;
        var headY = tileCount/2;
        
        var appleX = 5;
        var appleY = 5;

        var xVelocity =0;
        var yVelocity =0;

        const snakeParts =[]
        var tailLengt = 0

        var score = 0;

        var canvas;
        var ctx;

        function setup(){
            var canvas =document.getElementById('game')
            var ctx = canvas.getContext("2d")
            document.body.addEventListener("keydown",keydown)
            reset()
        }


        class SnakePart{

            constructor(x,y){
                this.x = x;
                this.y = y;
            }
        }

        function reset(){

            var speed = 15;
            var tileCount = 20;
            var tileSize = canvas.width / tileCount - 2; 
        
            var headX = tileCount/2;
            var headY = tileCount/2;
            
            var appleX = 5;
            var appleY = 5;

            var xVelocity =0;
            var yVelocity =0;

            const snakeParts =[]
            var tailLengt = 0

            var score = 0;
        }

        function drawGame(){
            
            changeSnakePosition();

            let result = isGameOver();
            console.log(result)
            if(result){
                return;
            }

            ClearScreen();
            checkAppleCollision();

            drawApple();
            drawSnake();

            drawScore();

            setTimeout(drawGame, 1000/speed);
        
        }    
        
        function ClearScreen(){ 
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,canvas.width, canvas.height);
        }

        function drawSnake(){


            for(let i = 0;i < snakeParts.length; i++ ){
                let part = snakeParts[i]
                ctx.fillStyle= "orange";
                ctx.fillRect(part.x * tileCount, part.y * tileCount,tileSize,tileSize)
            }

            snakeParts.push(new SnakePart(headX, headY));
        

            if(snakeParts.length > tailLengt){
                snakeParts.shift();
            }
            
            ctx.fillStyle = 'red';
            ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
        }

        function drawApple(){

            ctx.fillStyle= 'green';
            ctx.fillRect(appleX*tileCount,appleY*tileCount,tileSize,tileSize);

        }

        function drawScore(){

            ctx.fillStyle= "white";
            ctx.font = "10px Verdana";
            ctx.fillText("Score: " + score, canvas.width - 50, 10);
        }

        function changeSnakePosition(){


            headX = headX + xVelocity;
            
            headY = headY + yVelocity; 

            if (headX > (tileCount-1)){
                headX = headX % tileCount 
            }
            if (headY > (tileCount-1)){
                headY = headY % tileCount 
            }
            if (headX < 0){
                headX = tileCount - 1
            }
            if (headY < 0){
                headY = tileCount -1
            }
        }

        function checkAppleCollision(){

            if(appleX === headX && appleY === headY){

                appleX = Math.floor(Math.random()*tileCount);
                appleY = Math.floor(Math.random()*tileCount); 
                console.log("ok")
                while(
                        (
                            function (){
                            console.log("new apple")
                            
                            for(let i = 0 ;i < snakeParts.length; i++ ){
                                let part = snakeParts[i]
                             
                                if (part.x == appleX && part.y == appleY){
                                    appleX = Math.floor(Math.random()*tileCount);
                                    appleY = Math.floor(Math.random()*tileCount);
                                    return true
                                }
                            }
                            return false
                        }
                    )());

                tailLengt++;
                score++;
            }
        }

        function isGameOver(){
        
            gameOver= false;
            
            for(let i = 0 ;i < snakeParts.length; i++ ){

                let part = snakeParts[i]

                if (part.x === headX && part.y === headY){
                    gameOver =  true;
                    break
                }
            }
            return gameOver

        }

        

        function keydown(event){
            // up
            if(event.keyCode == 38){
                if(yVelocity == 1)
                    return;
                yVelocity = -1;
                xVelocity = 0;
            }

            // down
            if(event.keyCode == 40){
                if(yVelocity == -1)
                    return;
                yVelocity = 1;
                xVelocity = 0;
            }

            // left
            if(event.keyCode == 37){
                if(xVelocity == 1)
                    return;
                yVelocity = 0;
                xVelocity = -1;
            }

            // rigth
            if(event.keyCode == 39){
                if(xVelocity == -1)
                    return;
                yVelocity = 0;
                xVelocity = 1;
            }
        }

        return {

            init : function(){
                window.onload = setup;
        
            },

            loop : drawGame,
        }

})();

