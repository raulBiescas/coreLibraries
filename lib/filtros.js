/*!
 * filtros.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 filtros.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

var cambiosFiltroInicial=0;
var segundosBase=4;
var segundosToGo=0;
var relojCorriendo=false;

window.addEvent('domready', function() {

if ($('areaFiltroPpal'))
	{
	$$('#areaFiltroPpal select').addEvent('change',function(event){
		cambiosFiltroInicial+=1;
		window.setTimeout("cuentaAtras()",segundosBase*1000);
		var linea=event.target.getParent('.lineaFiltro');
		linea.addClass('filtroCambiado');
		$$('.botonFiltro').addClass('relojCorriendo');
		$$('.relojFiltro').setStyle('display','block');
		segundosToGo=segundosBase;
		$$('.relojFiltro').set('text',segundosToGo);
		relojCorriendo=true;
		});
	$$('#areaFiltroPpal input').addEvent('change',function(event){
		if (event.target.getParent('.lineaFiltro'))
			{
			cambiosFiltroInicial+=1;
			window.setTimeout("cuentaAtras()",segundosBase*1000);
			var linea=event.target.getParent('.lineaFiltro');
			linea.addClass('filtroCambiado');
			$$('.botonFiltro').addClass('relojCorriendo');
			$$('.relojFiltro').setStyle('display','block');
			segundosToGo=segundosBase;
			$$('.relojFiltro').set('text',segundosToGo);
			relojCorriendo=true;
			}
		});
	$$('#areaFiltroPpal .filterResults').each(function(item)
		{
		if (item.getElement('.filterTotalResults'))
			{
			var tablaDiv=item.get('tablaDiv');
			if ($(tablaDiv))
				{
				var lineas=$(tablaDiv).getElements('.lineaDatos').length;
				item.getElement('.filterTotalResults').set('text',lineas);
				}
			}
		});
	$$('#areaFiltroPpal .filterRadioControl').addEvent('change',function(event){
		filterSplitValue(event.target);

		});
	}

$$('.botonFiltro').addEvent('click',function(event){
	var form=event.target.getParent('form');
	form.submit();
	});

window.setTimeout("segundosFiltro()",1000);
	
});

function filterSplitValue(el)
{
var linea=el.getParent('.lineaFiltro');
var all=true;
var value='';
linea.getElements('.filterRadioControl').each(function(item)
	{
	if (!item.checked)
		{
		all=false;
		}
	else
		{
		value+=item.get('value')+',;';
		}
		
	});
var input=linea.getElement('.splitFilterValue');
if (all)
	{
	input.value='ALL';
	}
else
	{
	input.value=value;
	}
}

function segundosFiltro()
{
if (relojCorriendo && (segundosToGo>0))
	{
	segundosToGo=segundosToGo - 1;
	$$('.relojFiltro').set('text',segundosToGo);
	}
window.setTimeout("segundosFiltro()",1000);
}

function cuentaAtras()
{
cambiosFiltroInicial-=1;
if (cambiosFiltroInicial==0)
	{
	calcularFiltroInicial();
	}
}

function calcularFiltroInicial()
{

$('formFiltroInicial').submit();

/*var nuevoFiltro='';
$$('#areaFiltroPpal select').each(function(item,index){
	nuevoFiltro+= encodeURIComponent(item.get('name')) + '=' + encodeURIComponent(item.options[item.selectedIndex].text) + '&'; 
});

return window.location.pathname + '?' + nuevoFiltro;*/
}