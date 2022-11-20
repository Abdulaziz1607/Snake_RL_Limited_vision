class Q_learning{

    constructor(Snake,defaultLoopsPerInterval){

        this.qTable = {};
        this.learningRate = 0.85;
        this.discountFactor = 0.9;
        this.randomize = 0.1;
        this.Snake = Snake;
        this.availableActions = ["up","down","left",'right']
        this.score = 0;
        this.missed = 0;
        this.defaultLoopsPerInterval = defaultLoopsPerInterval;
        this.intervalID;
        this.loopsPerInterval = this.defaultLoopsPerInterval;
    }

    which_state(state){
        console.log(state)
        if(this.qTable[state] == undefined)
            this.qTable[state] = { 'up' : 0, 'down': 0,'left':0, 'right':0}
        return this.qTable
    }

    bestAction(state){

        let q = this.which_state(state)

        if(Math.random() < this.randomize){
            let random = Math.floor(Math.random()* this.availableActionsA)
            return this.availableActions[random];
        }

        let maxValue = q[this.availableActions[0]]
        let choseAction = this.availableActions[0]
        let actionZero = []

        for(let i = 0; i < this.availableActions.length;i++){
            if(q[this.availableActions[i]] == 0) actionZero.push(this.availableActions[0])
            if(q[this.availableActions[i]] > maxValue) {
                maxValue = q[this.availableActions[i]];
                choseAction = this.availableActions[i];
            }
        }

        if(maxValue == 0){
            let random = Math.floor(Math.random()* actionZero.length);
            console.log("deded")
            choseAction = actionZero[random];
        }
        return choseAction

    }

    update(state0, state1, reward, act){
        let q0 = this.which_state(state0)
        let q1 = this.which_state(state1)

        let newValue = reward + this.discountFactor * Math.max(q1.up,q1.down,q1.left,q1.right) - q0[act]
        this.qTable[state0][act] = q0[act] + this.learningRate * newValue
    }

    training(){

        let currentState = this.which_state(this.Snake.state_all)
        let action = this.bestAction(currentState)
        this.Snake.drawGame(action)
        let instantRreward = this.Snake.reward
        let nextState = this.which_state(this.Snake.state_all)

        this.update(currentState, nextState, instantRreward, action)

        if (instantRreward > 0 ) this.score += Math.trunc(instantRreward)
        if (instantRreward < 0 ) this.missed += Math.trunc(instantRreward)

        

    }

    startTrain() {
        clearInterval(this.intervalID);
        const loops = this.loopsPerInterval ? this.loopsPerInterval : this.defaultLoopsPerInterval;
        console.log("passer par la ")
        this.intervalID = setInterval(
            () => {
          for (let index = 0; index < loops; index++) {
            console.log("passer par la aussi ")
            this.training();
          }
        }, 1000/5);

      }
}