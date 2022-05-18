/*!
 * buscadores.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 buscadores.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function buscadorSobreTabla(div,tabla,campos)
{
div.addClass('contenedorBuscador');
div.set('tablaBuscar',tabla);
var camposList="";
campos.each(function(item)
	{
	camposList+=item+',';
	});
div.set('camposBusqueda',camposList);
var lineaSup=new Element('div',{'class':'lineaSupBuscador'}).inject(div);
var input=new Element('input',{'class':'inputBuscador','type':'text'}).inject(lineaSup);
var areaResultados=new Element('div',{'class':'resultsBuscador'}).inject(div);	
input.addEvent('keyup',function(e){actualizarBusqueda(e.target);});
input.addEvent('focus',function(e){limpiarBusqueda(e.target);});
}

function actualizarBusqueda(el)
{
var texto=el.value.toLowerCase();
var contenedor=el.getParent('.contenedorBuscador');
contenedor.getElement('.resultsBuscador').empty();
if (texto.length>2)
	{
	var tabla=contenedor.get('tablaBuscar');
	var campos=contenedor.get('camposBusqueda').split(',');
	$(tabla).getElements('.lineaDatos').each(function(linea)
		{
		var encontrado=false;
		var textoResultado="";
		campos.each(function(campo)
			{
			if (linea.getElement('.datos[campo="'+campo+'"]'))
				{
				var valor=linea.getElement('.datos[campo="'+campo+'"]').getFirst('.valor').get('text');
				textoResultado+=valor+' - ';
				valor=valor.toLowerCase();
				if (valor.search(texto)>-1)
					{encontrado=true;}
				}
			});
		if (encontrado)
			{
			var lineaRes=new Element('div',{'class':'lineaResBuscador','linea':linea.get('linea')}).inject(contenedor.getElement('.resultsBuscador'));
			lineaRes.set('text',textoResultado);
			lineaRes.addEvent('click',function(event){seleccionarResultado(event.target);});
			}
		});
	}
}

function seleccionarResultado(el)
{
var contenedor=el.getParent('.contenedorBuscador');
if (!el.hasClass('lineaResBuscador'))
	{el=el.getParent('.lineaResBuscador');}
var tabla=contenedor.get('tablaBuscar');
var lineaSeleccionada=$(tabla).getElement('.lineaDatos[linea="'+el.get('linea')+'"]');
lineaSeleccionada.addClass('seleccionBusqueda');
if (lineaSeleccionada.getPrevious('.lineaGrupo'))
	{
	showGroup(lineaSeleccionada.getPrevious('.lineaGrupo').getElement('.botonMostrarGrupo'));
	}
contenedor.getElement('.resultsBuscador').empty();
contenedor.getElement('input').value='';
var myFx = new Fx.Scroll($(tabla).getParent('.scrollBuscador'));
myFx.toElement(lineaSeleccionada);
}

function limpiarBusqueda(el)
{
var contenedor=el.getParent('.contenedorBuscador');
var tabla=contenedor.get('tablaBuscar');
$(tabla).getElements('.seleccionBusqueda').each(function(item)
	{
	item.removeClass('seleccionBusqueda');
	});
}