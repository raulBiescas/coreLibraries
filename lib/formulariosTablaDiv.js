/*!
 * formulariosTablaDiv.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 formulariosTablaDiv.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

window.addEvent('domready', function() {

eventosTablaDiv('');

});

function eventosTablaDiv(raiz)
{

$$(raiz +' .canceladoLinea').each(function(item, index){
	item.addEvent('click',function(event){cancelLinea(event.target);});  
	});
	
$$(raiz +' .edicionLinea').each(function(item, index){
	item.addEvent('click',function(event){editarLinea(event.target);});  
	});

$$(raiz +' .guardadoLinea').each(function(item, index){
	item.addEvent('click',function(event){saveLinea(event.target);});  
	});

$$(raiz +' .borradoLinea').each(function(item, index){
	item.addEvent('click',function(event){borrarLinea(event.target);});  
	});

}

function preventEditions(raiz)
{
$$(raiz +' .edicionLinea').each(function(item, index){item.addClass('oculto')});
$$(raiz +' .lineaDatos').each(function(item, index){item.addClass('editionPrevented')});
}

function borrarLinea(el)
{
	if (confirm("Please confirm you want to remove the selected line"))
		{
		var linea=el.getParent('.lineaDatos');
		var idLinea=linea.get('linea');
		if(typeof borradoParticular == 'function') {
			borradoParticular(idLinea);
			}
		else
		{
		var idForm=0;
		var tablaForm='';
		if (el.getParent('form'))
			{
			var formulario=el.getParent('form');
			idForm=formulario.get('id');
			tablaForm=$(idForm).get('tablaForm');
			}
		else
			{
			tablaForm=el.getParent('.tablaDiv').get('tabla');
			}
			
		var resul=borrarDB(tablaForm,idLinea)*1;
		if (resul)
			{
				/*var arr=el.getParents('.baseElemento');	
				arr[0].destroy();*/
				var tablaDiv=linea.getParent('.tablaDiv').get('id');
				var id=linea.get('linea');
				linea.destroy();	
				if (typeof(hookDespuesBorrar)=='function')
					{hookDespuesBorrar(tablaDiv,id);}				
				alert("Line deleted");	
				}	
		else
			{
			alert("A problem was found when trying to delete the line");				
				}	
			}
		}
	}

function cancelLinea(el)
{
	var arr=el.getParents('.lineaDatos');
	var linea=arr[0];
	linea.getElements('.editable').each(function(item, index){quitarControles(item);});
	linea.getElements('.campoLink').each(function(item, index){
		item.addClass('oculto');		
		});
	linea.getElements('.controlesIniciales').setStyle('display','block');
	linea.getElements('.controlesFinales').setStyle('display','none');
	if (typeof(hookDespuesCancelar)=='function')
		{hookDespuesCancelar(el);}
	}

function cancelarEdicionesTablaDiv(el)
{
el.getElements('.lineaDatos').each(function(item)
	{
	cancelLinea(item.getFirst('div'));
	});
}	
	
function editarLinea(el)
{
	if (el.getParent('form'))
		{
		var formulario=el.getParent('form');
		var idForm=formulario.get('id');
		var arr=el.getParents('.lineaDatos');
		var linea=arr[0];
		var idLinea=linea.get('linea');
		
		//cancel la edicion del resto de lineas activas
		$(idForm).getElements('.lineaDatos').each(function(item, index){
			var idL=item.get('linea');
			if (idL!=idLinea)
				{
					var td=item.getFirst('.datos');
					if (td){cancelLinea(td);}
					}
		});	
		
		linea.getElements('.editable').each(function(item, index){
			var display=item.getStyle('display');
			if (display!='none')
				{permitirEdicion(item);}
		});
		linea.getElements('.controlesIniciales').setStyle('display','none');
		linea.getElements('.controlesFinales').setStyle('display','block');
		}
	}
	
