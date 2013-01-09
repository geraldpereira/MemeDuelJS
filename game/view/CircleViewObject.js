/**
 * @constructor
 * @extends {BodyViewObject}
 */
function CircleViewObject (oContext2D, mdCircleModelObjectParam) {
	BodyViewObject.call(this,oContext2D,mdCircleModelObjectParam);
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nRadius = roundPosition((this.mdModelObject.getRadius() * Constants.DRAW_FACTOR) - (this.nLineWidth / 2));
	/**
	 * @private
	 * @type {number}
	 */
	this.nSize = 2 * this.mdModelObject.getRadius() * Constants.DRAW_FACTOR;
	

};
inherits(CircleViewObject, BodyViewObject);

/**
 * @override
 */
CircleViewObject.prototype.isInCanvas = function(nScrollX, nScrollY,nDrawScale){
	var nTopLeftX = (this.mdModelObject.getPosition().x * Constants.DRAW_FACTOR)-(this.nSize/2);
	var nTopLeftY = (this.mdModelObject.getPosition().y * Constants.DRAW_FACTOR)-(this.nSize/2);
	return this.isInCanvasProtected(nTopLeftX,nTopLeftY,this.nSize,nScrollX, nScrollY, nDrawScale);
};

/**
 * @override
 */
CircleViewObject.prototype.draw = function(nDeltaTime, oContext2D, nScrollX, nScrollY) {
	var x = roundPosition(this.mdModelObject.getPosition().x * Constants.DRAW_FACTOR);
	var y = roundPosition(this.mdModelObject.getPosition().y * Constants.DRAW_FACTOR);
	
	oContext2D.save();
	oContext2D.translate(x, y);
	oContext2D.rotate(this.mdModelObject.getAngle());
//	oContext2D.translate(-this.nRadius, -this.nRadius);
	oContext2D.beginPath();
	oContext2D.arc(0, 0, this.nRadius, 0, 2 * Math.PI, false);
	oContext2D.lineWidth = this.nLineWidth;
	oContext2D.strokeStyle = this.oType.sStrokeStyle;
	oContext2D.stroke();
	oContext2D.fillStyle = this.pattern;
	oContext2D.closePath();
	oContext2D.fill();

	// Affichage des dégats
	this.drawDamage(oContext2D);
	this.drawShadow(oContext2D, x, y);
	oContext2D.restore();
};

/**
 * @override
 */
CircleViewObject.prototype.drawShadow = function(oContext2D, x, y){
	if(ConfigurationConstants.graphics.current.bDisplayShadows != true){
		return;
	}
	
	var nAngleRaidans = this.getSunAngle(x, y);
//	oContext2D.translate(this.nRadius, this.nRadius);
	oContext2D.rotate(- this.mdModelObject.getAngle() + nAngleRaidans);
	var grd = oContext2D.createRadialGradient(0, -this.nRadius, 1, 0, -this.nRadius,
			1.8 * this.nRadius);
	grd.addColorStop(1, "rgba(0, 0, 0, 0.5)");
	grd.addColorStop(0.8, "rgba(0, 0, 0, 0.2)");
	grd.addColorStop(0.3, "rgba(0, 0, 0, 0.0)");
	oContext2D.fillStyle = grd;
	oContext2D.fill();
};