

class GameSnake {


    constructor(speed,tileCount,width_canvas,q_learning,angle_range,vision_length){

        this.speed = speed;
        this.tileCount = tileCount;
        this.tileSize = (width_canvas/ tileCount);
        this.q_learning = q_learning;
        this.ActionEnum = {"none":0,"up":1,"down":2,"left":3,"right":4};
        this.lastaction;
        this.angle_range = angle_range;
        this.vision_length = vision_length;
        this.reward = -0.1;
        this.state_all = "0-0-0-0";
    }

    setup(){
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext("2d");
        if (this.q_learning==false){
            document.body.addEventListener("keydown",(e) => this.keydown(e))
        }
        else{

        }
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
       
    drawGame(action){
    
        this.changeSnakePosition();
        this.ClearScreen();

        this.angle_vision()
        this.isGameOver()
        if (this.stop==false && this.q_learning == false){
    
            setTimeout(this.drawGame.bind(this), 1000/this.speed);
          
        }
        else{
            if (this.stop==false && this.q_learning == true){
                this.action_taken(action) 
            }
            else{
                this.ClearScreen()
                return
            } 
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

        this.last_tail;
        for(let i = 0;i < this.snakeParts.length; i++ ){
            let part = this.snakeParts[i]
            this.ctx.fillStyle= "pink";
            this.ctx.fillRect(part.x * this.tileCount, part.y * this.tileCount,this.tileSize,this.tileSize)
        }
        if (this.lastaction != 0){
            this.snakeParts.push(new SnakePart(this.headX, this.headY));

            if(this.snakeParts.length > this.tailLengt){
                this.last_tail = this.snakeParts.shift(); 
            }
        }

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.headX * this.tileCount, this.headY * this.tileCount, this.tileSize, this.tileSize)
    }

    drawApple(){

        this.ctx.fillStyle= 'red';
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
            
            while(true){
                let stop = false
                for(let i = 1 ;i < this.snakeParts.length; i++ ){
                    let part = this.snakeParts[i]
                    if (part.x == this.appleX && part.y == this.appleY){
                        this.appleX = Math.floor(Math.random()*this.tileCount);
                        this.appleY = Math.floor(Math.random()*this.tileCount);
                        stop = true
                    }
                }

                if (stop == false){
                    break
                }
            }
            this.reward = 1
            this.tailLengt++;
            this.score++;
        }
    }

    isGameOver(){
    
        this.stop=false 
        if (this.lastaction != 0)
            for(let i = 0 ;i < this.snakeParts.length; i++ ){

                let part = this.snakeParts[i]
    
                if (part.x === this.headX && part.y === this.headY){
                    this.stop =  true;
                    this.reward = -1
                    this.reset()
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
            this.lastaction = this.ActionEnum.up
        }

        // down
        if(event.keyCode == 40){
            if(this.yVelocity == -1)
                return;
            this.yVelocity = 1;
            this.xVelocity = 0;
            this.lastaction = this.ActionEnum.down
        }

        // left
        if(event.keyCode == 37){
            if(this.xVelocity == 1)
                return;
            this.yVelocity = 0;
            this.xVelocity = -1;
            this.lastaction = this.ActionEnum.left
        }

        // rigth
        if(event.keyCode == 39){
            if(this.xVelocity == -1)
                return;
            this.yVelocity = 0;
            this.xVelocity = 1;
            this.lastaction = this.ActionEnum.right
        }
        if(event.keyCode == 32){
            if(this.xVelocity == 0 && this.yVelocity == 0)
                return;
            this.lastaction = this.ActionEnum.none
            this.snakeParts.pop()
            this.snakeParts.unshift(this.last_tail);
            this.yVelocity = 0;
            this.xVelocity = 0;
        }
    }

    action_taken(action){

        // up
        if(action == 1){
            if(this.yVelocity == 1)
                return;
            this.yVelocity = -1;
            this.xVelocity = 0;
            this.lastaction = this.ActionEnum.up
        }

        // down
        if(action == 2){
            if(this.yVelocity == -1)
                return;
            this.yVelocity = 1;
            this.xVelocity = 0;
            this.lastaction = this.ActionEnum.down

        }

        // left
        if(action == 3){
            if(this.xVelocity == 1)
                return;
            this.yVelocity = 0;
            this.xVelocity = -1;
            this.lastaction = this.ActionEnum.left

        }

        // rigth
        if(action.action == 4){
            if(this.xVelocity == -1)
                return;
            this.yVelocity = 0;
            this.xVelocity = 1;
            this.lastaction = this.ActionEnum.right
        }
    }

    draw_radar(angle,color){


        let state_ = 0

        for(let i =0 ;i < (this.vision_length+1); i = i + this.tileSize ){
            
            let x = this.headX*this.tileCount + i*Math.floor(Math.cos(angle))
            let y = this.headY*this.tileCount + i*Math.floor(Math.sin(angle))


            if (x > (this.tileCount*this.tileCount-1)){
                x = x % (this.tileCount*this.tileCount)
            } 
            if (y > (this.tileCount*this.tileCount-1)){
                y = y % (this.tileCount*this.tileCount)
            } 
            if (x < 0){
                x = this.tileCount*this.tileCount - 1 + x
            }
            if (y < 0){
                y = this.tileCount*this.tileCount -1 + y
            }
          
            if ( (x == this.appleX*this.tileCount) && (y == this.appleY*this.tileCount)){
                state_ = 1
                return  state_
            }
            for(let l =0 ;l < (this.snakeParts.length); l ++ ){
                let part = this.snakeParts[l]
                if (part.x * this.tileCount == x && part.y * this.tileCount == y){
                    state_ = 2
                    return state_
                }

            }
            // array_X.push(x)
            // array_Y.push(y)
            this.ctx.fillStyle=color;
            this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
   
        }

        return state_

    }

    angle_vision(){

        let state_face;
        let state_left;
        let state_right;

        if (this.lastaction == 1){
        
            state_face = this.draw_radar(-Math.PI/2,"blue")
            state_left = this.draw_radar(Math.PI,"blue")
            state_right = this.draw_radar(0,"blue")

            this.state_all = this.lastaction + "-" + state_face + '-' + state_left + '-' + state_right
            
        }

        if (this.lastaction == 2){

            state_face = this.draw_radar(Math.PI/2,"blue")
            state_right = this.draw_radar(Math.PI,"blue")
            state_left = this.draw_radar(0,"blue")

            this.state_all = this.lastaction + "-" + state_face + '-' + state_left + '-' + state_right
        }

        if (this.lastaction == 3){

            state_face = this.draw_radar(Math.PI,"blue")
            state_left = this.draw_radar(Math.PI/2,"blue")
            state_right = this.draw_radar(-Math.PI/2,"blue")
       
            this.state_all = this.lastaction + '-'+ state_face + '-' + state_left + '-' + state_right

        }

        if (this.lastaction == 4){

            state_face= this.draw_radar(0,"blue")
            state_left= this.draw_radar(-Math.PI/2,"blue")
            state_right = this.draw_radar(Math.PI/2,"blue")

            this.state_all = this.lastaction + "-" + state_face + '-' + state_left + '-' + state_right

        }   
    }
}

class SnakePart{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}


