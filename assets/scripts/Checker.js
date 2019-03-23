// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
// var global = require('Globlal');
cc.Class({
    extends: cc.Component,

    properties: {
        isQueen: { 
            get () {
                return this._isQueen;
            },
            set (value) {
                this._isQueen = value;
            }
        },
        pos: { 
            get () {
                return this._pos;
            },
            set (value) {
                this._pos = value;
            }
        },
        checkersColor: { 
            get () {
                return this._checkersColor;
            },
            set (value) {
                this._checkersColor = value;
            }
        }
    } 
});
