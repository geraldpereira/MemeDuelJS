/**
 * @param {Box2D.Dynamics.b2World} b2dWorldParam
 * @constructor
 */
function ModelObjectExploder(b2dWorldParam, mdModelParam) {
	/**
	 * @private 
	 * @type {Box2D.Dynamics.b2World}
	 */
	this.b2dWorld = b2dWorldParam;
	
	/**
	 * @private 
	 * @type {Model}
	 */
	this.mdModel = mdModelParam;

	/**
	 * @private 
	 * @type {Array<Box2D.Common.Math.b2Vec2>}
	 */
	this.aEnterPoints = new Array();

	/**
	 * @private 
	 * @type {Array<Box2D.Dynamics.b2Body>}
	 */
	this.aExplodingBodies = undefined;

	/**
	 * the number of cuts for every explosion
	 * @private 
	 * @type {number}
	 */
	this.nExplosionCuts = 3;

	/**
	 * @private 
	 * @type {XY}
	 */
	this.mdExplosionXY = undefined;
	/**
	 * explosion radius, useful to determine the velocity of debris
	 * @private 
	 * @type {number}
	 */
	this.nExplosionRadius = 50;

};

/**
 * @public
 */
ModelObjectExploder.prototype.explode = function(b2dBodyToExplode) {
		var b2dOrigFixture = b2dBodyToExplode.GetFixtureList();//:b2Fixture
		var b2dPoly = b2dOrigFixture.GetShape(); // b2PolygonShape
		
		if (b2dPoly.GetVertices){
			// Polygon
			var b2dContacts = b2dBodyToExplode.GetContactList();
			this.explodePolygon(b2dBodyToExplode, b2dContacts);		
		}else{
			// Circle
			this.explodeCircle(b2dBodyToExplode);		
		}	
};

/**
 * @public
 */
ModelObjectExploder.prototype.explodeCircle = function(b2dBodyToExplode) {
	var b2dContacts = b2dBodyToExplode.GetContactList();
	var mdCircleModelObject = b2dBodyToExplode.GetUserData();	
	
	// Supprimer le cercle et sa représentation dans la vue
	this.b2dWorld.DestroyBody(b2dBodyToExplode);
	mdCircleModelObject.destroy();
	
	// Si le cercle à détruire est trop petit, on le supprime juste
	if (mdCircleModelObject.getRadius() > Constants.SIZE_MIN_CIRCLE_FRAGMENT){
		// En créer un nouveau sous forme de polygone
		mdPolygonModelObject = new PolygonModelObject(this.b2dWorld, mdCircleModelObject.getId(),b2dBodyToExplode.GetPosition(),b2dBodyToExplode, circleToPolygonGOD(mdCircleModelObject.getGameObjectDef()));
		var b2dCircleBody = mdPolygonModelObject.getBody();
		
		// On ne fait pas de fireAdded ! Cet objet va être découpé donc pas la peine de s'encombrer
		
		this.explodePolygon(b2dCircleBody,b2dContacts);
	}
};

/**
 * @public
 */
