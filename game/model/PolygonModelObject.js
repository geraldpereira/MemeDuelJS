/**
 * Un objet du modèle qui représente un Polygon 
 * @constructor
 * @extends {ModelObject}
 * @param {b2World} b2dWorld
 * @param {XY} mdPosition
 * @param mdGodParam
 */
function PolygonModelObject (b2dWorld,sIdParam, mdPosition,b2dFromBody, mdGodParam) {
	
	// Imports
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	var oType = GODTypeConstants[mdGodParam.sType];
	
	var b2dBodyDef = new b2BodyDef();
	b2dBodyDef.type = b2Body.b2_dynamicBody;
	b2dBodyDef.position.Set(mdPosition.x,mdPosition.y);
	if (b2dFromBody){
		b2dBodyDef.angle = b2dFromBody.GetAngle();
		b2dBodyDef.angularDamping = b2dFromBody.GetAngularDamping();
		b2dBodyDef.angularVelocity = b2dFromBody.GetAngularVelocity(); 	 	
		b2dBodyDef.linearDamping = b2dFromBody.GetLinearDamping();
		b2dBodyDef.linearVelocity = b2dFromBody.GetLinearVelocity();
	}
	var b2bBoxBody = b2dWorld.CreateBody(b2dBodyDef);
	
	var aPoints = new Array();
	for (var i = 0; i < mdGodParam.aPoints.length; i++) {
	    var vec = new b2Vec2();
	    vec.Set(mdGodParam.aPoints[i].x, mdGodParam.aPoints[i].y);
	    aPoints[i] = vec;
	}
	
	var b2dFixDef = new b2FixtureDef();
	b2dFixDef.shape = new b2PolygonShape();
	b2dFixDef.shape.SetAsArray(aPoints, aPoints.length);
	b2dFixDef.density = oType.nDensity;
	b2dFixDef.friction = oType.nFriction;
	b2dFixDef.restitution = oType.nRestitution;

	b2bBoxBody.CreateFixture(b2dFixDef);
	b2bBoxBody.SetUserData(this);
	
	// Centrer l'objet sous le pointeur de souris quand créé
	//b2bBoxBody.SetPosition(new b2Vec2(mdPosition.x - b2bBoxBody.GetLocalCenter().x,mdPosition.y - b2bBoxBody.GetLocalCenter().y));
	
	ModelObject.call(this,sIdParam,b2bBoxBody,mdGodParam);
};
inherits(PolygonModelObject, ModelObject);

/**
 * @public
 * @return {number}
 */
PolygonModelObject.prototype.getSize= function (){
	return this.mdGod.nSize;
};

/**
 * @public
 * @return {Array<XY>}
 */
PolygonModelObject.prototype.getPoints = function (){
	return this.mdGod.aPoints;
};
