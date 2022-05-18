/*!
 * niveles.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 niveles.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */
 
function mostrarSiguienteNivel(el)
{
var tablaId=el.getParent('.tablaDiv').get('id');
if (el.hasClass('mostrarNiveles'))
{	
	el.removeClass('mostrarNiveles');
	el.addClass('ocultarNiveles');

	var padre=el.getParent('.lineaDatos');
	var nivel=padre.get('nivel')*1;
	var linea=padre.get('linea'); 
	var siguienteNivel=nivel+1;
	$$('#'+tablaId+' div[nivel="'+siguienteNivel+'"][lineaSuperior="'+linea+'"]').each(function(item, index){
	//item.setStyle('display','block');
	item.removeClass('oculto');
	});
}
else
	{
	ocultarSiguienteNivel(el);
	}
}

function ocultarSiguienteNivel(el)
{
var tablaId=el.getParent('.tablaDiv').get('id');
el.removeClass('ocultarNiveles');

var padre=el.getParent('.lineaDatos');
var nivel=padre.get('nivel')*1;
var linea=padre.get('linea'); 
var siguienteNivel=nivel+1;
$$('#'+tablaId+' div[nivel="'+siguienteNivel+'"][lineaSuperior="'+linea+'"]').each(function(item, index){
	el.addClass('mostrarNiveles');
	//item.setStyle('display','none');
	item.addClass('oculto');
	if (item.getFirst('.menuNiveles'))
		{ocultarSiguienteNivel(item.getFirst('.menuNiveles'));}
});

}


function checkNiveles(el)
{
	var tabla=el.getParent('.tablaDiv').get('id');
	var nivel=el.get('nivel')*1;
	var linea=el.get('linea'); 
	var siguienteNivel=nivel+1;
	
	var hijos=$$('#'+tabla+' .lineaDatos[nivel="'+siguienteNivel+'"][lineaSuperior="'+linea+'"]'); 
	if (hijos.length>0)
		{
		var boton=el.getFirst('.menuNiveles');
		boton.addClass('mostrarNiveles');
		boton.addEvent('click',function(event){mostrarSiguienteNivel(event.target);});
		}
	if (nivel>0)
		{
		el.addClass('oculto');
		}


}

function mostrarTodosNiveles(tabla,niveles,umbral)
//display all in the case number of lines is less than umbral
{
var lineas=$$('#'+tabla+' .lineaNiveles').length;
if ((lineas<umbral) || (umbral==0))
	{
	var i=0;
	while (i<niveles)
		{
		$$('#'+tabla+' .lineaNiveles').each(function(item)
			{
			if (item.getElement('.mostrarNiveles'))
				{
				mostrarSiguienteNivel(item.getElement('.mostrarNiveles'));
				}
			});
		i++;
		}
	}
}

function newElementNiveles(nivel,div,id)
{
var titulos=$$('#'+div+' .lineaTitulo');
var nuevoEspacio=new Element('div',{'id':'nuevoEspacio'+nivel}).inject(titulos[0],'after');
	
var req = new Request({   
            method: 'get',   
            url: 'ajax/newElementNiveles.php',   
						data: { 'nivel' : nivel ,'id':id, 'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")  }, 
						async:true,  
            onRequest: function() { },   
            onComplete: function(response) 
				{
				var destino_id='nuevoEspacio'+nivel;
				$(destino_id).innerHTML=response;
				var idNuevo=$(destino_id).getFirst().get('id');
				inicializarTablaDiv(destino_id);
				if (typeof afterNewElement !='undefined')
					{
					afterNewElement($(idNuevo));
					}
				eventosTablaDiv('#'+idNuevo);
				todosEditablesTablaRaiz('#'+idNuevo);
				editarLinea($(idNuevo).getFirst('form').getFirst());
				$(idNuevo).inject($(destino_id),'after');
				$(destino_id).destroy();
				if (typeof afterNewElementEditable !='undefined')
					{
					afterNewElementEditable(idNuevo);
					}
				}   
        }).send(); 
}

function getTitulosNiveles(nivel,div)
{
var req = new Request({   
            method: 'get',   
            url: 'ajax/titulosNiveles.php',   
						data: { 'nivel' : nivel , 'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")  }, 
						async:true,  
            onRequest: function() { },   
            onComplete: function(response) 
				{$(div).innerHTML=response;
				inicializarTablaDiv(div);}   
        }).send(); 
}

function inicializarNiveles(tabla)
{
$$('#'+tabla+' .lineaNiveles').each(function(item, index){
checkNiveles(item);
});
}

window.addEvent('domready', function() {

$$('.lineaNiveles').each(function(item, index){
checkNiveles(item);
});

});

