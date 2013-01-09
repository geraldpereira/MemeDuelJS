/**
 * Dessine le soleil et le dégradé de fond
 * @constructor
 * @extends {DynamicViewObject}
 */
function SunViewObject() {
	DynamicViewObject.call(this,GODEnvConstants.sun.zOrder);
	
	this.nUpperPos = 0.8;
	this.nLowerPos = 0.4;
	this.nPos = this.nLowerPos;
	this.bAdd = true;
	
	this.nSunDiameter = Images['sun'].width;
	this.nSunRadius = roundPosition(this.nSunDiameter / 2);
	this.nSunGlowDiameter = this.nSunDiameter * 2;
	this.mdSunPosition = GODEnvConstants.sun.oPosition;
	
	this.nSize = this.nSunGlowDiameter * 2;
};
inherits(SunViewObject, DynamicViewObject);

/**
 * @override
 */
SunViewObject.prototype.isInCanvas = function(nScrollX, nScrollY,nDrawScale){
	var nTopLeftX = (this.mdSunPosition.x )-(this.nSize/2);
	var nTopLeftY = (this.mdSunPosition.y)-(this.nSize/2);
	return this.isInCanvasProtected(nTopLeftX,nTopLeftY,this.nSize,nScrollX, nScrollY, nDrawScale);
};

/**
 * @override
 */
SunViewObject.prototype.draw = function(nDeltaTime, oContext2D, nScrollX, nScrollY) {
	
	// Dessiner le soleil 
	oContext2D.save();
	oContext2D.translate(this.mdSunPosition.x,this.mdSunPosition.y);
	oContext2D.beginPath();
	oContext2D.arc(0, 0, this.nSunGlowDiameter, 0, 2 * Math.PI, false);
	var grd = oContext2D.createRadialGradient(0, 0, 1, 0, 0, this.nSunGlowDiameter);
	grd.addColorStop(0, "rgba(255, 120, 0, 1.0)");
	grd.addColorStop(this.nPos, "rgba(255, 209, 0, 0.0)");
	oContext2D.fillStyle = grd;
	oContext2D.fill();
	oContext2D.drawImage(Images['sun'], -this.nSunRadius,
			-this.nSunRadius,this.nSunDiameter, this.nSunDiameter);
	oContext2D.restore();
	
	var nToAdd = nDeltaTime / 10;
	if (this.bAdd){
		this.nPos +=nToAdd;
	}else{
		this.nPos -=nToAdd;
	}
	 
	if (this.nPos > this.nUpperPos){
		this.nPos = this.nUpperPos;
		this.bAdd = false;
	}else if (this.nPos < this.nLowerPos){
		this.nPos = this.nLowerPos;
		this.bAdd = true;
	}
};