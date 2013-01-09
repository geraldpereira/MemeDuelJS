/**
 * 
 * @constructor
 * @extends {DynamicViewObject}
 */
function AnimatedViewObject(mdExplosionPositionParam, nDeltaXParam,
		nDeltaYParam, sImageParam, nFrameCountParam, nFPSParam) {

	if (nFrameCountParam <= 0)
		throw "framecount can not be <= 0";
	if (nFPSParam <= 0)
		throw "fps can not be <= 0";

	/**
	 * L'image
	 * @private
	 */
	this.oImage = Images[sImageParam];

	/**
	 * Defines the current frame that is to be rendered
	 * @private
	 * @type {number}  
	 */
	this.nCurrentFrame = 0;

	/**
	 * Defines the frames per second of the animation
	 * @private
	 * @type {number}
	 */
	this.nTimeBetweenFrames = 1 / nFPSParam;

	/**
	 * The number of individual frames held in the image
	 * @type Number
	 */
	this.nFrameCount = nFrameCountParam;

	/**
	 * Time until the next frame
	 * @private
	 * @type {number}
	 */
	this.nTimeSinceLastFrame = this.nTimeBetweenFrames;
	/**
	 * The width of each individual frame
	 * @private
	 * @type {number}
	 */
	this.nFrameWidth = this.oImage.width / nFrameCountParam;

	/**
	 * La durée restante à afficher
	 * @private
	 * @type {number}
	 */
	this.nDurationLeft = nFrameCountParam / nFPSParam;

	/**
	 * @private
	 * @type {number}
	 */
	this.nDeltaX = nDeltaXParam * Constants.DRAW_FACTOR;

	/**
	 * @private
	 * @type {number}
	 */
	this.nDeltaY = nDeltaYParam * Constants.DRAW_FACTOR;

	/**
	 * La position dans la vue
	 * @private
	 * @type {XY}
	 */
	this.mdPos = new XY(mdExplosionPositionParam.x * Constants.DRAW_FACTOR
			- (this.nFrameWidth / 2), mdExplosionPositionParam.y
			* Constants.DRAW_FACTOR - (this.oImage.height / 2));

	// un ramdom entre 50 et 70
	var nZOrder = 50 + 20 * Math.random();
	DynamicViewObject.call(this, nZOrder);
};
inherits(AnimatedViewObject, DynamicViewObject);

/**
 * @override
 */
AnimatedViewObject.prototype.isDestroyed = function() {
	return this.nDurationLeft < 0;
};

/**
 * @override
 */
AnimatedViewObject.prototype.isInCanvas = function(nScrollX, nScrollY,
		nDrawScale) {
	return this.isInCanvasProtected(this.mdPos.x, this.mdPos.y,
			this.nFrameWidth, nScrollX, nScrollY, nDrawScale);
};

/**
 * @override
 */
AnimatedViewObject.prototype.draw = function(nDeltaTime, oContext2D, nScrollX,
		nScrollY) {
	var nSourceX = this.nFrameWidth * this.nCurrentFrame;

	oContext2D.drawImage(this.oImage, nSourceX, 0, this.nFrameWidth,
			this.oImage.height, roundPosition(this.mdPos.x), roundPosition(this.mdPos.y), this.nFrameWidth,
			this.oImage.height);

	this.nTimeSinceLastFrame -= nDeltaTime;
	if (this.nTimeSinceLastFrame <= 0) {
		this.nTimeSinceLastFrame = this.nTimeBetweenFrames;
		this.nCurrentFrame++;
		this.nCurrentFrame %= this.nFrameCount;
	}

	this.mdPos.x = this.mdPos.x + this.nDeltaX * nDeltaTime;
	this.mdPos.y = this.mdPos.y + this.nDeltaY * nDeltaTime;
	this.nDurationLeft -= nDeltaTime;
};