/*!
 * tablasDiv.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 tablasDiv.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

Date.defineParser('%d/%m/%Y');
var clasesTablasDiv=new Array('celdaNumero','celdaFecha','celdaDecimal','textoPeque','textoMedio','textoGrande','alturaDoble','edicionTextarea');
var clicksCount=0;
var dragElements=new Array();

HtmlTable.defineParsers({
    html: {
        match: /foo/,
        convert: function(){return this.get('html')},
        number: false
    }
});

function limpiarEstilosTablaDiv(tabla)
{
$$('#'+tabla+' .celda').each(function(item,index){
	clasesTablasDiv.each(function(clase){
		item.removeClass(clase);
		});
	});
}

//tabla is the id of the tablaDiv element
function inicializarTablaDiv(tabla)
{

	$$('#'+tabla+' .celda').each(function(item,index){
		
		if (item.get('tipo'))
		{
		var tipo=item.get('tipo');
		if (tipo.search('int')>=0)
			{item.addClass('celdaNumero');}
		if (tipo.search('date')==0)
			{item.addClass('celdaFecha');}
		if (tipo.search('decimal')==0)
			{item.addClass('celdaDecimal');}
		if (tipo.search('varchar')==0)
			{
			var caracteres=(tipo.substring(8,tipo.length-1))*1;
			if (caracteres < 50)
				{item.addClass('textoPeque');}
			else	
				{
				if (caracteres < 150)
					{item.addClass('textoMedio');
					item.addClass('edicionTextarea');}
				else	
					{item.addClass('textoGrande');
					item.addClass('edicionTextarea');}		
					
				}
			}
		if (tipo.search('text')==0)
			{item.addClass('textoGrande');}
		}
		
		if (item.get('campo'))
			{
			var campo=item.get('campo');
			if (typeof grandes !== 'undefined') 
				{if (grandes.indexOf(campo)!=-1)
					{item.addClass('anchuraGrande');}}
			if (typeof peques !== 'undefined') 
				{if (peques.indexOf(campo)!=-1)
					{item.addClass('anchuraPeque');}}
			if (typeof extraGrandes !== 'undefined') 
				{if (extraGrandes.indexOf(campo)!=-1)
					{item.addClass('anchuraExtraGrande');
					item.addClass('edicionTextarea');}}
			}
		});
	
	formatoHorizontal(tabla);	
	calcularAltura(tabla);

	//funciones adicionales: excel
	var botones=new Array('toExcel');
	var captions=new Array('export the table to excel');
	var barraFuncionesSup=new Element('div',{'class':'funcionesTabla'}).inject($(tabla),'top');
	var form=new Element('form',{'class':'oculto','method':'post'}).inject(barraFuncionesSup);
	var input=new Element('input',{'type':'text','name':'texto'}).inject(form);
	botones.each(function(boton,index)
		{
		var b=new Element('div',{'class':'funcionTabla conTip '+boton, 'title':captions[index]}).inject(barraFuncionesSup);
		});
	new Element('div',{'class':'clear'}).inject(barraFuncionesSup);
	$$('.funcionTabla').addEvent('click',function(e){funcionTabla(e.target);});
	
	barraFuncionesSup.addClass('funcionesTablaSup');
	$$('.funcionesTabla').addEvent('mouseenter',function(e)
		{
		if (e.target.hasClass('funcionesTabla'))
			{var item=e.target;}
		else
			{var item=e.target.getParent('.funcionesTabla');}
		new Fx.Tween(item, {property: 'height'}).start(25);
		});
	$$('.funcionesTabla').addEvent('mouseleave',function(e)
		{
		if (e.target.hasClass('funcionesTabla'))
			{var item=e.target;}
		else
			{var item=e.target.getParent('.funcionesTabla');}
		new Fx.Tween(item, {property: 'height'}).start(3);
		});
}

//consolidar la funcion anterior
function tableExtraFunction(tabla)
{
	var botones=new Array('toExcel');
	var captions=new Array('export the table to excel');
	var barraFuncionesSup=new Element('div',{'class':'funcionesTabla'}).inject($(tabla),'top');
	var form=new Element('form',{'class':'oculto','method':'post'}).inject(barraFuncionesSup);
	var input=new Element('input',{'type':'text','name':'texto'}).inject(form);
	botones.each(function(boton,index)
		{
		var b=new Element('div',{'class':'funcionTabla conTip '+boton, 'title':captions[index]}).inject(barraFuncionesSup);
		});
	new Element('div',{'class':'clear'}).inject(barraFuncionesSup);
	$$('.funcionTabla').addEvent('click',function(e){funcionTabla(e.target);});
	
	barraFuncionesSup.addClass('funcionesTablaSup');
	$$('.funcionesTabla').addEvent('mouseenter',function(e)
		{
		if (e.target.hasClass('funcionesTabla'))
			{var item=e.target;}
		else
			{var item=e.target.getParent('.funcionesTabla');}
		new Fx.Tween(item, {property: 'height'}).start(25);
		});
	$$('.funcionesTabla').addEvent('mouseleave',function(e)
		{
		if (e.target.hasClass('funcionesTabla'))
			{var item=e.target;}
		else
			{var item=e.target.getParent('.funcionesTabla');}
		new Fx.Tween(item, {property: 'height'}).start(3);
		});
}

function newExtraFunctionTablaDiv(table, className, title, functionName)
{
var functionsArea=$(table).getElement('.funcionesTabla');
var b=new Element('div',{'class':'funcionTabla conTip '+className, 'title':title}).inject(functionsArea.getElement('.clear'),'before');
b.addEvent('click',function(e){eval(functionName+"('"+table+"');");});
}

function getValorLinea(linea,campo)
{
var res=false;
if (linea.getElement('.datos[campo="'+campo+'"]'))
	{
	if (linea.getElement('.datos[campo="'+campo+'"]').getElement('.valor'))
		{
		res=linea.getElement('.datos[campo="'+campo+'"]').getElement('.valor').get('text');
		}
	}
return res;
}

function csvEscape(str)
{
var re = new RegExp('"', 'g');
str = str.replace(re, '""');
return str;
}

/*
function getVisibleContent(el)
{
if (!el.hasClass('oculto') && el.getStyle('display')!='none')
	{
	var children=el.getChildren();
	if (children.length==0)
		{return el.get('text')+' ';}
	else
		{
		var content='';
		children.each(function(item){
			content+=getVisibleContent(item);
			});
		return content;
			
		}
	}
else
	{return '';}

}*/

//showOnExport to show hidden lines/cells // dontExport for the opposite
function funcionTabla(el)
{
if (el.hasClass('toExcel'))
	{
	var tabla=el.getParent('.tablaDiv');
	var textoTabla='';
	tabla.getElements('.lineaTabla').each(function(linea)
		{
		if (((!linea.hasClass('oculto'))&&(!linea.hasClass('ocultoFiltrado'))&&(linea.getStyle('display')!='none')&&(!linea.hasClass('dontExport')))||(linea.hasClass('showOnExport')))
			{
			if (linea.hasClass('lineaNiveles'))
				{
				var nivel=linea.get('nivel')*1;
				var i=0;
				while (i<nivel)
					{
					textoTabla+='"",';
					i++;
					}
				}
			linea.getElements('.celda').each(function(celda)
					{
					if ((!celda.hasClass('oculto') && !celda.hasClass('dontExport'))  || celda.hasClass('showOnExport'))
						{
						if (celda.hasClass('titulo') && (!celda.hasClass('controles')))
							{
							textoTabla+='"'+getVisibleContent(celda)+'",';
							if (celda.hasClass('simboloIncluido'))
								{
								textoTabla+='"'+csvEscape(celda.get('tipoSimbolo'))+'",';
								}
							}
						if (celda.hasClass('datos'))
							{
							var hayValor=false;
							if (celda.getFirst('.valor'))
								{if (!celda.getFirst('.valor').hasClass('oculto'))
									{hayValor=true;}
								}
							if (hayValor)
								{
								var valor=getVisibleContent(celda.getFirst('.valor'));
								if (celda.hasClass('celdaDecimal'))
									{valor=limpiarNumero(valor);}
								textoTabla+='"'+csvEscape(valor)+'",';
								if (celda.getFirst('.simbolo'))
									{textoTabla+='"'+csvEscape(celda.getFirst('.simbolo').get('text'))+'",';}
								}
							else
								{
								var content=getVisibleContent(celda);
								/*if (content!='')
									{
									content=content.substring(0,content.length-1);
									}*/
								textoTabla+='"'+csvEscape(content)+'",';
								}
							}
						}
					});
			textoTabla+="findelinea";
			}
		});
	/*var req = new Request({   
            method: 'post',   
            url: 'ajax/tableAsCSV.php',   
						data: { 'textoTabla' : textoTabla,  'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")  }, 
						async:true,  
            onRequest: function() { },   
            onComplete: function(response) {}   
        }).send(); */
	var areaFunciones=el.getParent('.funcionesTabla');
	var formulario=areaFunciones.getElement('form');
	formulario.set('action','ajax/tableAsCSV.php');
	formulario.getElement('input').value=textoTabla;
	formulario.submit();
	}
}

