/**
 * 
 * @constructor
 */
function ConsoleViewObject () {
	/**
	 * @private
	 * @type {number}
	 */
	this.nCurFrame = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nCurFPS = 0;
};
/**
 * @public
 * @param {number} nDeltaTime
 * @param {number} nScrollX
 * @param {number} nScrollY
 * @param {number} nDrawScale
 */
ConsoleViewObject.prototype.draw = function(nDeltaTime, nScrollX, nScrollY, nDrawScale) {
	this.nCurFrame += 1;
	if (this.nCurFrame > 10) {
		this.nCurFrame = 0;
		this.nCurFPS = round(1 / nDeltaTime);
	}
	
	var nCanvasWidth = round(Constants.CANVAS.width / nDrawScale);
	var nCanvasHeight = round(Constants.CANVAS.height / nDrawScale);
	var nCanvasX = round(nScrollX / nDrawScale);
	var nCanvasY = round(nScrollY / nDrawScale);
	
	Constants.CONSOLE.innerHTML ='FPS: ' + this.nCurFPS +' Canvas [x: '+ nCanvasX + ',y: '+nCanvasY+',w:'+nCanvasWidth+',h: '+nCanvasHeight+']';
};

