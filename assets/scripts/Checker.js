var Cell = require("Cell");
cc.Class({
    extends: Cell,
    properties: {
        isQueen: { 
            get () {
                return this._isQueen;
            },
            set (value) {
                this._isQueen = value;
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
