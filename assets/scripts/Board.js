// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    	spriteUp: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteLeftUp: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteLeft: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteLeftDown: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteDown: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteRightDown: {
        default: null,
        type: cc.SpriteFrame
    	},
     	spriteRight: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteRightUp: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteWhiteWood: {
        default: null,
        type: cc.SpriteFrame
    	},
    	spriteBlackWood: {
        default: null,
        type: cc.SpriteFrame
    	}
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    createBoard(countCell)
    {
    	for (let i = -countCell/2; i < countCell/2; i++) {
    		console.log(i);
    		let down = new cc.Node();
			let spriteComponent = down.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = this.spriteDown;
			this.node.addChild(down);
			down.position = new cc.Vec2(i*32, (-countCell/2-1)*32);

			let up = new cc.Node();
			spriteComponent = up.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = this.spriteUp;
			this.node.addChild(up);
			up.position = new cc.Vec2(i*32, countCell/2*32);

			let left = new cc.Node();
			spriteComponent = left.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = this.spriteLeft;
			this.node.addChild(left);
			left.position = new cc.Vec2((-countCell/2-1)*32, i*32);

			let right = new cc.Node();
			spriteComponent = right.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = this.spriteRight;
			this.node.addChild(right);
			right.position = new cc.Vec2(countCell/2*32, i*32);
		}

		let rightUp = new cc.Node();
		let spriteComponent = rightUp.addComponent(cc.Sprite);
		spriteComponent.spriteFrame = this.spriteRightUp;
		this.node.addChild(rightUp);
		rightUp.position = new cc.Vec2(countCell/2*32, countCell/2*32);

		let rightDown = new cc.Node();
		spriteComponent = rightDown.addComponent(cc.Sprite);
		spriteComponent.spriteFrame = this.spriteRightDown;
		this.node.addChild(rightDown);
		rightDown.position = new cc.Vec2(countCell/2*32, (-countCell/2-1)*32);

		let leftUp = new cc.Node();
		spriteComponent = leftUp.addComponent(cc.Sprite);
		spriteComponent.spriteFrame = this.spriteLeftUp;
		this.node.addChild(leftUp);
		leftUp.position = new cc.Vec2((-countCell/2-1)*32, countCell/2*32);

		let leftDown = new cc.Node();
		spriteComponent = leftDown.addComponent(cc.Sprite);
		spriteComponent.spriteFrame = this.spriteLeftDown;
		this.node.addChild(leftDown);
		leftDown.position = new cc.Vec2((-countCell/2-1)*32, (-countCell/2-1)*32); 

		for (let i = -countCell/2; i < countCell/2; i++) 
			for (let j = -countCell/2; j < countCell/2; j++) {
    		let cell = new cc.Node();
			let spriteComponent = cell.addComponent(cc.Sprite);
			if((1+i+j)%2 == 0)
				spriteComponent.spriteFrame = this.spriteWhiteWood;
			else
				spriteComponent.spriteFrame = this.spriteBlackWood;
			this.node.addChild(cell);
			cell.position = new cc.Vec2(i*32, j*32);
		}
    },
    
    start () {
    	this.createBoard(14);
    },

    // update (dt) {},
});
