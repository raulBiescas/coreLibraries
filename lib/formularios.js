/*!
 * formularios.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 formularios.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

Date.defineParser('%d/%m/%Y');
var escuchandoFormularios=new Array();

/*Locale.define("en-US", 'Date', 'dateOrder' , ['date', 'month', 'year', '/']);		
Locale.define("en-US", 'Form.Validator', 'dateSuchAs' , 'DD/MM/YYYY');
Locale.define("en-US", 'Form.Validator', 'dateInFormatMDY' , 'DD/MM/YYYY');
Locale.use("en-US");	*/
Locale.use("es-ES");

Form.Validator.add('validate-time', {
    errorMsg: 'Time format should be hh:mm',
    test: function(element){
        return element.value.test(/(([0-9])|([0-1][0-9])|([2][0-3])):([0-5][0-9])/);
    }
});


window.addEvent('domready', function() {



if ($('edicionGlobal'))
	{
	$('edicionGlobal').addEvent('click',function(event){cambiarModoEdicion();});  
	}

initForms('');
			
});

function initForms(root)
{
eventosFormulario(root);
$$(root+' .nuevoFichero').addEvent('click',function(event){event.target.getNext('.areaNuevoFichero').removeClass('oculto');});  
$$(root+' .cerrarNuevoFichero').addEvent('click',function(event){
		event.target.getParent('.areaNuevoFichero').addClass('oculto');
		$$('.contenedorFicherosSeleccionado').removeClass('contenedorFicherosSeleccionado');
		});  	

$$(root+' .tablaParaSelect').each(function(item)
			{
			selectFromTablaDiv(item);
			});

$$(root+' .referencesBlock').each(function(item)
	{
	item.getElements('.tablaDiv').each(function(tabla)
		{
		var idTabla=tabla.get('id');
		inicializarTablaDiv(idTabla);
		ocultarTitulo(idTabla);
		tablaToLista(tabla);
		tabla.getElements('.funcionesTabla').each(function(el){el.addClass('oculto');});
		item.getElement('.addReference').addEvent('click',function(e)
			{
			var form=e.target.getParent('form');
			if (form.getElement('input[name="Reference"]').value.trim()!='')
				{
				var suffix=e.target.getParent('.referencesBlock').get('suffix');
				newElementTablaDiv(e.target.getParent('.referencesBlock').getElement('.tablaDiv').get('id'),suffix+'References',0,form.toQueryString().parseQueryString());}
			else
				{
				alert('Please set a reference');
				}
			});
		});
	});
}

function noBorrar(raiz)
{
$$(raiz+ ' .borradoLinea').addClass('oculto');
$$(raiz+ ' .borrado').addClass('oculto');
}

function noEditar(raiz)
{
$$(raiz+ ' .edicionLinea').addClass('oculto');
$$(raiz+ ' .edicion').addClass('oculto');
}

function inicializarFormulario(form)
{
$$('#'+form+' .datos').each(function(item, index)
	{
	if (item.get('tipo'))
		{
		var tipo=item.get('tipo');
		var padre=item.getParent();
		if (tipo.search('varchar')==0)
			{
			var caracteres=(tipo.substring(8,tipo.length-1))*1;
			if (caracteres > 50)
				{padre.addClass('formTextoGrande');}
			if (caracteres > 100)
				{padre.addClass('edicionTextarea');}
			}
		}
	});

var mensajes=$$('#'+form+' .mensaje');
if (mensajes.length==0)
{
new Element('div',{'class':'mensaje'}).inject($(form));
}
	
}

function eventosFormulario(raiz)
{

$$(raiz+' .cancelado').each(function(item, index){
	item.addEvent('click',function(event){cancel(event.target);});  
	});
	
$$(raiz+' .edicion').each(function(item, index){
	item.addEvent('click',function(event){editar(event.target);});  
	});

$$(raiz+' .guardado').each(function(item, index){
	item.addEvent('click',function(event){save(event.target);});  
	});

$$(raiz+' .borrado').each(function(item, index){
	item.addEvent('click',function(event){borrar(event.target);});  
	});
	
$$(raiz+' .simbolo').each(function(item, index){
	formatoSimbolo(item);
	});

$$(raiz+' .botonFichero').each(function(item, index){
	item.addEvent('click',function(event){uploadFile(event.target);});  
	});

$$(raiz+' .tituloFichero').each(function(item)
		{
		if (item.get('text').trim()=='')
			{
			item.set('text',extractFileFromLink(item.get('href')));
			}
		});
	
}

function cambiarModoEdicion()
{
modoEdicion=$('edicionGlobal').get('modoEdicion');
if (modoEdicion=='1')
	{
	$('edicionGlobal').set('modoEdicion','0');
	todosNoEditables();
	$('edicionGlobal').set('text','Edit mode');
	if (typeof(afterDisablingEdit)=='function')
		{
		afterDisablingEdit();
		}
	}
else
	{
	$('edicionGlobal').set('modoEdicion','1');
	todosEditables();
	$('edicionGlobal').set('text','Exit edit mode');	
	if (typeof(afterEnablingEdit)=='function')
		{
		afterEnablingEdit();
		}
	}
	
}

function linkFormulario(formulario,campo,basePath)
{
var ident=$(formulario).get('idForm');
var items=$$('#'+formulario+' .datos[campo="'+campo+'"]');
items.each(function(valor,index)
	{
	var link  = new Element('a', { 'class':valor.get('class'),'href':basePath+'&id='+ident,'tipo':valor.get('tipo'),'campo':valor.get('campo'),'text':valor.get('text')}).inject(valor, 'after');
	valor.destroy();
	
	/*var texto=item.get('text');
	item.set('html','<a href="'+link+'&id='+ident+'">'+texto+'</a>');*/
	});

}

function addClassToForm(form,field,prefix,cell)
{
if ($(form).getElement('.datos[campo="'+field+'"]'))
	{
	var newClass=$(form).getElement('.datos[campo="'+field+'"]').get('text').replace(/ /g,'_');
	if (typeof(prefix)!='undefined')
		{
		newClass=prefix+newClass;
		}
	if (typeof(cell)!='undefined')
		{
		if ($(form).getElement('.datos[campo="'+cell+'"]'))
			{$(form).getElement('.datos[campo="'+cell+'"]').addClass(newClass);}
		}
	else
		{
		$(form).getParent('div').addClass(newClass);
		}
	
	}
}
	
