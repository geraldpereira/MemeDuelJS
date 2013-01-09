/**
 * @param {model} mdModelParam
 * @constructor
 */
function View (mdModelParam) {
	/**
	 * @private
	 * @type {Array.<DynamicViewObject>}
	 */
	this.aDynamicViewObjects = new Array();
	
	/**
	 * @private
	 * @type {Array.<DynamicViewObject>}
	 */
	this.aParticleViewObjects = new Array();
	
	/**
	 * @private
	 * @type {Array.<StaticViewObject>}
	 */
	this.aStaticUnderViewObjects = new Array();
	
	/**
	 * @private
	 * @type {Array.<StaticViewObject>}
	 */
	this.aStaticOverViewObjects = new Array();
	
	/**
	 * References to the 2D context of the canvas elements
	 * @private
	 * @type CanvasRenderingContext2D
	 */
	this.oContext2D = null;
	/**
	 * @private
	 */
	this.oStaticUnderBufferContext2D = null;
	/**
	 * @private
	 */
	this.oDynamicBufferContext2D = null;
	/**
	 * @private
	 */
	this.oStaticOverBufferContext2D = null;
	
	/**
	 * A reference to the in-memory canvas used as a back buffer
	 * @private
	 * @type HTMLCanvasElement
	 */
	this.oDynamicBufferCanvas = null;
	/**
	 * @private
	 */
	this.oStaticUnderBufferCanvas = null;
	/**
	 * @private
	 */
	this.oStaticOverBufferCanvas = null;
	
	/**
	 * True if the canvas element is supported, false otherwise
	 * @private
	 * @type {boolean}
	 */
	this.bCanvasSupported = false;

	/**
	 * The global scrolling value
	 * @private
	 * @type {XY}
	 */
	this.mdScroll = new XY(0,0);
	
	/**
	 * L'inertie du déplacement de la vue lors du scroll
	 * @private
	 * @type {XY}
	 */
	this.mdScrollInertia = undefined;
	
	/**
	 * The global maximum scrolling value
	 * @private
	 * @type {XY}
	 */
	this.mdMaxScroll = new XY(0,0);
	/**
	 * The time that the last frame was rendered
	 * @private
	 * @type {number}
	 */
	this.dLastFrame = new Date().getTime();
	
	/**
	 * l'echelle courante d'affichage
	 * @private
	 * @type {number}
	 */
	this.nDrawScale = Constants.CANVAS_DRAW_SCALE;

	/**
	 * La console
	 * @private
	 * @type {ConsoleViewObject}
	 */
	this.mdConsoleViewObject = new ConsoleViewObject();

	/**
	 * @private
	 * @type {Model}
	 */
	this.mdModel = mdModelParam;
	
	// S'ajouter en tant que listener du modèle
	this.mdModel.addListener(this);

	// if the this.canvas.getContext function does not exist it is a safe
	// bet that
	// the current browser does not support the canvas element.
	// in this case we don't go any further, which will save some debuggers
	// (like
	// the IE8 debugger) from throwing up a lot of errors.
	if (Constants.CANVAS.getContext) {
		this.bCanvasSupported = true;
		
		this.graphicConfigurationUpdated();
		
		// Initialiser la vue avec un panneau Loading
		this.oContext2D.save();
		this.oContext2D.font = "40pt Calibri";
		this.oContext2D.fillStyle = "#0000ff"; // text color
		this.oContext2D.fillText("Loading ...", 100,100);
		this.oContext2D.restore();
	}
};

/**
 * Initialise les canvas et contexte au debut de jeu ou lors d'une changement de résolution
 * @private
 */