function formatoHorizontal(tabla)
{
var lineasDatos=$(tabla).getElements('.lineaDatos');
lineasDatos.each(function(linea,index)
	{
	centrar(linea);
	});

}

function calcularAltura(tabla)
{
var lineasDatos=$(tabla).getElements('.lineaDatos');
lineasDatos.each(function(linea,index)
	{
	ajustarAltura(linea,36,46);
	});
}

//tabla is the id of the tablaDiv element
function ocultarColumna(tabla, campo)
{
$(tabla).getElements('.celda[campo="'+campo+'"]').each(function(item,index)
	{
	item.addClass('oculto');
	});
}

//tabla is the id of the tablaDiv element
function addClase(tabla, campo, clase)
{
$(tabla).getElements('.celda[campo="'+campo+'"]').each(function(item,index)
	{
	if (clase.indexOf('text')==0)
		{
		var textClasses=new Array('textoMini','textoPeque','textoMedio','textoGrande');
		textClasses.each(function(type)
			{
			item.removeClass(type);
			});
		}
	item.addClass(clase);
	});
}


function addClassFromField(table,field,prefix,cell)
{
$(table).getElements('.lineaDatos').each(function(line)
	{
	if (getValorLinea(line,field))
		{
		var newClass=getValorLinea(line,field).replace(/ /g,'_');
		if (typeof(prefix)!='undefined')
			{
			newClass=prefix+newClass;
			}
		if (typeof(cell)!='undefined')
			{
			if (line.getElement('.celda[campo="'+cell+'"]'))
				{line.getElement('.celda[campo="'+cell+'"]').addClass(newClass);}
			}
		else
			{
			line.addClass(newClass);
			}
		}
	});
}

function listaToIconos(el)
{
var lista=el.get('text').split(' ');
el.addClass('oculto');
var padre=el.getParent();
padre.getElements('.iconoLista').each(function(item){item.destroy();});
lista.each(function(item)
	{
	new Element('div',{'class':'iconoLista conTip '+item,'title':item,'classValue':item}).inject(el,'after');
	});
}
	
function ocultarTitulo(tabla)
{
$(tabla).getElements('.lineaTitulo').each(function(item,index)
	{
	item.addClass('oculto');
	});
}

function quitarTitulos(tabla)
{
$(tabla).getElements('.lineaTitulo').each(function(item,index)
	{
	item.destroy();
	});
}


function dosTablasFiltro(tabla1,tabla2,clase,tabla)
//not tested
//looks in table "tabla1" all lines from table "tabla2" to add the class "clase"
//tabla is the table of tabla2 elements. It can be empty if tabla2 has levels
//it supports levels both tabla1 and tabla2
{
var nivelesTabla1=false;
var nombreTabla1="";
if ($$('#'+tabla1+' .lineaNiveles').length>0)
	{
	nivelesTabla1=true;
	}
else
	{
	nombreTabla1=$(tabla1).get('tabla');
	}
$$('#'+tabla2+' .lineaDatos').each(function(item)
	{
	var linea=item.get('linea');
	if (item.hasClass('lineaNiveles'))
		{
		tabla=item.get('tabla');
		if (nombreTabla1!="")
			{
			if (tabla==nombreTabla1)
				{
				$$('#'+tabla1+' .lineaDatos[linea="'+linea+'"]').addClase(clase);
				}
			}
		else
			{
			$$('#'+tabla1+' .lineaDatos[linea="'+linea+'"][tabla="'+tabla+'"]').addClase(clase);
			}
		}
	else
		{
		if (nombreTabla1!="")
			{
			$$('#'+tabla1+' .lineaDatos[linea="'+linea+'"]').addClase(clase);
			}
		else
			{
			$$('#'+tabla1+' .lineaDatos[linea="'+linea+'"][tabla="'+tabla+'"]').addClase(clase);
			}
		}
	});
}

//el puede ser una tabla o una linea
function tablaToLista(el)
{
if (el.hasClass('lineaDatos'))
	{
	el.getFirst('.datos').addClass('cabeceraLista');
	}
else
	{
	el.getElements('.lineaDatos').each(function(item,index)
		{
		item.getFirst('.datos').addClass('cabeceraLista');
		});
	}
el.getElements('.celda').each(function(item,index)
	{
	item.addClass('celdaLista');
	});
}

function agruparTabla(tabla,campo)
{
var grupoActual='';
var numeroGrupo=0;
ocultarColumna(tabla,campo);
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	var grupo=item.getFirst('.celda[campo="'+campo+'"]').getFirst('.valor').get('text');
	if (grupo!=grupoActual)
		{
		numeroGrupo++;
		grupoActual=grupo;
		var lineaGrupo=new Element('div',{'class':'lineaGrupo lineaDatos','grupo':numeroGrupo,'groupLevel':'0'}).inject(item,'before');
		var controlesGrupo=new Element('div',{'class':'controlesGrupo'}).inject(lineaGrupo);
		new Element('div',{'class':'botonMostrarGrupo'}).inject(controlesGrupo);
		new Element('div',{'class':'botonOcultarGrupo oculto'}).inject(controlesGrupo);
		var textoGrupo=new Element('div',{'class':'celda', 'campo':campo}).inject(lineaGrupo);
		var valor=new Element('span',{'class':'valor','text':grupo}).inject(textoGrupo);
		new Element('div',{'class':'clear'}).inject(lineaGrupo);
		}
	item.set('grupo',numeroGrupo);
	item.addClass('ocultoGrupo');
	//item.getFirst('.celda[campo="'+campo+'"]').destroy();
	});
$(tabla).getElements('.botonMostrarGrupo').each(function(item,index)
	{item.addEvent('click',function(e){clickShowGroup(e.target);});});
$(tabla).getElements('.botonOcultarGrupo').each(function(item,index)
	{item.addEvent('click',function(e){clickHideGroup(e.target);});});
}

