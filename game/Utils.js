/**
 * Pour avoir des namespace dans notre javascript
 */
//function namespace(namespaceString) {
//	var parts = namespaceString.split('.'), parent = window, currentPart = '';
//
//	for ( var i = 0, length = parts.length; i < length; i++) {
//		currentPart = parts[i];
//		parent[currentPart] = parent[currentPart] || {};
//		parent = parent[currentPart];
//	}
//
//	return parent;
//}
//
//g_pck = namespace('fr.byob.game.memeduel');

//La meme en statique (le compilo closure n'aime pas les références via String)
//var fr = {};
//fr.byob = {};
//fr.byob.game = {};
//fr.byob.game.memeduel = {};


function roundPosition (nValue){
	if (ConfigurationConstants.graphics.current.bRoundPositions == true){
		return round(nValue);	
	}
	return nValue;
}

function round (nValue){
	var nRounded = (0.5 + nValue) << 0;
	return nRounded;	
}

/**
 * Helper function that implements (pseudo)Classical inheritance inheritance.
 * @see http://www.yuiblog.com/blog/2010/01/06/inheritance-patterns-in-yui-3/
 * @param {Function} childClass
 * @param {Function} parentClass
 */
function inherits(childClass, parentClass) {
  /** @constructor */
  var tempClass = function() {
  };
  tempClass.prototype = parentClass.prototype;
  childClass.prototype = new tempClass();
  childClass.prototype.constructor = childClass;
}

/**
 * @public
 * @param {XY} oPosA
 * @param {XY} oPosB
 */
function computeAngleRadians (oPosA, oPosB){
	var nOpp = oPosA.x - oPosB.x; // Coté oposé
	var nAdj = oPosB.y - oPosA.y ; // COté adjacent
	var nTan = 0;
	if (nAdj != 0){
		nTan = nOpp / nAdj;
	}
	var nAngleRaidans = Math.atan(nTan);
	 if (nAdj > 0){
	    	nAngleRaidans += Math.PI;
	    }
	return nAngleRaidans;
}

/**
 * calcul le sens de l'angle ABC
 * @public
 * @param {XY} oPosA
 * @param {XY} oPosB
 * @param {XY} oPosC
 * @return {number}
 */
function counterClockWise ( oPosA, oPosB, oPosC ){
	var dx1, dx2, dy1, dy2 ;

	dx1 = oPosB.x - oPosA.x ;
	dy1 = oPosB.y - oPosA.y;
	dx2 = oPosC.x - oPosA.x ;
	dy2 = oPosC.y - oPosA.y ;

 // if ( fabs(dx1) < ACCURACY_DOUBLE )
//    dx1 = 0.0 ;
// if ( fabs(dx2) < ACCURACY_DOUBLE )
//    dx2 = 0.0 ;
// if ( fabs(dy1) < ACCURACY_DOUBLE )
//    dy1 = 0.0 ;
// if ( fabs(dy2) < ACCURACY_DOUBLE )
//    dy2 = 0.0 ;

	if ( (dx1*dy2) > (dy1*dx2) ){
		return 1;
	}

	if ( (dx1*dy2) < (dy1*dx2) ){
		return -1;
	}

	if ( ((dx1*dx2) < 0.0) || ((dy1*dy2) < 0.0) ){
     		return -1;
	}

	if ( (dx1*dx1+dy1*dy1) < (dx2*dx2+dy2*dy2) ){
		return 1;
	}

	return 0;
}