View.prototype.initCanvasAndContext = function(){
	this.oContext2D = Constants.CANVAS.getContext('2d');
	this.oDynamicBufferCanvas = document.createElement('canvas');
	this.oDynamicBufferCanvas.width = Constants.CANVAS.width;
	this.oDynamicBufferCanvas.height = Constants.CANVAS.height;
	this.oDynamicBufferContext2D = this.oDynamicBufferCanvas.getContext('2d');
	
	this.oStaticUnderBufferCanvas = document.createElement('canvas');
	this.oStaticUnderBufferCanvas.width = Constants.CANVAS.width;
	this.oStaticUnderBufferCanvas.height = Constants.CANVAS.height;
	this.oStaticUnderBufferContext2D = this.oStaticUnderBufferCanvas.getContext('2d');
	
	this.oStaticOverBufferCanvas = document.createElement('canvas');
	this.oStaticOverBufferCanvas.width = Constants.CANVAS.width;
	this.oStaticOverBufferCanvas.height = Constants.CANVAS.height;
	this.oStaticOverBufferContext2D = this.oStaticOverBufferCanvas.getContext('2d');
};

/**
 * @public
 */
View.prototype.graphicConfigurationUpdated = function (){
	var mdConfig = ConfigurationConstants.graphics.current;
	var bForceScrollY = Constants.CANVAS.height != mdConfig.nHeight;
	Constants.CANVAS.width = mdConfig.nWidth;
	Constants.CANVAS.height = mdConfig.nHeight;
	this.initCanvasAndContext();
	this.setDrawScale(this.nDrawScale);
	if (bForceScrollY){
		this.updateScrollY(this.mdMaxScroll.y);
	}
	this.refreshStaticBuffers();
};

/**
 * @public
 */
View.prototype.loadEnv = function() {
	if (ConfigurationConstants.graphics.current.bDisplayEnv == true){
		// Ajout du soleil
		var mdSunViewObject = new SunViewObject();
		this.addDynamicViewObjects(mdSunViewObject);

		// Ajout du fond
		var mdForegroundViewObject = new PerspectiveViewObject(GODEnvConstants.foreground);
		this.addStaticUnderViewObject(mdForegroundViewObject);

		var mdMiddlegroundViewObject = new PerspectiveViewObject(GODEnvConstants.middleground);
		this.addStaticUnderViewObject(mdMiddlegroundViewObject);

		var mdMiddleground2ViewObject = new PerspectiveViewObject(GODEnvConstants.middleground2);
		this.addStaticUnderViewObject(mdMiddleground2ViewObject);

		var mdBackgroundViewObject = new PerspectiveViewObject(GODEnvConstants.background);
		this.addStaticUnderViewObject(mdBackgroundViewObject);
	}

	// Ajout du sol
	var mdGroundViewObject = new RepeatXViewObject(GODEnvConstants.ground);
	this.addStaticOverViewObject(mdGroundViewObject);

	// Initialiser le scroll
	this.setDrawScale(this.nDrawScale);
	this.updateScrollY(this.mdMaxScroll.y);
	this.refreshStaticBuffers();
};

/**
 * @public
 * @param {ModelObject} mdModelObject
 */
View.prototype.objectAdded = function(mdModelObject) {
	var mdGod = mdModelObject.getGameObjectDef();
	if (mdGod.sShape == "circle") {
		var mdCircleViewObject = new CircleViewObject(this.oContext2D,mdModelObject);
		this.addDynamicViewObjects(mdCircleViewObject);
	} else if (mdGod.sShape == "box") {
		var mdBoxViewObject = new BoxViewObject(this.oContext2D,mdModelObject);
		this.addDynamicViewObjects(mdBoxViewObject);
	}else if (mdGod.sShape == "polygon" || mdGod.sShape == "fragment") {
		var mdPolygonViewObject = new PolygonViewObject(this.oContext2D,mdModelObject);
		this.addDynamicViewObjects(mdPolygonViewObject);
	}
};

/**
 * @public
 * @param {XY} mdExplosionPosition
 * @param {string} sType le type de l'objet ayant exlposé
 */