function segundoGrupoTabla(tabla,campo)
{
$(tabla).getElements('.botonMostrarGrupo').each(function(item,index){item.destroy();});
var grupoActual='';
var numeroGrupo=0;
ocultarColumna(tabla,campo);
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (item.hasClass('lineaGrupo'))
		{
		grupoActual='';
		numeroGrupo++;
		numeroGrupo1=item.get('grupo');
		item.set('grupo','0');
		item.set('numeroGrupo1',numeroGrupo1);
		}
	else
		{
		var grupo=item.getFirst('.celda[campo="'+campo+'"]').getFirst('.valor').get('text');
		if (grupo!=grupoActual)
			{
			numeroGrupo++;
			grupoActual=grupo;
			var lineaGrupo=new Element('div',{'class':'lineaGrupo lineaDatos lineaSegundoGrupo','grupo':numeroGrupo,'groupLevel':'1'}).inject(item,'before');
			var controlesGrupo=new Element('div',{'class':'controlesGrupo'}).inject(lineaGrupo);
			new Element('div',{'class':'botonMostrarGrupo'}).inject(controlesGrupo);
			new Element('div',{'class':'botonOcultarGrupo oculto'}).inject(controlesGrupo);
			var textoGrupo=new Element('div',{'class':'celda', 'campo':campo}).inject(lineaGrupo);
			var valor=new Element('span',{'class':'valor','text':grupo}).inject(textoGrupo);
			new Element('div',{'class':'clear'}).inject(lineaGrupo);
			}
		item.set('grupo',numeroGrupo);
		item.set('numeroGrupo1',numeroGrupo1);
		item.addClass('ocultoGrupo');
		}
	});
$(tabla).getElements('.botonMostrarGrupo').each(function(item,index)
	{item.addEvent('click',function(e){clickShowGroup(e.target);});});
$(tabla).getElements('.botonOcultarGrupo').each(function(item,index)
	{item.addEvent('click',function(e){clickHideGroup(e.target);});});	
	
}

function contarGrupoTabla(tabla)
{
$(tabla).getElements('.lineaGrupo').each(function(item,index)
	{
	var grupo=item.get('grupo');
	var numero=$(tabla).getElements('.lineaDatos[grupo="'+grupo+'"]').length - 1;
	if (item.getElement('.totalGroup'))
		{
		item.getElement('.totalGroup').set('text',numero);
		item.getElement('.totalGroup').set('total',numero);
		}
	else
		{
		var total=new Element('span',{'class':'cuentaGrupoTabla','text':'('+numero+')'}).inject(item.getFirst('.celda').getFirst('.valor'),'after');
		total.set('total',numero);
		}
	});
}

function contarFiltroGrupos(tabla,maxIndex,hide) //hide for hiding group headers with no elements
{
$(tabla).getElements('.lineaGrupo').each(function(item,index)
	{
	var grupo=item.get('grupo');
	var amount=0;
	$(tabla).getElements('.lineaDatos[grupo="'+grupo+'"]').each(function(line)
		{
		if (!line.hasClass('lineaGrupo'))
			{
			var filtered=false;
			var i=0;
			while (i<=maxIndex)
				{
				if (line.hasClass('ocultoFiltrado'+i))
					{
					filtered=true;
					}
				i++;
				}
			if (!filtered)
				{
				amount++;
				}
			}
		});
	if (item.getElement('.totalGroup'))
		{
		var total=item.getElement('.totalGroup').get('total');
		item.getElement('.totalGroup').set('text',amount+' of '+total);
		}
	if (item.getElement('.cuentaGrupoTabla'))
		{
		var total=item.getElement('.cuentaGrupoTabla').get('total');
		item.getElement('.cuentaGrupoTabla').set('text','('+amount+' of '+total+')');
		}
	if (amount==0 && hide)
		{
		item.addClass('ocultoFiltrado0');	
		}
	});
}

function contarGruposSegundoGrado(tabla)
{
$(tabla).getElements('.lineaSegundoGrupo').each(function(item,index)
	{
	var grupo=item.get('grupo');
	var numero=$(tabla).getElements('.lineaDatos[grupo="'+grupo+'"]').length - 1;
	if (item.getElement('.totalGroup'))
		{
		item.getElement('.totalGroup').set('text',numero);
		}
	else
		{
		new Element('span',{'class':'celda textoPeque','html':'<span class="cuentaGrupoTabla">('+numero+')</span>'}).inject(item.getFirst('.celda'),'after');
		}
	});
$(tabla).getElements('.lineaGrupo').each(function(item,index)
	{
	if (!item.hasClass('lineaSegundoGrupo'))
		{
		var grupo=item.get('numeroGrupo1');
		var numero=$(tabla).getElements('.lineaDatos[numeroGrupo1="'+grupo+'"]').length - 1;
		if (item.getElement('.totalGroup'))
			{
			item.getElement('.totalGroup').set('text',numero);
			}
		else
			{
			new Element('span',{'class':'celda textoPeque','html':'<span class="cuentaGrupoTabla">('+numero+')</span>'}).inject(item.getFirst('.celda'),'after');
			}
		}
	});
}


function groupInTable(table,value)
{
var res=false;
$(table).getElements('.lineaGrupo').each(function(item)
	{
	if (item.getFirst('.celda').getFirst('.valor').get('text')==value)
		{res=true;}
	});
return res;
}

function addGroupToTable(table,field,value,placement)
{
if ($(table).getElements('.lineaGrupo').length > 0)
	{
	var lineasGrupo=$(table).getElements('.lineaGrupo');
	var nuevaLinea;
	if (placement=='bottom')
		{
		nuevaLinea=lineasGrupo[lineasGrupo.length-1].clone();
		nuevaLinea.set('grupo',(nuevaLinea.get('grupo')*1)+1);
		}
	else
		{
		nuevaLinea=lineasGrupo[lineasGrupo.length-1].clone();
		nuevaLinea.set('grupo',(nuevaLinea.get('grupo')*1)+1);
		}
	nuevaLinea.inject($(table),placement);
	nuevaLinea.getFirst('.celda').getFirst('.valor').set('text',value);
	nuevaLinea.getElement('.botonMostrarGrupo').addEvent('click',function(e){clickShowGroup(e.target);});
	nuevaLinea.getElement('.botonOcultarGrupo').addEvent('click',function(e){clickHideGroup(e.target);});
	}
else
	{
	var nuevaLinea=new Element('div',{'class':'lineaGrupo lineaDatos','grupo':'1'}).inject($(table),placement);
	var nuevaLineaHtml='<div class="controlesGrupo"><div class="botonMostrarGrupo"></div><div class="botonOcultarGrupo oculto"></div></div>';
	nuevaLineaHtml+='<div class="celda" campo="'+field+'"><span class="valor">'+htmlentities(value)+'</span></div>';
	nuevaLinea.set('html',nuevaLineaHtml);
	nuevaLinea.getElement('.botonMostrarGrupo').addEvent('click',function(e){clickShowGroup(e.target);});
	nuevaLinea.getElement('.botonOcultarGrupo').addEvent('click',function(e){clickHideGroup(e.target);});
	}
}

function countGroupIfClass(table,lineClass)
{
$(table).getElements('.lineaGrupo').each(function(item,index)
	{
	var grupo=item.get('grupo');
	var numero=$(table).getElements('.lineaDatos.'+lineClass+'[grupo="'+grupo+'"]').length;
	if (item.getElement('.totalGroup[groupClass="'+lineClass+'"]'))
		{
		item.getElement('.totalGroup[groupClass="'+lineClass+'"]').set('text',numero);
		}
	else
		{
		new Element('span',{'class':'totalGroup'+lineClass,'text':'('+numero+')'}).inject(item.getFirst('.celda').getFirst('.valor'),'after');
		}
	});
}

function updateGroupStats(table)
{
if ($(table).getElement('.lineaGrupo'))
	{
	$(table).getElement('.lineaGrupo').getElements('.totalGroup').each(function(total)
		{
		if (total.get('groupClass')==null)
			{
			contarGrupoTabla(table);
			}
		else
			{
			countGroupIfClass(table,total.get('groupClass'));
			}
		});
	}
}

function denyDragToGroups(table) //only  valid for one table
{
dragElements.each(function(el)
	{
	el.detach();
	});
dragElements=new Array();
$$('.draggableLine').each(function(item)
	{item.removeClass('draggableLine');});
}