ModelObjectExploder.prototype.explodePolygon = function(b2dBodyToExplode, b2dContacts) {
	// imports Box2D
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	//	var b2dContactPoint = b2dContacts.contact.GetManifold().m_localPoint; // b2Vec2	
	
	var nCurAngle = undefined;
	// TODO Vérifier que le circle a bien ses points de contact !
	//MARCHE PAS !
	
	// PUTAIN DE WORLD MANIFOLD DE MERDEUUUU !!! :(
	//	var b2dWorldManifold = new 	Box2D.Collision.b2WorldManifold();
	var aExplosionPoints = new Array();
	
	if (b2dContacts){
		// rien ne sert d'ajouter plus de points qu'il y a d'explosions
		var i = 0;
		do {
			
			var b2dLocalPoint = b2dContacts.contact.GetManifold().m_localPoint;
			// prendre en compte la rotation (faudra faire une méthode utilitaire si ca fonctionne)
			var mdRotatedLocalPoint = rotatePoint(b2dBodyToExplode.GetAngle(),b2dLocalPoint);
			var mdWorldPoint = new XY(b2dBodyToExplode.GetPosition().x + mdRotatedLocalPoint.x, b2dBodyToExplode.GetPosition().y + mdRotatedLocalPoint.y);
			aExplosionPoints.push(mdWorldPoint);
			
			//		b2dWorldManifold.Initialize(b2dContacts.contact.GetManifold(), 
			//									b2dContacts.contact.GetFixtureA().GetBody().GetTransform(), 
			//									b2dContacts.contact.GetFixtureA().GetShape().m_radius, 
			//									b2dContacts.contact.GetFixtureB().GetBody().GetTransform(), 
			//									b2dContacts.contact.GetFixtureB().GetShape().m_radius);
			//		// Utiliser le GetWorldManiFold
			//		for (var i = 0; i < b2dWorldManifold.m_points.length ; i++){
			//			aExplosionPoints.push(b2dWorldManifold.m_points[i]);
			//		}
			
			b2dContacts = b2dContacts.next;
			i++;
		}while (b2dContacts && i < this.nExplosionCuts);
	}else{
		var mdWorldPoint = new XY(b2dBodyToExplode.GetPosition().x, b2dBodyToExplode.GetPosition().y);
		aExplosionPoints.push(mdWorldPoint);
	}	
	
	this.aExplodingBodies = new Array();
	this.aExplodingBodies.push(b2dBodyToExplode);
	// the explosion begins!
	for ( var i = 1, j = 0; i <= this.nExplosionCuts; i++) {
		this.mdExplosionXY = aExplosionPoints[j];
		// On coupe sur chacun des points de contact
		j++;
		if (j >= aExplosionPoints.length){
			j = 0;
		}
			//
		
		// choosing a random angle
		nCurAngle = Math.random() * Math.PI * 2;
		// creating the two points to be used for the raycast, according to the random angle and mouse position
		// also notice how I need to add a little offset (i/10) or Box2D will crash. Probably it's not able to 
		// determine raycast on objects whose area is very very close to zero (or zero)
		var p1 = new b2Vec2((this.mdExplosionXY.x + i/10 - 10 * Math
				.cos(nCurAngle)), (this.mdExplosionXY.y - 10 * Math
				.sin(nCurAngle)));
		var p2 = new b2Vec2((this.mdExplosionXY.x + 10 * Math
				.cos(nCurAngle)), (this.mdExplosionXY.y + 10 * Math
				.sin(nCurAngle)));
		

		// Utile pour que le this dans la méthode intersection() reference toujours notre ModelObjectExplorer
		// Si on passe directement this.intersection comem méthode à this.b2dWorld.RayCast(), this == DOMWindow dans la méthode intersection() appellée
		var thisMOE = this;
		var callIntersection = function(fixture, point, normal,fraction){
			thisMOE.intersection(fixture, point, normal,fraction);
		};
		
		
		// TODO Comprendre pourquoi on à besoin des deux !
		this.b2dWorld.RayCast(callIntersection, p1, p2);
		this.b2dWorld.RayCast(callIntersection, p2, p1);
		this.aEnterPoints = new Array();
	}
	// Parcourir les points d'explosion et FIRE ! la vue
	var mdModelObject = b2dBodyToExplode.GetUserData();
	var sType = mdModelObject.getGameObjectDef().sType;
	for ( var i = 0; i < aExplosionPoints.length; i++) {
		var oPoint = aExplosionPoints[i];
		this.mdModel.fireObjectExploded(oPoint,sType);			
	}
	// parcourir aExplodingBodies et faire des fire à la vue
	for (var i = 0; i < this.aExplodingBodies.length; i++){
		var b2dBody = this.aExplodingBodies[i];
		if (b2dBody){
			this.mdModel.fireObjectAdded(b2dBody.GetUserData());
		}
	}
	this.aExplodingBodies = null;
};

/**
 * @public
 * @param {b2Fixture} fixture
 * @param {b2Vec2} point
 * @param {b2Vec2} normal
 * @param {number} fraction
 * @return {number}
 */
ModelObjectExploder.prototype.intersection = function(fixture, point, normal,
		fraction) {
	var nIndex = this.aExplodingBodies.indexOf(fixture.GetBody());
	if (nIndex != -1) {
		var mdModelObject = fixture.GetBody().GetUserData();
		// Throughout this whole code I use only one global vector, and that is enterPointsVec. Why do I need it you ask? 
		// Well, the problem is that the world.RayCast() method calls this function only when it sees that a given line gets into the body - it doesnt see when the line gets out of it.
		// I must have 2 intersection points with a body so that it can be sliced, thats why I use world.RayCast() again, but this time from B to A - that way the point, at which BA enters the body is the point at which AB leaves it!
		// For that reason, I use a vector enterPointsVec, where I store the points, at which AB enters the body. And later on, if I see that BA enters a body, which has been entered already by AB, I fire the splitObj() function!
		// I need a unique ID for each body, in order to know where its corresponding enter point is - I store that id in the userData of each body.
		if (mdModelObject) {
			var sModelObjectId = mdModelObject.getId();
			if (this.aEnterPoints[sModelObjectId]) {
				// If this body has already had an intersection point, then it now has two intersection points, thus it must be split in two - thats where the splitObj() method comes in.
				this.splitObj(fixture.GetBody(), this.aEnterPoints[sModelObjectId],
						point.Copy(),nIndex);
				// Retourner 0 => dit a B2D d'arrêter les events d'intersection
				return 0;
			} else {
				this.aEnterPoints[sModelObjectId] = point;
			}
		}
	}
	return 1;
};

/**
 * @private
 * @param {Box2D.Dynamics.b2Body} b2dSliceBody
 * @param {Box2D.Common.Math.b2Vec2} b2dA les points de coupe
 * @param {Box2D.Common.Math.b2Vec2} b2dB
 */
