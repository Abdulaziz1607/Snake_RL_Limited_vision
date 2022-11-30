

class GameSnake {


    constructor(speed,tileCount,width_canvas,q_learning,angle_range,vision_length){

        this.speed = speed;
        this.tileCount = tileCount;
        this.tileSize = (width_canvas/ tileCount);
        this.q_learning = q_learning;
        this.ActionEnum = {"none":0,"up":1,"down":2,"left":3,"right":4};
        this.lastaction = 1;
        this.angle_range = angle_range;
        this.vision_length = vision_length;
        this.reward = -0.1;
        this.state_all = "1-0-0-0";
        this.draw_bool = true
        this.last_detection = false
        this.count_detec = 0
        this.last_detection_direc = -100

    }

    setup(){

        if (this.draw_bool){
            this.canvas = document.getElementById('game');
            this.ctx = this.canvas.getContext("2d");


            this.table_state = document.getElementById('table_state');
            this.ctx_state = this.table_state.getContext("2d");

            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

            this.ctx_state.fillStyle = 'black';
            this.ctx_state.fillRect(0,0,this.table_state.width, this.table_state.height);

            if (this.q_learning==false){
                document.body.addEventListener("keydown",(e) => this.keydown(e))
            }
            else{

            }
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
        this.reward = -5;
        this.changeSnakePosition();
        if (this.draw_bool)
            this.ClearScreen();
        this.isGameOver()
        if (this.stop==false && this.q_learning == false){
    
            setTimeout(this.drawGame.bind(this), 1000/this.speed);
          
        }
        else{
            if (this.q_learning == true){
     
                this.action_taken(action)
                this.angle_vision()
                this.update_state_all()
 
            }
            else{
                this.ClearScreen()
                return
            } 
        }    
     
        this.checkAppleCollision();
        if(this.draw_bool){
            this.drawScore();
            this.drawApple();
        }
        this.drawSnake();
      
    }     
        
    ClearScreen(){ 
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);


    }

    drawSnake(){
        
        if (this.draw_bool){
            for(let i = 0;i < this.snakeParts.length; i++ ){
                let part = this.snakeParts[i]
                this.ctx.fillStyle= "pink";
                this.ctx.fillRect(part.x * this.tileCount, part.y * this.tileCount,this.tileSize,this.tileSize)
            }
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(this.headX * this.tileCount, this.headY * this.tileCount, this.tileSize, this.tileSize)
        }
        if (this.lastaction != 0){
            this.snakeParts.push(new SnakePart(this.headX, this.headY));

            if(this.snakeParts.length > this.tailLengt){
                this.last_tail = this.snakeParts.shift(); 
            }
        }

       
    }