function formatoSimbolo(el)
{
	var tipo=el.get('tipo');
	var item=el.getPrevious('span');
	switch (tipo)
		{
		case 'CUR':
		var valor=limpiarNumero(item.get('text'))*1;
		var nuevoValor=valor.decimal(2);
		item.set('text',nuevoValor);
		break;
		case 'm':
		darFormato(item,'numerico');
		break;
		
		}
}

function darFormato(el,tipo)
{
var valor=el.get('text');
switch (tipo)
	{
	case 'moneda':
	var num=valor*1;
	var valor=num.toFixed(2);
	el.set('text',valor);
	break;
	}

}


function borrar(el)
{
	if (confirm("Are you sure you want to delete this element?"))
		{
		arr=el.getParents('form');
		var formulario=arr[0];
		var idForm=formulario.get('id');
		var tablaForm=$(idForm).get('tablaForm');
		var tablaId=$(idForm).get('idForm');	
		var resul=borrarDB(tablaForm,tablaId)*1;
		if (resul)
			{
				arr=el.getParents('.baseElemento');	
				arr[0].destroy();		
				alert("Element successfully deleted");	
				}	
		else
			{
			alert("Error: Element not deleted");				
				}	
			}
	
	}

function cancel(el)
{
	//arr=el.getParents('form');
	var formulario=el.getParent('form');
	//var formulario=arr[0];
	//var idForm=formulario.get('id');
	//$$('#'+idForm+' .editable').each(function(item, index){quitarControles(item);});
	formulario.getElements('.editable').each(function(item, index){quitarControles(item);});
	//$$('#'+idForm+' .campoLink').each(function(item, index){item.addClass('oculto');});
	formulario.getElements('.campoLink').each(function(item, index){item.addClass('oculto');});
	//$$('#'+idForm+' .controlesIniciales').setStyle('display','block');
	formulario.getElements('.controlesIniciales').each(function(item){item.setStyle('display','block');})
	//$$('#'+idForm+' .controlesFinales').setStyle('display','none');
	formulario.getElements('.controlesFinales').each(function(item){item.setStyle('display','none');})
	if (typeof(hookDespuesCancelar)=='function')
		{hookDespuesCancelar(el);}
	}

function editar(el)
{
	//arr=el.getParents('form');
	var formulario=el.getParent('form');
	//var idForm=formulario.get('id');
	//$$('#'+idForm+' .editable').each(function(item, index){
	formulario.getElements('.editable').each(function(item, index){
		var display=item.getStyle('display');
		if (display!='none' || item.match('label') )
			{permitirEdicion(item);}
	});
	//$$('#'+idForm+' .controlesIniciales').setStyle('display','none');
	formulario.getElements('.controlesIniciales').each(function(item){item.setStyle('display','none');})
	//$$('#'+idForm+' .controlesFinales').setStyle('display','block');
	formulario.getElements('.controlesFinales').each(function(item){item.setStyle('display','block');})
	}
	
function save(el)
{
	arr=el.getParents('form');
	var formulario=arr[0];
	var idForm=formulario.get('id');
	var tablaForm=$(idForm).get('tablaForm');
	var tablaId=$(idForm).get('idForm');
	
	formulario.getElements('.nestedGrupoInputs').each(function(item)
		{
		var selects=item.getElements('select');
		if (selects.length>0)
			{
			var datos=item.getElements('.datos');	
			if (getSelectValueSelect(selects[selects.length-1])=='')
				{
				var i=0;
				while (i<selects.length)
					{
					setSelectValueSelect(selects[i], datos[i].get('previousValue'));
					i++;
					}
				}
			else
				{
				var value=getSelectValueSelect(selects[selects.length-1]);
				var tables=item.getNext('.nestedValues').getElements('.tablaDiv');
				var id=0;
				tables[tables.length-1].getElements('.lineaDatos').each(function(line)
					{
					var lineValue=line.getElement('.valor').get('text');
					if (lineValue.trim()==value.trim())
						{id=line.get('linea')*1;
						}
					});
				if (id!=0)
					{
					item.getPrevious('.grupoInputs').getElement('input').value=id;
					var i=0;
					while (i<selects.length)
						{
						datos[i].set('previousValue',getSelectValueSelect(selects[i]));
						i++;
						}
					}
				}
			}
		});
	
	preSubmit(idForm);		
	var val=new Form.Validator.Inline($(idForm));
	
	var formResult=$(idForm).getElement('.mensaje');
	
	if ($(idForm).retrieve('form.request'))
		{
		var req=$(idForm).retrieve('form.request');
		req.setOptions({
		extraData: { 
		  'tabla': tablaForm,
		  'id':tablaId
		}});
		
		}
	
	else
		{
	
		var req=new Form.Request($(idForm),formResult , {

		extraData: { 
		  'tabla': tablaForm,
		  'id':tablaId
		},
		resetForm:false,
		onSuccess: function(target,texto,textoXML) { 
		target.setStyle('display','block');
		setTimeout("$$('.mensaje').setStyle('display','none');",4000);
		if (target.get('text').indexOf("Error") != 0)
			{
			var formularioTarget=target.getParent('form');
			if (formularioTarget.hasClass('separatedForm'))
				{
				var lines=formularioTarget.get('lines').split(',');
				var fields=formularioTarget.get('fields').split(',');
				var tableLine=$(formularioTarget.get('tableRef')).getElement('.lineaDatos[tabla="'+formularioTarget.get('tablaForm')+'"][linea="'+formularioTarget.get('idForm')+'"]');
				fields.each(function(field)
					{
					var cell=tableLine.getElement('.celda[campo="'+field+'"]');
					var control=false;
					if (formularioTarget.getElement('input[name="'+field+'"]'))
						{
						control=formularioTarget.getElement('input[name="'+field+'"]');
						}
					else
						{
						if (formularioTarget.getElement('select[name="'+field+'"]'))
							{
							control=formularioTarget.getElement('select[name="'+field+'"]');
							}
						else
							{
							if (formularioTarget.getElement('textarea[name="'+field+'"]'))
								{
								control=formularioTarget.getElement('textarea[name="'+field+'"]');
								}
							}
						}
					if (control)
						{
						var nuevoControl=control.clone().inject(cell.getElement('.valor'),'after');
						nuevoControl.addClass('elementoEdicion');
						cell.getElement('.valor').addClass('editable');
						}
					});
				actualizarDatos(tableLine);
				cancelLinea(tableLine.getElement('div'));	
				if (typeof(hookDespuesGuardar)=='function')
					{hookDespuesGuardar(tableLine);}
				var processed=(formularioTarget.get('processed')*1)+1;
				if (processed==lines.length)
					{
					if (typeof(completedSeparatedForm)=='function')
						{
						completedSeparatedForm(formularioTarget);
						}
					}
				else
					{
					formularioTarget.set('processed',processed);
					formularioTarget.set('idForm',lines[processed]);
					save(formularioTarget.getElement('.botonSubmit'));
					
					}
				}
			else
				{
				var idForm=formularioTarget.get('id');
				actualizarDatos(idForm);
				cancel(target);	
				escuchandoFormularios.each(function(item)
					{
					eval(item+'("'+idForm+'");');
					});
				}
			}
		}  
	  });
	}
  
	if ((val.validate())&&(!formulario.hasClass('noSubmit')))
		{req.send();}
	
}

