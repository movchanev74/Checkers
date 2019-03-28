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
        },
        checkerPrefab:{
            default:null,
            type:cc.Prefab
        },
        spriteWhiteQueen: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteBlackQueen: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteWhiteChecker: {
            default: null,
            type: cc.SpriteFrame
        },
        spriteBlackChecker: {
            default: null,
            type: cc.SpriteFrame
        },
        cell:{
            default:null,
            type:cc.Prefab
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        greenPointPrefab: {
            default:null,
            type:cc.Prefab
        },
        checkerPrefab:{
            default:null,
            type:cc.Prefab
        },
        speedChecker:300
    },
    init(countCell){ //initialization
        this.countCell = countCell; 
        this.widthCell = this.spriteBlackWood.getRect().width;
        this.createBoard();
        this.greenPointPool = new cc.NodePool('greenPointPool');
        this.moves = [];
        this.movesParent = new cc.Node();
        this.node.addChild(this.movesParent);
        this.checkersPool = new cc.NodePool('checkersPool');
    },
    arrayPosToScenePos(pos){
        return new cc.Vec2(
                (pos.x - this.countCell/2)*this.widthCell+this.widthCell/2, 
                (pos.y - this.countCell/2)*this.widthCell+this.widthCell/2);
    },
    createBoard(){//create board 
        function createCell(sprite,pos,newCell){
            if(newCell == null)
                newCell = new cc.Node();
            else
                newCell.getComponent("Cell").pos = new cc.Vec2(pos.x + this.countCell/2,pos.y + this.countCell/2);
            let spriteComponent = newCell.addComponent(cc.Sprite);
            spriteComponent.spriteFrame = sprite;
            this.node.addChild(newCell);
            newCell.position = new cc.Vec2(pos.x*this.widthCell+this.widthCell/2, pos.y*this.widthCell+this.widthCell/2);
        }

        for (let i = -this.countCell/2; i < this.countCell/2; i++) {
            createCell.call(this, this.spriteDown,new cc.Vec2(i, -this.countCell/2-1));
            createCell.call(this, this.spriteUp,new cc.Vec2(i, this.countCell/2));
            createCell.call(this, this.spriteLeft,new cc.Vec2(-this.countCell/2-1, i));
            createCell.call(this, this.spriteRight,new cc.Vec2(this.countCell/2, i));
        }
        createCell.call(this, this.spriteRightUp,new cc.Vec2(this.countCell/2, this.countCell/2));
        createCell.call(this, this.spriteRightDown,new cc.Vec2(this.countCell/2, -this.countCell/2-1));
        createCell.call(this, this.spriteLeftUp,new cc.Vec2(-this.countCell/2-1, this.countCell/2));
        createCell.call(this, this.spriteLeftDown,new cc.Vec2(-this.countCell/2-1, -this.countCell/2-1));

        for (let i = -this.countCell/2; i < this.countCell/2; i++) 
            for (let j = -this.countCell/2; j < this.countCell/2; j++)
                if((1+i+j)%2 == 0)
                    createCell.call(this, this.spriteWhiteWood,new cc.Vec2(i, j),cc.instantiate(this.cell));
                else
                    createCell.call(this, this.spriteBlackWood,new cc.Vec2(i, j),cc.instantiate(this.cell));
    },
    addCheckers(checkersArray){// create checkers and add their to array 
        function createChecker(checker,pos){
            let newCheckers = null;     
            if (this.checkersPool.size() > 0) {
                newCheckers = this.checkersPool.get(this);
            } else {
                newCheckers = cc.instantiate(this.checkerPrefab);
            }
            newCheckers.position = this.arrayPosToScenePos(pos);
            newCheckers.getComponent(cc.Sprite).spriteFrame = checker;
            newCheckers.getComponent("Checker").pos = pos;
            newCheckers.getComponent("Checker").isQueen = false;
            return newCheckers;
        }

        let parent = new cc.Node();
        parent.name = "Checkers";
        this.node.addChild(parent);
        for (let x = 0; x < this.countCell; x++) 
            for (let y = 0; y < this.countCell; y++){
                checkersArray[x][y] = null;
                if(y >= 0 && y < 3 && ((1+x+y)%2 == 0)){
                    checkersArray[x][y] = createChecker.call(this, this.spriteWhiteChecker, new cc.Vec2(x, y)) 
                    parent.addChild(checkersArray[x][y]);
                    checkersArray[x][y].getComponent("Checker").checkersColor = window.CurrentPlayerState.White;
                }
                if(y >= this.countCell-3 && y < this.countCell && ((1+x+y)%2 == 0)){
                    checkersArray[x][y] = createChecker.call(this, this.spriteBlackChecker, new cc.Vec2(x, y)) 
                    parent.addChild(checkersArray[x][y]);
                    checkersArray[x][y].getComponent("Checker").checkersColor = window.CurrentPlayerState.Black;
                }
            }
        return parent;
    },
    deleteChecker(checker){
        this.checkersPool.put(checker);
    },
    createQueen(checker){//create queen checker
        let sprite = checker.getComponent(cc.Sprite); 
        if(checker.checkersColor == CurrentPlayerState.White){
            sprite.spriteFrame = this.spriteWhiteQueen;
            checker.isQueen = true;
        }else{
            sprite.spriteFrame = this.spriteBlackQueen;
            checker.isQueen = true;
        }
    },
    moveChecker(endPos,checker){
        let pos = this.arrayPosToScenePos(endPos);
        let time = new cc.Vec2(pos.x-checker.x,pos.y-checker.y).mag()/this.speedChecker;
        if(checker.getNumberOfRunningActions() == 0){
            this.actions = [];
            this.actions.push(cc.moveTo(time,pos.x,pos.y));
            checker.runAction(this.actions[0]);
        }else if(checker.getNumberOfRunningActions() > 0){
            this.actions.push(cc.moveTo(time,pos.x,pos.y));
            checker.runAction(cc.sequence(this.actions));
        }else{
            this.actions.push(cc.moveTo(time,pos.x,pos.y));
            checker.runAction(this.prevAction);
        }
        this.hideMove();
    },
    showMove(moves){//show all move in array moves
        this.hideMove();
        for (let i = 0; i < moves.length; i++) 
        {
            let newGreenPoint = null;     
            if (this.greenPointPool.size() > 0) {
                newGreenPoint = this.greenPointPool.get(this);
            } else {
                newGreenPoint = cc.instantiate(this.greenPointPrefab);
            }
            this.movesParent.addChild(newGreenPoint);
            newGreenPoint.position = this.arrayPosToScenePos(moves[i]);
            this.moves.push(newGreenPoint);
        }
    },
    showEndGame(text){//set text to endGameLabel  
        this.gameOverNode.getComponent(cc.Label).string = text;
    },
    hideMove(){//hide all moves shown
        for (let i = 0; i < this.moves.length; i++)
            this.greenPointPool.put(this.moves[i]);
        this.moves = [];
    }
});
