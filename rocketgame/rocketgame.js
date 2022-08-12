
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var spacerocks;
var platforms;
var cursors;
var score = 0;
let fuel = 100;
var gameOver = false;
var scoreText;
var fuelOn = true;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'rocketgame/assets/sky-1.png');
    this.load.image('ground', 'rocketgame/assets/platform-1.png');
    this.load.image('spacerock', 'rocketgame/assets/spacerock.png');
    this.load.spritesheet('rocket', 'rocketgame/assets/rocket.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(600, 584, 'ground');
    platforms.create(200, 584, 'ground');

    //  Now let's create some ledges
    platforms.create(Phaser.Math.Between(50, 750), 400, 'ground');
    platforms.create(Phaser.Math.Between(50, 750), 250, 'ground');
    platforms.create(Phaser.Math.Between(50, 750), 125, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 460, 'rocket');

    //  Player physics properties.
    player.setBounce(.3);
    player.setCollideWorldBounds(true);

    //  Our player animations, rockets on or off.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('rocket', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'rocket', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('rocket', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('rocket', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();


    //  Some spacerocks to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    spacerocks = this.physics.add.group({
        key: 'spacerock',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    spacerocks.children.iterate(function (child) {

        //  Give each spacerock a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });


    //  The score and fuel text
    scoreText = this.add.text(16, 16, 'Score: 0', { fill: '#ceb4ff', font: 'bold 20pt Courier' });
    fuelText = this.add.text(600,16, 'Fuel: ' + fuel, { fill: '#cf0b0b', font: 'bold 20pt Courier' })

    //  Collide the player and the spacerocks with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(spacerocks, platforms);

    //  Checks to see if the player overlaps with any of the spacerocks, if he does call the collectRock function
    this.physics.add.overlap(player, spacerocks, collectRock, null, this);

}

// function toggleFuel() {
//     if (fuelOn == true) {
//         fuelOn = false;
//         fuelText.setText('Unlimited Fuel');
//     }
//     else {
//         fuelOn = true;
//         fuelText.setText('Fuel: ' + fuel);
//     }
// }


function update ()
{
    if (gameOver)
    {
        return;
    }
    if (fuel == 0) {
        player.anims.play('turn');
    }
    if (cursors.left.isDown && player.body.touching.down == false)
    {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown && player.body.touching.down == false)
    {
        player.setVelocityX(160);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        if (fuel > 0 || fuelOn == false) {
        player.setVelocityY(-200);
        player.anims.play('up', true);
        if (fuelOn == true) {
            fuel -= 1;
            fuelText.setText('Fuel: ' + fuel);
        }
        }
    }
    else
    {
        player.anims.play('turn');
    }
}

function collectRock (player, spacerock)
{
    spacerock.disableBody(true, true);

    //  Add and update the score
    score += 10;
    fuel += 25;
    if (fuel >= 500) {
        fuel = 500;
    }
    if (fuelOn == true) {
        fuelText.setText('Fuel: ' + fuel);
    }
    scoreText.setText('Score: ' + score);

    // if (score == 200) {
    //     winText = this.add.text(16, 100, 'You Win!', { fontSize: '64px', fill: '#ceb4ff' });
    //     gameOver = true;
    //     this.physics.pause();
    // }
    if (spacerocks.countActive(true) === 0)
    {
        //  A new batch of spacerocks to collect
        
        spacerocks.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
}