function uploadFile(el)
{
	arr=el.getParents('form');
	var form=arr[0];
	if (form.getElement('input[name="Link"]').value!='')
		{
		if (!form.hasClass('imagenLocalizada'))
			{
			var formId=form.get('formId');
			
			var conts=el.getParents('.contenedorFicheros');
			if (conts.length==0)
				{
				var conts=$$('.contenedorFicherosSeleccionado');
				}
			var cont=conts[0];//hay que añadir esta clase, sin formato, al contenedor superior
			var nuevos=cont.getElements('.espacioNuevoDoc');
			var num=((nuevos[nuevos.length - 1].get('num'))*1)+1;
			new Element('div',{'class':'espacioNuevoDoc','id':'espacioNuevoDoc'+formId+'_'+num, 'num':num}).inject(nuevos[nuevos.length - 1],'after');
			var destino_id='espacioNuevoDoc'+formId+'_'+num;
			}
		else
			{
			var menuFichero=el.getParent('.areaNuevoFichero');
			var galleries=menuFichero.getSiblings('.picturesGallery');
			if (galleries.length>0)
				{
				var gallery=galleries[0];
				//ver si es se tiene que meter la foto en un rack
				if (gallery.hasClass('rackDetails'))
					{
					var rackDetails=menuFichero.getNext('.rackDetails');
					var contenedorNuevos=rackDetails.getElement('.contenedorNewPicturesRack');
					var nuevos=contenedorNuevos.getElements('.espacioNuevaFotoRack');
					if (nuevos.length>0)
						{var num=((nuevos[nuevos.length - 1].get('num'))*1)+1;}
					else
						{var num=0;}
					new Element('div',{'class':'espacioNuevaFotoRack','id':'espacioNuevaFotoRack'+num,'num':num}).inject(contenedorNuevos);
					var destino_id='espacioNuevaFotoRack'+num;
					}
				else
					{
					var nuevos=gallery.getElements('.espacioNuevoPicture');
					if (nuevos.length>0)
						{var num=((nuevos[nuevos.length - 1].get('num'))*1)+1;}
					else
						{var num=0;}
					new Element('div',{'class':'espacioNuevoPicture','id':'espacioNuevoPicture'+num,'num':num}).inject($('picturesAreaGallery'));
					var destino_id='espacioNuevoPicture'+num;
					}
				}
			else
				{
				
				}
			}
		
		
		// Create the iframe...
		var iframe = document.createElement("iframe");
		iframe.setAttribute("id", "upload_iframe");
		iframe.setAttribute("name", "upload_iframe");
		iframe.setAttribute("width", "0");
		iframe.setAttribute("height", "0");
		iframe.setAttribute("border", "0");
		iframe.setAttribute("style", "width: 0; height: 0; border: none;");
	 
		// Add to document...
		form.parentNode.appendChild(iframe);
		window.frames['upload_iframe'].name = "upload_iframe";
	 
		iframeId = document.getElementById("upload_iframe");
	 
		// Add event...
		var eventHandler = function () {
	 
				if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
				else iframeId.removeEventListener("load", eventHandler, false);
	 
				// Message from server...
				if (iframeId.contentDocument) {
					content = iframeId.contentDocument.body.innerHTML;
				} else if (iframeId.contentWindow) {
					content = iframeId.contentWindow.document.body.innerHTML;
				} else if (iframeId.document) {
					content = iframeId.document.body.innerHTML;
				}
	 
				$(destino_id).innerHTML = content;
				var idNuevo=$(destino_id).getFirst().get('id');
				if ($(idNuevo).hasClass('ajaxPicture')) //ver si nos manda una imagen + lineaDatos
					{
					if ($(idNuevo).hasClass('rackPicture'))//es tipo rack, se llama a función en lib/rack.js
						{
						nuevaImagenRack(idNuevo);
						}
					else
						{
						var contenedor=$(idNuevo).getParent('.contenedorImagenes');
						if (contenedor.getElement('.thumbGalleryHistory'))
							{var galeria=contenedor.getElement('.thumbGalleryHistory');}
						else
							{
							if (contenedor.getElement('.picturesGallery'))
								{var galeria=contenedor.getElement('.picturesGallery');}
							}
						if (galeria)
							{
							var tabla=galeria.getElement('.tablaPictures');
							$(idNuevo).getElement('.lineaDatos').inject(tabla);
							$(idNuevo).getElement('img').inject(tabla,'after');
							eventosImagen(galeria.getFirst('img'));
							}
						}
					}
				else
					{
					$(idNuevo).inject($(destino_id),'after');
					eventosFormulario('#'+idNuevo);
					activarEdiciones('#'+idNuevo);
					}
				if (typeof(ficheroAñadido)=='function')
					{
					ficheroAñadido(idNuevo);
					}
				if (typeof(ficheroAñadidoHistoria)=='function')
					{
					ficheroAñadidoHistoria(idNuevo);
					}
				$(destino_id).destroy();
				// Del the iframe...
				setTimeout('iframeId.parentNode.removeChild(iframeId);', 250);
			}
	 
		if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
		if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
	 
		// Set properties of form...
		form.setAttribute("target", "upload_iframe");
		//form.setAttribute("action", action_url);
		//form.setAttribute("method", "post");
		//form.setAttribute("enctype", "multipart/form-data");
		//form.setAttribute("encoding", "multipart/form-data");
	 
		// Submit the form...
		form.submit();
		form.reset();
		form.getParent('.areaNuevoFichero').addClass('oculto');
		$(destino_id).innerHTML = "Uploading...";
		$$('.contenedorFicherosSeleccionado').removeClass('contenedorFicherosSeleccionado');
		}
	else
		{
		alert('Please select a file to upload');
		}
}

