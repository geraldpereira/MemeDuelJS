/**
 * Cr�er les GameObjectDef � partir de ce qu'a s�lectionn� l'utilisateur dans les selet box
 * @interface
 */
function GODFactory () {
};

/**
 * g�re le mouse down
 * @public
 * @param {XY} mdPos the position
 */
GODFactory.prototype.mouseDown = function(mdPos){};

/**
 * g�re le mouse up
 * @public
 * @param {XY} mdPos the position
 */
GODFactory.prototype.mouseUp = function(mdPos){};

/**
 * g�re le mouse move
 * @public
 * @param {XY} mdPos the position
 * @param {boolean} bMouseDown bouton enfonc� ?
 */
GODFactory.prototype.mouseMove = function(mdPos,bMouseDown){};

/**
 * affiche le GOD
 * @public
 * @param oContext2D le canvas
 */
GODFactory.prototype.draw = function(){};

/**
 * set le type courant
 * @public
 * @param oType le type d'objet a dessiner ('wood', 'stone', ...)
 */
GODFactory.prototype.setType = function(oType){};

/**
 * Retourne la forme cr��e
 * @public
 * 
 */
GODFactory.prototype.getCurrentGOD = function(){};

