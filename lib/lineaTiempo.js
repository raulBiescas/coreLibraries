/*!
 * lineaTiempo.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 lineaTiempo.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function situarMomentos()
{
i=0;
$$('.momento').each(function(item, index){
 var dias=item.get('dias')*1;
 var posicion=Math.ceil((dias/365)*100);
 item.setStyle('left',posicion+'%');
 if (i%2==0)
 {
 	item.setStyle('top','20px');
 	var union=item.getChildren('.union');
 	union[0].setStyle('height','13px');
 	}

 i++;
});
	}
	
function situarPeriodos()
{
	var previousItem=0;	
	var posicionAnterior=0;
	var posicion=0;
	$$('.periodo').each(function(item, index){
		var dias=item.get('dias')*1;
		posicion=Math.ceil((dias/365)*100);
		item.setStyle('left',posicion+'%');
		if (dias>0)
		{
		var tam=posicion-posicionAnterior;
		previousItem.setStyle('width',tam+'%');
		}
		else
		{ 
			if (previousItem)
			{
				var tam=100-posicionAnterior;
				previousItem.setStyle('width',tam+'%');
				}
		}
		previousItem=item;
		posicionAnterior=posicion;
		
});	
	var tam=100-posicionAnterior;
	previousItem.setStyle('width',tam+'%');
	}