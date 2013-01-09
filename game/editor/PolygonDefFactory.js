/**
 * @constructor
 * @implements {GODFactory}
 */
function PolygonDefFactory (oContext2D) {
	/**
	 * @private
	 * @type {string}
	 */
	this.sType = undefined;
	
	/**
	 * @private
	 */
	this.oContext2D = oContext2D; 
	
	/**
	 * @private
	 * @type {Array<XY>}
	 */
	this.aPoints = new Array();
	
	/**
	 * @private
	 * @type {XY}
	 */
	this.mdMouseMovePos = undefined;
	
	/**
	 * Est-on en train de dessiner ?
	 * @private
	 * @type {boolean}
	 */
	this.bIsDrawing = false;
	
	/**
	 * Le GameObjectDef courant
	 * @private
	 */
	this.mdGod = undefined;
};

/**
 * Set le centre du cercle
 * @override
 */
PolygonDefFactory.prototype.mouseDown = function(mdPos){
};

/**
 * Set le rayon du cercle. Le cercle ne doit pas sortir de l'éditeur !
 * @override
 */
PolygonDefFactory.prototype.mouseUp = function(mdPos){
	if (this.isDrawing() == false){
		this.setDrawingOn();
	}
	this.aPoints.push(mdPos);
	if (this.aPoints.length >= 10){
		this.setDrawingOff();
	}
	this.draw();
};

/**
 * gère le mouse leave
 * @override
 */
PolygonDefFactory.prototype.mouseLeave = function(mdPos,bMouseDown){
	if (this.isDrawing() == true ){
		this.setDrawingOff();
	}
};

/**
 * gère le mouse move
 * @override
 */
PolygonDefFactory.prototype.mouseMove = function(mdPos,bMouseDown){
	if (this.isDrawing() == true && bMouseDown == false){
		this.mdMouseMovePos = mdPos;
		this.draw();	
	}
};

/**
 * set le type courant
 * @override
 */
PolygonDefFactory.prototype.setType = function(sType){
	this.sType = sType;
	this.setDrawingOff();	
};

/**
 * @private
 */
PolygonDefFactory.prototype.setDrawingOn = function (){
	this.bIsDrawing = true;
	this.aPoints = new Array();
	this.mdMouseMovePos = new XY(0,0);
};

/**
 * @private
 */
PolygonDefFactory.prototype.setDrawingOff  = function(){
	this.bIsDrawing = false;
	this.mdGod = newPolygonGOD(this.aPoints,Constants.CANVAS_EDITOR_DRAW_FACTOR,this.sType);
	if (!this.mdGod){
		this.mdGod = newPolygonGOD([{x: 0, y: -0.6}, {x: 0.6, y: 0.6}, {x: -0.6, y:0.6}],1,this.sType);
	}
	this.aPoints = new Array();
	// Transformer le tableau de points du mdGod en points d'affichage
	for (var i =0 ; i < this.mdGod.aPoints.length ; i++ ){
		var mdCurPoint = new XY(Constants.CANVAS_EDITOR.width / 2, Constants.CANVAS_EDITOR.height / 2);
		mdCurPoint.x += this.mdGod.aPoints[i].x * Constants.CANVAS_EDITOR_DRAW_FACTOR;
		mdCurPoint.y += this.mdGod.aPoints[i].y * Constants.CANVAS_EDITOR_DRAW_FACTOR;
		this.aPoints.push(mdCurPoint);
	}
	
	this.mdMouseMovePos = undefined;
	this.draw();
};

/**
 * @private
 * @return {boolean}
 */
PolygonDefFactory.prototype.isDrawing = function(){
	return this.bIsDrawing;
};


/**
 * affiche le GOD
 * @override
 */
PolygonDefFactory.prototype.draw = function(){
	var oType = GODTypeConstants[this.sType];
	
	var aTmpPoints = this.aPoints;
	
	var pattern = this.oContext2D.createPattern(Images[oType.sImage], "repeat");
	var nLineWidth = roundPosition(oType.nLineWidth * Constants.CANVAS_EDITOR_DRAW_FACTOR);
	
	this.oContext2D.clearRect(0, 0, Constants.CANVAS_EDITOR.width,
			Constants.CANVAS_EDITOR.height);

	this.oContext2D.save();
	this.oContext2D.beginPath();
	this.oContext2D.moveTo(aTmpPoints[0].x, aTmpPoints[0].y);
	for ( var j = 1; j < aTmpPoints.length; j++) {
		this.oContext2D.lineTo(aTmpPoints[j].x, aTmpPoints[j].y);
	}
	if (this.mdMouseMovePos){
		this.oContext2D.lineTo(this.mdMouseMovePos.x, this.mdMouseMovePos.y);
	}
	this.oContext2D.lineTo(aTmpPoints[0].x, aTmpPoints[0].y);
	this.oContext2D.closePath();
	this.oContext2D.lineWidth = nLineWidth;
	this.oContext2D.lineJoin = GODShapeConstants['polygon'].sLineJoin;
	this.oContext2D.strokeStyle = oType.sStrokeStyle;
	this.oContext2D.stroke();
	this.oContext2D.fillStyle = pattern;
	this.oContext2D.fill();
	this.oContext2D.restore();
};

/**
 * Retourne la forme créée
 * @override
 */
PolygonDefFactory.prototype.getCurrentGOD = function(){
	return this.mdGod;
};
