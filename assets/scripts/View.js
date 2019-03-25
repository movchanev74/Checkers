cc.Class({
    extends: cc.Component,

    properties: {
        // spriteGreenPoint: {
        //     default: null,
        //     type: cc.SpriteFrame
        // },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        greenPointPrefab: {
            default:null,
            type:cc.Prefab
        }
    },
    init(countCell,widthCell){ //initialization
        this.countCell = countCell; 
        this.widthCell = widthCell;
        this.greenPointPool = new cc.NodePool('greenPointPool');
        this.moves = [];
        this.movesParent = new cc.Node();
        this.node.addChild(this.movesParent);
    },
    moveChecker(endPos,checker){//move the сhecker to a point endPos
        checker.x = (endPos.x - this.countCell/2)*this.widthCell+this.widthCell/2;
        checker.y = (endPos.y - this.countCell/2)*this.widthCell+this.widthCell/2;
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
            newGreenPoint.position = new cc.Vec2(
                (moves[i].x - this.countCell/2)*this.widthCell+this.widthCell/2, 
                (moves[i].y - this.countCell/2)*this.widthCell+this.widthCell/2);
            this.moves.push(newGreenPoint);
        }
    },
    showEndGame(text){//set text to endGameLabel  
        this.gameOverNode.getComponent(cc.Label).string = text;
    },
    hideMove()//hide all moves shown
    {
        for (let i = 0; i < this.moves.length; i++){
            //this.moves[i].destroy();
            this.greenPointPool.put(this.moves[i]);
        } 

        this.moves = [];
    }
});