    drawApple(){

        this.ctx.fillStyle= 'orange';
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
                let stop_ = false
                for(let i = 1 ;i < this.snakeParts.length; i++ ){
                
                    let part = this.snakeParts[i]
                    if (part.x == this.appleX && part.y == this.appleY){
                        this.appleX = Math.floor(Math.random()*this.tileCount);
                        this.appleY = Math.floor(Math.random()*this.tileCount);
                        stop_ = true
                    }
                }

                if (stop_ == false){
                    break
                }

            }
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
                    this.reward = -10
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

    }

    action_taken(action){

        // up
        if(this.ActionEnum[action] == 1){
            if(this.yVelocity == 1)
                return;
            this.yVelocity = -1;
            this.xVelocity = 0;
            this.lastaction = this.ActionEnum.up
        }

        // down
        if(this.ActionEnum[action] == 2){
            if(this.yVelocity == -1)
                return;
            this.yVelocity = 1;
            this.xVelocity = 0;
            this.lastaction = this.ActionEnum.down

        }

        // left
        if(this.ActionEnum[action] == 3){
            if(this.xVelocity == 1)
                return;
            this.yVelocity = 0;
            this.xVelocity = -1;
            this.lastaction = this.ActionEnum.left
        }

        // rigth
        if(this.ActionEnum[action] == 4){
            if(this.xVelocity == -1)
                return;
            this.yVelocity = 0;
            this.xVelocity = 1;
            this.lastaction = this.ActionEnum.right
        }
    }

    draw_radar(angle,color){

        let state_ = 0
        let detection_ = false

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
          
            if ((x == this.appleX*this.tileCount) && (y == this.appleY*this.tileCount)){


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

            if(this.draw_bool){
                this.ctx.fillStyle=color;
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
            }
        }

        return state_

    }



    update_state_all(){
        this.state_all = this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right

    }
    angle_vision(){

        let state_face;
        let state_left;
        let state_right;

        let color = "violet"

        if (this.lastaction == 1){
        
            this.state_face = this.draw_radar(-Math.PI/2,color)
            this.state_left = this.draw_radar(Math.PI,color)
            this.state_right = this.draw_radar(0,color)
            // console.log("==here ")
            // console.log(this.state_all)
            // console.log( this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
            
            if (this.state_face ==1){

                if (this.state_all === this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
                    this.reward = 5
                if(this.state_all[0] == '3' &&  this.state_all[6] == '1' )
                    this.reward = 5
                if(this.state_all[0] == '4' && this.state_all[4] == '1')
                    this.reward = 5
            
                if( this.state_face == '1' &&  this.state_left == '1' && this.state_right == 1){

                    this.reward = 20
                }


            }

        }

        if (this.lastaction == 2){

            this.state_face = this.draw_radar(Math.PI/2,color)
            this.state_left = this.draw_radar(0,color)
            this.state_right = this.draw_radar(Math.PI,color)
            // console.log("==here ")

            // console.log(this.state_all)
            // console.log( this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)

            if (this.state_face ==1){

                if (this.state_all === this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
                    this.reward = 5
                if(this.state_all[0] == '3' &&  this.state_all[4] == '1' )
                    this.reward = 5
                if(this.state_all[0] == '4' && this.state_all[6] == '1')
                    this.reward = 5
                if( this.state_face == '1' &&  this.state_left == '1' && this.state_right == 1){

                    this.reward = 20
                }
            }


        }

        if (this.lastaction == 3){

            this.state_face = this.draw_radar(Math.PI,color)
            this.state_left = this.draw_radar(Math.PI/2,color)
            this.state_right = this.draw_radar(-Math.PI/2,color)
            // console.log("==here ")

            // console.log(this.state_all)
            // console.log( this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
            if (this.state_face ==1){
                if (this.state_all === this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
                    this.reward = 5
                if(this.state_all[0] == '2' &&  this.state_all[6] == '1' )
                    this.reward = 5
                if(this.state_all[0] == '1' && this.state_all[4] == '1')
                    this.reward = 5
                if( this.state_face == '1' &&  this.state_left == '1' && this.state_right == 1){

                    this.reward = 20
                }
        
            }

        }

        if (this.lastaction == 4){

            this.state_face= this.draw_radar(0,color)
            this.state_left= this.draw_radar(-Math.PI/2,color)
            this.state_right = this.draw_radar(Math.PI/2,color)
            // console.log("==here ")

            // console.log(this.state_all)
            // console.log( this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)

            if (this.state_face ==1){

                if (this.state_all === this.lastaction + "-" + this.state_face + '-' + this.state_left + '-' + this.state_right)
                    this.reward = 5
                if(this.state_all[0] == '1' &&  this.state_all[6] == '1' )
                    this.reward = 5
                if(this.state_all[0] == '2' && this.state_all[4] == '1')
                    this.reward = 5
                if( this.state_face == '1' &&  this.state_left == '1' && this.state_right == 1){

                    this.reward = 20
                }
        
            }


        }   
    }

    Set_draw_bool(bool_){
        this.draw_bool = bool_
    }

    create_fingerprinting(){

        this.fingerprinting =  undefined || {};
        let m = 4
        let n = 3
        let p;
        this.taille_table = 40;
        for (var index = 1; index <=m; index++) {
            p = 0
            for (var index2 = 0; index2 < n; index2++) {
                for (var index3 = 0; index3 < n; index3++) {
                    for (var index4 = 0; index4 < n; index4++) {
                
                        this.fingerprinting[index + '-' + index2 + '-' + index3 + '-' + index4] = {"x" : p, "y": (index-1)*this.taille_table}
                        p=p+this.taille_table;
                        
                    }
                }
            }

        }
        console.log(this.fingerprinting)
    }

    setSpeed(speed){
        this.speed = speed
    }


}



class SnakePart{

    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}


