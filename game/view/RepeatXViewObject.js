/**
 * 
 * @constructor
 * @extends {StaticViewObject}
 */
function RepeatXViewObject(mdGodEnv) {
	StaticViewObject.call(this,mdGodEnv.zOrder);
	/**
	 * @private
	 */
	this.oImage = Images[mdGodEnv.sImage];
	/**
	 * @private
	 * @type {number}
	 */
	this.nPosY = Constants.DRAW_FACTOR * mdGodEnv.nPosY;
	/**
	 * @private
	 * @type {number}
	 */
	this.nImageWidth = this.oImage.width;
	/**
	 * @private
	 * @type {number}
	 */
	this.nIterations = Math.ceil(Constants.DRAW_FACTOR * GODEnvConstants.world.nWidth /this.nImageWidth);
};

inherits(RepeatXViewObject, StaticViewObject);

/**
 * @override
 */
RepeatXViewObject.prototype.draw = function(oContext2D, nScrollX, nScrollY) {
			oContext2D.save();
			oContext2D.translate(0, this.nPosY);
			for (var i = 0; i < this.nIterations; i +=1){
				oContext2D.drawImage(this.oImage,0,0);
				oContext2D.translate(this.oImage.width-1, 0);
			}
			oContext2D.restore();
		};