View.prototype.objectExploded = function(mdExplosionPosition, sType) {
	var oType = GODTypeConstants[sType];
	var sImage = oType.sImage + "Particles";
	// un peu de random dans les delta des particules (en metres)
	var nDeltaX = 0.5 - Math.random();
	var nDeltaY = 0.5 + Math.random();
	// Nombre d'images par seconde
	var nFrameCount = 20;
	var nFPS = 30;
	mdAnimatedViewObject = new AnimatedViewObject(mdExplosionPosition, nDeltaX, nDeltaY, sImage,nFrameCount,nFPS);
	this.addParticleViewObjects(mdAnimatedViewObject);
};

/**
 * @public
 * @param {number} nXPosition
 */
View.prototype.objectHitGround = function(nXPosition) {
	var sImage = "sandParticles"; // TODO A changer
	// un peu de random dans les delta des particules
	var nDeltaX = 0.5 - Math.random();
	var nDeltaY = - (0.5 + Math.random());
	// Nombre d'images par seconde
	var nFrameCount = 12;
	var nFPS = 30;
	
	mdPosition = new XY(nXPosition + nDeltaX, GODEnvConstants.ground.nPosY + 0.25);	
	mdAnimatedViewObject = new AnimatedViewObject(mdPosition, nDeltaX, nDeltaY, sImage,nFrameCount,nFPS);
	this.addParticleViewObjects(mdAnimatedViewObject);
};



/**
 * Adds a new GameObject to the aDynamicViewObjects collection
 * @private
 * @param {DynamicViewObject} mdViewObject
 */
View.prototype.addDynamicViewObjects = function(mdViewObject) {
	this.aDynamicViewObjects.push(mdViewObject);
	this.aDynamicViewObjects.sort(function(a, b) {
		return a.getZOrder() - b.getZOrder();
	});
};

/**
 * Adds a new GameObject to the aParticleViewObjects collection
 * @private
 * @param {DynamicViewObject} mdViewObject
 */
View.prototype.addParticleViewObjects = function(mdViewObject) {
	if (this.aParticleViewObjects.length < ConfigurationConstants.graphics.current.nParticles){
		this.aParticleViewObjects.push(mdViewObject);
		this.aParticleViewObjects.sort(function(a, b) {
			return a.getZOrder() - b.getZOrder();
		});		
	}
};


/**
 * Adds a new GameObject to the aDynamicViewObjects collection
 * @private
 * @param {StaticViewObject} mdViewObject
 */
View.prototype.addStaticUnderViewObject = function(/* GameObject */mdViewObject) {
	this.aStaticUnderViewObjects.push(mdViewObject);
	this.aStaticUnderViewObjects.sort(function(a, b) {
		return a.getZOrder() - b.getZOrder();
	});
};

/**
 * Adds a new GameObject to the aDynamicViewObjects collection
 * @private
 * @param {StaticViewObject} mdViewObject
 */
View.prototype.addStaticOverViewObject = function(mdViewObject) {
	this.aStaticOverViewObjects.push(mdViewObject);
	this.aStaticOverViewObjects.sort(function(a, b) {
		return a.getZOrder() - b.getZOrder();
	});
};

/**
 * @public
 */
