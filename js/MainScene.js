class FirstScene extends Phaser.Scene {
    map;
    player;
    collisionLayer;
    camera;
    cursors;

    constructor(config) {
        super(config);
    }
    
    preload() {
        this.load.image('landscape-image', '../assets/landscape-tileset.png');
        this.load.image('props-image', '../assets/props-tileset.png');
        this.load.spritesheet('player-ss', '../assets/player.png', {frameWidth: 24, frameHeight: 24});

        this.load.tilemapTiledJSON('level1', '../assets/level1.json');
    }

    create() {
        this.map = this.make.tilemap({key: 'level1'});
        this.map.landscape = this.map.addTilesetImage('landscape-tileset', 'landscape-image');
        this.map.props = this.map.addTilesetImage('props-tileset', 'props-image');

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.map.createStaticLayer('background', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('background2', [this.map.landscape, this.map.props], 0, 0);
        this.map.createStaticLayer('platforms', [this.map.landscape, this.map.props], 0, 0);

        this.createPlayer();

        this.map.createStaticLayer('foreground', [this.map.landscape, this.map.props], 0, 0);

        this.createCollision();
        
        this.setCamera();

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
            this.player.flipX = true;
        } else if(this.cursors.right.isDown) {
            this.player.setVelocityX(100);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
            this.player.setVelocityY(-200);
        }
    }

    createPlayer() {
        this.player = this.physics.add.sprite(16, 16, 'player-ss', 1);
        this.player.setCollideWorldBounds(true);
    }

    createCollision() {
        this.collisionLayer = this.map.getLayer('platforms').tilemapLayer;
        this.collisionLayer.setCollisionBetween(0, 1000);

        this.physics.add.collider(this.player, this.collisionLayer);
    }

    setCamera() {
        this.camera = this.cameras.getCamera("");
        this.camera.startFollow(this.player);
        this.camera.setZoom(2);
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }
}