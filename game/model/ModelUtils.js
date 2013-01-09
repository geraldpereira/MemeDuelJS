/**
 * @public
 * @param {Box2D.Dynamics.b2World} b2dWorld
 * @param {MousePosition} mdMousePosition 
 * @return {Box2D.Dynamics.b2Body}
 */
function getBodyAtMouse(b2dWorld, mdMousePosition) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2AABB = Box2D.Collision.b2AABB;
	
	var xInCanvasMeter = mdMousePosition.getXYInCanvasMeter().x;
	var yInCanvasMeter = mdMousePosition.getXYInCanvasMeter().y;
	
	var b2dMousePVec = new b2Vec2(xInCanvasMeter,yInCanvasMeter);
	var aabb = new b2AABB();
	aabb.lowerBound.Set(xInCanvasMeter - 0.001,yInCanvasMeter - 0.001);
	aabb.upperBound.Set(xInCanvasMeter + 0.001,yInCanvasMeter + 0.001);

	// Query the world for overlapping shapes.
	var b2dSelectedBody = null;
	b2dWorld.QueryAABB(function (fixture) {
		var b2Body = Box2D.Dynamics.b2Body;		
		if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
			if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(),
					b2dMousePVec)) {
				b2dSelectedBody = fixture.GetBody();
				return false;
			}
		}
		return true;
	}, aabb);
	return b2dSelectedBody;
};

/**
 * this function will determine the velocity of the debris according
 * to the center of mass of the body and the distance from the explosion point
 * @public 
 * @param {Box2D.Dynamics.b2Body} b2dBody
 * @param {XY} b2dBody
 * @param {number} b2dBody
 * @return {Box2D.Common.Math.b2Vec2}	
 */
function getExplosionVelocity (b2dBody, mdExplosionXY, nExplosionRadius) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	var nDistX = b2dBody.GetWorldCenter().x - mdExplosionXY.x;//:Number
	if (nDistX < 0) {
		if (nDistX < -nExplosionRadius) {
			nDistX = 0;
		} else {
			nDistX = -nExplosionRadius - nDistX;
		}
	} else {
		if (nDistX > nExplosionRadius) {
			nDistX = 0;
		} else {
			nDistX = nExplosionRadius - nDistX;
		}
	}

	var nDistY = b2dBody.GetWorldCenter().y - mdExplosionXY.Y;
	if (nDistY < 0) {
		if (nDistY < -nExplosionRadius) {
			nDistY = 0;
		} else {
			nDistY = -nExplosionRadius - nDistY;
		}
	} else {
		if (nDistY > nExplosionRadius) {
			nDistY = 0;
		} else {
			nDistY = nExplosionRadius - nDistY;
		}
	}
	nDistX *= 0.25;
	nDistY *= 0.25;
	return new b2Vec2(nDistX, nDistY);
};

/**
 * @public
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @return {number}
 */
function determinant (x1, y1, x2, y2, x3, y3) {
	// This is a function which finds the determinant of a 3x3 matrix.
	// If you studied matrices, you'd know that it returns a positive number if three given points are in clockwise order, negative if they are in anti-clockwise order and zero if they lie on the same line.
	// Another useful thing about determinants is that their absolute value is two times the face of the triangle, formed by the three given points.
	return x1 * y2 + x2 * y3 + x3 * y1 - y1 * x2 - y2 * x3 - y3 * x1;
};

function arrangeClockwise(aPoints,oCenterPos) {
	aPoints.sort(function(a, b) {
		// TODO Comprendre pourquoi cela ne fonctionne pas dans tous les cas
		//return - counterClockWise (a,b,oCenterPos);
		var nAAngleRaidans = computeAngleRadians(a,oCenterPos);
		var nBAngleRaidans = computeAngleRadians(b,oCenterPos);
		return nAAngleRaidans - nBAngleRaidans;
	});
};

/**
 * function to get the area of a shape. I will remove tiny shape to increase performance
 * @public
 * @param {Array<Box2D.Common.Math.b2Vec2>} aVectors
 * @param {number} nCount
 * @return {number}
 */
function getArea (aVectors) {
	var nArea =0.0;
	var mdPos1 = new XY(0,0);
	var nCount = aVectors.length;
	for (var i = 0; i < nCount; i++) {
		var b2dPos2 = aVectors[i];
		var b2dPos3 = i+1 < nCount ? aVectors[i+1] : aVectors[0];
		var mdE1 = new XY(b2dPos2.x - mdPos1.x,b2dPos2.y - mdPos1.y);
		var mdE2 = new XY(b2dPos3.x - mdPos1.x,b2dPos3.y - mdPos1.y);
		var nDeterminant = (mdE1.x * mdE2.y - mdE1.y * mdE2.x);
		var nTriangleArea = Math.abs(0.5*nDeterminant);
		nArea += nTriangleArea;
	}
	return nArea;
};

/**
 * Tourne le point par rapport à un angle
 * @public
 */
function rotatePoint(nAngle,mdPos){
	var mdRotatedPos = new XY(0,0);
	// http://fr.wikipedia.org/wiki/Rotation_plane
	mdRotatedPos.x = mdPos.x * Math.cos(nAngle) - mdPos.y * Math.sin(nAngle);
	mdRotatedPos.y = mdPos.x * Math.sin(nAngle) + mdPos.y * Math.cos(nAngle);
	return mdRotatedPos;
};