View.prototype.update = function() {
	// calculate the time since the last frame
	var dThisFrame = new Date().getTime();
	var nDeltaTime = (dThisFrame - this.dLastFrame) / 1000;
	this.dLastFrame = dThisFrame;

	// clear the drawing contexts
	if (this.bCanvasSupported) {
		
		if (this.mdScrollInertia){
			var mdCurrentOffset = new XY(this.mdScrollInertia.x * 0.1, this.mdScrollInertia.y * 0.1);
			if (Math.abs(mdCurrentOffset.x) < 2 && Math.abs(mdCurrentOffset.y) < 2){
				this.mdScrollInertia = undefined;
			}else{
				this.mdScrollInertia.x -= roundPosition(mdCurrentOffset.x);
				this.mdScrollInertia.y -= roundPosition(mdCurrentOffset.y);
				this.updateScroll(mdCurrentOffset);	
			}
		}
		
		this.oDynamicBufferContext2D.clearRect(0, 0, this.oDynamicBufferCanvas.width,
				this.oDynamicBufferCanvas.height);
		this.oContext2D.clearRect(0, 0, Constants.CANVAS.width,
				Constants.CANVAS.height);

		this.oDynamicBufferContext2D.save();
		this.oDynamicBufferContext2D.translate(-this.mdScroll.x, -this.mdScroll.y);
		this.oDynamicBufferContext2D.scale(this.nDrawScale, this.nDrawScale);
		// Mettre a jour les objets dynamiques
		for ( var i = 0; i < this.aDynamicViewObjects.length; i++) {
			var mdViewObject = this.aDynamicViewObjects[i];
			if (mdViewObject){
				if (mdViewObject.isDestroyed()) {
					this.aDynamicViewObjects.splice(i,1);
					// On supprime un element du tableau, il ne faut donc pas avancer 
					i--;
				} else if (mdViewObject.isInCanvas(this.mdScroll.x, this.mdScroll.y,this.nDrawScale) == true) {
					mdViewObject.draw(nDeltaTime, this.oDynamicBufferContext2D,
							this.mdScroll.x, this.mdScroll.y);
				}				
			}
		}
		
		// Mettre a jour les particules
		for ( var i = 0; i < this.aParticleViewObjects.length; i++) {
			var mdViewObject = this.aParticleViewObjects[i];
			if (mdViewObject){
				if (mdViewObject.isDestroyed()) {
					this.aParticleViewObjects.splice(i,1);
					i--;
				} else if (mdViewObject.isInCanvas(this.mdScroll.x, this.mdScroll.y,this.nDrawScale) == true) {
					mdViewObject.draw(nDeltaTime, this.oDynamicBufferContext2D,
							this.mdScroll.x, this.mdScroll.y);
				}				
			}
		}
		
		this.oDynamicBufferContext2D.restore();
		// copy the back buffer to the displayed canvas
		this.oContext2D.drawImage(this.oStaticUnderBufferCanvas, 0, 0);
		this.oContext2D.drawImage(this.oDynamicBufferCanvas, 0, 0);
		this.oContext2D.drawImage(this.oStaticOverBufferCanvas, 0, 0);

		// Rafraichi la console
		this.mdConsoleViewObject.draw(nDeltaTime,this.mdScroll.x,this.mdScroll.y,this.nDrawScale);
	}
};

/**
 * @private
 */
View.prototype.refreshStaticBuffers = function() {
	this.oStaticOverBufferContext2D.clearRect(0, 0, this.oStaticOverBufferCanvas.width,
			this.oStaticOverBufferCanvas.height);
	this.oStaticOverBufferContext2D.save();
	this.oStaticOverBufferContext2D.translate(-this.mdScroll.x, -this.mdScroll.y);
	this.oStaticOverBufferContext2D.scale(this.nDrawScale, this.nDrawScale);
	// Mettre a jour les objets statiques
	for ( var i = 0; i < this.aStaticOverViewObjects.length; i++) {
		var mdViewObject = this.aStaticOverViewObjects[i];
		if (mdViewObject) {
			mdViewObject.draw(this.oStaticOverBufferContext2D, this.mdScroll.x,	this.mdScroll.y);
		}
	}
	this.oStaticOverBufferContext2D.restore();

	if (ConfigurationConstants.graphics.current.bDisplayEnv == true){
		this.oStaticUnderBufferContext2D.clearRect(0, 0, this.oStaticUnderBufferCanvas.width,
				this.oStaticUnderBufferCanvas.height);
		this.oStaticUnderBufferContext2D.save();
		this.oStaticUnderBufferContext2D.translate(-this.mdScroll.x, -this.mdScroll.y);
		this.oStaticUnderBufferContext2D.scale(this.nDrawScale, this.nDrawScale);
		// Mettre a jour les objets statiques
		for ( var i = 0; i < this.aStaticUnderViewObjects.length; i++) {
			var mdViewObject = this.aStaticUnderViewObjects[i];
			if (mdViewObject) {
				mdViewObject.draw(this.oStaticUnderBufferContext2D, this.mdScroll.x,
						this.mdScroll.y);
			}
		}
		
		this.oStaticUnderBufferContext2D.restore();
	}
};

