/**
 * @constructor
 * @implements {GODFactory}
 */
function CircleDefFactory (oContext2D) {
	/**
	 * @private
	 * @type {XY}
	 */
	this.oPosCenter = new XY(Constants.CANVAS_EDITOR.width / 2, Constants.CANVAS_EDITOR.height / 2);
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMaxRadius = Math.min(this.oPosCenter.x,this.oPosCenter.y);
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMinRadius = this.nMaxRadius/5;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nRadius = this.nMaxRadius / 2;
	
	/**
	 * @private
	 * @type {string}
	 */
	this.sType = undefined;
	
	/**
	 * @private
	 */
	this.oContext2D = oContext2D; 
};

/**
 * Set le centre du cercle
 * @override
 */
CircleDefFactory.prototype.mouseDown = function(mdPos){
	this.handleMouse(mdPos);		
};

/**
 * Set le rayon du cercle. Le cercle ne doit pas sortir de l'éditeur !
 * @override
 */
CircleDefFactory.prototype.mouseUp = function(mdPos){
	this.handleMouse(mdPos);
};

/**
 * gère le mouse move
 * @override
 */
CircleDefFactory.prototype.mouseMove = function(mdPos,bMouseDown){
	if (bMouseDown == true){
		this.handleMouse(mdPos);
	}
};

/**
 * gère le mouse leave
 * @override
 */
CircleDefFactory.prototype.mouseLeave = function(mdPos,bMouseDown){
	if (bMouseDown == true){
		this.handleMouse(mdPos);
	}
};

/**
 * gère le mouse move
 * @private
 * @param {XY}
 */
CircleDefFactory.prototype.handleMouse = function(mdPos){
	var nWidth = this.oPosCenter.x - mdPos.x;
	var nHeight = this.oPosCenter.y - mdPos.y;	
	this.nRadius = Math.sqrt(Math.pow(nWidth, 2)+Math.pow(nHeight, 2));
	if (this.nRadius > this.nMaxRadius){
		this.nRadius = this.nMaxRadius;
	}else if (this.nRadius < this.nMinRadius){
		this.nRadius = this.nMinRadius;
	}
	this.draw();	
};

/**
 * set le type courant
 * @override
 */
CircleDefFactory.prototype.setType = function(sType){
	this.sType = sType;
	this.draw();	
};


/**
 * affiche le GOD
 * @override
 */
CircleDefFactory.prototype.draw = function(){
	var oType = GODTypeConstants[this.sType];
	
	var pattern = this.oContext2D.createPattern(Images[oType.sImage], "repeat");
	var nLineWidth = oType.nLineWidth * Constants.CANVAS_EDITOR_DRAW_FACTOR;
	
	this.oContext2D.clearRect(0, 0, Constants.CANVAS_EDITOR.width,
			Constants.CANVAS_EDITOR.height);
	this.oContext2D.save();
	this.oContext2D.beginPath();
	this.oContext2D.arc(this.oPosCenter.x,this.oPosCenter.y, this.nRadius - nLineWidth, 0, 2 * Math.PI, false);
	this.oContext2D.lineWidth = nLineWidth;
	this.oContext2D.strokeStyle = oType.sStrokeStyle;
	this.oContext2D.stroke();
	this.oContext2D.fillStyle = pattern;
	this.oContext2D.closePath();
	this.oContext2D.fill();
	this.oContext2D.restore();
};


/**
 * Retourne la forme créée
 * @override
 */
CircleDefFactory.prototype.getCurrentGOD = function(){
	var mdGod = {};
	mdGod.sShape = 'circle';
	mdGod.sType = this.sType;
	mdGod.nRadius = this.nRadius / Constants.CANVAS_EDITOR_DRAW_FACTOR;
	return mdGod;
};

