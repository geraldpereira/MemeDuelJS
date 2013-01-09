/**
 * @preserve 
 * MemeDuel v 0.1
 * Copyright 2012 Gerald Pereira. 
 * Mail : gerald.rapiere@gmail.com
 *  
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the author be held liable for any damages
 * arising from the use of this software.
 */

// Au chargement de la page notre application est initialisée
window.onload = init;

/**
 * Point d'entrée de l'application
 */
function init() {
	// Initialise le modèle
	var mdModel = new Model();

	// Initialise la vue
	var mdView = new View(mdModel);
	
	// Initialise le controleur
	var mdController = new Controller(mdModel,mdView);

	var mdConfigManager = new ConfigurationManager(mdView);
	
	// Images.js => on charge les images
	loadImages(mdView);
}

var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * Permet d'afficher des logs dans la console de Chrome, pour éviter un plantage
 * si elle n'est pas présente on l'initialise avec des fonctions vides
 */

var console;
if (!window.console) {
	console = {};
}else{
	console = window.console;
}
console.log = console.log || function() {
};
console.warn = console.warn || function() {
};
console.error = console.error || function() {
};
console.info = console.info || function() {
};
