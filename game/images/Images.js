Images = {
	bLoaded : false
};

function loadImages(mdView) {
	var sources = {};
	sources['wood'] =  "game/images/wood.png";
	sources['stone'] = "game/images/stone.png";
	sources['stone75'] = "game/images/stone75.png";
	sources['stone50'] = "game/images/stone50.png";
	sources['stone25'] = "game/images/stone25.png";
	sources['wood75'] = "game/images/wood75.png";
	sources['wood50'] = "game/images/wood50.png";
	sources['wood25'] = "game/images/wood25.png";
	sources['sun'] = "game/images/sun.png";
	sources['ground'] = "game/images/ground.png";
	sources['foreground'] = "game/images/foreground.png";
	sources['middleground'] = "game/images/middleground.png";
	sources['middleground2'] = "game/images/middleground2.png";
	sources['background'] = "game/images/background.png";
	sources['stoneParticles'] = "game/images/stoneParticles.png";
	sources['woodParticles'] = "game/images/woodParticles.png";
	sources['sandParticles'] = "game/images/sandParticles.png";

	var images = Images;
	var loadedImages = 0;
	var numImages = 0;
	// get num of sources
	for ( var src in sources) {
		numImages++;
	}
	for ( var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if (++loadedImages >= numImages) {
				images.bLoaded = true;
				mdView.loadEnv();
			}
		};
		images[src].src = sources[src];
	}
}