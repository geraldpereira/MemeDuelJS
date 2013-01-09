/**
 * @constructor
 * @extends {BodyViewObject}
 */
function BoxViewObject (oContext2D, mdBoxModelObjectParam) {
	BodyViewObject.call(this,oContext2D,mdBoxModelObjectParam);
	/**
	 * @private
	 * @type {number}
	 */
	this.nWidth = roundPosition((mdBoxModelObjectParam.getWidth() * Constants.DRAW_FACTOR)
			- this.nLineWidth);
	/**
	 * @private
	 * @type {number}
	 */
	this.nHeight = roundPosition((mdBoxModelObjectParam.getHeight() * Constants.DRAW_FACTOR)
			- this.nLineWidth);
	/**
	 * @private
	 * @type {number}
	 */
	this.nHalfWidth = roundPosition(this.nWidth / 2);
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nHalfHeight = roundPosition(this.nHeight / 2);

	/**
	 * @private
	 * @type {number}
	 */
	this.nSize = mdBoxModelObjectParam.getWidth() * Constants.DRAW_FACTOR;
	
};

inherits(BoxViewObject, BodyViewObject);

/**
 * @override
 */
BoxViewObject.prototype.isInCanvas = function(nScrollX, nScrollY, nDrawScale) {
	var nTopLeftX = (this.mdModelObject.getPosition().x * Constants.DRAW_FACTOR) - (this.nSize / 2);
	var nTopLeftY = (this.mdModelObject.getPosition().y * Constants.DRAW_FACTOR) - (this.nSize / 2);
	return this.isInCanvasProtected(nTopLeftX, nTopLeftY, this.nSize, nScrollX,
			nScrollY, nDrawScale);
};

/**
 * @override
 */
BoxViewObject.prototype.draw = function(/* Numder */nDeltaTime, /* CanvasRenderingContext2D */
		oContext2D, nScrollX, nScrollY) {
	var x = roundPosition(this.mdModelObject.getPosition().x
			* Constants.DRAW_FACTOR);
	var y = roundPosition(this.mdModelObject.getPosition().y
			* Constants.DRAW_FACTOR);

	oContext2D.save();
	oContext2D.translate(x, y);
	oContext2D.rotate(this.mdModelObject.getAngle());
	oContext2D.beginPath();
//	oContext2D.translate(-this.nHalfWidth, -this.nHalfHeight);
	oContext2D.rect(-this.nHalfWidth, -this.nHalfHeight, this.nWidth, this.nHeight);
	oContext2D.lineWidth = this.nLineWidth;
	oContext2D.lineJoin = this.oShape.sLineJoin;
	oContext2D.strokeStyle = this.oType.sStrokeStyle;
	oContext2D.stroke();
	oContext2D.fillStyle = this.pattern;
	oContext2D.closePath();
	oContext2D.fill();
	this.drawDamage(oContext2D);
	this.drawShadow(oContext2D, x, y);
	oContext2D.restore();
};

/**
 * @override
 */
BoxViewObject.prototype.drawShadow = function(/* CanvasRenderingContext2D */oContext2D, x, y) {
	if(ConfigurationConstants.graphics.current.bDisplayShadows != true){
		return;
	}
	
	// Affichage de l'ombre
//	oContext2D.translate(this.nHalfWidth,this.nHalfHeight);
	var nAngleRaidans = this.getSunAngle(x, y);
	oContext2D.rotate(-this.mdModelObject.getAngle() + nAngleRaidans);
	// Les box sont toujours plus larges que hautes !
	var grd = oContext2D.createLinearGradient(0, (this.nHeight+this.nWidth)/2, 0, 0);
	grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
	grd.addColorStop(0, "rgba(0, 0, 0, 0.8)");
	oContext2D.fillStyle = grd;
	oContext2D.fill();
};