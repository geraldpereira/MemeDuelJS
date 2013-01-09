/**
 * 
 * @constructor
 * @param {EditorView}
 */
function EditorController() {
	
	/**
	 * @private
	 * @type {boolean}
	 */
	var bMouseDown = false;
	
	/**
	 * @private
	 */
	var oContext2D = Constants.CANVAS_EDITOR.getContext('2d');
	
	/**
	 * La factory courante
	 * @private
	 * @type {GODFactory}
	 */
	var mdCurrentGodFactory = undefined;
	
	/**
	 * La factory de cercle 
	 * @private
	 * @type {CircleDefFactory}
	 */
	var mdCircleDefFactory = new CircleDefFactory(oContext2D);
	
	/**
	 * La factory de rectangle
	 * @private
	 * @type {BoxDefFactory}
	 */
	var mdBoxDefFactory = new BoxDefFactory(oContext2D);
	
	 /**
	 * La factory de polygone 
	 * @private
	 * @type {PolygonDefFactory}
	 */
	var mdPolygonDefFactory = new PolygonDefFactory(oContext2D);
	
	/**
	 * Retourne la position de la souris dans le canvas d'édition 
	 * @private
	 * @param event
	 * @return {XY}
	 */
	var getXYInCanvas = function(event){
		var el = Constants.CANVAS_EDITOR;
		var mdXYInScreen = new XY(event.clientX, event.clientY);

		var mdCurOffset = new XY(el.scrollLeft - el.offsetLeft,el.scrollTop - el.offsetTop);
		while (el = el.offsetParent) {
			mdCurOffset.x += el.scrollLeft - el.offsetLeft;
			mdCurOffset.y += el.scrollTop - el.offsetTop;
		}

		var mdXYInCanvas = new XY(mdXYInScreen.x + mdCurOffset.x,  mdXYInScreen.y + mdCurOffset.y);
		return mdXYInCanvas;
	};
	
	// Faudra modifier ca par les types retournées par le serveur
	var aTypesAvailable = ['wood','stone'];
	var nCurrentType = 0;
	
	var initSelectedType = function(){
		var oShapeDiv = $('#type');
		var sSelectedType = aTypesAvailable[nCurrentType];
		oShapeDiv.addClass('game-editor-type-'+sSelectedType);
		mdCurrentGodFactory.setType(sSelectedType);
	};
	
	/**
	 * @private
	 */
	var handleTypeSelected = function (){
		var oTypeDiv = $('#type');
		oTypeDiv.removeClass('game-editor-type-'+aTypesAvailable[nCurrentType]);
		nCurrentType++;
		if (nCurrentType >= aTypesAvailable.length){
			nCurrentType = 0;
		}
		var sSelectedType = aTypesAvailable[nCurrentType];
		oTypeDiv.addClass('game-editor-type-'+sSelectedType);
		mdCurrentGodFactory.setType(sSelectedType);
	};
	
	// Faudra modifier ca par les formes retournées par le serveur
	var aShapesAvailable = ['circle','polygon','box'];
	var nCurrentShape = 0;
	
	var setCurrentGodFactory = function (){
		var sSelectedShape = aShapesAvailable[nCurrentShape];
		if (sSelectedShape == "box"){
			mdCurrentGodFactory = mdBoxDefFactory;
		}else if (sSelectedShape == "circle"){
			mdCurrentGodFactory = mdCircleDefFactory;
		}else if (sSelectedShape == "polygon"){
			mdCurrentGodFactory = mdPolygonDefFactory;
		}
	};
	
	var initSelectedShape = function(){
		var oShapeDiv = $('#shape');
		oShapeDiv.addClass('game-editor-shape-'+aShapesAvailable[nCurrentShape]);
		setCurrentGodFactory();
	};
	/**
	 * @private
	 */
	var handleShapeSelected = function (){
		var oShapeDiv = $('#shape');
		oShapeDiv.removeClass('game-editor-shape-'+aShapesAvailable[nCurrentShape]);
		nCurrentShape++;
		if (nCurrentShape >= aShapesAvailable.length){
			nCurrentShape = 0;
		}
		oShapeDiv.addClass('game-editor-shape-'+aShapesAvailable[nCurrentShape]);
		setCurrentGodFactory();
		// on met aussi a jour le type automatiquement
		var sSelectedType = aTypesAvailable[nCurrentType];
		mdCurrentGodFactory.setType(sSelectedType);
	};
	
	/**
	 * Gère le déplacement de la souris, uniquement lorsque le bouton est
	 * enfoncé
	 * @private
	 * @param event
	 */
	var handleMouseMove = function(/* MouseEvent */event) {
		var mdPosMove = getXYInCanvas(event);
		mdCurrentGodFactory.mouseMove(mdPosMove,bMouseDown);
	};

	/**
	 * Gère le début du click souris (bouton enfoncé)
	 * @private
	 * @param event
	 */
	var handleMouseDown = function(/* MouseEvent */event) {
		bMouseDown = true;
		var mdPosDown = getXYInCanvas(event);
		mdCurrentGodFactory.mouseDown(mdPosDown);
	};
	
	/**
	 * Gère la sortie de la sortie du canvas
	 * @private
	 * @param event
	 */
	var handleMouseLeave = function(event) {
		var mdPosMove = getXYInCanvas(event);
		mdCurrentGodFactory.mouseLeave(mdPosMove,bMouseDown);
	};

	/**
	 * Gère la fin du click souris (bouton relaché)
	 * @private
	 * @param event
	 */
	var handleMouseUp = function(/* MouseEvent */event) {
		bMouseDown = false;
		var mdPosUp = getXYInCanvas(event);
		mdCurrentGodFactory.mouseUp(mdPosUp);
		
	};	
	
	// Initialise les listeners
	var $canvas = $('#canvas_editor');
	$canvas.mouseup(handleMouseUp);
	$canvas.mousedown(handleMouseDown);
	$canvas.mousemove(handleMouseMove);
	$canvas.mouseleave(handleMouseLeave);
	
	$('#type').click(handleTypeSelected);
	$('#shape').click(handleShapeSelected);
	
	// Le bouton pour afficher / masquer le paneau d'edition
	$("#game_editor_toggle").click(function(){
		if ($("#editor:first").is(":hidden")) {
	      $("#editor").slideDown("slow");
	    } else {
	      $("#editor").slideUp();
	    }
		
	});
	
	// Désactiver le curseur de sélection text 
	Constants.CANVAS_EDITOR.onselectstart = function () { return false; };// ie
	Constants.CANVAS_EDITOR.onmousedown = function () { return false; }; // mozilla
	
	initSelectedShape();
	initSelectedType();
	
	/**
	 * Retourne la forme créée
	 * @public
	 */
	EditorController.prototype.getGameObjectDef = function(){
		return mdCurrentGodFactory.getCurrentGOD();
	};
};
