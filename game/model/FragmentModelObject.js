/**
 * Un objet du mod�le qui repr�sente un Polygon 
 * @constructor
 * @extends {ModelObject}
 * @param {b2World} b2dWorld
 * @param {XY} mdPosition
 * @param mdGodParam
 */
function FragmentModelObject (b2dWorld,sIdParam, mdPosition, b2dFromBody, mdGodParam) {
	PolygonModelObject.call(this, b2dWorld, sIdParam, mdPosition, b2dFromBody, mdGodParam);
};
inherits(FragmentModelObject, PolygonModelObject);

/**
 * Certains objets comme les Fragments ont besoin d'une mise � jour r�guli�re
 * @public
 */
FragmentModelObject.prototype.update = function (){
	this.nLifespan -= this.nInitialLifespan * 0.005; 
};

