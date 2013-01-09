/**
 * Constantes pour les objets de l'environnement du jeu 
 */
ConfigurationConstants = {};

ConfigurationConstants.game = {};

ConfigurationConstants.game['edit'] = {
		bShowEditPanel : true,
		bShowPlayButton : true,
		bShowStopButton : false,
		bShowSaveButton : false,
		bDamageObjects : false
		// TODO mettre les taille du world ici aussi !
};

//TODO a remplacer par des paramètres passés dans l'url
ConfigurationConstants.game.current = ConfigurationConstants.game['edit'];

ConfigurationConstants.game['test'] = {
		bShowEditPanel : false,
		bShowPlayButton : false,
		bShowStopButton : true,
		bShowSaveButton : true,
		bDamageObjects : false
};

ConfigurationConstants.graphics = {};

ConfigurationConstants.graphics['min'] = {
	bDisplayShadows : false,
	bRoundPositions : true,
	nParticles : 0, // Doit on afficher les particules
	bDisplayEnv : false, // Doit on afficher le fond, le soleil	
	nWidth : 640,
	nHeight : 480
};

ConfigurationConstants.graphics['low'] = {
	bDisplayShadows : false,
	bRoundPositions : true,
	nParticles : 5,
	bDisplayEnv : true,
	nWidth : 640,
	nHeight : 480
};

ConfigurationConstants.graphics['medium'] = {
	bDisplayShadows : true,
	bRoundPositions : true,
	nParticles : 15,
	bDisplayEnv : true,
	nWidth : 800,
	nHeight : 600
};

ConfigurationConstants.graphics['high'] = {
	bDisplayShadows : true,
	bRoundPositions : true,
	nParticles : 30,
	bDisplayEnv : true,
	nWidth : 1024,
	nHeight : 768
};

ConfigurationConstants.graphics['max'] = {
	bDisplayShadows : true,
	bRoundPositions : false,
	nParticles : 50,
	bDisplayEnv : true,
	nWidth : 1024,
	nHeight : 768
};

//TODO a remplacer par des paramètres passés dans l'url
ConfigurationConstants.graphics.current = ConfigurationConstants.graphics['low'];