function valueFromForm(form,name)
{
if (form.getElement('input[type="text"][name="'+name+'"]'))
	{
	return form.getElement('input[type="text"][name="'+name+'"]').value;
	}
if (form.getElement('select[name="'+name+'"]'))
	{
	var select=form.getElement('select[name="'+name+'"]');	
	return select.options[select.selectedIndex].text;
	}
if (form.getElement('textarea[name="'+name+'"]'))
	{
	return form.getElement('textarea[name="'+name+'"]').value;
	}
}

function actualizarDatos(formulario)
{
	var ediciones=$(formulario).getElements('.elementoEdicion');
	ediciones.each(function(item, index){
		switch (true)	
		{	
			case 	(item.match('input')):
			if ((item.get('type')=="text")&&(item.getStyle('display')!='none'))
					{
						var spanDatos=item.getPrevious('.editable');
						spanDatos.set('text',item.value);
						if (spanDatos.hasClass("linkCopy"))
							{
							var linkEditable=	item.getPrevious('a');					
							linkEditable.set('text',item.value);	
								}
					}
			break;
						
			case (item.match('textarea')):
				var spanDatos=item.getPrevious('.editable');
				//spanDatos.set('html',item.get('text'));
				spanDatos.set('html',item.value); //prevenir inyeccion
				if (spanDatos.hasClass("linkCopy"))
							{
							var linkEditable=	item.getPrevious('a');					
							linkEditable.set('text',item.value);	
							}
			break;
			
			case (item.match('select')):
				if (!item.hasClass('selectRelacionado'))
					{
					var spanDatos=item.getPrevious('.editable');
					if (spanDatos.hasClass('useDbValue') && typeof(getSymbol)=='function')
						{
						var newValue=item.options[item.selectedIndex].text;
						spanDatos.set('dbValue',newValue);
						spanDatos.set('text',getSymbol(newValue));
						}
					else
						{spanDatos.set('text',item.options[item.selectedIndex].text);}
					}
				
			break;
			case (item.hasClass('nuevas')):
			var etiquetasNuevas=new Array();
			item.getChildren('span').each(function(etiq, index){etiquetasNuevas.push(etiq.get('text'));});
			var actuales   = item.getPrevious('.actuales'); 
			actuales.empty();
			etiquetasNuevas.each(function(etiq, index){
				var el= new Element('span', { 'class':'tag max tagSeleccionado'});
				el.set('text',etiq);
				actuales.adopt(el);
				});
			break;
			
			
				}
	});
	if(typeof formularioActualizado == 'function') {
	formularioActualizado(formulario);
	}
	if(typeof actualizarCalculosTabla == 'function') {
		if ($(formulario).getParent('.lineaDatos'))
			{actualizarCalculosTabla($(formulario).getParent('.lineaDatos'));}
		}
	
	}

//activar la edición de un item editable
function activarEdicion(item)
{
	if (item.match('a'))
	{
		var edicionLink  = new Element('span', { 'class':'editable edicionPermitida linkCopy'}).inject(item, 'after');
		edicionLink.set('text',item.get("text"));
		edicionLink.set('tipo',item.get("tipo"));
		edicionLink.set('campo',item.get("campo"));
		if (item.get('campolink'))
			{edicionLink.set('campolink',item.get("campolink"));}
		item.setStyle("display","none");
		edicionLink.addEvent('dblclick',function(event){permitirEdicion(event.target);}); 
		var iconoLink  = new Element('a', { 'class':'linkCopy','href':item.get('href')}).inject(edicionLink, 'after');
		new Element('img', {'src': 'styles/images/page_go.png'}).inject(iconoLink);
		
		}
	else
	{	
	item.addEvent('dblclick',function(event){permitirEdicion(event.target);});  
	item.addClass('edicionPermitida');
	//borde edicion
	var padres=item.getParents('.grupoInputs');
	if (padres.length > 0){padres[0].addClass('bordeEdicion');}
	else
		{var hermanos=item.getSiblings('.grupoInputs');
		if (hermanos.length > 0){hermanos[0].addClass('bordeEdicion');}
		}
	
	//casos de elemento vacío
	if (item.get('text')=='')
		{
			var edicionVacio  = new Element('span', { 'class':'edicionVacio'}).inject(item, 'after');
			edicionVacio.set('html',"&nbsp;");
			edicionVacio.addEvent('dblclick',function(event){permitirEdicion(event.target.getPrevious());});  
			if (item.hasClass('oculto'))
				{
				edicionVacio.addClass('oculto');
				}
		}
	}	
	}
	
//desactivar la edición de un item editable	
function desactivarEdicion(item)
{
	item.removeEvents('dblclick'); 
	item.removeClass('edicionPermitida');
	//quitar borde edición
	//borde edicion
	var padres=item.getParents('.grupoInputs');
	if (padres.length > 0){padres[0].removeClass('bordeEdicion');}
	else
		{var hermanos=item.getSiblings('.grupoInputs');
		if (hermanos.length > 0){hermanos[0].removeClass('bordeEdicion');}
		}
	if(vacio=item.getNext('.edicionVacio')){vacio.destroy();}
	quitarControles(item);
	if (item.hasClass("linkCopy"))
		{
			var a=item.getPrevious('a');
			a.setStyle('display','inline');			
			item.getParent().getElements('.linkCopy').each(function(linkCopy){
				linkCopy.destroy();
				});
			}
	}

