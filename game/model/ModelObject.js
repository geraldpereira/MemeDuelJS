/**
 * Un objet du modèle avec uniquement une durée de vie
 * @constructor
 * @param {b2Body} b2dBodyParam
 * @param mdGodParam
 */
function ModelObject(sIdParam, b2dBodyParam, mdGodParam) {

	var oType = GODTypeConstants[mdGodParam.sType];
	
	/**
	 * @protected
	 * @type {number}
	 */
	this.nLifespan = b2dBodyParam.GetMass() * oType.nLifespanFactor;
	
	/**
	 * @protected
	 * @type {number}
	 */
	this.nInitialLifespan = this.nLifespan;

	/**
	 * GameObjectDef
	 * @protected
	 */
	this.mdGod = mdGodParam;
	
	/**
	 * @protected
	 * @type {b2Body}
	 */
	this.b2dBody = b2dBodyParam;
	
	/**
	 * @protected
	 * @type {string}
	 */
	this.sId = sIdParam;
	
	
};

/**
 * @public
 * @return {string} 
 */
ModelObject.prototype.getId = function (){
	return this.sId;
};


/**
 * @public
 * @return {b2Body} 
 */
ModelObject.prototype.getBody = function (){
	return this.b2dBody;
};

/**
 * @public
 * 
 */
ModelObject.prototype.getGameObjectDef = function (){
	return this.mdGod;
};

/**
 * @public
 * @param {number} damageAmount
 */
ModelObject.prototype.damage = function(/* Number */damageAmount) {
	this.nLifespan -= damageAmount;
};
/**
 * @public
 * @return {boolean}
 */
ModelObject.prototype.isDestroyed = function() {
	return this.nLifespan <= 0;
};

/**
 * @public
 */
ModelObject.prototype.destroy = function() {
	// Juste pour etre sur que le isDestroyed retourne true
	this.nLifespan = -1;
	return this.b2dBody = null;
};

/**
 * @public
 * @return {number}
 */
ModelObject.prototype.getLifespan = function() {
	return this.nLifespan;
};

/**
 * @public
 * @return {number}
 */
ModelObject.prototype.getLifespanPercentage = function() {
	return this.nLifespan / this.nInitialLifespan * 100;
};

/**
 * @public
 * @return {number}
 */
ModelObject.prototype.setLifespanPercentage = function(nPercentage) {
	return this.nLifespan = this.nInitialLifespan * nPercentage / 100;
};

/**
 * @public
 */
ModelObject.prototype.getPosition = function (){
	return this.b2dBody.GetPosition();
};

/**
 * @public
 * @return {number}
 */
ModelObject.prototype.getAngle = function (){
	return this.b2dBody.GetAngle();
};


/**
 * Certains objets comme les Fragments ont besoin d'une mise à jour régulière
 * @public
 */
ModelObject.prototype.update = function (){
	// A implementer
};