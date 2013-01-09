/**
 * Un objet de la vue
 * @constructor
 * @param {number} zOrderParam le z order definit la profondeur d'affichage.
 */
function ViewObject(zOrderParam) {

	/**
	 * @private
	 * @type {number}
	 */
	this.zOrder = zOrderParam;

};

/**
 * @return {number} zOrderParam le zOrder.
 */
ViewObject.prototype.getZOrder = function() {
	return this.zOrder;
};