function quitarControles(item)
{
	if (!item.match('a'))
	{item.setStyle('display','inline');
	if(vacio=item.getNext('.edicionVacio')){
		if (item.get('text')==''){vacio.setStyle('display','inline');}
		else {vacio.destroy();}
	}
	item.getAllNext('.elementoEdicion').each(function(el, index){el.destroy();});
	if (tipo=item.get('tipo'))	
	{if (tipo.indexOf("text") == 0 || tipo.indexOf("mediumtext") == 0)
	{id='area'+item.get('campo');
		if (ed = tinyMCE.get(id))
	{ed.remove();}}
	}
	if (item.match('label'))
		{var grupoInputs=item.getNext('div');
		var nuevoItem=grupoInputs.getFirst();
		quitarControles(nuevoItem);
			}
	
	//formato simbolos, sirve sólo para después de edición
	var simbolo=item.getNext('.simbolo');
	if (simbolo)
		{
		formatoSimbolo(simbolo);
		}
	
	}
}

function activarEdiciones(raiz)
{
$$(raiz+' .editable').each(function(item, index){activarEdicion(item);});
$$(raiz+' .controlesIniciales').setStyle('display','block');
$$(raiz+' .controles').setStyle('display','block');
$$(raiz+' .showOnEdit').setStyle('display','block');
$$(raiz+' .hideOnEdit').setStyle('display','none');
$$(raiz+' .columnaControles').setStyle('display','table-cell');
}

function activarEdicionesDOM(el)
{
el.getElements('.editable').each(function(item, index){activarEdicion(item);});
el.getElements('.controlesIniciales').each(function(item, index){item.setStyle('display','block');});
el.getElements('.controles').each(function(item, index){item.setStyle('display','block');});
el.getElements('.showOnEdit').each(function(item, index){item.setStyle('display','block');});
el.getElements('.hideOnEdit').each(function(item, index){item.setStyle('display','block');});
el.getElements('.columnaControles').each(function(item, index){item.setStyle('display','table-cell');});
}

//activar todas las ediciones posibles en la página
function todosEditables()
{
	$$('.editable').each(function(item, index){activarEdicion(item);});
	$$('.controlesIniciales').setStyle('display','block');
	$$('.controles').setStyle('display','block');
	$$('.columnaControles').setStyle('display','table-cell');
	$$('.showOnEdit').setStyle('display','block');
	$$('.hideOnEdit').setStyle('display','none');
	$$('.edicionNivel2').setStyle('display','block');
	$$('.showOnEdit [type=text]').each(function(item,index)
		{
		var overText=true;
		if (item.getParent('.grupoInputs'))
			{
			if (item.getParent('.grupoInputs').getPrevious('label'))
				{
				overText=false;
				}
			}
		if (overText)
			{
			new OverText(item,{wrap:true});
			}
		});
	}
	
//desactivar todas las ediciones posibles en la página
function todosNoEditables()
{
	$$('.editable').each(function(item, index){desactivarEdicion(item);});
	$$('.controlesIniciales').setStyle('display','none');
	$$('.controlesFinales').setStyle('display','none');
	$$('.controles').setStyle('display','none');
	$$('.columnaControles').setStyle('display','none');
	$$('.showOnEdit').setStyle('display','none');
	$$('.hideOnEdit').setStyle('display','block');
	$$('.edicionNivel2').setStyle('display','none');
	}

function preSubmit(formulario)
{
	if (typeof(accionAntesSubmit)=='function')
		{
		accionAntesSubmit(formulario);
		}
	$$('#'+formulario+' textarea').each(function(item, index){		
		id=item.get('id');
		if (typeof tinyMCE!== 'undefined')
			{
			if (tinyMCE.get(id))
				{
				var ed = tinyMCE.get(id);
				var contenido=ed.getContent();
				$(id).set('text',contenido);
				}
			}
		});
	}
	
