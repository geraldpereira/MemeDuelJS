/**
 * Un objet du modèle qui représente un cercle 
 * @constructor
 * @extends {ModelObject}
 * @param {b2World} b2dWorld
 * @param {XY} mdPosition
 * @param mdGodParam
 */
function CircleModelObject (b2dWorld,sIdParam, mdPosition, mdGodParam) {

	// Imports
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

	var oType = GODTypeConstants[mdGodParam.sType];
	var b2dBodyDef = new b2BodyDef();
	b2dBodyDef.type = b2Body.b2_dynamicBody;
	b2dBodyDef.position.Set(mdPosition.x,mdPosition.y);
	var b2bCircleBody = b2dWorld.CreateBody(b2dBodyDef);

	var b2dFixDef = new b2FixtureDef();
	b2dFixDef.shape = new b2CircleShape(mdGodParam.nRadius);
	b2dFixDef.density = oType.nDensity;
	b2dFixDef.friction = oType.nFriction;
	b2dFixDef.restitution = oType.nRestitution;

	b2bCircleBody.CreateFixture(b2dFixDef);
	b2bCircleBody.SetUserData(this);

	ModelObject.call(this,sIdParam,b2bCircleBody,mdGodParam);
};

inherits(CircleModelObject, ModelObject);

/**
 * @public
 * @return {number}
 */
CircleModelObject.prototype.getRadius = function(){
	return this.mdGod.nRadius;
};