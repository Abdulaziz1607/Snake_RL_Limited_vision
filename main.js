const btn_play = document.querySelector("#play");
const btn_stop = document.querySelector("#stop");
const btn_speed_dec = document.querySelector("#speed_dec");
const btn_speed_inc = document.querySelector("#speed_inc");
const slider_score = document.querySelector("#myRange");


tileCount = 20
width_canvas = 400
q_learning = true
angle_range = 1
vision_length = 140
score_goal = 10

snake_g = new GameSnake(5,tileCount,width_canvas,q_learning,angle_range,vision_length)
snake_g.Set_draw_bool(true)
snake_g.setup()
snake_g.create_fingerprinting()
q_table = new Q_learning(snake_g,1,score_goal)


btn_speed_inc.addEventListener("click", function () {
    snake_g.setSpeed(60)
    q_table.startTrain_display()

});

btn_speed_dec.addEventListener("click", function () {
    snake_g.setSpeed(10)
    q_table.startTrain_display()

});

btn_play.addEventListener("click", function () {
    q_table.setStopPlay(false)
    q_table.startTrain_display()

});

btn_stop.addEventListener("click", function () {
    q_table.setStopPlay(true)

});

 