//mostrar los inputs para un item
function permitirEdicion(el)
{
if (! el.hasClass('editable'))
 {
	el=el.getParent('.editable');
 }
if (el.match('label'))
{
var tipoControl=el.get('tipoControl');

eval(tipoControl+'(el);');
el.setStyle('display','none');
var labelDuplicada   = new Element('label', { 'class':'elementoEdicion'}).inject(el, 'after');
labelDuplicada.set('text',el.get('text'));
}
else
{
var campo=el.get('campo');
var tipo=el.get('tipo');
el.setStyle('display','none');
if(vacio=el.getNext('.edicionVacio')){vacio.setStyle('display','none');}
var valorTexto=el.get('text');
if (el.hasClass('useDbValue'))
	{
	valorTexto=el.get('dbValue');
	}
var valorHtml=el.get('html');

switch (true)
{

	case 	(tipo.indexOf("enum") == 0):
	var s=tipo;
	var codigo=s.replace("enum", "new Array");
	codigo="selectValues="+codigo+';';	
	eval(codigo);
	var select  = new Element('select', { 'name':campo, 'class':'elementoEdicion'}).inject(el, 'after');
	selectfield(selectValues,valorTexto,select);
	if (el.hasClass('nestedControl'))
		{
		select.addEvent('change',function(e){nestedControlChanged(e.target);});
		}
	break;
	case 	(tipo.indexOf("date") == 0):
	var input  = new Element('input', { 'type':'text','class':'fecha elementoEdicion validate-date', 'name':campo, 'value':valorTexto}).inject(el, 'after');
	 nuevoCalendario(input);
	break;
	case 	(tipo.indexOf("time") == 0):
	var input  = new Element('input', { 'type':'text','class':'hora elementoEdicion validate-time', 'name':campo, 'value':valorTexto}).inject(el, 'after');
	break;
	case 	(tipo.indexOf("text") == 0):
	case 	(tipo.indexOf("mediumtext") == 0):
		var padre=el.getParent();
		if(etiqueta=padre.getPrevious('label'))
			{
				cols='25';
				rows='5';
				}
		else
			{
				cols='50';
				rows='10';
				}
		//var areaTexto=new Element('textarea',{'id':'area'+campo,'class':'elementoEdicion', 'name':campo, 'cols':cols, 'rows':rows}).inject(el,'after');
		var areaTexto=new Element('textarea',{'id':'area'+campo,'class':'elementoEdicion', 'name':campo, 'rows':rows}).inject(el,'after');
		areaTexto.set('html',valorHtml);		
		areaTexto.setStyle('width','95%');
		nuevoEditor('area'+campo);
	break;
	case 	((tipo.indexOf("int") == 0)||(tipo.indexOf("smallint") == 0)||(tipo.indexOf("bigint") == 0)):
	var clase="number validate-integer";
	var input  = new Element('input', { 'type':'text','class':clase+' elementoEdicion', 'name':campo, 'value':valorTexto}).inject(el, 'after');
	break;	
	case 	((tipo.indexOf("float") == 0)||(tipo.indexOf("double") == 0)||(tipo.indexOf("decimal") == 0)):
	var clase="number validate-numeric";
	var input  = new Element('input', { 'type':'text','class':clase+' elementoEdicion', 'name':campo, 'value':limpiarNumero(valorTexto)}).inject(el, 'after');
	break;
	
	default:
	var clase="inputText";
	if (campo.indexOf("Mail") > -1)
	{clase+=" validate-email";}
	var parent=el.getParent();
	if (parent.hasClass('edicionTextarea'))
		{
		var input  = new Element('textarea', { 'class':clase+' elementoEdicion', 'name':campo, 'value':valorTexto}).inject(el, 'after');
		}
	else
		{ var input  = new Element('input', { 'type':'text','class':clase+' elementoEdicion', 'name':campo, 'value':valorTexto}).inject(el, 'after');}
	
	break;	
	}
}

var arr=el.getParents('tr');
if (arr.length>0)
	{
	if(typeof window.cambiarControlesTabla == 'function') 
		{
		cambiarControlesTabla(el);
		}
	}
else
	{
	var arr=el.getParents('form');
	var formulario=arr[0];
	var idForm=formulario.get('id');
	$$('#'+idForm+' .controlesIniciales').setStyle('display','none');
	$$('#'+idForm+' .controlesFinales').setStyle('display','block');
	}

if (el.get('campolink'))	
	{
	var arr=el.getParents('form');
	var formulario=arr[0];
	var campoLink=el.get('campolink');
	formulario.getElements('[campo="'+campoLink+'"]').each(function(item,index)
		{
		item.removeClass('oculto');
		var valor=item.getFirst('.valor');
		if (valor)
			{
			if (valor.get('text')=='')
				{valor.set('text','link');}
			}
		}
		);
	}
	
}

function selectfield(optionsarray, selected, element) 
{
  var i=0;
  optionsarray.each(function(value, index){ 
  	if (i++==0)
  	{var clase="primerOption";}
  	else {
  		clase="miOption";}
    if (value == selected) {
		var option  = new Element('option', { 'class':clase, 'value':value,'selected':1});
		option.set('text',value);
		element.adopt(option);   

    } else {
	var option  = new Element('option', { 'class':clase, 'value':value});
		option.set('text',value);
		element.adopt(option);   
    }
  });
}

function selectHtml(optionsarray, selected)
{
var res='';
var i=0;
 optionsarray.each(function(value, index){ 
    if (value == selected) {
		res+='<option value="'+value+'" selected="1">'+value+'</option>';

    } else {
		res+='<option value="'+value+'">'+value+'</option>';
    }
  });
return res;
}

function nuevoEditor(elId)
{
var ed = new tinymce.Editor(elId, {
			language : "en",
        mode : "textareas",
        theme : "advanced",
        plugins : "paste",

                // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,forecolor,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist",
        theme_advanced_buttons2 : "undo,redo,|,outdent,indent,|,link,unlink,pasteword,charmap",
        theme_advanced_buttons3 : "",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",

			
        // Skin options
        skin : "o2k7",
        skin_variant : "silver"  //(n.b. no trailing comma, this will be critical as you experiment later)
});

ed.render();	
	}
	
function nuevoCalendario(elemento)
{new Picker.Date(elemento, {
    positionOffset: {x: 5, y: 0},
    pickerClass: 'datepicker_dashboard',
    format:'%d/%m/%Y',
    blockKeydown:false,
    useFadeInOut: false
    });}
	
	
function controlEtiquetas(elemento)
{
//elemento es de tipo label
var grupoInputs=elemento.getNext('div');

var arr=elemento.getParents('form');
var formulario=arr[0];
var idForm=formulario.get('id');
var tablaForm=$(idForm).get('tablaForm');

var actual=grupoInputs.getFirst('.actuales');
var etiquetasActuales=new Array();
var cadenaEtiquetas="";
actual.getChildren('span').each(function(item, index){etiquetasActuales.push(item.get('text'));});
var clone   = new Element('div', { 'class':'nuevas elementoEdicion lineaMenuTags'}).inject(actual, 'after');
etiquetasActuales.each(function(item, index){
	var el= new Element('span', { 'class':'tag max tagSeleccionado'});
	el.set('text',item);
	clone.adopt(el);
	cadenaEtiquetas+=' '+item;
});
var input  = new Element('input', { 'type':'text','class':'elementoEdicion', 'name':'etiquetas', 'value':cadenaEtiquetas}).inject(clone, 'after');
input.setStyle('display','none');
actual.setStyle('display','none');
clone.getChildren('span').each(function(item, index){item.addEvent('click',function(event){quitarEtiqueta(event.target);})}); 

var lineaNuevaTag   = new Element('div', { 'class':'elementoEdicion lineaMenuTags'}).inject(input, 'after');
var nuevaTag  = new Element('input', { 'type':'text','class':'', 'name':'nuevaEtiqueta', 'value':''});
lineaNuevaTag.adopt(nuevaTag);
var añadirNuevaTag  = new Element('a', {'class':'boton'});
lineaNuevaTag.adopt(añadirNuevaTag);
var links=lineaNuevaTag.getChildren('a');
var añadirNuevaTag=links[0];
añadirNuevaTag.set('text','New tag');
añadirNuevaTag.addEvent('click',function(event){nuevaEtiqueta(event.target);}); 
var etiquetas=JSON.decode(getEtiquetas(tablaForm));
var existentes   = new Element('div', { 'class':'existentes elementoEdicion'}).inject(lineaNuevaTag, 'after');
etiquetas.each(function(item, index){
	var el= new Element('span', { 'class':'tag '+item[1]});
	el.set('text',item[0]);
	if (etiquetasActuales.indexOf(item[0])>-1)
		{el.setStyle('display','none');}
	existentes.adopt(el);
});
existentes.getChildren('span').addEvent('click',function(event){añadirEtiqueta(event.target);}); 
}

