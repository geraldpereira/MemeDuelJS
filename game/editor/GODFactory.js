/**
 * Créer les GameObjectDef à partir de ce qu'a sélectionné l'utilisateur dans les selet box
 * @interface
 */
function GODFactory () {
};

/**
 * gère le mouse down
 * @public
 * @param {XY} mdPos the position
 */
GODFactory.prototype.mouseDown = function(mdPos){};

/**
 * gère le mouse up
 * @public
 * @param {XY} mdPos the position
 */
GODFactory.prototype.mouseUp = function(mdPos){};

/**
 * gère le mouse move
 * @public
 * @param {XY} mdPos the position
 * @param {boolean} bMouseDown bouton enfoncé ?
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
 * Retourne la forme créée
 * @public
 * 
 */
GODFactory.prototype.getCurrentGOD = function(){};

