function circleToPolygonGOD (mdCircleGod){
	
	var aCirclePoints = Array();
	var nCircleRadius = mdCircleGod.nRadius;
	var nCircleSteps = Math.max(3,round(24 * nCircleRadius));
	for (var i =0; i < nCircleSteps; i++) {
		aCirclePoints.push(new XY(nCircleRadius*Math.cos(2*Math.PI/nCircleSteps*i),nCircleRadius*Math.sin(2*Math.PI/nCircleSteps*i)));
	}

	var mdGod = {};
	mdGod.sShape = 'polygon'; 
	mdGod.sType = mdCircleGod.sType;
	mdGod.aPoints = aCirclePoints;
	mdGod.nSize = mdCircleGod.nSize;
	return mdGod;
};

function toConvexPolygon(aPoints) {
	// Un triangle ne peut être concave
	if (aPoints.length <= 3) {
		return aPoints;
	}

	var bModified = false;
	do {
		bModified = false;
		for ( var i = 0; i < aPoints.length; i++) {
			var oPrevPoint = undefined;
			var oCurPoint = aPoints[i];
			var oNextPoint = undefined;
			if (i == 0) {
				oPrevPoint = aPoints[aPoints.length - 1];
			} else {
				oPrevPoint = aPoints[i - 1];
			}
			if (i == aPoints.length - 1) {
				oNextPoint = aPoints[0];
			} else {
				oNextPoint = aPoints[i + 1];
			}

			var nCC = counterClockWise(oPrevPoint, oCurPoint, oNextPoint);

			if (nCC == -1) {
				// On supprime le point courant
				aPoints.splice(i, 1);
				bModified = true;
			}

		}

	} while (bModified == true);

}

function newFragmentGOD (aPoints, sType, oCenterPos){
	
	var nPoints = aPoints.length;
	
	if (nPoints < 3){
		return null;
	}

	var mdGod = {};
	
	mdGod.sType = sType;
	
	for (var i = 0; i < nPoints; i++) {
		oCenterPos.x += aPoints[i].x;
		oCenterPos.y += aPoints[i].y;
	}
	oCenterPos.x = oCenterPos.x / nPoints;
	oCenterPos.y = oCenterPos.y / nPoints;
	
	var aTmpPoints = new Array();
	var nSize = 0;
	
	for (var i = 0; i < nPoints; i++) {
		aTmpPoints[i] = new XY(aPoints[i].x - oCenterPos.x,aPoints[i].y - oCenterPos.y);
		nSize = Math.max(nSize,2 * Math.sqrt(Math.pow(aTmpPoints[i].x,2)+Math.pow(aTmpPoints[i].y,2)));
	}
	
	// Pas d'objets trop petits
	if (getArea(aTmpPoints) < Constants.SIZE_MIN_FRAGMENT){
		return null;
	}else if (getArea(aTmpPoints) > Constants.SIZE_MAX_FRAGMENT){
		mdGod.sShape = 'polygon'; // Pas d'autodestruction 
	}else {
		mdGod.sShape = 'fragment'; // Avec autodestruction
	}
	toConvexPolygon(aTmpPoints);
	mdGod.aPoints = aTmpPoints;
	mdGod.nSize = nSize;
	
	return mdGod;
};

function newPolygonGOD (aPoints, nFactor, sType){
	
	var nPoints = aPoints.length;
	
	if (nPoints < 3){
		return null;
	}

	var mdGod = {};
	mdGod.sShape = 'polygon';
	mdGod.sType = sType;
	
	var oCenterPos = new XY(0,0);
	for (var i = 0; i < nPoints; i++) {
		oCenterPos.x += aPoints[i].x;
		oCenterPos.y += aPoints[i].y;
	}
	oCenterPos.x = oCenterPos.x / nPoints / nFactor;
	oCenterPos.y = oCenterPos.y / nPoints / nFactor;
	
	var aTmpPoints = new Array();
	var nSize = 0;
	
	for (var i = 0; i < nPoints; i++) {
		aTmpPoints[i] = new XY(aPoints[i].x / nFactor - oCenterPos.x,aPoints[i].y / nFactor - oCenterPos.y);
		nSize = Math.max(nSize,2 * Math.sqrt(Math.pow(aTmpPoints[i].x,2)+Math.pow(aTmpPoints[i].y,2)));
	}
	
	// Pas d'objets trop petits
	if (getArea(aTmpPoints) < Constants.SIZE_MIN_POLYGON){
		return null;
	}
	
	// Le cenre est maintenant au milieu du polygone
	arrangeClockwise(aTmpPoints,new XY(0,0));
	toConvexPolygon(aTmpPoints);
	mdGod.aPoints = aTmpPoints;
	mdGod.nSize = nSize;
	
	return mdGod;
};
