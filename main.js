
speed = 10
tileCount = 20
width_canvas = 400
q_learning = true
angle_range = 1
vision_length = 140


snake_g = new GameSnake(speed,tileCount,width_canvas,q_learning,angle_range,vision_length)
snake_g.setup()

q_learning = new Q_learning(snake_g,5)
q_learning.startTrain()