function allowDragToGroups(table) //only  valid for one table
{
$(table).getElements('.lineaDatos').each(function(item)
	{
	if (!item.hasClass('lineaGrupo'))
		{
		item.addClass('draggableLine');
		if (!item.getElement('.mensajeLineaActualizada'))
			{new Element('div',{'class':'mensajeLineaActualizada oculto'}).inject(item.getFirst('.celda'));}
		dragElements[dragElements.length] = new Drag.Move(item, {
			//container: $(table),
			droppables: '#'+table+' .lineaGrupo',
			//fails if needs scrolling
			
			onSnap: function(element, droppable){
				$$('#'+element.getParent('.tablaDiv').get('id')+' .lineaGrupo').each(function(lineGroup)
					{
					lineGroup.addClass('droppableLine');
					});
				$$('#'+element.getParent('.tablaDiv').get('id')+' .lineaDatos').each(function(line)
					{
					if (!line.hasClass('lineaGrupo')&& line.get('linea')!=element.get('linea'))
						{
						line.addClass('oculto');
						}
					});
				$$('#'+element.getParent('.tablaDiv').get('id')+' .botonMostrarGrupo').removeClass('oculto');
				$$('#'+element.getParent('.tablaDiv').get('id')+' .botonOcultarGrupo').addClass('oculto');
				element.addClass('activeDragLine');
			},
			
			onDrop: function(element, droppable, event){
				 $$('#'+element.getParent('.tablaDiv').get('id')+' .lineaGrupo').removeClass('droppableLine');
				 element.setStyle('top','0px');
				 element.setStyle('left','0px');
				 if (!droppable)
					{
					clickShowGroup(element.getPrevious('.lineaGrupo').getElement('.botonMostrarGrupo'));
					element.removeClass('activeDragLine');
					}
				else
					{
					if (!droppable.hasClass('lineaGrupo'))
						{
						droppable=droppable.getParent('.lineaGrupo');
						}
					droppable.addClass('activeDroppableGroup');
					
					$$('#'+element.getParent('.tablaDiv').get('id')+' .lineaGrupo').each(function(groupLine)
						{
						groupLine.removeClass('droppableLine');
						groupLine.removeClass('inDropLine');
						});
					var myRequest = new Request({
						method: 'post', 
						url: 'ajax/update.php',
						onSuccess: function(responseText){
							var dragLines=$$('.activeDragLine');
							var dragLine=dragLines[0];
							var droppableGroups=$$('.activeDroppableGroup');
							var droppableGroup=droppableGroups[0];
							var mensaje=dragLine.getElement('.mensajeLineaActualizada');
							mensaje.set('text',responseText);
							mensaje.removeClass('oculto');
							setTimeout("$$('.mensajeLineaActualizada').addClass('oculto');",2000);
							dragLine.removeClass('activeDragLine');	
							droppableGroup.removeClass('activeDroppableGroup');	
							if (responseText.indexOf('Error')!=-1)
								{
								mensaje.addClass('mensajeError');
								mensaje.removeClass('mensajeOK');
								clickShowGroup(dragLine.getPrevious('.lineaGrupo').getElement('.botonMostrarGrupo'));
								}
							else
								{
								mensaje.removeClass('mensajeError');
								mensaje.addClass('mensajeOK');
								dragLine.inject(droppableGroup,'after');
								dragLine.set('grupo',droppableGroup.get('grupo'));
								clickShowGroup(droppableGroup.getElement('.botonMostrarGrupo'));
								updateGroupStats(dragLine.getParent('.tablaDiv').get('id'));
								}
						},
						onFailure: function(){
							var dragLines=$$('.activeDragLine');
							var dragLine=dragLines[0];
							var droppableGroups=$$('.activeDroppableGroup');
							var droppableGroup=droppableGroups[0];
							dragLine.removeClass('activeDragLine');	
							droppableGroup.removeClass('activeDroppableGroup');	
							clickShowGroup(dragLine.getPrevious('.lineaGrupo').getElement('.botonMostrarGrupo'));
						}
						
						});
					var fieldGroup=droppable.getFirst('.celda').get('campo');
					var newValue=droppable.getFirst('.celda').getFirst('.valor').get('text');
					myRequest.send('tabla='+element.getParent('.tablaDiv').get('tabla')+'&id='+element.get('linea')+'&'+encodeURIComponent(fieldGroup)+'='+encodeURIComponent(newValue));	
					
					}
			},
		 
			onEnter: function(element, droppable){
				if (droppable.hasClass('lineaGrupo')){droppable.addClass('inDropLine');}
			},
		 
			onLeave: function(element, droppable){
				if (droppable.hasClass('lineaGrupo')){droppable.removeClass('inDropLine');}
			}
		 
		});
		
		}
	});


}

function clickShowGroup(el)
{
clicksCount++;
setTimeout(function(){checkShowGroup(el)},300);
}

function checkShowGroup(el)
{
if (clicksCount>0)
	{
	if (clicksCount==2)
		{showAllGroups(el);}
	else
		{showGroup(el)}
	clicksCount=0;
	}
}

function clickHideGroup(el)
{
clicksCount++;
setTimeout(function(){checkHideGroup(el)},300);
}

function checkHideGroup(el)
{
if (clicksCount>0)
	{
	if (clicksCount==2)
		{hideAllGroups(el);}
	else
		{hideGroup(el)}
	clicksCount=0;
	}
}

function showAllGroups(el)
{
var contenedor=el.getParent('.tablaDiv');
contenedor.getElements('.botonMostrarGrupo').each(function(item)
	{
	showGroup(item);
	});
}

function hideAllGroups(el)
{
var contenedor=el.getParent('.tablaDiv');
contenedor.getElements('.botonOcultarGrupo').each(function(item)
	{
	hideGroup(item);
	});
}

function showIfFew(table,maxRows)
{
var rows=$(table).getElements('.lineaTabla').length;
if ((rows>0)&&(rows<maxRows))
	{
	showAllGroups($(table).getElement('.lineaTabla'));
	}
}

function eliminarGrupo(el)
{
var grupo=el.getParent('.lineaGrupo').get('grupo');
var tabla=el.getParent('.tablaDiv');
tabla.getElements('.lineaDatos[grupo="'+grupo+'"]').each(function(item,index)
	{item.destroy();});
if (typeof(grupoEliminado)=='function')
		{
		grupoEliminado();
		}
}

function botonEliminarGrupo(tabla)
{
$(tabla).getElements('.lineaGrupo').each(function(item)
	{
	var boton=new Element('div',{'class':'botonEliminar conTip','title':'remove group'}).inject(item.getLast('.celda'),'after');
	boton.addEvent('click',function(event){eliminarGrupo(event.target);});
	});
}

function showGroup(el)
{
var tabla=el.getParent('.tablaDiv');
var grupo=el.getParent('.lineaGrupo').get('grupo');
tabla.getElements('.lineaDatos[grupo="'+grupo+'"]').each(function(item,index)
	{item.removeClass('ocultoGrupo');});
var controlesGrupo=el.getParent('.controlesGrupo');
controlesGrupo.getElement('.botonMostrarGrupo').addClass('oculto');
controlesGrupo.getElement('.botonOcultarGrupo').removeClass('oculto');
}

function hideGroup(el)
{
var tabla=el.getParent('.tablaDiv');
var grupo=el.getParent('.lineaGrupo').get('grupo');
tabla.getElements('.lineaDatos[grupo="'+grupo+'"]').each(function(item,index)
	{
	if (!item.hasClass('lineaGrupo'))
		{item.addClass('ocultoGrupo');}
	});
var controlesGrupo=el.getParent('.controlesGrupo');
controlesGrupo.getElement('.botonMostrarGrupo').removeClass('oculto');
controlesGrupo.getElement('.botonOcultarGrupo').addClass('oculto');

}


