/**
 * 
 * @constructor
 * @extends {StaticViewObject}
 */
function PerspectiveViewObject(mdGodEnv) {
	StaticViewObject.call(this,mdGodEnv.zOrder);
	
	/**
	 * @private
	 */
	this.oImage = Images[mdGodEnv.sImage];
	/**
	 * @private
	 * @type {number}
	 */
	this.nScrollFactorX = mdGodEnv.nScrollFactorX;
	/**
	 * @private
	 * @type {number}
	 */
	this.nScrollFactorY = mdGodEnv.nScrollFactorY;
	/**
	 * @private
	 * @type {number}
	 */
	this.nPosYMeter = mdGodEnv.nPosY;
	/**
	 * @private
	 * @type {number}
	 */
	this.nImageWidth = this.oImage.width;
	/**
	 * @private
	 * @type {number}
	 */
	this.nImageHeight = this.oImage.height;
	/**
	 * @private
	 * @type {number}
	 */
	this.nIterations = Math.ceil(Constants.DRAW_FACTOR * GODEnvConstants.world.nWidth /this.nImageWidth);
};
inherits(PerspectiveViewObject, StaticViewObject);

/**
 * @override
 */
PerspectiveViewObject.prototype.draw = function(oContext2D, nScrollX, nScrollY) {
			var nPosY = roundPosition((Constants.DRAW_FACTOR * this.nPosYMeter) + nScrollY * this.nScrollFactorY);
			var nPosX = roundPosition(nScrollX * this.nScrollFactorX);

			oContext2D.save();
			oContext2D.translate(nPosX, nPosY);
			for (var i = 0; i < this.nIterations; i +=1){
				oContext2D.drawImage(this.oImage,0,0);
				oContext2D.translate(this.oImage.width - 1, 0);
			}
			oContext2D.restore();
		};
		
//		this.draw = function(/* Numder */nDeltaTime, /* CanvasRenderingContext2D  */
//				oContext2D, nScrollX, nScrollY) {
//					var pattern = oContext2D.createPattern(oImage, "repeat-x");
//					var nPosY = (mdConstants.DRAW_FACTOR * nPosYMeter) + nScrollY * nScrollFactorY;
//					var nPosX = nScrollX * nScrollFactorX;
	//
//					oContext2D.save();
//					oContext2D.translate(nPosX, nPosY);
//					oContext2D.beginPath();
//					oContext2D.rect(0,0, mdConstants.DRAW_FACTOR * mdGODEnvConstants.world.nWidth,mdConstants.DRAW_FACTOR *mdGODEnvConstants.world.nHeight);
//			        oContext2D.fillStyle = pattern;
//			        oContext2D.fill();
//					oContext2D.restore();
//				};
