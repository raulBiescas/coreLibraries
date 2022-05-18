/*!
 * historia.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 historia.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

window.addEvent('domready', function() {

initHistory('');	
		
});

function initHistory(root)
{
$$(root+' .newEntry').addEvent('click',function(event){nuevaEntrada(event.target);});  
eventosHistoria(root);

$$(root+' .contenedorGlobalHistoria').each(function(item)
	{
	if (item.getFirst('.nuevoFichero'))
		{
		item.getFirst('.nuevoFichero').removeClass('showOnEdit');
		item.getFirst('.nuevoFichero').addClass('oculto');
		}
	});

$$(root+' .ampliacionTotalHistoria').addEvent('click',function(event){ampliarHistoria(0,event.target);});  

//comprobar si hay soporte a imagenes
$$(root+' .contenedorGlobalHistoria').each(function(item)
	{
	if (item.getFirst('.contenedorHistoria'))
		{
		if (item.getFirst('.contenedorHistoria').hasClass('soporteImagenes'))
			{
			if (item.getFirst('.areaNuevoFichero'))
				{
				new Element('input',{'class':'oculto','name':'SoporteImagenes','value':'si'}).inject(item.getFirst('.areaNuevoFichero').getFirst('form'));
				}
			}
		}
	});

//trunca la hora en las fechas
$$(root+' .fechaHistoria').each(function(item)
		{
		var s=item.getElement('.datos').get('text');
		item.getElement('.datos').set('text',s.substring(0,10));
		});

//numero ficheros
$$(root+' .fondoNumFiles').each(function(item)
		{
		item.set('text', calcularFicheros(item));
		});

$$(root+' .fondoNumPictures').each(function(item)
		{
		item.set('text', calcularPictures(item));
		});	
}

function ficheroAñadidoHistoria(elId)
{
if ($(elId).getParent('.contenedorFicheros'))
	{
	var contenedor=$(elId).getParent('.contenedorFicheros');
	if (contenedor.getElement('.fondoNumFiles'))
		{
		var numFiles=contenedor.getElement('.fondoNumFiles');
		numFiles.set('text',calcularFicheros(numFiles));
		}
	}
if ($(elId).getParent('.contenedorImagenes'))
	{
	var contenedor=$(elId).getParent('.contenedorImagenes');
	if (contenedor.getElement('.fondoNumPictures'))
		{
		var numPictures=contenedor.getElement('.fondoNumPictures');
		numPictures.set('text',calcularPictures(numPictures));
		}
	}
}

function calcularFicheros(item)
{
		var contenedor=item.getParent('.contenedorFicheros');
		return contenedor.getElements('.lineaFichero').length;
}

function calcularPictures(item)
{
		var contenedor=item.getParent('.contenedorImagenes');
		return contenedor.getElements('.thumbGalleryItem').length;
}

function eventosHistoria(raiz)
{
$$(raiz +' .botonMostrar').addEvent('click',function(event){mostrarHistoria(event.target);});  
$$(raiz +' .botonOcultar').addEvent('click',function(event){ocultarHistoria(event.target);});  
$$(raiz +' .nuevoFicheroHistoria').addEvent('click',function(event){
	var contenedorGlobal=event.target.getParent('.contenedorGlobalHistoria');
	var scroll=contenedorGlobal.getScroll();
	var scrolly=scroll.y;
	if (event.target.getParent('.contenedorScrollSuperior'))
		{
		scrolly+=event.target.getParent('.contenedorScrollSuperior').getScroll().y;
		}
	contenedorGlobal.getFirst('.areaNuevoFichero').removeClass('oculto');
	contenedorGlobal.getFirst('.areaNuevoFichero').setStyle('top',scrolly+'px');
	var form=contenedorGlobal.getFirst('.areaNuevoFichero').getFirst('form');
	form.getElement('input[name="IdTabla"]').value=event.target.get('historia');
	contenedorGlobal.getElements('.ficherosHistoria').removeClass('contenedorFicherosSeleccionado');
	var contenedorFicheros=event.target.getParent('.contenedorFicheros');
	contenedorFicheros.getElement('.ficherosHistoria').addClass('contenedorFicherosSeleccionado');
	});
}

function nuevaEntrada(el)
{
	arr=el.getParents('form');
	var form=arr[0];
	var formId=form.get('formId');
	
	var conts=el.getParents('.contenedorHistoria');
	var cont=conts[0];
	var nuevo=cont.getElement('.nuevaHistoria');
	var destino_id=nuevo.get('id');
	
	var req=new Form.Request(form,destino_id , {
	    resetForm:true,
		onSuccess: function(target,texto,textoXML) { 
			var destino_id=target.get('id');
			var idNuevo=$(destino_id).getFirst().get('id');
			$(idNuevo).inject($(destino_id),'after');
			eventosFormulario('#'+idNuevo);
			eventosHistoria('#'+idNuevo);
			activarEdiciones('#'+idNuevo);
			noBorrar('#'+idNuevo);
			ficheroAñadidoHistoria($(idNuevo).getElement('.superiorHistoria').get('id'));
			if ($(idNuevo).getElement('.indexChapter'))
				{
				$(idNuevo).inject($(idNuevo).getParent('.contenedorHistoria').getLast('.bloqueHistoria'),'after');
				if ($(idNuevo).getParent('.bloqueScroll'))
					{
					var myFx = new Fx.Scroll($(idNuevo).getParent('.bloqueScroll'), {
						duration: 1000,
						wait: false
						}).toElement($(idNuevo),'y');
					}
				}
    		}  
	});
	
	req.send();
	
}

function ampliarHistoria(id,el)
{
if (id==0)
	{
	var bloquesHistoria=el.getParent('.contenedorGlobalHistoria').getElements('.bloqueHistoria');
	if (bloquesHistoria.length>0)
		{
		id=bloquesHistoria[0].get('historia');
		}
	}
if (id!=0)
	{
	$$('.popUpElement').removeClass('oculto');
	$('popUp').empty();
	var contenedor=new Element('div',{'class':'ampliacionHistoria'}).inject($('popUp'));
	var cabecera=new Element('div',{'class':'cabeceraAmpliacionHistoria'}).inject(contenedor);
	var cuerpo=new Element('div',{'class':'cuerpoAmpliacionHistoria textoFormateado'}).inject(contenedor);
	var fotos=new Element('div',{'class':'fotosAmpliacionHistoria'}).inject(contenedor);
	var navegacion=new Element('div',{'class':'navegacionAmpliacionHistoria'}).inject(contenedor);

	var bloqueHistoria=el.getParent('.contenedorGlobalHistoria').getElement('.bloqueHistoria[historia="'+id+'"]');
	var elId=bloqueHistoria.get('id');
	var fecha=bloqueHistoria.getElement('.fechaHistoria').getElement('.datos').get('text');
	new Element('div',{'class':'elementoCabeceraAmpliacion','text':fecha}).inject(cabecera);
	var titulo=bloqueHistoria.getElement('.tituloHistoria').getElement('.datos').get('text');
	new Element('div',{'class':'elementoCabeceraAmpliacion','text':titulo}).inject(cabecera);
	if (bloqueHistoria.getElement('.tagsHistoria')){bloqueHistoria.getElement('.tagsHistoria').clone().inject(cabecera);}
	if (bloqueHistoria.getElement('.numFiles')){bloqueHistoria.getElement('.numFiles').clone().inject(cabecera);}
	if (bloqueHistoria.getElement('.numPictures')){bloqueHistoria.getElement('.numPictures').clone().inject(cabecera);}
	cuerpo.set('html',bloqueHistoria.getElement('.textoHistoria').getElement('.datos').get('html'));
	if (bloqueHistoria.getElement('.ficherosHistoria')){bloqueHistoria.getElement('.ficherosHistoria').clone().inject(cuerpo,'top');}
	if (bloqueHistoria.getElement('.thumbGalleryHistory'))
		{
		var areaFotos=new Element('div',{'class':'areaFotosAmpliacion'}).inject(fotos);
		var thumbarea=new Element('div',{'id':'thumbarea'}).inject(areaFotos);
		var thumbareaContent=new Element('div',{'id':'thumbareaContent','class':'thumbAreaAmpliacion'}).inject(thumbarea);
		var gallery=bloqueHistoria.getElement('.thumbGalleryHistory');
		var tablaDatos=$(gallery).get('tablaDatos');
		if ($(gallery).getElements('.thumbGalleryItem').length>0)
			{
			$(gallery).getElements('.thumbGalleryItem').each(function(item,index)
				{
				var nuevoThumb=item.clone().inject(thumbareaContent);
				nuevoThumb.removeClass('thumbGalleryItem');
				var idPicture=item.get('idPicture');
				var linea=$(tablaDatos).getElement('.lineaDatos[linea="'+idPicture+'"]');
				var medium=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="Medium"]').getFirst('.valor').get('text');
				nuevoThumb.set('src',medium);
				//convertir en link a la imagen full
				});
			var scrollGalleryObj = new scrollGallery({imagearea:'none',autoScroll:false});
			}
		}
	if (bloqueHistoria.getPrevious('.bloqueHistoria'))
		{
		var navegacionLeft=new Element('div',{'class':'navegacionLeft itemNavegacionHistoria'}).inject(navegacion);
		var previousId=bloqueHistoria.getPrevious('.bloqueHistoria').get('historia');
		navegacionLeft.set('historia',previousId);
		navegacionLeft.set('elId',elId);
		var previousFecha=bloqueHistoria.getPrevious('.bloqueHistoria').getElement('.fechaHistoria').getElement('.datos').get('text');
		if (bloqueHistoria.getPrevious('.bloqueHistoria').getElement('.indexChapter'))
				{previousFecha=bloqueHistoria.getPrevious('.bloqueHistoria').getElement('.indexChapter').get('chapterNumber');}
		var previousTitulo=bloqueHistoria.getPrevious('.bloqueHistoria').getElement('.tituloHistoria').getElement('.datos').get('text');
		navegacionLeft.set('text','<< '+previousFecha+' : '+previousTitulo);
		}
	if (bloqueHistoria.getNext('.bloqueHistoria'))
		{
		var navegacionRight=new Element('div',{'class':'navegacionRight itemNavegacionHistoria'}).inject(navegacion);
		var nextId=bloqueHistoria.getNext('.bloqueHistoria').get('historia');
		navegacionRight.set('historia',nextId);
		navegacionRight.set('elId',elId);
		var nextFecha=bloqueHistoria.getNext('.bloqueHistoria').getElement('.fechaHistoria').getElement('.datos').get('text');
		if (bloqueHistoria.getNext('.bloqueHistoria').getElement('.indexChapter'))
				{nextFecha=bloqueHistoria.getNext('.bloqueHistoria').getElement('.indexChapter').get('chapterNumber');}
		var nextTitulo=bloqueHistoria.getNext('.bloqueHistoria').getElement('.tituloHistoria').getElement('.datos').get('text');
		navegacionRight.set('text',nextFecha+' : '+nextTitulo+'  >>');
		}
	$$('.itemNavegacionHistoria').addEvent('click',function(event){ampliarHistoria(event.target.get('historia'),$(event.target.get('elId')));});
	}

}

function ocultarHistoria(el)
{
var padre=el.getParent('.bloqueHistoria');
el.getPrevious('.botonMostrar').removeClass('oculto');
el.addClass('oculto');
var bloque=padre.getElement('.inferiorHistoria');
bloque.dissolve();
}

function mostrarHistoria(el)
{
var padre=el.getParent('.bloqueHistoria');
el.getNext('.botonOcultar').removeClass('oculto');
el.addClass('oculto');
var bloque=padre.getElement('.inferiorHistoria');
bloque.reveal();
}