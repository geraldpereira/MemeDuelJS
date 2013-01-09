/**
 * @constructor
 */
function Model() {
	// imports Box2D
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2AABB = Box2D.Collision.b2AABB;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	
	/**
	 * Le vecteur utilisé définit l'orientation de la force de gravité (x,y)
	 * Plus le vecteur est grand, plus la force est importante
	 * // (gravity, allow sleep)
	 * @private 
	 * @type {b2World}
	 */
	this.b2dWorld = new b2World(new b2Vec2(0, 10), true);
	
	/**
	 * @private
	 * @type {b2MouseJoint}
	 */
	this.b2dMouseJoint = undefined;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.bUnselectObject = false;
	
	/**
	 * Tableau des listeners
	 * @private
	 * @type {Array<View>}
	 */
	this.aListeners = new Array();
	
	
	/**
	 * @private
	 * @type {number}
	 */
	this.nCurrentId = 0;
	
	var b2dFixDef = new b2FixtureDef();
	var b2dBodyDef = new b2BodyDef();
	var b2dEnvBody = undefined;
	
	// Create static world
	b2dFixDef.density = 1.0; // Densité des bloc (le poid est definit par la
	// surface * la densité)
	b2dFixDef.friction = 0.5; // Quantité de frottement entre les blocs
	b2dFixDef.restitution = 0.2; // Definit les rebonds (plus la valeur est
	// grande, plus les objects rebondissent)

	// Le bas du monde
	b2dBodyDef.type = b2Body.b2_staticBody; 
	b2dFixDef.shape = new b2PolygonShape;
	b2dFixDef.shape.SetAsBox(GODEnvConstants.world.nWidth / 2, GODEnvConstants.ground.nHeight /2);
	b2dBodyDef.position.Set(GODEnvConstants.world.nWidth / 2,GODEnvConstants.ground.nPosYModel);
	b2dEnvBody = this.b2dWorld.CreateBody(b2dBodyDef);
	b2dEnvBody.SetUserData('ground');
	b2dEnvBody.CreateFixture(b2dFixDef);

	// Le haut du monde
	// PosX = milieu du monde
	// PosY = 0.25m pour ratraper l'epaisseur du bas du restangle
	b2dFixDef.shape.SetAsBox(GODEnvConstants.world.nWidth/2, 0.25);
	b2dBodyDef.position.Set(GODEnvConstants.world.nWidth /2, 0.25);
	b2dEnvBody = this.b2dWorld.CreateBody(b2dBodyDef);
	b2dEnvBody.SetUserData('top');
	b2dEnvBody.CreateFixture(b2dFixDef);

	// Les coté
	// 50cm de large et haut comme la hauteur du monde
	b2dFixDef.shape.SetAsBox(0.25, GODEnvConstants.world.nHeight / 2);
	b2dBodyDef.position.Set(0.25, GODEnvConstants.world.nHeight / 2);
	b2dEnvBody = this.b2dWorld.CreateBody(b2dBodyDef);
	b2dEnvBody.SetUserData('side');
	b2dEnvBody.CreateFixture(b2dFixDef);
	b2dBodyDef.position.Set(GODEnvConstants.world.nWidth -0.25, GODEnvConstants.world.nHeight / 2);
	b2dEnvBody = this.b2dWorld.CreateBody(b2dBodyDef);
	b2dEnvBody.SetUserData('side');
	b2dEnvBody.CreateFixture(b2dFixDef);

	var damageObject = function(damageAmount, b2dBody, b2dOtherBody) {
		if (b2dBody && b2dBody.GetUserData()) {
			// TODO : faire plutot disparaitre l'objet ? Si l'autre objet est un mur ou le plafond, les dégats sont augementés
			// Ou mettre des textures aux cotés et au plafond
//			var mdOtherModelObject = b2dOtherBody.GetUserData();
//			if (mdOtherModelObject == 'side' || mdOtherModelObject == 'top'){
//				damageAmount = damageAmount * 10000;
//			}
			
			var mdModelObject = b2dBody.GetUserData();
			if (mdModelObject.damage){ // Si l'objet peut être endomagé
				mdModelObject.damage(damageAmount);
			}
		}
	};
	
	var thisModel = this;	
	var fireObjectHitGround = function(nXPosition) {
		thisModel.fireObjectHitGround(nXPosition);
	};
	
	var b2dContactListener = new Box2D.Dynamics.b2ContactListener();
	b2dContactListener.PostSolve = function(b2dContact, b2dImpulse) {
		var b2dNormalImpulse = b2dImpulse.normalImpulses[0];
		if (b2dNormalImpulse && b2dContact.GetFixtureA() != null && b2dContact.GetFixtureB() != null) {
			var b2dObjectA = b2dContact.GetFixtureA().GetBody();
			var b2dObjectB = b2dContact.GetFixtureB().GetBody();
			// Pas terrible le isContinuous
			if (ConfigurationConstants.game.current.bDamageObjects == true && b2dNormalImpulse > 1) {
				damageObject(b2dNormalImpulse , b2dObjectA, b2dObjectB);
				damageObject(b2dNormalImpulse , b2dObjectB, b2dObjectA);
			}
			if (b2dNormalImpulse > 1){
				// Aficher la fumée au sol
				if (b2dObjectA.GetUserData() == 'ground'){
					var b2dLocalPoint = b2dContact.GetManifold().m_localPoint;
					var nXPos = b2dObjectB.GetPosition().x + b2dLocalPoint.x;
					fireObjectHitGround(nXPos);
				}else if (b2dObjectB.GetUserData() == 'ground'){
					var b2dLocalPoint = b2dContact.GetManifold().m_localPoint;
					var nXPos = b2dObjectA.GetPosition().x + b2dLocalPoint.x;
					fireObjectHitGround(nXPos);
				}
			}
		}
	};
	// contactListener.BeginContact = function(contact) {
	// console.log("BeginContact");
	// };
	// contactListener.EndContact = function(contact) {
	// console.log("EndContact");
	// };
	// contactListener.PreSolve = function(contact, manifold) {
	// console.log("PreSolve");
	// };
	this.b2dWorld.SetContactListener(b2dContactListener);
	
	// setup debug draw
	if (Constants.CANVAS_DEBUG){
		var oContext2D_debug = Constants.CANVAS_DEBUG.getContext('2d');
		var b2dDebugDraw = new b2DebugDraw();
		b2dDebugDraw.SetSprite(oContext2D_debug);
		b2dDebugDraw.SetDrawScale(Constants.CANVAS_DEBUG_DRAW_FACTOR);
		b2dDebugDraw.SetFillAlpha(0.5); // La transparence
		b2dDebugDraw.SetLineThickness(1.0); // L'épaisseur des lignes
		b2dDebugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.b2dWorld.SetDebugDraw(b2dDebugDraw);
	}
	
	// Set up l'exploder !
	this.mdModelObjectExploder = new ModelObjectExploder(this.b2dWorld,this);
};


