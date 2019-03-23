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
        spriteGreenPoint: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    moveChecker(startPos,endPos,checher)
    {
        let countCell = 8;
        cc.log(startPos);
        cc.log(endPos);
        checher.x = (endPos.x - countCell/2)*32;
        checher.y = (endPos.y - countCell/2)*32;
    },
    showMove(moves){
        let countCell = 8;
        for (let i = 0; i < this.moves.length; i++) 
            this.moves[i].destroy();
        for (let i = 0; i < moves.length; i++) 
        {
            let newMove = new cc.Node();
            let spriteComponent = newMove.addComponent(cc.Sprite);
            spriteComponent.spriteFrame = this.spriteGreenPoint;
            this.movesParent.addChild(newMove);
            newMove.position = new cc.Vec2((moves[i].x - countCell/2)*32, (moves[i].y - countCell/2)*32);
            this.moves.push(newMove);
        }
        cc.log("moves: /t" + this.moves);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.moves = [];
        this.movesParent = new cc.Node();
        this.node.addChild(this.movesParent);
    },

    // update (dt) {},
});
