/**
 * Un objet de la vue dynamique
 * @param {number} zOrderParam le z order definit la profondeur d'affichage.
 * @constructor
 * @extends {ViewObject}
 */
function DynamicViewObject(zOrderParam) {
	ViewObject.call(this,zOrderParam);
};
inherits(DynamicViewObject, ViewObject);

/**
 * Retourne vrais si le rectangle est dans le canvas
 * @protected 
 * @param {number} nTopLeftX
 * @param {number} nTopLeftY 
 * @param {number} nSize 
 * @param {number} nScrollX
 * @param {number} nScrollY 
 * @param {number} nDrawScale 
 * @return {Boolean}
 */
DynamicViewObject.prototype.isInCanvasProtected = function(nTopLeftX,nTopLeftY,nSize,nScrollX, nScrollY,nDrawScale){
	var nCanvasWidth = Constants.CANVAS.width / nDrawScale;
	var nCanvasHeight = Constants.CANVAS.height / nDrawScale;
	var nCanvasX = nScrollX / nDrawScale;
	var nCanvasY = nScrollY / nDrawScale;
	
	// On oublie le cas ou la forme peut être plus grosse que le canvas
	// On se simplifie la vie en ne prenant pas en compte les rotations 
	// recouvrement axe horizontal
	var bHoverlap = (nTopLeftX<nCanvasX+nCanvasWidth) && (nCanvasX<nTopLeftX+nSize);
	// recouvrement axe vertical
	var bVoverlap = (nTopLeftY<nCanvasY+nCanvasHeight) && (nCanvasY<nTopLeftY+nSize);
	// recouvrement final
	var bOverlap = bHoverlap && bVoverlap;
	return bOverlap;
};

/**
 * A surcharger
 * @protected
 * @param {number} nScrollX
 * @param {number} nScrollY
 * @param {number} nDrawScale
 * @return {Boolean}
 */
DynamicViewObject.prototype.isInCanvas = function(nScrollX, nScrollY,nDrawScale){
	// A implémenter
	return true;
};

/**
 * Retourne l'angle par rapport à la position du soleil
 * @protected
 * @param {number} x
 * @param {number} y
 * @return {number} angle en radians
 */
DynamicViewObject.prototype.getSunAngle = function(x,y){
	var mdSunPosition = GODEnvConstants.sun.oPosition;
	return computeAngleRadians(new XY(x,y),mdSunPosition);
};

/**
 * @public
 * @param {number} nDeltaTime
 * @param oContext2D
 * @param {number} nScrollX
 * @param {number} nScrollY
 */
DynamicViewObject.prototype.draw = function(nDeltaTime, oContext2D, nScrollX, nScrollY) {
	// A implémenter
};

/**
 * @public
 * @return {boolean}
 */
DynamicViewObject.prototype.isDestroyed = function() {
	// A implémenter
	return false;
};

