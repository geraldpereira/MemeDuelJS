/**
 * 
 * @constructor
 * @extends {DynamicViewObject}
 */
function BodyViewObject (oContext2D,mdModelObjectParam) {
	
	/**
	 * @protected
	 */
	this.mdModelObject = mdModelObjectParam;
	var mdGod = this.mdModelObject.getGameObjectDef();
	/**
	 * @protected
	 */
	this.oShape = GODShapeConstants[mdGod.sShape];
	/**
	 * @protected
	 */
	this.oType = GODTypeConstants[mdGod.sType];
	/**
	 * @protected
	 */
	this.pattern = oContext2D.createPattern(Images[this.oType.sImage], "repeat");
	/**
	 * @protected
	 * @type {number}
	 */
	this.nLineWidth = roundPosition(this.oType.nLineWidth * Constants.DRAW_FACTOR);
	
	DynamicViewObject.call(this,this.oShape.nZOrder);
};
inherits(BodyViewObject, DynamicViewObject);

/**
 * @public
 * @return {ModelObject}
 */
BodyViewObject.prototype.getModelObject = function() {
	return this.mdModelObject;
};

/**
 * @protected
 */
BodyViewObject.prototype.drawDamage = function(/* CanvasRenderingContext2D */oContext2D){
	var nPercentage = this.mdModelObject.getLifespanPercentage();
	var sDmgImage = undefined;
	if (nPercentage <= 25) {
		sDmgImage = this.oType.sImage + "25";
	}else if (nPercentage <= 50){
		sDmgImage = this.oType.sImage + "50";
	}else if (nPercentage <= 75){
		sDmgImage = this.oType.sImage + "75";
	}

	if (sDmgImage) {
		var dmgPattern = oContext2D.createPattern(Images[sDmgImage], "repeat");
		oContext2D.fillStyle = dmgPattern;
		oContext2D.fill();
	}
};

/**
 * @public
 * @return {boolean}
 */
BodyViewObject.prototype.isDestroyed = function() {
	if (this.mdModelObject.isDestroyed
			&& this.mdModelObject.isDestroyed()) {
		return true;
	}
	return false;
};

/**
 * @private
 * @param oContext2D
 * @param {number} x
 * @param {number} y
 */
BodyViewObject.prototype.drawShadow = function(/* CanvasRenderingContext2D */oContext2D, x, y) {
	// A implémenter
};