function saveLinea(el)
{
	var arr=el.getParents('form');
	var formulario=arr[0];
	var idForm=formulario.get('id');
	var arr=el.getParents('.lineaDatos');
	var linea=arr[0];
	
	var tablaForm=$(idForm).get('tablaForm');
	//var idLinea=linea.get('linea');
	//$(idForm).set('idForm',idLinea);
	var idLinea=$(idForm).get('idForm');
	
	preSubmit(idForm);

	var val=new Form.Validator.Inline($(idForm));
	var formResult=linea.getElement('.mensajeLineaActualizada');	
	
	if ($(idForm).retrieve('form.request'))
		{
		var req=$(idForm).retrieve('form.request');
		req.setOptions({
		extraData: { 
		  'tabla': tablaForm,
		  'id':idLinea
		}});
		
		}
	
	else
		{
		var req=new Form.Request($(idForm),formResult , {
		
		extraData: { 
		  'tabla': tablaForm,
		  'id':idLinea
		},
		resetForm:false,
		onSuccess: function(target,texto,textoXML) { 
		if (target.get('text').indexOf("Error") == -1)
			{var arr=target.getParents('form');
			var formularioTarget=arr[0];
			var idFormTarget=formularioTarget.get('id');
			actualizarDatos(idFormTarget);
			
			if (typeof(hookDespuesGuardar)=='function')
				{hookDespuesGuardar(target);}
			
			cancelLinea(target);	
			target.set('text','Updated');
			target.removeClass('oculto');
			target.removeClass('mensajeError');
			target.addClass('mensajeOK');
			setTimeout("$$('.mensajeLineaActualizada').addClass('oculto');",2000);
			$$('#'+idFormTarget+' .campoLink').each(function(item, index)
				{
				var campoBase=item.get('campoBase');
				var celdaLink=$(idFormTarget).getElement('.datos[campo="'+campoBase+'"]');
				celdaLink.getElements('a').each(function(link, ind)
					{
					link.set('href',item.getFirst('.valor').get('text'));
					});
				});
			
			actualizarTabla(idFormTarget);
			
				}
			else
				{
				target.set('text','Error or no changes');
				target.removeClass('oculto');
				target.removeClass('mensajeOK');
				target.addClass('mensajeError');
				setTimeout("$$('.mensajeLineaActualizada').addClass('oculto');",2000);
				cancelLinea(target);	
					}
		}  
	  });
	 }
  
	if (val.validate())
		{
		req.setTarget(formResult);	
		req.send();
		}
	
	}

//se pasa la celda, hay que declarar el campo como extraGrande para que se amplie el título
function cambioControlaText(el)
{
el.set('tipo','varchar(256)');
el.addClass('textoGrande');
el.addClass('edicionTextArea');
el.getElement('.valor').set('tipo','varchar(256)');
}
	
	
//activar todas las ediciones posibles en la página
function todosEditablesTabla()
	{
	todosEditablesTablaRaiz('');
	}

function todosEditablesTablaRaiz(raiz)
{
	$$(raiz+ ' .editable').each(function(item, index){activarEdicion(item);});
	$$(raiz+ ' .controles').setStyle('display','block');
	$$(raiz+ ' .controlesIniciales').setStyle('display','block');
	$$(raiz+ ' .controlesFinales').setStyle('display','none');
}
	
//desactivar todas las ediciones posibles en la página
function todosNoEditablesTabla()
{
	todosNoEditablesTablaRaiz('');
	}
	
function todosNoEditablesTablaRaiz(raiz)
{
	$$(raiz+ ' .editable').each(function(item, index){desactivarEdicion(item);});
	$$(raiz+ ' .controles').setStyle('display','none');
	$$(raiz+ ' .controlesIniciales').setStyle('display','none');
	$$(raiz+ ' .controlesFinales').setStyle('display','none');
}

function cambiarControlesTabla(el)
{
var arr=el.getParents('.lineaDatos');
var linea=arr[0];
linea.getElements('.controlesIniciales').setStyle('display','none');
linea.getElements('.controlesFinales').setStyle('display','block');
}
	