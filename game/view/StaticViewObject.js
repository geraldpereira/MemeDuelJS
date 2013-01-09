/**
 * Un objet de la vue static
 * @param {number} zOrderParam le z order definit la profondeur d'affichage.
 * @constructor
 * @extends {ViewObject}
 */
function StaticViewObject(zOrderParam) {
	ViewObject.call(this,zOrderParam);
};

inherits(StaticViewObject, ViewObject);
/**
 * @public
 * @param oContext2D
 * @param {number} nScrollX
 * @param {number} nScrollY
 */
StaticViewObject.prototype.draw = function(oContext2D, nScrollX, nScrollY) {
	// A implémenter
};