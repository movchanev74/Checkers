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
    	checkersArray: {
            default: [],
            type: cc.Node
		},
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
    	},
    	whiteChecker:{
			default:null,
			type:cc.Prefab
		},
    	blackChecker:{
			default:null,
			type:cc.Prefab
		},
		cell:{
			default:null,
			type:cc.Prefab
		},
		countCell:{
			default:8,
			type:cc.Integer
		}
    },

    onLoad () {
    	this.checkersArray = new Array(this.countCell);
		for (var i = 0; i < this.checkersArray.length; i++) {
  			this.checkersArray [i] = new Array(this.countCell);
		};
    },

    click(pos){
    	cc.log(pos);
    },

    createBoard(countCell)
    {
    	function createCell(sprite,pos,newCell){
    		if(newCell == null)
	    		newCell = new cc.Node();
			let spriteComponent = newCell.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = sprite;
			this.node.addChild(newCell);
			newCell.position = pos;
    	}

    	for (let i = -countCell/2; i < countCell/2; i++) {
    		createCell.call(this, this.spriteDown,new cc.Vec2(i*32, (-countCell/2-1)*32));
    		createCell.call(this, this.spriteUp,new cc.Vec2(i*32, countCell/2*32));
    		createCell.call(this, this.spriteLeft,new cc.Vec2((-countCell/2-1)*32, i*32));
			createCell.call(this, this.spriteRight,new cc.Vec2(countCell/2*32, i*32));
		}
		createCell.call(this, this.spriteRightUp,new cc.Vec2(countCell/2*32, countCell/2*32));
    	createCell.call(this, this.spriteRightDown,new cc.Vec2(countCell/2*32, (-countCell/2-1)*32));
    	createCell.call(this, this.spriteLeftUp,new cc.Vec2((-countCell/2-1)*32, countCell/2*32));
		createCell.call(this, this.spriteLeftDown,new cc.Vec2((-countCell/2-1)*32, (-countCell/2-1)*32));

		for (let i = -countCell/2; i < countCell/2; i++) 
			for (let j = -countCell/2; j < countCell/2; j++)
				if((1+i+j)%2 == 0)
					createCell.call(this, this.spriteWhiteWood,new cc.Vec2(i*32, j*32),cc.instantiate(this.cell));
				else
					createCell.call(this, this.spriteBlackWood,new cc.Vec2(i*32, j*32),cc.instantiate(this.cell));
    },
    addCheckers(){
    	function createCell(checker,pos,parent){
    		this.checkersArray[pos.x][pos.y] = cc.instantiate(checker);
    		this.checkersArray[pos.x][pos.y].position = new cc.Vec2((pos.x - this.countCell/2)*32, (pos.y - this.countCell/2)*32);
    		this.node.addChild(this.checkersArray[pos.x][pos.y]);
    	}

    	let parent = new cc.Node();
    	parent.name = "Checkers";
    	for (let x = 0; x < this.countCell; x++) 
			for (let y = 0; y < this.countCell; y++){
    			if(y >= 0 && y < 3 && ((1+x+y)%2 == 0))
    				createCell.call(this, this.blackChecker, new cc.Vec2(x, y), parent);
    			if(y >= 5 && y < 8 && ((1+x+y)%2 == 0))
    				createCell.call(this, this.whiteChecker, new cc.Vec2(x, y), parent);
    		}
    },

    start () {
    	this.createBoard(this.countCell);
    	this.addCheckers();
    },

    // update (dt) {},
});