/**
 * @public
 * @param {View} oListener
 */
Model.prototype.addListener = function (oListener){
	this.aListeners.push(oListener);
};

/**
 * Ca serait bien en package protected
 * @public 
 * @param {ModelObject} mdModelObject
 */
Model.prototype.fireObjectAdded = function (mdModelObject){
	for ( var i = 0; i < this.aListeners.length; i++) {
		var oListener = this.aListeners[i];
		if (oListener && oListener.objectAdded) {
			oListener.objectAdded(mdModelObject);
		}
	}
};

/**
 * Ca serait bien en package protected
 * @public 
 * @param {XY} mdExplosionPosition
 * @param {string} sType le type de l'objet ayant exlposé
 */
Model.prototype.fireObjectExploded = function (mdExplosionPosition, sType){
	for ( var i = 0; i < this.aListeners.length; i++) {
		var oListener = this.aListeners[i];
		if (oListener && oListener.objectAdded) {
			oListener.objectExploded(mdExplosionPosition,sType);
		}
	}
};

/**
 * Ca serait bien en package protected
 * @public 
 * @param {number} nXPosition
 */
Model.prototype.fireObjectHitGround = function (nXPosition){
	for ( var i = 0; i < this.aListeners.length; i++) {
		var oListener = this.aListeners[i];
		if (oListener && oListener.objectAdded) {
			oListener.objectHitGround(nXPosition);
		}
	}
};

