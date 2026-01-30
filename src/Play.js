class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELCOCITY_Y_MIN = 700
        this.SHOT_VELCOCITY_Y_MAX = 1100
        // initialize display variables
        this.shot_counter = 0
        this.score = 0
        this.shot_percentage = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)
        wallA.direction = 1
        wallA.velocity = 100

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            // direct shot along x-axis based on pointer position
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELCOCITY_Y_MIN, this.SHOT_VELCOCITY_Y_MAX) * shotDirectionY)
            // increment shot counter, update shot percentage
            this.shot_counter += 1
            this.shot_percentage = (this.score / this.shot_counter * 100).toFixed(2)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // reset ball on score, increment score, update shot percentage
            this.ballreset()
            this.score += 1
            this.shot_percentage = (this.score / this.shot_counter * 100).toFixed(2)
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        // move wall A left/right
        let wallA = this.walls.getChildren()[0]
        wallA.x += wallA.direction * wallA.velocity * this.game.loop.delta / 1000
        if (wallA.x >= width - wallA.width / 2 | wallA.x <= wallA.width / 2) {
            wallA.direction *= -1
        } 

        // display stats on screen
        this.displayStats()
    }

    displayStats() {
        // display shot counter, score, and shot percentage on screen\
        if (this.statsText) this.statsText.destroy()
        let statsString = `Shots: ${this.shot_counter}  Score: ${this.score}  Shot %: ${this.shot_percentage}`
        this.statsText = this.add.text(10, 10, statsString, { font: '16px Arial', fill: '#ffffff' })
    }

    // reset ball position
    ballreset() {
        this.ball.setPosition(width / 2, height - height / 10)
        this.ball.body.setVelocity(0)
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[DONE] Add ball reset logic on successful shot
[DONE] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[DONE] Make one obstacle move left/right and bounce against screen edges
[DONE] Create and display shot counter, score, and successful shot percentage
*/