/**
 * @constructor
 * @implements {GODFactory}
 */
function BoxDefFactory (oContext2D) {
	/**
	 * @private
	 * @type {XY}
	 */
	this.oPosCenter = new XY(Constants.CANVAS_EDITOR.width / 2, Constants.CANVAS_EDITOR.height / 2);
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMaxWidth = Constants.CANVAS_EDITOR.width;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMinWidth = this.nMaxWidth/5;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMaxHeight = Constants.CANVAS_EDITOR.height;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nMinHeight = this.nMaxHeight/5;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nWidth = this.nMaxWidth / 2;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nHeight = this.nMaxHeight / 3;
	
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
BoxDefFactory.prototype.mouseDown = function(mdPos){
	this.handleMouse(mdPos);		
};

/**
 * Set le rayon du cercle. Le cercle ne doit pas sortir de l'éditeur !
 * @override
 */
BoxDefFactory.prototype.mouseUp = function(mdPos){
	this.handleMouse(mdPos);
};

/**
 * gère le mouse move
 * @override
 */
BoxDefFactory.prototype.mouseMove = function(mdPos,bMouseDown){
	if (bMouseDown == true){
		this.handleMouse(mdPos);
	}
};

/**
 * gère le mouse leave
 * @override
 */
BoxDefFactory.prototype.mouseLeave = function(mdPos,bMouseDown){
	if (bMouseDown == true){
		this.handleMouse(mdPos);
	}
};


/**
 * gère le mouse move
 * @private
 * @param {XY}
 */
BoxDefFactory.prototype.handleMouse = function(mdPos){
	this.nWidth = 2 * Math.abs(this.oPosCenter.x - mdPos.x);
	this.nHeight = 2 * Math.abs(this.oPosCenter.y - mdPos.y);	

	if (this.nHeight > this.nWidth){
		this.nHeight = this.nWidth;
	}
	
	if (this.nWidth > this.nMaxWidth){
		this.nWidth = this.nMaxWidth;
	}else if (this.nWidth < this.nMinWidth){
		this.nWidth = this.nMinWidth;
	}
	
	if (this.nHeight > this.nMaxHeight){
		this.nHeight = this.nMaxHeight;
	}else if (this.nHeight < this.nMinHeight){
		this.nHeight = this.nMinHeight;
	}
	
	this.draw();	
};

/**
 * set le type courant
 * @override
 */
BoxDefFactory.prototype.setType = function(sType){
	this.sType = sType;
	this.draw();	
};


/**
 * affiche le GOD
 * @override
 */
BoxDefFactory.prototype.draw = function(){
	var oType = GODTypeConstants[this.sType];
	
	var pattern = this.oContext2D.createPattern(Images[oType.sImage], "repeat");
	var nLineWidth = roundPosition(oType.nLineWidth * Constants.CANVAS_EDITOR_DRAW_FACTOR);
	
	var oPosTopLeft = new XY(this.oPosCenter.x - ((this.nWidth - nLineWidth)/2), this.oPosCenter.y - ((this.nHeight - nLineWidth)/2));
	
	this.oContext2D.clearRect(0, 0, Constants.CANVAS_EDITOR.width,
			Constants.CANVAS_EDITOR.height);
	this.oContext2D.save();
	this.oContext2D.beginPath();
	this.oContext2D.rect(oPosTopLeft.x, oPosTopLeft.y, this.nWidth - nLineWidth, this.nHeight - nLineWidth);
	this.oContext2D.lineWidth = nLineWidth;
	this.oContext2D.lineJoin = GODShapeConstants['box'].sLineJoin;
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
BoxDefFactory.prototype.getCurrentGOD = function(){
	var mdGod = {};
	mdGod.sShape = 'box';
	mdGod.sType = this.sType;
	mdGod.nWidth = this.nWidth / Constants.CANVAS_EDITOR_DRAW_FACTOR;
	mdGod.nHeight = this.nHeight / Constants.CANVAS_EDITOR_DRAW_FACTOR;
	return mdGod;
};