/**
 * Retourne le world
 * @return {b2World}
 */
Model.prototype.getWorld = function() {
	return this.b2dWorld;
};

Model.prototype.newId = function() {
	var nId = this.nCurrentId;
	this.nCurrentId ++;
	return nId;
};

/**
 * Ajoute un object rond à la position donnée
 * @public 
 * @param {MousePosition} mdMousePosition
 * @param mdGod
 */
Model.prototype.addObject = function(mdMousePosition, mdGod) {
	var xInCanvasMeter = mdMousePosition.getXYInCanvasMeter().x;
	var yInCanvasMeter = mdMousePosition.getXYInCanvasMeter().y;
	if (xInCanvasMeter >= 0.5 
		&& xInCanvasMeter <= (GODEnvConstants.world.nWidth - 0.5)
		&& yInCanvasMeter >= 0.5 
		&& yInCanvasMeter <= (GODEnvConstants.world.nHeight - GODEnvConstants.ground.nHeight)){
		
		if (mdGod){
			var mdModelObject = undefined;
			if (mdGod.sShape == "circle"){
				mdModelObject = new CircleModelObject(this.b2dWorld,this.newId(), mdMousePosition.getXYInCanvasMeter(), mdGod);
			}else if (mdGod.sShape == "box"){
				mdModelObject = new BoxModelObject(this.b2dWorld,this.newId(), mdMousePosition.getXYInCanvasMeter(), mdGod);
			}else if (mdGod.sShape == "polygon"){
				mdModelObject = new PolygonModelObject(this.b2dWorld,this.newId(), mdMousePosition.getXYInCanvasMeter(),undefined /*pas d'angle*/ ,mdGod);
			}
			if (mdModelObject){
				this.fireObjectAdded(mdModelObject);				
			}	
		}else{
			console.log('Triangle too small!');
		}
		
	}		
};

/**
 * Selectionne l'objet à la position donnée
 * @public
 * @param {MousePosition} mdMousePosition
 * @return {boolean}
 */
Model.prototype.selectObject = function(mdMousePosition) {
	// imports Box2D
	var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
	
	if (mdMousePosition) {
		if (!this.b2dMouseJoint) {
			// Récupérer l'objet sélectionné
			var b2dBody = getBodyAtMouse(this.b2dWorld,mdMousePosition);
			if (b2dBody) {
				// Créer le b2dMouseJoint permettant de déplacer l'objet
				// sélectionner
				var b2dMouseJointDef = new b2MouseJointDef();
				b2dMouseJointDef.bodyA = this.b2dWorld.GetGroundBody();
				b2dMouseJointDef.bodyB = b2dBody;
				b2dMouseJointDef.target.Set(mdMousePosition.getXYInCanvasMeter().x,
						mdMousePosition.getXYInCanvasMeter().y);
				b2dMouseJointDef.collideConnected = true;
				b2dMouseJointDef.maxForce = 300.0 * b2dBody.GetMass();
				this.b2dMouseJoint = this.b2dWorld.CreateJoint(b2dMouseJointDef);
				b2dBody.SetAwake(true);
				return true;
			}else{
				this.b2dMouseJoint = undefined;
			}
		}
	}
	return false;
};

/**
 * Désélectionne l'objet
 * @public
 * @return {boolean} true si un objet était sélectionné, faux sinon
 */
Model.prototype.unselectObject = function() {
	if (this.b2dMouseJoint) {
		// On positionne juste un flag, la déselection DOIT être faite dans
		// la boucle d'update
		this.bUnselectObject = true;
		return true;
	}
	return false;
};

/**
 * @public
 * @return {boolean} Dit si un objet est sélectionné ou pas !
 */
Model.prototype.isSelectObject = function() {
	if (this.b2dMouseJoint) {
		return true;
	}
	return false;
};

/**
 * Met à jour l'objet sélectionné : - la position du joint si toujours
 * sélectionné, - supprime le MouseJoint s'il vient d'être déselectionné
 * @public
 * @param {MousePosition} mdMousePosition
 */
