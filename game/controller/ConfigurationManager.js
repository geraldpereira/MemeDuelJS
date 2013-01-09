/**
 * 
 * @param {View} mdView
 * @constructor
 */
function ConfigurationManager(mdViewParam) {
//	$("#resolutions").change(function(){
//		var sResolution = this.options[this.selectedIndex].id;
//		var oResolution = ConfigurationConstants.resolutions[sResolution];
//		mdViewParam.setResolution(oResolution);
//		$("#game").css("width",(oResolution.nWidth+22)+"px").css("height",(oResolution.nHeight+27)+"px");
//	});
//	$("#roundPositions").change(function(){
//		ConfigurationConstants.bRoundPositions = this.checked;
//	});
	
	// Virer ca de la !!!!
	$("#damageObjects").change(function(){
		ConfigurationConstants.game.current.bDamageObjects = this.checked;
	});
	
	$("#configuration > div").click(function(){
		var mdConfig = ConfigurationConstants.graphics[this.id];
		ConfigurationConstants.graphics.current = mdConfig;
		$("#game").css("width",(mdConfig.nWidth+22)+"px").css("height",(mdConfig.nHeight+27)+"px");
		mdViewParam.graphicConfigurationUpdated();
	});
	
	
};
