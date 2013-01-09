/**
 * Un objet du modèle qui représente un rectangle 
 * @constructor
 * @extends {ModelObject}
 * @param {b2World} b2dWorld
 * @param {XY} mdPosition
 * @param mdGodParam
 */
function BoxModelObject (b2dWorld,sIdParam, mdPosition, mdGodParam) {

	// Imports
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

	var oType = GODTypeConstants[mdGodParam.sType];

	var b2dBodyDef = new b2BodyDef();
	b2dBodyDef.type = b2Body.b2_dynamicBody;
	b2dBodyDef.position.Set(mdPosition.x,mdPosition.y);
	var b2bBoxBody = b2dWorld.CreateBody(b2dBodyDef);

	var b2dFixDef = new b2FixtureDef();
	b2dFixDef.shape = new b2PolygonShape();
	b2dFixDef.shape.SetAsBox(mdGodParam.nWidth/2, mdGodParam.nHeight/2);
	b2dFixDef.density = oType.nDensity;
	b2dFixDef.friction = oType.nFriction;
	b2dFixDef.restitution = oType.nRestitution;

	b2bBoxBody.CreateFixture(b2dFixDef);
	b2bBoxBody.SetUserData(this);
	
	ModelObject.call(this,sIdParam,b2bBoxBody,mdGodParam);
};

inherits(BoxModelObject, ModelObject);

/**
 * @public
 * @return {number}
 */
BoxModelObject.prototype.getWidth = function (){
	return this.mdGod.nWidth;
};

/**
 * @public
 * @return {number}
 */
BoxModelObject.prototype.getHeight= function (){
	return this.mdGod.nHeight;
};