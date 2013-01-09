/**
 * @constructor
 * @extends {BodyViewObject}
 */
function PolygonViewObject (oContext2D, mdBoxModelObjectParam) {
	BodyViewObject.call(this,oContext2D,mdBoxModelObjectParam);
	/**
	 * @private
	 * @type {number}
	 */
	this.nSize = this.mdModelObject.getSize() * Constants.DRAW_FACTOR;
	/**
	 * @private
	 */
	this.aPoints = new Array();
	/**
	 * @private
	 */
	var aModelPoints = this.mdModelObject.getPoints();
	
	// Calcul des positions des points en prenant en compte les épaisseurs de lignes
	for ( var i = 0; i < aModelPoints.length; i++) {
		var mdModelXY = aModelPoints[i];
		var mdXY = new XY(mdModelXY.x * Constants.DRAW_FACTOR, mdModelXY.y * Constants.DRAW_FACTOR);
		if (mdXY.x > 0){
			mdXY.x -=  this.nLineWidth/2;
		}else if (mdXY.x < 0){
			mdXY.x +=  this.nLineWidth/2;
		}

		if (mdXY.y > 0){
			mdXY.y -=  this.nLineWidth/2;
		}else if (mdXY.y < 0){
			mdXY.y +=  this.nLineWidth/2;
		}
		
		this.aPoints[i] = mdXY;
	}
};

inherits(PolygonViewObject, BodyViewObject);

/**
 * @override
 */
PolygonViewObject.prototype.isInCanvas = function(nScrollX, nScrollY, nDrawScale) {
	var nTopLeftX = (this.mdModelObject.getPosition().x * Constants.DRAW_FACTOR) - this.nSize/2;
	var nTopLeftY = (this.mdModelObject.getPosition().y * Constants.DRAW_FACTOR) - this.nSize/2;
	return this.isInCanvasProtected(nTopLeftX, nTopLeftY, this.nSize, nScrollX,
			nScrollY, nDrawScale);
};


/**
 * @override
 */
PolygonViewObject.prototype.draw = function(nDeltaTime, oContext2D, nScrollX, nScrollY) {
	var x = roundPosition(this.mdModelObject.getPosition().x
			* Constants.DRAW_FACTOR);
	var y = roundPosition(this.mdModelObject.getPosition().y
			* Constants.DRAW_FACTOR);

	oContext2D.save();
	oContext2D.translate(x, y);
	oContext2D.rotate(this.mdModelObject.getAngle());

	oContext2D.beginPath();
	oContext2D.moveTo(this.aPoints[0].x, this.aPoints[0].y);
	for ( var j = 1; j < this.aPoints.length; j++) {
		oContext2D.lineTo(this.aPoints[j].x, this.aPoints[j].y);
	}
	oContext2D.lineTo(this.aPoints[0].x, this.aPoints[0].y);
	oContext2D.closePath();
	oContext2D.lineWidth = this.nLineWidth;
	oContext2D.lineJoin = this.oShape.sLineJoin;
	oContext2D.strokeStyle = this.oType.sStrokeStyle;
	oContext2D.stroke();
	oContext2D.fillStyle = this.pattern;
	oContext2D.fill();

	this.drawDamage(oContext2D);
	this.drawShadow(oContext2D, x, y);

	oContext2D.restore();
};

/**
 * @override
 */
PolygonViewObject.prototype.drawShadow = function(oContext2D, x, y) {
	
	if(ConfigurationConstants.graphics.current.bDisplayShadows != true){
		return;
	}
	
	// Affichage de l'ombre
	
//	oContext2D.translate(this.mdCenterPos.x, this.mdCenterPos.y);
	var nAngleRaidans = this.getSunAngle(x, y);
	oContext2D.rotate(-this.mdModelObject.getAngle() + nAngleRaidans);
	var grd = oContext2D.createLinearGradient(0, this.nSize / 2, 0, 0);
	grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
	grd.addColorStop(0, "rgba(0, 0, 0, 0.6)");
	oContext2D.fillStyle = grd;
	oContext2D.fill();
};