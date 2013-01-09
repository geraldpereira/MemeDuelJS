// Constantes pour les objets de l'environnement du jeu 
GODEnvConstants = {
	// Tout en metres car le drawScale est variable
	world : {
		nWidth : 70,
		nHeight : 30
	},

	sun : {
		// View
		zOrder : 37,
		// Position du centre du soleil en Px
		oPosition : {
			// Au milieu du monde
			x : 1750,
			// en haut du monde
			y : 100
		}
	},

	ground : {
		// View
		zOrder : 100,
		sImage : "ground",
		// Position du haut de l'image
		nPosY : 27.85,

		// Model
		nHeight : 2,
		// Position du centre de l'objet
		nPosYModel : 29
	},

	foreground : {
		// View
		zOrder : 40,
		sImage : "foreground",
		nPosY : 24,
		nScrollFactorX : 0.2,
		nScrollFactorY : 0
	},

	middleground : {
		// View
		zOrder : 39,
		sImage : "middleground",
		nPosY : 25, // 16
		nScrollFactorX : 0.4,
		nScrollFactorY : 0.1
	},

	middleground2 : {
		// View
		zOrder : 38,
		sImage : "middleground2",
		nPosY : 23, // 16
		nScrollFactorX : 0.7,
		nScrollFactorY : 0.2
	},
	
	background : {
		// View
		zOrder : 36,
		sImage : "background",
		// 10 pour plus tard
		nPosY : 1,
		nScrollFactorX : 0.9,
		nScrollFactorY : 0.4
	}
};
