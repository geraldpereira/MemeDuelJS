/**
 * Un couple XY (deux numbers)
 * @constructor
 * @param {number} xParam
 * @param {number} yParam 
 */
function XY (xParam, yParam) {
	/**
	 * @type {number}
	 * @public
	 */
	this.x = xParam;
	/**
	 * @type {number}
	 * @public
	 */
	this.y = yParam;
};

/**
 * @public
 */
XY.prototype.reset = function (){
	this.x = 0;
	this.y = 0;
};

/**
 * @public
 * @return {string}
 */
XY.prototype.toString = function (){
	return '[x:'+this.x+',y:'+this.y+']';
};