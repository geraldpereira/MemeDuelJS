/**
 * Controlleur principal de l'application
 * @param {Model} mdModel
 * @param {view} mdView
 * @constructor
 */
function Controller(mdModelParam, mdViewParam) {
	/**
	 * @private
	 * @type {Model}
	 */
	var mdModel = mdModelParam;
	
	/**
	 * @private
	 * @type {View}
	 */
	var mdView = mdViewParam;
	
	/**
	 * Position courante de la souris
	 * @private
	 * @type {MousePosition}
	 */
	var mdMousePosition = new MousePosition(mdView);

	/**
	 * Le controller d'edition de GOD
	 * @private
	 * @type {EditorController}
	 */
	var mdEditorController = undefined;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	var bMouseDown = false;
	
	/**
	 * True si on a effectué un scroll entre le mouse deown et le up
	 * @private
	 * @type {boolean}
	 */
	var bScrolled = false;
	
	/**
	 * @private
	 * @type {XY}
	 */
	var mdLastOffset = undefined;
	
	/**
	 * @private
	 * @param {string} newCursor
	 */
	var changeCursor = function (newCursor){
		Constants.CANVAS.style.cursor = newCursor;
	};

	/**
	 * Gère le déplacement de la souris, uniquement lorsque le bouton est
	 * enfoncé
	 * @private
	 * @param event
	 */
	var handleMouseMove = function(/* MouseEvent */event) {
		if (bMouseDown){
			var bIsObjectSelected = mdModel.isSelectObject();
			if (!bIsObjectSelected){
				var oOffset = mdMousePosition.computeOffset(event);
				if (oOffset.x != 0 || oOffset.y != 0) {
					oOffset.x = - oOffset.x;
					oOffset.y = - oOffset.y;
					mdLastOffset = oOffset;
					bScrolled = true;
					mdView.updateScroll(oOffset);
					mdView.setScrollInertia(undefined);
				}
				changeCursor("move");
			}else if (bIsObjectSelected){
				changeCursor("pointer");
			}
		}
		// Mise à jour de la position de la souris et du scroll
		mdMousePosition.setPosition(Constants.CANVAS, event);
	};
	
	/**
	 * Gère le début du click souris (bouton enfoncé)
	 * @private
	 * @param event
	 */
	var handleMouseDown = function(/* MouseEvent */event) {
		bMouseDown = true;
		// Mise à jour de la position de la souris
		mdMousePosition.setPosition(Constants.CANVAS, event);
		// Selection d'un objet du modèle
		var bObjectSelected = mdModel.selectObject(mdMousePosition);
		if (bObjectSelected){
			changeCursor("pointer");
		}
		bScrolled = false;
	};

	var handleMouseUp = function(/* MouseEvent */event) {
		bMouseDown = false;
		// Mise à jour de la position de la souris
		mdMousePosition.setPosition(Constants.CANVAS, event);
		// Déselection d'un objet du modèle
		var bObjectWasSelected = mdModel.unselectObject();
		if (!bObjectWasSelected && !bScrolled) {
			// Si aucun objet n'a été sélectionné, on ajoute un cercle
			createObject();
		}else if (bScrolled){
			mdView.setScrollInertia(mdLastOffset);
		}
		mdLastOffset = undefined;
		bScrolled = false;
		changeCursor("default");
	};

	/**
	 * Gère la sortie de la souris
	 * @private
	 * @param event
	 */
	var handleMouseLeave = function(/* MouseEvent */event) {
		if (bMouseDown == true){
			handleMouseUp(event);	
		}
	};
	
	/**
	 * @private
	 * @param event
	 */
	var handleKeyDown = function(/* KeyEvent */event) {
	};

	/**
	 * @private
	 * @param event
	 */
	var handleKeyUp = function(/* KeyEvent */event) {
		// debug d
		if (event.keyCode == 68) {
			// mdView.debug();
			var fruits = ["Banana", "Orange", "Apple", "Mango"];
			fruits.splice(2,1);
			console.log(fruits);
			console.log(counterClockWise (new XY(1,2),new XY(1,1),new XY(2,1)));
			console.log(counterClockWise (new XY(1,2),new XY(2,2),new XY(2,1)));
			console.log(counterClockWise (new XY(1,2),new XY(2,2),new XY(3,2)));
		}
	};

	/**
	 * Event handler for mouse wheel event.
	 * @private
	 * @param event
	 */
	var handleMouseWheel = function(event) {
		var delta = 0;
		if (!event) { /* For IE. */
			event = window.event;
		}
		if (event.wheelDelta) { /* IE/Opera. */
			delta = event.wheelDelta / 120;
		} else if (event.detail) {
			/** Mozilla case. */
			/**
			 * In Mozilla, sign of delta is different than in IE. Also,
			 * delta is multiple of 3.
			 */
			delta = -event.detail / 3;
		}
		/**
		 * If delta is nonzero, handle it. Basically, delta is now positive if
		 * wheel was scrolled up, and negative, if wheel was scrolled down.
		 */
		if (delta) {
			var bIsObjectSelected = mdModel.isSelectObject();
			if (bIsObjectSelected){
				// Faire tourner l'objet sélectionné sur lui même
				mdModel.rotateSelectedObject(delta);
			}else {
				// Mettre à jour l'échelle
				var nDrawScale = mdView.getDrawScale();
				nDrawScale += (delta/50);
				if (nDrawScale > Constants.CANVAS_MAX_DRAW_SCALE) {
					nDrawScale = Constants.CANVAS_MAX_DRAW_SCALE;
				} else if (nDrawScale < Constants.CANVAS_MIN_DRAW_SCALE) {
					nDrawScale = Constants.CANVAS_MIN_DRAW_SCALE;
				}
				mdView.setDrawScale(nDrawScale,mdMousePosition);
			}
		}
		/**
		 * Prevent default actions caused by mouse wheel. That might be ugly,
		 * but we handle scrolls somehow anyway, so don't bother here..
		 */
		if (event.preventDefault) {
			event.preventDefault();
		}
		event.returnValue = false;
	};

	/**
	 * @private
	 */
	var createObject = function() {
		var xInCanvasPx = mdMousePosition.getXYInCanvasPx().x;
		var yInCanvasPx = mdMousePosition.getXYInCanvasPx().y;
		if (xInCanvasPx >= 0 && xInCanvasPx <= Constants.CANVAS.width
				&& yInCanvasPx >= 0 && yInCanvasPx <= Constants.CANVAS.height) {
			var mdGod = mdEditorController.getGameObjectDef();
			mdModel.addObject(mdMousePosition, mdGod);
		}
	};
	
	var update = function (){
		requestAnimFrame(update);
		if (Images.bLoaded == true) {
			if (mdEditorController == undefined){
				mdEditorController = new EditorController();
			}
			mdModel.updateSelectedObject(mdMousePosition);
			mdModel.update();
			mdView.update();
		}
	};
	
	// Initialise les listeners
	var $canvas = $('#canvas');
	$canvas.mouseup(handleMouseUp);
	$canvas.mousedown(handleMouseDown);
	$canvas.mousemove(handleMouseMove);
	$canvas.mouseleave(handleMouseLeave);

	//http://upandcrawling.wordpress.com/2010/06/08/cool-jquery-stuff-for-beginners-part-1/
	$canvas.bind('DOMMouseScroll',function(event,delta) {
		handleMouseWheel(event.originalEvent);
	});
	$canvas.bind('mousewheel',function(event,delta) {
		handleMouseWheel(event.originalEvent);
	});
	$canvas.scroll(function(event,delta) {
		handleMouseWheel(event.originalEvent);
	});
	
		// watch for keyboard events
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	// Désactiver le curseur de sélection text 
	Constants.CANVAS.onselectstart = function () { return false; };// ie
	Constants.CANVAS.onmousedown = function () { return false; }; // mozilla
	
	// ET ON DECOLLLLEEEE !!!!
	update();
	
};


