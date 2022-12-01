class Q_learning{

    constructor(Snake,defaultLoopsPerInterval,score_goal){

        this.qTable = {};
        this.learningRate = 1;
        this.discountFactor = 1;
        this.randomize = 0.5;
        this.Snake = Snake;
        this.availableActions = ["up","down","left",'right']
        this.score = 0;
        this.missed = 0;
        this.defaultLoopsPerInterval = defaultLoopsPerInterval;
        this.intervalID;
        this.score_goal = score_goal
        this.loopsPerInterval = this.defaultLoopsPerInterval;
        this.set_qtable = false
        this.stopPlay=false
        this.best_score = 0
    }

    which_state(state){

        if(this.qTable[state] == undefined ){

           
            this.qTable[state] = { 'up' : 0, 'down': 0,'left':0, 'right':0 }
        }
     
        return this.qTable[state]
    }

    bestAction(state){
     
        this.availableActions = ["up","down","left",'right']

        let q;
        let last = this.Snake.lastaction
        if(last == 0){
            q = this.which_state(state)
        }
        if(last == 1){

            q = this.which_state(state)
            this.availableActions = ["up","left",'right']
        }
        if(last == 2){
            q = this.which_state(state)
            this.availableActions = ["down","left",'right']
        }
        if(last == 3){
            q = this.which_state(state)
            this.availableActions = ["up","down","left"]
        }
        if(last == 4){
            q = this.which_state(state)
            this.availableActions = ["up","down",'right']
        }

        if(Math.random() < this.randomize){
            let random = Math.floor(Math.random() * this.availableActions.length)
            return this.availableActions[random];
        }

        
        let maxValue = q[this.availableActions[0]]
        let choseAction = this.availableActions[0]
        let actionZero = []

        for(let i = 0; i < this.availableActions.length;i++){
            if(q[this.availableActions[i]] == 0 || q[this.availableActions[i]] == -5)
                actionZero.push(this.availableActions[i])
            if(q[this.availableActions[i]] > maxValue) {
                maxValue = q[this.availableActions[i]];
                choseAction = this.availableActions[i];
            }
        }

        if(maxValue == 0 || maxValue == -5){
            let random = Math.floor(Math.random()* actionZero.length);
            choseAction = actionZero[random];
        }

        return choseAction
    }

    update(state0, state1, reward, act){

        let q0 = this.which_state(state0);
        let q1 = this.which_state(state1);
        // console.log(state0)
        // console.log("update q0 state for act chosen",q0,q1,act)

        let newValue = reward + this.discountFactor *Math.max(q1.up,q1.down,q1.left,q1.right) - q0[act]
        this.qTable[state0][act] = q0[act] + this.learningRate * newValue
        // console.log("update q0 state for act chosen after",this.which_state(state0))
    }

    training(){

        // console.log("=================================================================")
        // console.log("Beginning")

        // console.log("state",this.Snake.state_all)
        let currentState =this.Snake.state_all
        this.currentState_ = currentState
        // console.log("lastdetection",this.Snake.last_detection)
        // console.log("last_action",this.Snake.lastaction)
        let action = this.bestAction(currentState)
        // console.log("action",action)
        this.Snake.drawGame(action)
        let instantReward = this.Snake.reward 
        let nextState = this.Snake.state_all
        // console.log("last_action new",this.Snake.lastaction)
        // console.log("new state",this.Snake.state_all)
        // console.log("instant reward",this.currentState_, instantReward)

        if (this.set_qtable == false)
            this.update(currentState, nextState, instantReward, action)
        if (instantReward > 0 ) this.score += Math.trunc(instantReward)
        if (instantReward < 0 ) this.missed += Math.trunc(instantReward)

        let q_new = this.qTable
        // console.log("qtable",q_new)
    }


    setStopPlay(stop){
        this.stopPlay = stop
    }

    startTrain_display() {

        let i =0
        clearInterval(this.intervalID);
        const loops = this.loopsPerInterval ? this.loopsPerInterval : this.defaultLoopsPerInterval;
        this.intervalID = setInterval(
            () => {
          for (let index = 0; index < loops; index++) {

            if (this.stopPlay==true)
                return
            i++
            this.training();
            if (this.randomize > 0.1)
                this.randomize -= 0.001
            this.draw_table();
            if (this.Snake.score> this.best_score)
                this.best_score = this.Snake.score
                document.getElementById("bestscore").innerHTML = this.best_score
          }
        }, 1000/this.Snake.speed);
      }


    startTrain(){
        console.log("start_train")

       while(this.score_goal != this.Snake.score) {
            this.training();
            if (this.randomize > 0.1)
                this.randomize -= 0.001
  
       }
        return this.qTable
    }

    Set_qtable(qtable){
        this.qTable = qtable;
        this.set_qtable == true;
    }

    Get_qtable(){
        return this.qTable;
    }

    draw_table(){

        let coord;

        let q1 = this.qTable[this.currentState_]
        coord =this.Snake.fingerprinting[this.currentState_];


        let last = this.Snake.lastaction;
        let max;
    
        if(this.currentState_[0] === "1"){
            max = Math.max(q1.up,q1.left,q1.right) 
        }
        if(this.currentState_[0] === "2"){
            max = Math.max(q1.down,q1.left,q1.right) 
        }
        if(this.currentState_[0] === "3"){
            max = Math.max(q1.up,q1.down,q1.left) 
        }
        if(this.currentState_[0] === "4"){
            max = Math.max(q1.up,q1.down,q1.right) 
        }
        console.log("max",max)
 

        if (max => 0){


            this.Snake.ctx_state.fillStyle = 'blue';
            this.Snake.ctx_state.fillRect(coord.x,coord.y,this.Snake.taille_table,this.Snake.taille_table);

        } 

        if (max < 0){
            console.log("ok")

            this.Snake.ctx_state.fillStyle = 'red';
            this.Snake.ctx_state.fillRect(coord.x,coord.y,this.Snake.taille_table,this.Snake.taille_table);

        }
    }
}