

class GameSnake {


    constructor(speed,tileCount,width_canvas){

        this.speed = speed;
        this.tileCount = tileCount;
        this.tileSize = (width_canvas/ tileCount) - 2;
        
    }

    setup(){

        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext("2d");
        document.body.addEventListener("keydown",(e) => this.keydown(e))

        this.reset()
    }

    reset(){

    
        this.headX = this.tileCount/2;
        this.headY = this.tileCount/2;
        
        this.appleX = 5;
        this.appleY = 5;

        this.xVelocity =0;
        this.yVelocity =0;

        this.snakeParts =[]
        this.tailLengt = 0

        this.score = 0;

        this.stop = false
    }
       
    drawGame(){
    
        this.changeSnakePosition();

        // let result = isGameOver();
        // console.log(result)
        // if(result){
        //     return;
        // }
        

        this.ClearScreen();
       
        this.isGameOver()
        if (this.stop==false){
            setTimeout(this.drawGame.bind(this), 1000/this.speed);
        }
        else{
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        }

        this.checkAppleCollision();
        this.drawScore();
        this.drawSnake();
        this.drawApple();
    }     
        
    ClearScreen(){ 
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    }

    drawSnake(){

        for(let i = 0;i < this.snakeParts.length; i++ ){
            let part = this.snakeParts[i]
            this.ctx.fillStyle= "orange";
            this.ctx.fillRect(part.x * this.tileCount, part.y * this.tileCount,this.tileSize,this.tileSize)
        }

        console.log(this.snakeParts)
        this.snakeParts.push(new SnakePart(this.headX, this.headY));

        if(this.snakeParts.length > this.tailLengt){
            this.snakeParts.shift();
        }
        console.log(this.snakeParts)
        
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.headX * this.tileCount, this.headY * this.tileCount, this.tileSize, this.tileSize)
    }

    drawApple(){

        this.ctx.fillStyle= 'green';
        this.ctx.fillRect(this.appleX*this.tileCount,this.appleY*this.tileCount,this.tileSize,this.tileSize);

    }
    
    drawScore(){

        this.ctx.fillStyle= "white";
        this.ctx.font = "10px Verdana";
        this.ctx.fillText("Score: " + this.score, this.canvas.width - 50, 10);
    }

    changeSnakePosition(){


        this.headX = this.headX + this.xVelocity;
        
        this.headY = this.headY + this.yVelocity; 

        if (this.headX > (this.tileCount-1)){
            this.headX = this.headX % this.tileCount 
        }
        if (this.headY > (this.tileCount-1)){
            this.headY = this.headY % this.tileCount 
        }
        if (this.headX < 0){
            this.headX = this.tileCount - 1
        }
        if (this.headY < 0){
            this.headY = this.tileCount -1
        }
    }

    checkAppleCollision(){

        if(this.appleX === this.headX && this.appleY === this.headY){
            this.appleX = Math.floor(Math.random()*this.tileCount);
            this.appleY = Math.floor(Math.random()*this.tileCount);
            let stop = false

            while(true){
                for(let i = 0 ;i < this.snakeParts.length; i++ ){
                    let part = this.snakeParts[i]
                    if (part.x == this.appleX && this.party == this.appleY){
                        this.appleX = Math.floor(Math.random()*this.tileCount);
                        this.appleY = Math.floor(Math.random()*this.tileCount);
                        let stop = true
                    }
                }

                if (stop == false){
                    break
                }
            }

            this.tailLengt++;
            this.score++;
        }
    }

    isGameOver(){
    
        this.stop=false 
        for(let i = 0 ;i < this.snakeParts.length; i++ ){

            let part = this.snakeParts[i]
 
            if (part.x === this.headX && part.y === this.headY){
                this.stop =  true;
                break
            }
        }

    }


    keydown(event){

        // up
        if(event.keyCode == 38){
            if(this.yVelocity == 1)
                return;
            this.yVelocity = -1;
            this.xVelocity = 0;
        }

        // down
        if(event.keyCode == 40){
            if(this.yVelocity == -1)
                return;
            this.yVelocity = 1;
            this.xVelocity = 0;
        }

        // left
        if(event.keyCode == 37){
            if(this.xVelocity == 1)
                return;
            this.yVelocity = 0;
            this.xVelocity = -1;
        }

        // rigth
        if(event.keyCode == 39){
            if(this.xVelocity == -1)
                return;
            this.yVelocity = 0;
            this.xVelocity = 1;
        }
    }


}


class SnakePart{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