/**
 * @public
 * @return {XY}
 */
View.prototype.getScroll = function() {
	return this.mdScroll;
};

/**
 * @public
 * @param {XY} oOffset
 */
View.prototype.updateScroll = function(oOffset) {
	var bScrollUpdated = false;
	// Mettre à jour les scroll lors du DND de la souris
	if (oOffset.x != 0) {
		this.updateScrollX(this.mdScroll.x + oOffset.x);
		bScrollUpdated = true;
	}
	if (oOffset.y != 0) {
		this.updateScrollY(this.mdScroll.y + oOffset.y);
		bScrollUpdated = true;
	}
	if (bScrollUpdated == true) {
		this.refreshStaticBuffers();
	}
};

/**
 * @public
 * @param {XY} oOffset
 */
View.prototype.setScrollInertia = function(oOffset) {
	if (oOffset){
		this.mdScrollInertia = oOffset;
		this.mdScrollInertia.x = this.mdScrollInertia.x * 20;
		this.mdScrollInertia.y = this.mdScrollInertia.y * 20;
	}else{
		this.mdScrollInertia = undefined;
	}
};


/**
 * @public
 * @return {number}
 */
View.prototype.getDrawScale = function() {
	return this.nDrawScale;
};
/**
 * @public
 * @param {number} nNewDrawScale
 * @param {MousePosition} mdMousePosition
 */
View.prototype.setDrawScale = function(nNewDrawScale, mdMousePosition) {
	var nOldDrawScaleParam = this.nDrawScale;
	this.nDrawScale = nNewDrawScale;

	// update the maxmimum scroll values
	this.mdMaxScroll.x = roundPosition((GODEnvConstants.world.nWidth
			* Constants.DRAW_FACTOR * this.nDrawScale)
			- Constants.CANVAS.width);
	this.mdMaxScroll.y = roundPosition((GODEnvConstants.world.nHeight
			* Constants.DRAW_FACTOR * this.nDrawScale)
			- Constants.CANVAS.height);

	var xScaledScroll = (this.mdScroll.x * this.nDrawScale / nOldDrawScaleParam);
	this.updateScrollX(xScaledScroll);

	var yScaledScroll = (this.mdScroll.y * this.nDrawScale / nOldDrawScaleParam);
	// Pour que quand on zoom, la vue aille vers le bas
	if (nOldDrawScaleParam < this.nDrawScale) {
		yScaledScroll = yScaledScroll + 20; // 10; ca c'était avec un delta/100 dans le controller
	}
	this.updateScrollY(yScaledScroll);
	this.refreshStaticBuffers();
};

/**
 * @private
 * @param {number} scrollValue
 */
View.prototype.updateScrollX = function(scrollValue) {
	this.mdScroll.x = roundPosition(scrollValue);
	if (this.mdScroll.x < 0) {
		this.mdScroll.x = 0;
	} else if (this.mdScroll.x > this.mdMaxScroll.x) {
		this.mdScroll.x = this.mdMaxScroll.x;
	}
};

/**
 * @private
 * @param {number} scrollValue
 */
View.prototype.updateScrollY = function(scrollValue) {
	this.mdScroll.y = roundPosition(scrollValue);
	if (this.mdScroll.y < 0) {
		this.mdScroll.y = 0;
	} else if (this.mdScroll.y > this.mdMaxScroll.y) {
		this.mdScroll.y = this.mdMaxScroll.y;
	}
};

/**
 * @public
 */
View.prototype.debug = function() {
	for ( var i = 0; i < this.aDynamicViewObjects.length; i++) {
		var mdViewObject = this.aDynamicViewObjects[i];
		if (mdViewObject) {
			console.log(mdViewObject);
		}
	}
};