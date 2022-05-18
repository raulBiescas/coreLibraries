/*!
 * menus.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 menus.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

//hooks: tabAbandonada(target), tabSeleccionada(target)

var clicksAgrupar=0;

//new v1.0
function openPopUp(closeAllowed)
{
if (typeof(closeAllowed)=='undefined'){closeAllowed=true;}
$('popUp').empty();
$$('.popUpElement').removeClass('oculto');
if (!closeAllowed)
	{$("popUpClose").addClass('oculto');}
return ($('popUp'));
}

//new v1.0
function closePopUp()
{
$$(".popUpElement").addClass("oculto");
if (typeof(popUpClosed)=="function"){popUpClosed();}
$("popUp").empty();
}

//new v1.0
function createPopUpStructure(popUp,includeStepLine)
{
if (typeof(includeStepLine)=='undefined'){includeStepLine=false;}
var contentClass='';
if (includeStepLine)
	{
	var stepLine=new Element('div',{'class':'stepLine'}).inject(popUp);
	new Element('div',{'class':'clear'}).inject(stepLine);
	contentClass='stepsAbove';
	}
new Element('div',{'class':'popUpInternalContent '+contentClass}).inject(popUp);

}

//new v1.0
function getPopUpContent(container)
{
return (container.getElement('.popUpInternalContent'));
}

//new v1.0
function blockStep(container,stepName, allowRedo)
{
if (typeof(allowRedo)=='undefined'){allowRedo=true;}
var content=getStepContent(container, stepName);
var blockingArea=new Element('div',{'class':'stepBlocker'}).inject(content);
if (allowRedo)
	{
	var redoButton=new Element('div',{'class':'redoButton', 'text':'DO AGAIN'}).inject(blockingArea);
	redoButton.addEvent('click',function(e)
		{
		var container=e.target.getParent('.stepContent');
		container.fireEvent('redoStepRequested', container);
		});
	}
}
//new v1.0
function removeBlockingStep(container,stepName)
{
var content=getStepContent(container, stepName);
content.getElement('.stepBlocker').destroy();	
}

//new v1.0
function removeStepsFrom(container,stepName)
{
var found=false;
container.getElements('.stepItem').each(function(item)
	{
	if (found)
		{removeStep(container,item.get('stepName'));}
	else
		{
		if (item.get('stepName')==stepName){found=true;}
		}
	});

}

function removeStep(container,stepName)
{
if (container.getElement('.stepItem[stepName="'+stepName+'"]')){container.getElement('.stepItem[stepName="'+stepName+'"]').destroy();}
if (container.getElement('.stepContent[stepName="'+stepName+'"]')){container.getElement('.stepContent[stepName="'+stepName+'"]').destroy();}
}
	

//new v1.0
function createStep(container,stepName)
{
var stepLine;
if (container.getElement('.stepLine'))
	{
	stepLine=container.getElement('.stepLine');
	}
else
	{
	stepLine=new Element('div',{'class':'stepLine'}).inject(container);
	}
var steps=container.getElements('.stepItem');
var number=steps.length+1;
var stepItem=new Element('div',{'class':'stepItem','number':number,'stepName':stepName,'text':stepName}).inject(stepLine.getElement('.clear'),'before');
var stepContent=new Element('div',{'class':'stepContent','number':number,'stepName':stepName}).inject(stepLine.getNext('.popUpInternalContent'));
stepItem.addEvent('click',function(e){selectPopUpStep(e.target);});
selectPopUpStep(stepItem);	

return stepItem;
}

//new v1.0
function getStepSelector(container,stepName)
{
return (container.getElement('.stepItem[stepName="'+stepName+'"]'));
}

//new v1.0
function getStepContent(container, stepName)
{
return (container.getElement('.stepContent[stepName="'+stepName+'"]'));
}

//new v1.0
function selectPopUpStep(el)
{
if (!el.hasClass('stepItem')){el=el.getParent('.stepItem');}
var line=el.getParent('.stepLine');
line.getElements('.stepItem').each(function(item){item.removeClass('currentStep');});
el.addClass('currentStep');
var stepName=el.get('stepName');
var content=line.getNext('.popUpInternalContent');
content.getElements('.stepContent').each(function(item){item.addClass('oculto');});
content.getElement('.stepContent[stepName="'+stepName+'"]').removeClass('oculto');
}


function openInfoWindow(e,size,pos)
{
var posCursor=e.page;
$('cuadroInfo').empty();
$('cuadroInfo').removeClass('oculto');
$('cuadroInfo').setStyle('width',size[0]+'px');
$('cuadroInfo').setStyle('height',size[1]+'px');
$('cuadroInfo').setStyle('left',(posCursor.x+pos[0])+'px');
$('cuadroInfo').setStyle('top',(posCursor.y+pos[1])+'px');
new Element('div',{'id':'cuadroInfoContent','style':'position:absolute;top:1%;left:1%;width:98%;height:98%;overflow:auto;'}).inject($('cuadroInfo')); 

}
var dragCuadroInfo;
function addCloseInfoWindow()
{
var cerrar=new Element('div',{'class':'conTip','style':'position:absolute;top:2px;right:5px;cursor:pointer;width:15px;height:15px;z-index:10;','text':'X','title':'close'}).inject($('cuadroInfo')); 
cerrar.addEvent('click',function(){closeInfoWindow();});
dragCuadroInfo=new Drag('cuadroInfo').detach();
new Element('div',{'class':'dragCorner','style':'top:5px;left:5px'}).inject($('cuadroInfo'));
//new Element('div',{'class':'dragCorner','style':'top:5px;right:5px'}).inject($('cuadroInfo'));
new Element('div',{'class':'dragCorner','style':'bottom:5px;left:5px'}).inject($('cuadroInfo'));
new Element('div',{'class':'dragCorner','style':'bottom:5px;right:5px'}).inject($('cuadroInfo'));
$$('.dragCorner').each(function(item)
	{
	item.addEvent('mouseover',function(e){dragCuadroInfo.attach();});
	item.addEvent('mouseleave',function(e){dragCuadroInfo.detach();});
	});
}

function closeInfoWindow()
{
$('cuadroInfo').addClass('oculto');
$('cuadroInfo').empty();
}

function menuTabs(el,claseTabs, claseTarget)
{
el.getElements('.'+claseTabs).each(function(item,index)
	{
	item.addEvent('click',function(e)
		{
		var elemento='';
		if (e.target.hasClass(claseTabs))
			{
			elemento=e.target;
			}
		else
			{
			elemento=e.target.getParent('.'+claseTabs);
			}
		var padre=elemento.getParent('div');
		if (typeof(tabAbandonada)=='function')
			{
			padre.getElements('.'+claseTabs+'.seleccionada').each(function(tab,ind)
				{tabAbandonada(tab.get('target'));});
			}
		$$('.'+claseTarget).each(function(target,ind)
			{
			target.addClass('oculto');
			});
		var idTarget=elemento.get('target');
		$(idTarget).removeClass('oculto');
		
		padre.getElements('.'+claseTabs+'.seleccionada').each(function(tab,ind)
			{
			tab.removeClass('seleccionada');
			});
		elemento.addClass('seleccionada');
		if (typeof(tabSeleccionada)=='function')
			{
			tabSeleccionada(idTarget);
			}
		});
	});

}

function menuTabsLoad(el,claseTabs, claseTarget)
{
el.getElements('.'+claseTabs).each(function(item,index)
	{
	item.addEvent('click',function(e)
		{
		var elemento='';
		if (e.target.hasClass(claseTabs))
			{
			elemento=e.target;
			}
		else
			{
			elemento=e.target.getParent('.'+claseTabs);
			}
		var padre=elemento.getParent('div');
		if (typeof(tabAbandonada)=='function')
			{
			padre.getElements('.'+claseTabs+'.seleccionada').each(function(tab,ind)
				{tabAbandonada(tab.get('target'));});
			}
		$$('.'+claseTarget).each(function(target,ind)
			{
			target.addClass('oculto');
			});
		var idTarget=e.target.get('target');
		$(idTarget).removeClass('oculto');
		padre.getElements('.'+claseTabs+'.seleccionada').each(function(tab,ind)
			{
			tab.removeClass('seleccionada');
			});
		elemento.addClass('seleccionada');
		
		var reload=false;
		var loaded=$(idTarget).get('loaded');
		if (loaded=='reload')
			{
			reload=true;
			}
		if (loaded=='no')
			{
			reload=true;
			$(idTarget).set('loaded','yes');
			}
		if (reload)
			{
			tabReload(idTarget);
			}
		else
			{
			if (typeof(tabSeleccionada)=='function')
				{
				tabSeleccionada(idTarget);
				}
			}
		});
	});

}

function tabReload(idTarget)
{
loading($(idTarget));
var infoSource=$(idTarget).get('infoSource');
$(idTarget).set('load', {evalScripts: true,onSuccess:function(event)
	{
	if (typeof(tabSeleccionada)=='function')
		{
		tabSeleccionada(idTarget);
		}
	}
});
$(idTarget).load(infoSource);
}

//incluir css tablasDiv.css, anterior tiene que tener position:absolute o relative. Se agrupa el div siguiente con clase
function groupElements(anterior, clase)
{
var mostrar=new Element('div',{'class':'controlesGrupo botonMostrarGrupo conTip','title':'show (double click for all)','clase':clase}).inject(anterior);
mostrar.addEvent('click',function(e){clickMostrar(e.target);});
var ocultar=new Element('div',{'class':'controlesGrupo botonOcultarGrupo oculto conTip','title':'hide (double click for all)','clase':clase}).inject(anterior);
ocultar.addEvent('click',function(e){clickOcultar(e.target);});
anterior.getNext('.'+clase).dissolve();
}

function contarElementosGrupo(titulo,claseGrupo,claseElemento)
{
var i=0;
titulo.getNext('.'+claseGrupo).getElements('.'+claseElemento).each(function(item)
	{
	if (!item.hasClass('noContar'))
		{
		i++;
		}
	});
titulo.getElements('.numeroElementos').set('text',i);
}

function clickMostrar(el)
{
clicksAgrupar++;
setTimeout(function(){checkMostrar(el)},300);
}

function checkMostrar(el)
{
if (clicksAgrupar>0)
	{
	if (clicksAgrupar==2)
		{mostrarTodosGrupos(el);}
	else
		{accionMostrarGrupo(el)}
	clicksAgrupar=0;
	}
}

function clickOcultar(el)
{
clicksAgrupar++;
setTimeout(function(){checkOcultar(el)},300);
}

function checkOcultar(el)
{
if (clicksAgrupar>0)
	{
	if (clicksAgrupar==2)
		{ocultarTodosGrupos(el);}
	else
		{accionOcultarGrupo(el)}
	clicksAgrupar=0;
	}
}

function mostrarTodosGrupos(el)
{
var contenedor=el.getParent().getParent();
contenedor.getElements('.botonMostrarGrupo').each(function(item)
	{
	accionMostrarGrupo(item);
	});
}

function ocultarTodosGrupos(el)
{
var contenedor=el.getParent().getParent();
contenedor.getElements('.botonOcultarGrupo').each(function(item)
	{
	accionOcultarGrupo(item);
	});
}

function accionMostrarGrupo(el)
{
var padre=el.getParent();
var clase=el.get('clase');
var botonOcultar=padre.getElement('.botonOcultarGrupo');
if (botonOcultar.hasClass('oculto'))
	{
	el.addClass('oculto');
	botonOcultar.removeClass('oculto');
	padre.getNext('.'+clase).reveal();
	}
}

function accionOcultarGrupo(el)
{
var padre=el.getParent();
var clase=el.get('clase');
var botonMostrar=padre.getElement('.botonMostrarGrupo');
if (botonMostrar.hasClass('oculto'))
	{
	el.addClass('oculto');
	botonMostrar.removeClass('oculto');
	padre.getNext('.'+clase).dissolve();
	}
}

function finderInit(root)
{
$$(root +' .jsonInput').each(function(item)
	{
	item.addEvent('focus',function(e){
		var f=e.target.getParent('.finderParent');
		var extra=new Array();
		if (f.hasOwnProperty('extra'))
			{
			var extraInputs=f.get('extra').split(',');
			extraInputs.each(function(item)
				{
				extra[extra.length]=valueFromForm(f,item);
				});
			}
		e.target.set('extra',JSON.encode(extra));
		addAutoSelect(e.target,$(f.get('containerAutoSelects')));
		e.target.addEvent('afterAutoselect', function(linea){
			var target=this.getParent('.finderLine').get('target');
			if (linea.get('linea')!='0')
				{
				window.location=target+linea.get('linea');
				}
			});
		});
	});
}

//requires ajax/getSelectValues.php, called when input get focus input.addEvent('focus',function(e){addAutoSelect(input,container,extra,chars)});
function addAutoSelect(input,container,charsInit)
{
var chars=3;
if (typeof(charsInit)!='undefined')
	{
	chars=charsInit;
	}

var contSize=container.getSize();
var inputSize=input.getSize();
var pos=input.getPosition(container);
var dimension='top';
var offset=0;
var height=0;
if (pos.y>contSize.y-(pos.y+inputSize.y))
	{
	dimension='bottom';
	offset=contSize.y-pos.y;
	height=pos.y;
	}
else
	{
	offset=pos.y+inputSize.y;
	height=contSize.y-(pos.y+inputSize.y);
	}
var left=pos.x;
var width=200;
var form=input.getParent('form').get('id');
new Element('div',{'id':'autoselect'+input.get('name'),'class':'autoselectArea','parentForm':form,'maxHeight':height,'chars':chars,'style':dimension+':'+offset+'px;height:'+height+'px;left:'+left+'px;width:'+width+'px;','name':input.get('name')}).inject(container);
updateAutoSelect(input);
input.addEvent('blur',function(e){setTimeout(function(){$$('.autoselectArea').each(function(item){item.destroy();});},500);});
input.addEvent('keyup',function(e){updateAutoSelect(e.target)});

}

function updateAutoSelect(input)
{
if ($('autoselect'+input.get('name')))
	{
	var area=$('autoselect'+input.get('name'));
	var chars=area.get('chars')*1;
	if (input.value.length>=chars)
		{
		area.removeClass('oculto');
		loading('autoselect'+input.get('name'));
		var extra='';
		if (input.hasOwnProperty('extra'))
			{
			extra=input.get('extra');
			}
		$('autoselect'+input.get('name')).load('ajax/getSelectValues.php?field='+input.get('name')+'&value='+input.value+'&extra='+encodeURIComponent(extra));
		}
	else
		{
		area.addClass('oculto');
		}
	}
}

function autoSelectLoaded(field,ocultos)
{
tablaToLista($('autoSelectTable'+field));
if (typeof(ocultos)!='undefined')
	{
	ocultos.each(function(item)
		{
		ocultarColumna('autoSelectTable'+field, item);
		});
	}
if ($('autoSelectTable'+field).getElement('.lineaDatos'))
	{
	var width=0;
	$('autoSelectTable'+field).getElement('.lineaDatos').getElements('.celda').each(function(celda)
		{
		width+=celda.getSize().x;
		});
	$('autoselect'+field).setStyle('width',(width+20)+'px');	
	}
var height=(44*$('autoSelectTable'+field).getElements('.lineaDatos').length)+2;
if (height<($('autoselect'+field).get('maxHeight')*1))
	{
	$('autoselect'+field).setStyle('height',height+'px');
	}
else
	{
	$('autoselect'+field).setStyle('height',$('autoselect'+field).get('maxHeight')+'px');
	addAutoscroll($('autoselect'+field));
	}
$('autoSelectTable'+field).getElements('.lineaDatos').each(function(item)
	{
	item.addEvent('click',function(e){
		var linea=e.target;
		if (!linea.hasClass('lineaDatos'))
			{
			linea=linea.getParent('.lineaDatos');
			}
		var autoselect=linea.getParent('.autoselectArea');
		var input=$(autoselect.get('parentForm')).getElement('input[name="'+autoselect.get('name')+'"]');
		input.value=getValorLinea(linea,autoselect.get('name'));
		input.fireEvent('afterAutoselect', linea);
		});
	});

}

//requires el has overflow:hidden
function addAutoscroll(el,speed)
{
var id=el.get('id');
var px=44;
if (typeof(speed)!='undefined')
	{
	px=speed;
	}
var topScroll=new Element('div',{'class':'scrollActionArea','speed':px,'parent':id,'position':'top','enabled':'0','style':'top:0px;','top':'0'}).inject(el);
topScroll.addEvent('mouseover',function(e){if (e.target.hasClass('scrollActionArea')){e.target.set('enabled','1');actionAutoScroll(e.target);}});
topScroll.addEvent('mouseleave',function(e){if (e.target.hasClass('scrollActionArea')){e.target.set('enabled','0');}});
var bottomScroll=new Element('div',{'class':'scrollActionArea','speed':px,'parent':id,'position':'bottom','enabled':'0','style':'top:'+(el.getSize().y-44)+'px','top':el.getSize().y-44}).inject(el);
bottomScroll.addEvent('mouseover',function(e){if (e.target.hasClass('scrollActionArea')){e.target.set('enabled','1');actionAutoScroll(e.target);}});
bottomScroll.addEvent('mouseleave',function(e){if (e.target.hasClass('scrollActionArea')){e.target.set('enabled','0');}});
}

var elementUnderScroll;

function actionAutoScroll(el)
{
if (el.get('enabled')=='1')
	{
	elementUnderScroll=el;
	var parentId=el.get('parent');
	var position=el.get('position');
	var speed=el.get('speed')*1;
	var scroll=$(parentId).getScroll();
	var sizeScroll=$(parentId).getScrollSize().y-$(parentId).getSize().y;
	var difScrolly=speed;
	if (position=='top')
		{
		$(parentId).getElement('.scrollActionArea[position="bottom"]').removeClass('oculto');
		if (scroll.y < speed)
			{
			el.addClass('oculto');
			difScrolly=0;
			}
		else
			{
			difScrolly=(-1)*speed;
			}
		}
	else
		{
		$(parentId).getElement('.scrollActionArea[position="top"]').removeClass('oculto');
		if (sizeScroll-scroll.y < speed)
			{
			el.addClass('oculto');
			difScrolly=0;
			}
		}
	if (difScrolly!=0)
		{
		$(parentId).getElement('.scrollActionArea[position="bottom"]').setPosition({x:0, y: $(parentId).getElement('.scrollActionArea[position="bottom"]').getPosition($(parentId)).y+difScrolly+scroll.y});
		$(parentId).getElement('.scrollActionArea[position="top"]').setPosition({x:0, y: $(parentId).getElement('.scrollActionArea[position="top"]').getPosition($(parentId)).y+difScrolly+scroll.y});
		new Fx.Scroll($(parentId)).set(0,$(parentId).getScroll().y+difScrolly);
		setTimeout(function(){actionAutoScroll(elementUnderScroll);},100);
		}
	}
}

function loading(id)
{
$(id).set('html','<div class="loading">loading...</div>');
}

//selectionMenuContainer for the container and selectionMenuLine for each option

function initSelectionMenu(menu)
{
$(menu).getElements('.selectionMenuLine').each(function(item)
	{
	item.addEvent('click',function(e)
		{
		var line=e.target;
		if (!line.hasClass('selectionMenuLine'))
			{
			line=line.getParent('.selectionMenuLine');
			}
		var container=line.getParent('.selectionMenuContainer');
		container.getElements('.selectionMenuLine').each(function(el)
			{
			el.removeClass('selectedMenu');
			});
		line.addClass('selectedMenu');
		
		});
		
	});
	
}