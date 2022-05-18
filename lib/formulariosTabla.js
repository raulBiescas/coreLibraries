/*!
 * formulariosTabla.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 formulariosTabla.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

window.addEvent('domready', function() {

$$('.canceladoLinea').each(function(item, index){
	item.addEvent('click',function(event){cancelLinea(event.target);});  
	});
	
$$('.edicionLinea').each(function(item, index){
	item.addEvent('click',function(event){editarLinea(event.target);});  
	});

$$('.guardadoLinea').each(function(item, index){
	item.addEvent('click',function(event){saveLinea(event.target);});  
	});

$$('.borradoLinea').each(function(item, index){
	item.addEvent('click',function(event){borrarLinea(event.target);});  
	});

});

function borrarLinea(el)
{
	if (confirm("Por favor confirma que quieres eliminar este elemento"))
		{
		var arr=el.getParents('tr');
		var linea=arr[0];
		var idLinea=linea.get('linea');
		var arr=el.getParents('form');
		var formulario=arr[0];
		var idForm=formulario.get('id');
		var tablaForm=$(idForm).get('tablaForm');	
		var resul=borrarDB(tablaForm,idLinea)*1;
		if (resul)
			{
				var arr=el.getParents('.baseElemento');	
				arr[0].destroy();		
				alert("Elemento borrado con éxito");	
				}	
		else
			{
			alert("Ha habido un problema y el elemento no ha sido borrado");				
				}	
			}
	
	}

function cancelLinea(el)
{
	var arr=el.getParents('tr');
	var linea=arr[0];
	linea.getElements('.editable').each(function(item, index){quitarControles(item);});
	linea.getElements('.controlesIniciales').setStyle('display','block');
	linea.getElements('.controlesFinales').setStyle('display','none');
	}

function editarLinea(el)
{
	var arr=el.getParents('tr');
	var linea=arr[0];
	linea.getElements('.editable').each(function(item, index){
		var display=item.getStyle('display');
		if (display!='none')
			{permitirEdicion(item);}
	});
	linea.getElements('.controlesIniciales').setStyle('display','none');
	linea.getElements('.controlesFinales').setStyle('display','block');
	}
	
function saveLinea(el)
{
	var arr=el.getParents('form');
	var formulario=arr[0];
	var idForm=formulario.get('id');
	var arr=el.getParents('tr');
	var linea=arr[0];
	var idLinea=linea.get('linea');
	var tablaForm=$(idForm).get('tablaForm');
	//cancel la edicion del resto de lineas activas
	
	$(idForm).getElements('tbody tr').each(function(item, index){
		var idL=item.get('linea');
		if (idL!=idLinea)
			{
				var td=item.getFirst('td');
				if (td){cancelLinea(td);}
				}
	});	
	
	preSubmit(idForm);
		
	var val=new Form.Validator.Inline($(idForm));
	var arr=linea.getElements('.mensajeOculto');	
	var formResult=arr[0];
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
		if (target.get('text').indexOf("Error") != 0)
			{var arr=target.getParents('form');
			var formularioTarget=arr[0];
			var idFormTarget=formularioTarget.get('id');
			actualizarDatos(idFormTarget);
			cancelLinea(target);	
			var mensaje=target.getNext('.celdaMensaje');
			mensaje.set('text','Cambios OK');
			mensaje.setStyle('display','block');
			mensaje.removeClass('error');
			mensaje.addClass('ok');
			actualizarTabla(tablaForm);
			setTimeout("$$('.celdaMensaje').setStyle('display','none');",4000);
				}
			else
				{
				var mensaje=target.getNext('.celdaMensaje');
				mensaje.set('text','No ha habido cambios');
				mensaje.setStyle('display','block');
				mensaje.removeClass('ok');
				mensaje.addClass('error');
				setTimeout("$$('.celdaMensaje').setStyle('display','none');",4000);
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

//activar todas las ediciones posibles en la página
function todosEditablesTabla()
{
	$$('.editable').each(function(item, index){activarEdicion(item);});
	$$('.columnaControles').setStyle('display','table-cell');
	$$('.controlesIniciales').setStyle('display','block');
	}
	
//desactivar todas las ediciones posibles en la página
function todosNoEditablesTabla()
{
	$$('.editable').each(function(item, index){desactivarEdicion(item);});
	$$('.columnaControles').setStyle('display','none');
	$$('.controlesIniciales').setStyle('display','none');
	$$('.controlesFinales').setStyle('display','none');
	}

function cambiarControlesTabla(el)
{
var arr=el.getParents('tr');
var linea=arr[0];
linea.getElements('.controlesIniciales').setStyle('display','none');
linea.getElements('.controlesFinales').setStyle('display','block');
}