function newElementTablaDiv(div,tabla,id,extra)
//div:container for the table, should have a tbody div containing data lines
//tabla:MYSQL table name
//id: MYSQL parent id
//extra:POST parameter called extra for anything else you want to send to newElementTablaDiv.php
{
var tbody=$(div).getFirst('.tbody');
var nuevoEspacio=new Element('div',{'id':'nuevoEspacio'+div}).inject(tbody,'top');
	
var req = new Request({   
            method: 'get',   
            url: 'ajax/newElementTablaDiv.php',   
						data: { 'tabla':tabla,'id':id,'extra':extra, 'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")  }, 
						async:true,  
            onRequest: function() { },   
            onComplete: function(response) 
				{
				var destino_id='nuevoEspacio'+div;
				$(destino_id).innerHTML=response;
				var idNuevo=$(destino_id).getFirst().get('id');
				inicializarTablaDiv(destino_id);
				if (typeof(afterNewElementTablaDiv) =='function')
					{
					afterNewElementTablaDiv($(idNuevo));
					}
				if  ($(idNuevo).getParent('.tablaDiv'))
					{
					var tabla=$(idNuevo).getParent('.tablaDiv');
					tabla.fireEvent('afterNewElementTablaDiv', idNuevo);
					}
				eventosTablaDiv('#'+idNuevo);
				todosEditablesTablaRaiz('#'+idNuevo);
				if ($(idNuevo).getElement('.celda'))
					{editarLinea($(idNuevo).getElement('.celda'));}
				$(idNuevo).inject($(destino_id),'after');
				if (typeof(afterNewElementTablaDivCompleted) =='function')
					{
					afterNewElementTablaDivCompleted($(idNuevo));
					}
				if  ($(idNuevo).getParent('.tablaDiv'))
					{
					var tabla=$(idNuevo).getParent('.tablaDiv');
					tabla.fireEvent('afterNewElementTablaDivCompleted', idNuevo);
					}
				$(destino_id).destroy();
				}   
        }).send(); 
}

function edicionExterna(tabla,link)
{
$$('#'+tabla+' .lineaTitulo').each(function(item, index){
	var celda=new Element('div', {'class': 'celda controles titulo'}).inject(item,'top');
});
$$('#'+tabla+' .tbody .lineaDatos').each(function(item, index){
	var ident=item.get('linea');
	var celda=new Element('div', {'class': 'celda controles centrado'}).inject(item,'top');
	var boton=new Element('img', {'class':'boton conTip', title: 'edit', src:'styles/images/edit.png'}).inject(celda,'top');
	boton.addEvent('click',function(event){window.location=link+'id='+ident;});

});

}

function secsToTime(tabla,campo)
{

$$('#'+tabla+' .tbody .celda').each(function(item, index){
	if (item.get('campo')==campo)
		{
		var valor=item.getFirst('.valor');
		var secs=valor.get('text')*1;
		var horas=Math.floor(secs/3600);
		var minutos=Math.floor((secs-(horas*3600))/60);
		var minText="";
		if (minutos<10)
			{minText='0'+minutos;}
		else
			{minText=''+minutos;}
		valor.set('text',horas+':'+minText);	
		}
});

}


//sirve para filtar una tabla desde otra. El elemento está en la línea que filtra y se buscan iguales indices en las dos tablas). devuelve número de filtradas
function filtrarTablaRelacionada(el,ind1, tablaFiltrar,ind2)
{
var lineaOrigen=el.getParent('.lineaDatos');
var celdas=lineaOrigen.getElements('.datos');
var celdaOrigen=celdas[ind1];
var valorOrigen=celdaOrigen.getFirst('.valor').get('text');
var cuenta=0;
if ($(tablaFiltrar)!= null)
	{
	$$('#'+tablaFiltrar+' .lineaDatos').each(function(item, index){
		var celdas=item.getElements('.datos');
		var valorDestino=celdas[ind2].getFirst('.valor').get('text');
		if (valorOrigen != valorDestino)
			{
			item.addClass('oculto');
			}
		else
			{cuenta++;}
		});
	}

	return cuenta;
}

function quitarFiltro(tabla)
{
if ($(tabla)!= null)
	{
	$$('#'+tabla+' .lineaDatos').each(function(item, index){
	item.removeClass('oculto');
	});
	}
}

function addFilterControl(table,field)
{
if ($(table))
	{
	if ($(table).getElement('.lineaTitulo'))
		{
		if ($(table).getElement('.lineaTitulo').getElement('.celda[campo="'+field+'"]'))
			{
			titleCell=$(table).getElement('.lineaTitulo').getElement('.celda[campo="'+field+'"]');
			if (!titleCell.hasClass('filterEnabled'))
				{
				titleCell.addClass('filterEnabled');
				var filterBlock=new Element('div',{'class':'filterTableBlock'}).inject(titleCell);
				var button=new Element('div',{'class':'filterTableButton', 'title':'filtering options'}).inject(filterBlock);
				button.addEvent('click',function(e){tableFilterOptions(e)});
				new Element('div',{'class':'filterTableResults'}).inject(filterBlock);
				var filterIndex=$(table).getElements('.filterTableOptions').length;
				var options=new Element('div',{'class':'filterTableOptions oculto','table':table,'field':field,'filterIndex':filterIndex}).inject(filterBlock);
				new Element('div',{'class':'filterOptionsLine','html':'<span class="botonLink tableFilterSelection special allElements" style="padding-left:10px;padding-right:20px;">all</span><span class="botonLink tableFilterSelection special noElements" style="padding-left:10px;">none</span>'}).inject(options);
				if (blanksInTable(table,field)>0)
					{
					new Element('div',{'class':'filterOptionsLine','html':'<span class="botonLink tableFilterSelection blankSelection" style="padding-left:10px;">blanks<span>'}).inject(options);
					}
				var elements=getDistinctTable(table,field);
				elements.each(function(item){
					if (item!='')
						{new Element('div',{'class':'filterOptionsLine','html':'<span class="botonLink tableFilterSelection" style="padding-left:10px;">'+item+'<span>'}).inject(options);}
					});
				}
			}
		}
	}
}

function blanksInTable(table,field)
{
var blanks=0;
$(table).getElements('.lineaDatos').each(function(linea)
	{
	if (getValorLinea(linea,field)=='')
		{blanks++;}
	});
return blanks;
	}
	
function getDistinctTable(table,field)
{
var elements=new Array();
$(table).getElements('.lineaDatos').each(function(linea)
	{
	var valor=getValorLinea(linea,field);
	if (elements.indexOf(valor)==-1)
		{
		elements[elements.length]=valor;
		}
	});
return elements;
}

function tableFilterSelected(el)
{
var optionsBlock=el.getParent('.filterTableOptions');
var table=optionsBlock.get('table');
var field=optionsBlock.get('field');
var index=optionsBlock.get('filterIndex');
var value=el.get('text');
if (el.hasClass('blankSelection'))
	{
	value='';
	}
if (el.hasClass('special'))
	{
	if (el.hasClass('allElements'))
		{
		optionsBlock.getElements('.tableFilterDisabled').removeClass('tableFilterDisabled');
		filterTableAll(table,index,'show');
		}
	if (el.hasClass('noElements'))
		{
		optionsBlock.getElements('.tableFilterSelection').each(function(item)
			{
			if (!item.hasClass('special'))
				{item.addClass('tableFilterDisabled');}
			});
		filterTableAll(table,index,'hide');
		}
	}
else
	{
	if (el.hasClass('tableFilterDisabled'))
		{
		el.removeClass('tableFilterDisabled');
		
		filterTableToggle(table,field,value,index,'show');
		}
	else
		{
		el.addClass('tableFilterDisabled');
		filterTableToggle(table,field,value,index,'hide');
		}
	}
var titleCell=$(table).getElement('.lineaTitulo').getElement('.celda[campo="'+field+'"]');
titleCell.getElements('.filterTableOptions').destroy();
var newOptions=optionsBlock.clone().inject(titleCell.getElement('.filterTableBlock'));
newOptions.addClass('oculto');

}

function tableFilterOptions(e)
{
var filterBlock=e.target.getParent('.filterTableBlock');
if (filterBlock.getElement('.filterTableOptions'))
	{
	openInfoWindow(e,new Array(200,300),new Array(-50,-50));
	addCloseInfoWindow();
	var newFilterBlock=filterBlock.getElement('.filterTableOptions').clone().inject($('cuadroInfoContent'));
	newFilterBlock.removeClass('oculto');
	newFilterBlock.getElements('.tableFilterSelection').each(function(item)
		{
		item.addEvent('click',function(e){tableFilterSelected(e.target);});
		});
	}
}

function filterTableAll(table,index,action)
{
$(table).getElements('.lineaDatos').each(function(line)
	{
	if (action=='show')
		{
		line.removeClass('ocultoFiltrado'+index);
		}
	else
		{
		line.addClass('ocultoFiltrado'+index);
		}
	});
}
function filterTableToggle(table,field,value,index,action)
{
$(table).getElements('.lineaDatos').each(function(line)
	{
	if (getValorLinea(line,field)==value)
		{
		if (action=='show')
			{
			line.removeClass('ocultoFiltrado'+index);
			}
		else
			{
			line.addClass('ocultoFiltrado'+index);
			}
		}
	});
}

function cleanTableFilter(table, index)
{
$(table).getElements('.ocultoFiltrado'+index).each(function(line)
	{
	line.removeClass('ocultoFiltrado'+index);
	});
}

function multiFilterTable(table,filterArea,index)
{
cleanTableFilter(table,index);
$(filterArea).getElements('.filterOutput').each(function(filter)
	{
	$(table).getElements('.lineaDatos').each(function(line)
		{
		if (!line.hasClass('lineaGrupo'))
			{
			var field=filter.get('name');
			var values=filter.get('value').split(',');
			var result=false;
			var compare=getValorLinea(line,field);
			values.each(function(value)
				{
				if (value==compare || value=='All'){result=true;}	
				});
			if (!result)
				{
				line.addClass('ocultoFiltrado'+index);
				}
			}			
		});
	});


}

function addOrderControl(table,field,orderField)
{
if (typeof(orderField)=='undefined')
	{
	orderField=field;
	}
if ($(table))
	{
	if ($(table).getElement('.lineaTitulo'))
		{
		if ($(table).getElement('.lineaTitulo').getElement('.celda[campo="'+field+'"]'))
			{
			titleCell=$(table).getElement('.lineaTitulo').getElement('.celda[campo="'+field+'"]');
			if (!titleCell.hasClass('orderEnabled'))
				{
				titleCell.addClass('orderEnabled');
				titleCell.set('orderField',orderField);
				var block=new Element('div',{'class':'orderSelectionBlock', 'title':'click for ascending order'}).inject(titleCell);
				new Element('div',{'class':'orderSelectionAsc'}).inject(block);
				new Element('div',{'class':'orderSelectionDesc'}).inject(block);
				block.addEvent('click',function(e){toggleOrderTable(e.target);});
				}
			}
		}
	}
}

function toggleOrderTable(el)
{
if (!el.hasClass('orderSelectionBlock'))
	{
	el=el.getParent('.orderSelectionBlock');
	}
var titleCell=el.getParent('.celda');
var currentField=titleCell.get('campo');
var table=titleCell.getParent('.tablaDiv');
var direction='';
if (el.getElement('.orderSelectionAsc').hasClass('oculto'))
	{
	direction='DESC';
	el.getElement('.orderSelectionAsc').removeClass('oculto');
	el.getElement('.orderSelectionDesc').addClass('oculto');
	el.set('title','click for ascending order');
	}
else
	{
	direction='ASC';
	el.getElement('.orderSelectionAsc').addClass('oculto');
	el.getElement('.orderSelectionDesc').removeClass('oculto');
	el.set('title','click for descending order');
	}
ordenarTablaDiv(table,titleCell.get('orderField'),direction);
$(table).getElements('.orderEnabled').each(function(item)
	{
	if (item.get('campo')!=currentField)
		{
		item.getElement('.orderSelectionAsc').removeClass('oculto');
		item.getElement('.orderSelectionDesc').removeClass('oculto');
		item.getElement('.orderSelectionBlock').set('title','click for ascending order');
		}
	});
}

function ordenarTablaDiv(tabla,campo,sentido,extra)
{
//ordena la tabla en funcion de los valores del campo, sentido puede ser ASC-DESC y extra reservado para futuros usos
var lineas=$(tabla).getElements('.lineaDatos').length;
revisarOrden(tabla,campo,lineas,0,0, sentido);
}

function revisarOrden(tabla,campo,lineasTotales,actual,mirando, sentido)
{
if (actual>mirando)
	{
	var lineas=$(tabla).getElements('.lineaDatos');
	var tipo=lineas[mirando].getElement('.datos[campo="'+campo+'"]').get('tipo');
	switch(tipo)
		{
		case 'decimal':
		case 'int':
		var comparar1=limpiarNumero(lineas[actual].getElement('.datos[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
		var comparar2=limpiarNumero(lineas[mirando].getElement('.datos[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
		break;
		default:
		var comparar1=lineas[actual].getElement('.datos[campo="'+campo+'"]').getElement('.valor').get('text');
		var comparar2=lineas[mirando].getElement('.datos[campo="'+campo+'"]').getElement('.valor').get('text');
		break;
		}
	if (sentido=='ASC')
		{
		if (comparar1<comparar2)
			{
			mirando--;
			if (mirando<0)
				{
				if (lineas[actual].getParent('.tablaDivForm'))
					{lineas[actual].getParent('.tablaDivForm').inject(lineas[mirando+1].getParent('.tablaDivForm'),'before');}
				else
					{lineas[actual].inject(lineas[mirando+1],'before');}
				mirando=actual;
				}
			}
		else
			{
			if (lineas[actual].getParent('.tablaDivForm'))
				{lineas[actual].getParent('.tablaDivForm').inject(lineas[mirando].getParent('.tablaDivForm'),'after');}
			else
				{lineas[actual].inject(lineas[mirando],'after');}
			mirando=actual;
			}
		}
	else
		{
		if (comparar1>comparar2)
			{
			mirando--;
			if (mirando<0)
				{
				if (lineas[actual].getParent('.tablaDivForm'))
					{lineas[actual].getParent('.tablaDivForm').inject(lineas[mirando+1].getParent('.tablaDivForm'),'before');}
				else
					{lineas[actual].inject(lineas[mirando+1],'before');}
				mirando=actual;
				}
			}
		else
			{
			if (lineas[actual].getParent('.tablaDivForm'))
				{lineas[actual].getParent('.tablaDivForm').inject(lineas[mirando].getParent('.tablaDivForm'),'after');}
			else
				{lineas[actual].inject(lineas[mirando],'after');}
			mirando=actual;
			}
		}
	revisarOrden(tabla,campo,lineasTotales,actual,mirando,sentido);
	}
else
	{
	actual++;
	if (actual<lineasTotales)
		{
		mirando=actual-1;
		revisarOrden(tabla,campo,lineasTotales,actual,mirando,sentido);
		}
	}
}

//tabla is the id of the tablaDiv element
function enlazarCeldas(tabla, basePath, campo, campoId)
{
$$('#'+tabla+' .datos[campo="'+campo+'"]').each(function(item, index){
		var dataLine=item.getParent('.lineaDatos');
		var ident=dataLine.get('linea');
		if (typeof(campoId)!='undefined')
			{
			ident=dataLine.getElement('.datos[campo="'+campoId+'"]').getElement('.valor').get('text');
			}
		var valor=item.getElement('.valor');
		var link  = new Element('a', { 'class':valor.get('class'),'href':basePath+'&id='+ident,'tipo':valor.get('tipo'),'campo':valor.get('campo'),'html':valor.get('html')}).inject(valor, 'after');
		valor.destroy();

	});
	}
	
function enlazarDosCeldas(tabla, campo, campoLink)
{
$$('#'+tabla+' .titulo').each(function(item, index){
	if (item.get('campo')==campoLink)
		{item.addClass('oculto');}
	});

$$('#'+tabla+' .lineaDatos').each(function(item, index){
	item.getElements('.datos').each(function(dato, ind)
		{		
		if (dato.get('campo')==campo)
			{
			
			var celdaLink=item.getElement('.datos[campo="'+campoLink+'"]');
			var links=celdaLink.getElements('a');
			if (links.length==0)
				{
				var valor=dato.getElement('.valor');
				var link  = new Element('a', { 'class':valor.get('class'),'href':celdaLink.getFirst('.valor').get('text'),'tipo':valor.get('tipo'),'campo':valor.get('campo'),'campolink':campoLink,'text':valor.get('text')}).inject(valor, 'after');
				valor.destroy();
				celdaLink.addClass('oculto');
				celdaLink.addClass('campoLink');
				celdaLink.set('campoBase',campo);
				}
			}
		});
	});
}
	
function iconosCeldas(tabla, campo)
{
$$('#'+tabla+' .titulo').each(function(item, index){
	if (item.get('campo')==campo)
		{
		item.set('parser','html');
			}
});

$$('#'+tabla+' .datos').each(function(item, index){
	if (item.get('campo')==campo)
		{
		var texto=item.get('text');
		item.empty();
		item.set('title',texto);
		item.addClass('conTip');
		var el=new Element('div',{'class': texto}).inject(item);
			}
});
	
	}
	
function getParsers(tabla)
{
	var res=new Array();
	$$('#'+tabla+' .titulo').each(function(item, index){
	res.push(item.get('parser'));
});
return res;
	}	

function ajustarAltura(linea, maxHeight, maxScroll)
{
var size = linea.getSize();
var altura=size.y;
if (altura>maxHeight)
	{
	linea.getElements('.celda').each(function(celda,index)
		{
		celda.addClass('alturaDoble');
		var scroll = celda.getScrollSize();
		var sizeCelda = celda.getSize();
		if ((scroll.y>maxScroll) || (scroll.x > sizeCelda.x))
			{
			if (celda.hasClass('datos'))
				{mostrarAdicional(celda);}
			}
		else
			{
			quitarAdicional(celda);
			}
		});
	}
else
	{
	linea.getElements('.celda').each(function(celda,index)
		{
		var scroll = celda.getScrollSize();
		var sizeCelda = celda.getSize();
		if (scroll.x > sizeCelda.x)
			{
			if (celda.hasClass('datos'))
				{mostrarAdicional(celda);}
			}
		else
			{
			quitarAdicional(celda);
			}
		});
	}
var myTips=new Tips('.infoAdicional');
}

function botonTablaFiltrada(tabla,claseFiltro,accion,textoBoton)
//tercer parámetro es para el nombre de la clase del boton y la funcion
{
tabla.getElements('.lineaDatos.'+claseFiltro).each(function(item)
	{
	var boton=new Element('div',{'class':'botonTablaFiltrada '+accion}).inject(item.getElement('.clear'),'before');
	boton.set('text',textoBoton);
	boton.addEvent('click',function(event){eval(accion+'(event.target);');});
	});
}



function botonTabla(tabla,campo,funcion)
//tercer parámetro es para el nombre de la clase del boton y la funcion
{
var lineasDatos=$(tabla).getElements('.lineaDatos');
lineasDatos.each(function(linea,index)
	{
	linea.getElements('.celda').each(function(celda,index)
		{
		if (celda.hasClass('datos'))
			{
			if (celda.get('campo')==campo)
				{
				var boton=new Element('div', {'class': funcion}).inject(celda);
				boton.addEvent('click',function(event){eval(funcion+'(event.target);');});
				}
			}
		});
	});
}

function nuevaClase(tabla,campo)
{
var lineasDatos=$(tabla).getElements('.lineaDatos');
lineasDatos.each(function(linea,index)
	{
	linea.getElements('.celda').each(function(celda,index)
		{
		if (celda.hasClass('datos'))
			{
			if (celda.get('campo')==campo)
				{
				var valor=celda.getFirst('.valor');
				linea.addClass(valor.get('text'));
				}
			}
		});
	});
}

function nuevaClaseCelda(tabla,campo)
{
var lineasDatos=$(tabla).getElements('.lineaDatos');
lineasDatos.each(function(linea,index)
	{
	linea.getElements('.celda').each(function(celda,index)
		{
		if (celda.hasClass('datos'))
			{
			if (celda.get('campo')==campo)
				{
				var valor=celda.getFirst('.valor');
				celda.addClass(valor.get('text'));
				}
			}
		});
	});
}

function limpiarClasesTo1(tabla, campo, clases)
{
$(tabla).getElements('.lineaDatos').each(function(item)
	{
	if (item.getElement('.datos[campo="'+campo+'"]'))
		{
		var lista=item.getElement('.datos[campo="'+campo+'"]').getFirst('.valor').get('text').split(',');
		var claseFinal='';
		clases.each(function(clase)
			{
			if ((lista.indexOf(clase)>-1)&&(claseFinal==''))
				{
				claseFinal=clase;
				}
			});
		item.getElement('.datos[campo="'+campo+'"]').getFirst('.valor').set('text',claseFinal);
		}
	});
}

function centrar(linea)
{
linea.getElements('.celda').each(function(celda,index)
		{
		//if (celda.hasClass('datos') && celda.hasOwnProperty('tipo'))
			var tipo=celda.get('tipo');
			if (tipo!=null)
				{
				if ((tipo.indexOf('varchar')!=0)&&(tipo.indexOf('text')!=0))
					{
					celda.addClass('centrado');
					}
				}
				
		});
}


function mostrarAdicional(celda)
{
var adicional='';
var adicionales=celda.getElements('.infoAdicional')
if (adicionales.length>0)
	{
	adicional=celda.getFirst('.infoAdicional');
	}
else
	{
	adicional=new Element('div', {'class': 'infoAdicional'}).inject(celda);
	}
var valor=celda;
if (celda.getFirst('.valor'))
	{valor=celda.getFirst('.valor');}
else
	{
	if (celda.getFirst('div'))
		{valor=celda.getFirst('div');}
	}
if (adicional)
	{
	adicional.set('rel',valor.get('html'));
	adicional.addEvent('click',function(e)
			{
			if ($('cuadroInfo'))
				{
				openInfoWindow(e,new Array(200,100),new Array(-10,10));
				addCloseInfoWindow();
				$('cuadroInfoContent').set('html',e.target.getParent('.celda').get('html'));
				$('cuadroInfoContent').getElement('.infoAdicional').destroy();
				$('cuadroInfoContent').addClass('cuadroInfoBlanco');
				var drag = new Drag($('cuadroInfo'));
				}
			});
	}
		
}

function quitarAdicional(celda)
{
var adicionales=celda.getElements('.infoAdicional')
if (adicionales.length>0)
	{
	var adicional=celda.getFirst('.infoAdicional');
	adicional.destroy();
	}
}

function nuevoCampo(elemento,nombre,posicion,campoCopia)
{
if (elemento.getElements('.lineaDatos').length>0)
	{
	var celdaTitulo=elemento.getElement('.lineaTitulo').getElement('.celda[campo="'+campoCopia+'"]');
	elemento.getElements('.lineaTitulo').each(function(item)
		{
		var titulos=item.getElements('.celda.titulo');
		var posicionTitulo=posicion;
		if (titulos[0].hasClass('controles'))
			{
			posicionTitulo++;
			}
		var nuevoTitulo=celdaTitulo.clone();
		nuevoTitulo.inject(titulos[posicionTitulo],'after');
		nuevoTitulo.set('campo',nombre);
		nuevoTitulo.set('text',nombre);
		nuevoTitulo.addClass('tituloNuevo');
		});

	var celdaDatos=elemento.getElement('.lineaDatos').getElement('.celda[campo="'+campoCopia+'"]');
	elemento.getElements('.lineaDatos').each(function(item)
		{
		var datos=item.getElements('.celda.datos');
		var nuevoDato=celdaDatos.clone();
		nuevoDato.inject(datos[posicion],'after');
		nuevoDato.set('campo',nombre);
		nuevoDato.addClass('datoNuevo');
		nuevoDato.getFirst('.valor').removeClass('editable');
		nuevoDato.getFirst('.valor').set('text','');
		});
	}
}

function actualizarTabla(idForm)
{

if(typeof formularioActualizado == 'function') {
	formularioActualizado(idForm);
	}
if(typeof actualizarCalculosTabla == 'function') {
	if ($(idForm).getParent('.lineaDatos'))
		{actualizarCalculosTabla($(idForm).getParent('.lineaDatos'));}
	}
}
	
function filtrarTablaClases(tabla,campo,clases,filtro)
//filters if the field does not have any of the clases. filtro is added as class for the line
{
tabla.getElements('.lineaDatos').each(function(item)
	{
	if (item.getElement('.datos[campo="'+campo+'"]'))
		{
		var ocultar=true;
		clases.each(function(clase)
			{
			if (item.getElement('.datos[campo="'+campo+'"]').hasClass(clase))
				{
				ocultar=false;
				}
			});
		if (ocultar)
			{
			item.addClass('ocultoFiltrado');
			if (item.getElement('.ocultarNiveles'))
				{
				ocultarSiguienteNivel(item.getElement('.ocultarNiveles'));
				}
			}
		else
			{
			item.addClass(filtro);
			}
		}
	});
}

function filtrarTablaClasesLinea(tabla,clases,filtro)
//filters if the field does not have any of the clases. filtro is added as class for the line
{
tabla.getElements('.lineaDatos').each(function(item)
	{
	var ocultar=true;
	clases.each(function(clase)
		{
		if (item.hasClass(clase))
			{
			ocultar=false;
			}
		});
	if (ocultar)
		{
		item.addClass('ocultoFiltrado');
		if (item.getElement('.ocultarNiveles'))
			{
			ocultarSiguienteNivel(item.getElement('.ocultarNiveles'));
			}
		}
	else
		{
		item.addClass(filtro);
		}
	});
}

function mostrarConMatches(tabla,claseSuma)
{
tabla.getElements('.lineaDatos').each(function(item)
	{
	var numero=item.getElement('.'+claseSuma).get('text')*1;
	if (numero>0)
		{
		item.removeClass('ocultoFiltrado');
		}
	else
		{
		item.addClass('ocultoFiltrado');
		}
	});
}

function contarMatches(tabla,filtro,claseNuevo,niveles)
{
tabla.getElements('.lineaDatos').each(function(item)
	{
	var cuenta=new Element('div',{'class':claseNuevo}).inject(item.getElement('.clear'),'before');
	if (item.hasClass(filtro))
		{
		cuenta.set('text','1');
		}
	else
		{
		cuenta.set('text','0');
		}
	});

var nivelActual=niveles -1;
while (nivelActual>0)
	{
	tabla.getElements('.lineaDatos[nivel="'+nivelActual+'"]').each(function(item)
		{
		var lineaSuperior=item.get('lineaSuperior');
		var sumar=item.getElement('.'+claseNuevo).get('text')*1;
		var lineaSup=tabla.getElement('.lineaDatos[nivel="'+(nivelActual-1)+'"][linea="'+lineaSuperior+'"]');
		var inicial=lineaSup.getElement('.'+claseNuevo).get('text')*1;
		lineaSup.getElement('.'+claseNuevo).set('text',(sumar+inicial));
		});
	nivelActual--;
	}

}	

function quitarFiltroTabla(tabla,filtro)
{
tabla.getElements('.lineaDatos.ocultoFiltrado').each(function(item)
	{
	//ver si el único filtro que tiene es ese y quitar el filtro//de momento sólo lo añado como clase
	item.removeClass('ocultoFiltrado');
	});
tabla.getElements('.lineaDatos.'+filtro).each(function(item)
	{
	item.removeClass(filtro);
	});
}

function arrayFromTabla(tabla,campo)
{
var resultado=new Array();
tabla.getElements('.lineaDatos').each(function(item)
	{
	if (item.getElement('.datos[campo="'+campo+'"]'))
		{
		resultado[resultado.length]=item.getElement('.datos[campo="'+campo+'"]').getFirst('.valor').get('text');
		}
	});
return resultado;	
}

function buscarEnTabla(tabla, campo, valor)
{
var linea=0;
var encontrado=false;
tabla.getElements('.lineaDatos').each(function(item)
	{
	if (!encontrado)
		{
		if (item.getElement('.datos[campo="'+campo+'"]'))
			{
			if (item.getElement('.datos[campo="'+campo+'"]').getFirst('.valor').get('text')==valor)
				{
				linea=item.get('linea');
				encontrado=true;
				}
			}
		}
	});
return linea;
}

//revisar unir con funcion edicionExterna
function edicionLinkExterno(tabla, link)
{
$(tabla).getElements('.lineaDatos').each(function(item)
	{
	if (item.getElement('.datos'))
		{
		var botonEditar=new Element('div',{'class':'botonEditar conTip showOnEdit','title':'edit','link':link}).inject(item,'top');
		botonEditar.addEvent('click',function(e){window.location=e.target.get('link')+'id='+e.target.getParent('.lineaDatos').get('linea');});
		}
	});

}

function edicionFuncion(tabla, funcion)
{
$(tabla).getElements('.lineaDatos').each(function(item)
	{
	if (item.getElement('.datos'))
		{
		var botonEditar=new Element('div',{'class':'botonEditar conTip showOnEdit','title':'edit','funcion':funcion}).inject(item,'top');
		botonEditar.addEvent('click',function(e){
			var funcion=e.target.get('funcion');
			eval(funcion+'(e.target);');
			});
		}
	});

}

function linkFuncion(tabla,campo,funcion)
{
$$('#'+tabla+' .datos[campo="'+campo+'"]').each(function(item, index){
		var ident=item.getParent().get('linea');
		var valor=item.getElement('.valor');
		var link  = new Element('a', { 'class':valor.get('class'),'href':'javascript:'+funcion+'(id='+ident+');','tipo':valor.get('tipo'),'campo':valor.get('campo'),'text':valor.get('text')}).inject(valor, 'after');
		valor.destroy();
});

}

function tablasDiv_addSimbol(tabla, campo,simbol)
{
$$('#'+tabla+' .datos[campo="'+campo+'"]').each(function(item, index){
	new Element('span',{'class':'separacion','style':'padding-left:5px;'}).inject(item,'bottom');
	new Element('span',{'class':'symbolTable','text':simbol}).inject(item,'bottom');
	});
}

function addSymbol(table,field,symbol,type)
{
$(table).getElements('.datos[campo="'+field+'"]').each(function(el)
	{
	new Element('span',{'class':'simbolo','tipo':type,'text':symbol}).inject(el,'bottom');
	});

}

function populateFormFromLine(form,linea,disableMode)
{
var disabling=false;
if (typeof(disableMode)!='undefined')
	{
	disabling=disableMode;
	}
form.getElements('input[type="text"]').each(function(item)
	{
	if (linea.getElement('.celda[campo="'+item.get('name')+'"]'))
		{
		item.value=getValorLinea(linea,item.get('name'));
		if (disabling){item.disabled=true;}
		}
	});
form.getElements('textarea').each(function(item)
	{
	if (linea.getElement('.celda[campo="'+item.get('name')+'"]'))
		{
		item.value=getValorLinea(linea,item.get('name'));
		if (disabling){item.disabled=true;}
		}
	});
form.getElements('select').each(function(item)
	{
	if (linea.getElement('.celda[campo="'+item.get('name')+'"]'))
		{
		setSelectValue(form,item.get('name'),getValorLinea(linea,item.get('name')));
		if (disabling){item.disabled=true;}
		}
	});

}