Model.prototype.updateSelectedObject = function(/* MousePosition */mdMousePosition) {
	// imports Box2D
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	if (this.b2dMouseJoint) {
		if (this.bUnselectObject) {
			// Remettre la rotation libre
			var b2dBody = this.b2dMouseJoint.GetBodyB();
			if (b2dBody.IsFixedRotation() == true){
				b2dBody.SetFixedRotation(false);	
			}
			this.b2dWorld.DestroyJoint(this.b2dMouseJoint);
			this.b2dMouseJoint = null;
			this.bUnselectObject = false;
		} else if (mdMousePosition) {
			this.b2dMouseJoint.SetTarget(new b2Vec2(mdMousePosition.getXYInCanvasMeter().x,
					mdMousePosition.getXYInCanvasMeter().y));
		}
	}
};


/**
 * Fait tourner l'objet sélectionné sur lui même
 * Sa rotation deviens alros fixe
 * @public
 * @param {MousePosition} mdMousePosition
 */
Model.prototype.rotateSelectedObject = function(nDirection) {
	if (this.b2dMouseJoint) {
		//Fixer la rotation
		var b2dBody = this.b2dMouseJoint.GetBodyB();
		if (b2dBody.IsFixedRotation() == false){
			b2dBody.SetAngularDamping(0); 	 	
			b2dBody.SetAngularVelocity(0);
			b2dBody.SetFixedRotation(true);	
		}else{ 
			var nAngle = b2dBody.GetAngle();
			if (nDirection > 0){
				b2dBody.SetAngle(nAngle + Math.PI /12);
			}else if (nDirection < 0){
				b2dBody.SetAngle(nAngle - Math.PI /12);
			}
		}
	}
};

/**
 * Met à jour le modèle (à appeller de mannière périodique)
 * @public
 */
Model.prototype.update = function() {
	
	var /*b2Body**/ node = this.b2dWorld.GetBodyList();
	while (node){
	    var /*b2Body**/ curB2Body = node;
	    node = node.GetNext();
	    var /* ModelObject */mdModelObject = curB2Body.GetUserData();
	    // Si l'objet existe, qu'il a une méthode isDestroyed et qu'elle retourne vrais
	    if (mdModelObject && mdModelObject instanceof ModelObject) {
	    	mdModelObject.update();
	    	if (mdModelObject.isDestroyed && mdModelObject.isDestroyed()){
		    	// On l'explose
		    	this.mdModelObjectExploder.explode(curB2Body);
	    	}
		}
	}
	
	// Mettre à jour le monde
	this.b2dWorld.Step(Constants.WORLD_REFRESH_RATE, Constants.VELOCITY_ITERATIONS, Constants.POSITION_ITERATIONS);
	if (Constants.CANVAS_DEBUG){
		this.b2dWorld.DrawDebugData();			
	}
	this.b2dWorld.ClearForces();
};

/**
 * Vide les objets dynamiques du modèle
 * @public
 */
Model.prototype.clear = function (){
	this.b2dWorld.paused = true;
	var /*b2Body**/ node = this.b2dWorld.GetBodyList();
	while (node){
	    var /*b2Body**/ curB2Body = node;
	    node = node.GetNext();
	    var /* ModelObject */mdModelObject = curB2Body.GetUserData();
	    // Si l'objet existe, qu'il a une méthode isDestroyed et qu'elle retourne vrais
	    if (mdModelObject && mdModelObject instanceof ModelObject) {
	    	mdModelObject.destroy();
	    	this.b2dWorld.DestroyBody(b2dSliceBody);
		}
	}
	this.b2dWorld.paused = false;
	this.b2dWorld.step(null);
};


/**
 * @public
 */
Model.prototype.save = function (){
	this.b2dWorld.paused = true;
	while (node){
	    var /*b2Body**/ curB2Body = node;
	    node = node.GetNext();
	    var /* ModelObject */mdModelObject = curB2Body.GetUserData();
	    // Si l'objet existe, qu'il a une méthode isDestroyed et qu'elle retourne vrais
	    if (mdModelObject && mdModelObject instanceof ModelObject) {
	    	// TODO Enregistrer l'objet
		}
	}
	this.b2dWorld.paused = false;
	this.b2dWorld.step(null);
};


/**
 * @public
 */
Model.prototype.load= function (){
	this.b2dWorld.paused = true;
	// TODO
	this.b2dWorld.paused = false;
	this.b2dWorld.step(null);
};