ModelObjectExploder.prototype.splitObj = function(b2dSliceBody, b2dAParam, b2dBParam, nIndex) {
	var b2dOrigFixture = b2dSliceBody.GetFixtureList();//:b2Fixture
	var b2dPoly = b2dOrigFixture.GetShape(); // b2PolygonShape
	var aVertices = b2dPoly.GetVertices(); // Array<b2Vec2>
	var nVertices = b2dPoly.GetVertexCount();

	// First, I destroy the original body and remove its Sprite representation from the childlist.
	this.b2dWorld.DestroyBody(b2dSliceBody);

	// The world.RayCast() method returns points in world coordinates, so I use the b2Body.GetLocalPoint() to convert them to local coordinates.;
	var b2dLocalA = b2dSliceBody.GetLocalPoint(b2dAParam);
	var b2dLocalB = b2dSliceBody.GetLocalPoint(b2dBParam);

	// Ajouter tous les points (points de coupe compris) dans un tableau
	var aAllVertices = new Array();
	for (var i = 0; i < nVertices; i++){
		aAllVertices[i] = aVertices[i];
	}
	aAllVertices.push(b2dLocalA);
	aAllVertices.push(b2dLocalB);
	
	var b2dLocalCenter = b2dSliceBody.GetLocalCenter();
	// Trier ce tableau de points dans le sens des aiguilles d'une montre
	arrangeClockwise(aAllVertices,b2dLocalCenter);

	// On va découper la forme en deux, les points seront tous déjà dans le bon ordre
	var aShape1Vertices = new Array(); // Array<b2Vec2>
	var aShape2Vertices = new Array();// Array<b2Vec2>
	
	// On commence par remplir le shape1
	var bFillShape1 = true;
	
	for (var i = 0; i < aAllVertices.length; i++){
		// Notre point courant
		var b2dCurPoint = aAllVertices[i];
		// True si ce point est un point de coupe
		var bIsCut = (b2dCurPoint.x == b2dLocalA.x && b2dCurPoint.y == b2dLocalA.y) || (b2dCurPoint.x == b2dLocalB.x && b2dCurPoint.y == b2dLocalB.y);
		
		if (bIsCut == true){
			// On ajoute les points de coupe aux deux formes créées
			aShape1Vertices.push(b2dCurPoint);
			aShape2Vertices.push(b2dCurPoint);
			// On vient de franchir la ligne de coupe => On ajoutera les points suivant à l'autre forme 
			bFillShape1 = !bFillShape1;
		}else{
			if (bFillShape1 == true){
				aShape1Vertices.push(b2dCurPoint);
			}else{
				aShape2Vertices.push(b2dCurPoint);
			}
		}
	}
	
	var mdOrigModelObject = b2dSliceBody.GetUserData();
	var sOrigModelObjectId = mdOrigModelObject.getId();
	
	if (this.addFragment(b2dSliceBody, aShape1Vertices, sOrigModelObjectId) == true){
		this.aEnterPoints[sOrigModelObjectId] = null;
	}
	
	if (this.addFragment(b2dSliceBody, aShape2Vertices,  this.mdModel.newId()) == true){
		// TODO ca sert plus a rien ca non ?
		this.aEnterPoints.push(null);
	}
	
	// Fin de la destruciton 
	mdOrigModelObject.destroy();
	this.aExplodingBodies[nIndex] = null;
};

/**
 * @private
 * @param {b2Body} b2dSliceBody
 * @param {Array<b2Vec2>} aShapeVertices
 * @param {string} sId l'id du fragment à ajouter
 * @return {boolean}
 */
ModelObjectExploder.prototype.addFragment = function(b2dSliceBody,aShapeVertices,sId){
	var mdOrigModelObject = b2dSliceBody.GetUserData();
	var oCenterPos = new XY(0,0);
	var mdGod = newFragmentGOD(aShapeVertices,mdOrigModelObject.getGameObjectDef().sType,oCenterPos);
	if (mdGod){
		// Calcul de la position du nouvel objet dans le b2World
		// On prend en compte la position de son centre par rapport a la position de l'objet exploded que l'on tranforme via l'angle de ce dernier
		var nAngle = b2dSliceBody.GetAngle();
		var oRotatedCenterPos = rotatePoint(nAngle,oCenterPos);
		var oCurrentPos = new XY(b2dSliceBody.GetPosition().x,b2dSliceBody.GetPosition().y);
		oCurrentPos.x += oRotatedCenterPos.x;
		oCurrentPos.y += oRotatedCenterPos.y;
		
		var mdFragmentModelObject = undefined;
		if (mdGod.sShape == 'fragment'){
			mdFragmentModelObject = new FragmentModelObject(this.b2dWorld, sId,oCurrentPos,b2dSliceBody, mdGod);
		}else {
			mdFragmentModelObject = new PolygonModelObject(this.b2dWorld, sId,oCurrentPos,b2dSliceBody, mdGod);
		}
		 
		mdFragmentModelObject.setLifespanPercentage(20 + 20 * Math.random());
		
		var b2dBody = mdFragmentModelObject.getBody();
		
		//TODO voir pourquoi ca merde quand on met ca !
		//b2dBody.SetLinearVelocity(getExplosionVelocity(b2dBody,this.mdExplosionXY,this.nExplosionRadius));
		
		// the shape will be also part of the explosion and can explode too
		this.aExplodingBodies.push(b2dBody);
		return true;
	}
	return false;
};