function quitarEtiqueta(etiqueta)
{
var valor=etiqueta.get('text');
var cadenaEtiquetas="";
var padre=etiqueta.getParent();
etiqueta.destroy();
padre.getChildren('span').each(function(item, index){cadenaEtiquetas+=item.get('text')+' ';});
padre.getNext('input').value=cadenaEtiquetas;
var existentes=padre.getNext('.existentes');
existentes.getChildren('span').each(function(item, index)
{
if (item.get('text')==valor)
{item.setStyle('display','inline');}
	});

}

function nuevaEtiqueta(el)
{
var nueva=el.getPrevious('input').value;
var padre=el.getParent();
var actuales=padre.getPrevious('.nuevas');
var inputEtiquetas=padre.getPrevious('input');
var existentes=padre.getNext('.existentes');
var nuevasEtiquetas=nueva.split(' ');
var cadenaEtiquetas=inputEtiquetas.value;
var etiquetasActuales=cadenaEtiquetas.split(' ');
nuevasEtiquetas.each(function(valor, index)
{
if (etiquetasActuales.indexOf(valor)==-1)
{
var etiq= new Element('span', { 'class':'tag max tagSeleccionado'});
etiq.set('text',valor);
actuales.adopt(etiq);
cadenaEtiquetas+=' '+valor;
var item=actuales.getLast('span');
item.addEvent('click',function(event){quitarEtiqueta(event.target);});

existentes.getChildren('span').each(function(item, index){
if(item.get('text')==valor){item.setStyle('display','none');}	
	});
}	
	});

inputEtiquetas.value=cadenaEtiquetas;
el.getPrevious('input').value="";
}

function añadirEtiqueta(el)
{
var padre=el.getParent();
var valor=el.get('text');
el.setStyle('display','none');
var actuales=padre.getPrevious('.nuevas');
var inputEtiquetas=padre.getPrevious('input');

var etiq= new Element('span', { 'class':'tag max tagSeleccionado'});
etiq.set('text',valor);
actuales.adopt(etiq);
var cadenaEtiquetas=inputEtiquetas.value;
cadenaEtiquetas+=' '+valor;
inputEtiquetas.value=cadenaEtiquetas;
var item=actuales.getLast('span');
item.addEvent('click',function(event){quitarEtiqueta(event.target);});
	}

