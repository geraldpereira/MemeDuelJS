/**
 * The position of the mouse, on screen, one the canvas in px, on the canvas in
 * metters
 * @constructor
 * @param {View} mdView
 */
function MousePosition (mdViewParam) {

	/**
	 * La vue
	 * @private
	 * @type {View}
	 */
	this.mdView = mdViewParam;
	
	/**
	 * La position de la souris à l'cran
	 * @private
	 * @type {XY}
	 */
	this.mdXYInScreen = new XY(0,0);
	
	/**
	 * La position de la souris dans le canvas en pixel (vue)
	 * @private
	 * @type {XY}
	 */
	this.mdXYInCanvasPx = new XY(0,0);
	
	/**
	 * La position de la souris dans le canvas en metres (model)
	 * @private
	 * @type {XY}
	 */
	this.mdXYInCanvasMeter = new XY(0,0);
};

/**
 * @param el l'element de la vue .... en pratique c'est toujours notre canvas principal car c'est le seul ayant un scroll et un drawScale
 * @param event
 * @public
 */
MousePosition.prototype.setPosition = function(/* Element HTML */el, /* Event souris */event) {
	this.mdXYInScreen.x = event.clientX;
	this.mdXYInScreen.y = event.clientY;

	var mdCurOffset = new XY(el.scrollLeft - el.offsetLeft, el.scrollTop - el.offsetTop);
	while (el = el.offsetParent) {
		mdCurOffset.x += el.scrollLeft - el.offsetLeft;
		mdCurOffset.y += el.scrollTop - el.offsetTop;
	}

	this.mdXYInCanvasPx.x = this.mdXYInScreen.x + mdCurOffset.x;
	this.mdXYInCanvasPx.y = this.mdXYInScreen.y + mdCurOffset.y;

	
	var nDrawScalePx = this.mdView.getDrawScale() * Constants.DRAW_FACTOR; 
	
	this.mdXYInCanvasMeter.x = (this.mdXYInCanvasPx.x + this.mdView.getScroll().x)
			/ nDrawScalePx;
	this.mdXYInCanvasMeter.y = (this.mdXYInCanvasPx.y + this.mdView.getScroll().y)
			/ nDrawScalePx;
};

/**
 * @public
 * @param event
 * @return {XY}
 */
MousePosition.prototype.computeOffset = function(/* Event souris */ event) {
	// Le delta de la position de la souris à l'écran lorsque que le bouton
	// click gauche est enfoncé
	var mdXYOffset = new XY(event.clientX - this.mdXYInScreen.x, event.clientY - this.mdXYInScreen.y);
	return mdXYOffset;
};

MousePosition.prototype.getXYInScreen = function() {
	return this.mdXYInScreen;
};

MousePosition.prototype.getXYInCanvasPx = function() {
	return this.mdXYInCanvasPx;
};

MousePosition.prototype.getXYInCanvasMeter = function() {
	return this.mdXYInCanvasMeter;
};