function getEtiquetas(tabla)
{
var res="";
var req = new Request({   
            method: 'post',   
            url: 'ajax/etiquetas.php',   
						data:{ 'tabla':tabla,'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")},
						async:false,  
            onRequest: function() { },   
            onComplete: function(response) { res=response; }   
        }).send(); 
return res;
}

function borrarDB(tabla, id)
{
var res="";
var req = new Request({   
            method: 'post',   
            url: 'ajax/borrar.php',   
						data:{ 'tabla':tabla, 'id':id,'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")},
						async:false,  
            onRequest: function() { },   
            onComplete: function(response) { res=response; }   
        }).send(); 
return res;
}

//changes all text inputs in the container to a select or set structure for editing with a select instead of text field
function textInputToSelect(container,values,extraEditable)
{
if (container.getElement('input[type="text"]'))
	{
	container.getElements('input[type="text"]').each(function(input)
		{
		var sel=new Element('select',{'name':input.get('name'),'title':input.get('title'),'id':input.get('id')}).inject(input,'after');
		selectfield(values, values[0], sel);
		input.destroy();
		});
	}
if (container.getElement('.editable'+extraEditable))
	{
	container.getElements('.editable'+extraEditable).each(function(el)
		{
		//el.set('tipo','ENUM('
		});
	}
}

function selectFromTablaDiv(el)
{
var defaultValue=el.get('default');
var inputName=el.get('inputName');
var label=el.get('label');
var campo=el.get('campo');
var tabla=el.getElement('.tablaDiv');
var tablaId=tabla.get('id');
var lineaInputs=new Element('div',{'class':'lineaInputs'}).inject(el,'before');
if (label='yes')
	{
	var label=new Element('label',{'text':inputName}).inject(lineaInputs);
	}
var grupoInputs=new Element('div',{'class':'grupoInputs'}).inject(lineaInputs);
var select  = new Element('select', { 'name':'select'+inputName,'input':inputName, 'class':'elementoEdicion selectRelacionado','campo':campo,'tablaDatos':tablaId}).inject(grupoInputs);
select.addEvent('change',function(event){
	selectRelacionadoChange(event.target);
	});
var input=new Element('input', { 'name':inputName,'type':'text', 'class':'oculto'}).inject(grupoInputs);
input.value=buscarEnTabla(tabla, campo, defaultValue);
var selectValues=arrayFromTabla(tabla,campo);
selectfield(selectValues,defaultValue,select);
new Element('div',{'class':'clear'}).inject(lineaInputs);
}

function selectRelacionadoChange(el)
{
var seleccionado=el.options[el.selectedIndex].text;
var inputName=el.get('input');
var inputRelacionado=el.getNext('input[name="'+inputName+'"]');
var tabla=el.get('tablaDatos');
var campo=el.get('campo');
inputRelacionado.value=buscarEnTabla($(tabla), campo, seleccionado);
}

function getSelectValue(form,name)
{
var select=form.getElement('select[name="'+name+'"]');
return select.options[select.selectedIndex].text;
}


function getSelectValueSelect(select)
{
return select.options[select.selectedIndex].text;
}


function setSelectValue(form,name,value)
{
var select=form.getElement('select[name="'+name+'"]');
select.getElements('option').each(function(item)
	{
	if (item.text==value)
		{item.selected='selected';}
	});
}

function setSelectValueSelect(select, value)
{
select.getElements('option').each(function(item)
	{
	if (item.text==value)
		{item.selected='selected';}
	});
}

function setSelectValuePerValue(select, value)
{
select.getElements('option').each(function(item)
	{
	if (item.value==value)
		{item.selected='selected';}
	});
}

function disableForm(form)
{
form.getElements('input').each(function(item)
	{
	item.disabled=true;
	});
form.getElements('select').each(function(item)
	{
	item.disabled=true;
	});
form.getElements('textarea').each(function(item)
	{
	item.disabled=true;
	});
}

function getRadioValue(form,name)
{
var valor='';
form.getElements('input[name="'+name+'"]').each(function(item)
	{
	if (item.checked)
		{
		valor=item.value;
		}
	});
return valor;
}

function getRadioTextValue(form,name)
{
var valor='';
form.getElements('input[name="'+name+'"]').each(function(item)
	{
	if (item.checked)
		{
		valor=item.get('textValue');
		}
	});
return valor;
}

function setRadioValue(form,name,valor)
{
form.getElements('input[name="'+name+'"]').each(function(item)
	{
	if (item.value==valor)
		{item.checked='checked';}
	});
}

function serializarFormulario(form)
{
var serializedForm=$(form).toQueryString().parseQueryString();
/*$(form).getElements('.select').each(function(select)
	{
	serializedForm[select.get('name')]=select.options[select.selectedIndex].value;
	});*/
return serializedForm;
}

function loadForm(target,form,method,http,data)
{
data = typeof data !== 'undefined' ?  '&'+data : '';
target.set('load',{method:method,data:form.toQueryString()+data});
target.load(http);
}

function createSeparateForm(table,tableName,lines,fields,container)
{
var linesArr=lines.split(',');
if (linesArr.length>0)
	{
	if ($(table).getElement('.lineaDatos[tabla="'+tableName+'"][linea="'+linesArr[0]+'"]'))
		{
		var line=$(table).getElement('.lineaDatos[linea="'+linesArr[0]+'"]');
		var form=new Element('form',{'id':'separatedForm'+tableName,'class':'mainForm separatedForm','action':'ajax/update.php', 'method':'post','tableRef':table,'tablaForm':tableName,'lines':lines,'fields':fields,'processed':'0'}).inject(container);
		var controlsDiv=new Element('div').inject(form);
		new Element('div',{'class':'mensaje'}).inject(form);
		controlsDiv.load('ajax/separatedForm.php?table='+encodeURIComponent(tableName)+'&id='+linesArr[0]+'&fields='+encodeURIComponent(fields));
		var submit=new Element('div',{'class':'botonSubmit','text':'SAVE CHANGES'}).inject(form);
		submit.addEvent('click',function(e){separatedFormSubmitted(e.target);});
		}
	}
}

function separatedFormSubmitted(el)
{
var form=el.getParent('form');
var lines=form.get('lines').split(',');
form.set('idForm',lines[0]);
save(el);
}

//container is id: requires ajax/getNestedValues table column id or columnValue
function transformIntoNestedSelects(container,field,table,columns)
{
if ($(container).getElement('.datos[campo="'+field+'"]'))
	{
	var datos=$(container).getElement('.datos[campo="'+field+'"]');
	var classes='';
	if (datos.hasClass('editable'))
		{
		classes=' editable edicionPermitida nestedControl';	
		}
	if (datos.getParent('.grupoInputs'))
		{//by now this function only for simple forms (not in tablaDiv elements)
		var initValue=datos.get('text');
		datos.getParent('.grupoInputs').addClass('oculto');
		var newGrupo=new Element('div',{'class':'grupoInputs nestedGrupoInputs','table':table}).inject(datos.getParent('.grupoInputs'),'after');
		var i=0;
		columns.each(function(item,index)
			{
			new Element('span',{'class':'datos'+classes,'index':i++,'table':table,'campo':item,'tipo':'enum()','style':'padding-left:10px;'}).inject(newGrupo);
			});
		var nestedValues=new Element('div',{'class':'nestedValues oculto'}).inject(newGrupo,'after');
		nestedValues.load('ajax/getNestedValues.php?table='+encodeURIComponent(table)+'&id='+encodeURIComponent(initValue)+'&container='+encodeURIComponent(container));
		}
	}

}

function afterNestedValueReceived(container,table,index)
{
if ($(container).getElement('.nestedGrupoInputs[table="'+table+'"]'))
	{
	var group=$(container).getElement('.nestedGrupoInputs[table="'+table+'"]');
	var nestedValues=group.getNext('.nestedValues');
	var i=0;
	nestedValues.getElements('.tablaDiv').each(function(item){
		if (index=='all' || (index*1==i))
			{
			var dato=group.getElement('.datos[campo="'+item.get('column')+'"]');
			dato.set('text',item.get('selectedValue'));
			if (index=='all'){dato.set('previousValue',item.get('selectedValue'));}
			var list="''";
			item.getElements('.valor').each(function(val)
				{
				list+=",'"+val.get('text')+"'";
				});
			dato.set('tipo','enum('+list+')');
			}
		i++;
		});
	if (index!='all')
		{
		var selects=group.getElements('select');
		var i=index*1;
		while(i<selects.length)
			{
			selects[i].destroy();
			i++;
			}
		var editables=group.getElements('.editable');
		i=index*1;
		while(i<editables.length)
			{
			permitirEdicion(editables[i]);
			i++;
			}
		}
	if (typeof(afterNestedTransformation)=='function')
		{
		afterNestedTransformation(container);
		}
	}
}

//after cancel form not good restoring of values when changed select<last
function nestedControlChanged(el)
{
var newValue=getSelectValueSelect(el);
var field=el.get('name');
var group=el.getParent('.nestedGrupoInputs');
var table=group.get('table');
var initialIndex=(group.getElement('.datos[campo="'+field+'"]').get('index')*1)+1;
var tables=group.getNext('.nestedValues').getElements('.tablaDiv');
if (initialIndex<tables.length)
	{
	var index=initialIndex;
	while (index<tables.length)
		{
		tables[index].set('selectedValue','');
		tables[index].empty();
		index++;
		}
	tables[initialIndex].load('ajax/getNestedValues.php?table='+encodeURIComponent(table)+'&previous='+encodeURIComponent(newValue)+'&index='+initialIndex+'&container='+encodeURIComponent(group.getParent('form').get('id')));
	}
}


