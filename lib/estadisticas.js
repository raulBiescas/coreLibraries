/*!
 * estadisticas.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 estadisticas.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */
window.addEvent('domready',
 function() {

$$('.excelChartLine').addEvent('click',function(e){chartToExcel(e.target);});
$$('.launchChartStat').addEvent('click',function(e){generateChart(e.target);});
$$('.chartMenuOptionsRadio').addEvent('change',function(e)
	{
	var container=e.target.getParent('.chartsContainer');
	var type=getRadioTextValue(container,'chartMenuOptionsRadio');
	container.getElements('.statsFilterOptions').each(function(item){if(!item.hasClass('commonFilterOptions')){item.addClass('oculto');}});
	if (container.getElement('.statsFilterOptions[stat="'+type+'"]'))
		{
		container.getElement('.statsFilterOptions[stat="'+type+'"]').removeClass('oculto');
		}
	});
$$('.activatePeriodSelection').addEvent('change',function(e)
	{
	var container=e.target.getParent('.containerDateFilter');
	var period=getSelectValue(container,'period');
	container.getElements('.periodSelectorContainer').each(function(item){item.destroy();});
	if (period!='')
		{
		var thisYear=true;
		if(container.getElement('.yearSelection').getElement('select'))
			{
			var year=getSelectValue(container.getElement('.yearSelection'),'year');
			if (year!=container.getElement('.yearSelection').get('current'))
				{
				thisYear=false;
				}
			}
		
		var dateData=container.getElement('.dateData[period="'+period+'"]');
		var values=dateData.get('text').split(',');
		if (thisYear)
			{
			var periodNow=dateData.get('now');
			var found=false;
			while (!found && values.length>0)
				{
				if (periodNow==values.shift())
					{
					found=true;
					}
				}
			}
		if (period=='Year')
			{
			values=new Array(year);
			}
		var selectorContainer=new Element('div',{'class':'standardLineFilterOptions periodSelectorContainer','html':'<span style="padding-left:10px;padding-right:5px"><strong>'+period+':</strong></span><select class="dateFilteringItem" name="selectedPeriod">'+selectHtml(values, values[0])+'</select>'}).inject(dateData,'after');
		}
	});
	
$$('.multipleChartsSelect').each(function(item)
	{
	initMultipleChartsSelect(item);
	});
	
$$('.chartsAreaSelection').each(function(item)
	{
	initMultipleChartsArea(item);
	});
	
$$('.multipleChartsArea').each(function(item)
	{
	initChartsAreaSelection(item);
	});

	
});


function chartPercentageCalculation(container)
{
if (container.getElement('.labelsRow'))
	{
	var labels=container.getElement('.labelsRow').get('text').split(';');
	var found=false;
	var newLabels=new Array();
	labels.each(function(item)
		{
		if (item=='NULL')
			{
			newLabels[newLabels.length]='None';	
			}
		else
			{
			if (item!='Total')
				{
				newLabels[newLabels.length]=item;	
				}
			else
				{
				found=true;
				}
			}
		});
	if (found && container.getElement('.dataRow'))
		{
		container.getElement('.labelsRow').set('text',newLabels.join(';'));
		container.getElements('.dataRow').each(function(item)
			{
			var data=item.get('text').split(';');
			var newData=new Array();
			var total=(data[data.length-1])*1;
			var i=0;
			while (i<data.length-1)
				{
				newData[i]=((data[i]*1)/total)*100;
				i++;
				}
			item.set('text',newData.join(';'))
			});
		
		}
	}


}

function initChartMenuCommon(menu)
{
menu.getElements('.multipleChartsSelect').each(function(item)
	{
	initMultipleChartsSelect(item);
	});
	
menu.getElements('.chartsAreaSelection').each(function(item)
	{
	initMultipleChartsArea(item);
	});
	
menu.getElements('.multipleChartsArea').each(function(item)
	{
	initChartsAreaSelection(item);
	});

menu.getElements('.excelChartLine').each(function(item){item.addEvent('click',function(e){chartToExcel(e.target);});});
	
}

function initMultipleChartsSelect(item)
{
item.addEvent('change',function(e)
	{
	var el=e.target;
	var number=getSelectValueSelect(el)*1;
	el.getParent('.multipleChartsArea').getElements('.chartsAreaSelection').each(function(item)
		{
		var orden=item.get('order')*1;
		if (orden<=number)
			{
			item.removeClass('oculto');	
			}
		else
			{
			item.addClass('oculto');	
			}
		});
	var selected=el.getParent('.multipleChartsArea').getElement('.selectedChartArea');
	if (selected.hasClass('oculto'))
		{
		selected.removeClass('selectedChartArea');
		el.getParent('.multipleChartsArea').getElement('.area1').addClass('selectedChartArea');
		}
		
	if (el.getParent('.chartsContainer'))
		{
		var p=el.getParent('.chartsContainer');
		if (p.getElement('.statsChartArea'))
			{
			var container=p.getElement('.statsChartArea');
			var i=1;
			while (i<5)
				{
				if (i<=number)
					{
					if (container.getElement('.multiChart[order="'+i+'"]'))
						{
						var el=container.getElement('.multiChart[order="'+i+'"]');
						el.removeClass('t1charts');el.removeClass('t2charts');el.removeClass('t4charts');
						el.addClass('t'+number+'charts');
						}
					else
						{
						new Element('div',{'class':'t'+number+'charts chart'+i+' multiChart','order':i}).inject(container);	
						}
					}
				else
					{
					if (container.getElement('.multiChart[order="'+i+'"]'))
						{
						container.getElement('.multiChart[order="'+i+'"]').destroy();
						}
					}
				
				i++;				
				}
			
			}
		}
	});
}

function initMultipleChartsArea(item)
{
if (item.getParent('.chartsContainer'))
	{
	var p=item.getParent('.chartsContainer');
	if (p.getElement('.statsChartArea'))
		{
		if (!p.getElement('.statsChartArea').getElement('.chart1'))
			{new Element('div',{'class':'t1charts chart1 multiChart','order':'1'}).inject(p.getElement('.statsChartArea'));}
		}
	}	
	
}

function initChartsAreaSelection(item)
{
item.addEvent('click',function(e){	
	var el=e.target;
	if (el.getParent('.multipleChartsRight'))
		{
		el.getParent('.multipleChartsRight').getElements('.chartsAreaSelection').each(function(item)
			{
			item.removeClass('selectedChartArea');
			});
		el.addClass('selectedChartArea');
		}
	});	
}

function createChartStructure(container,divId)
{
var main=new Element('div',{'id':divId,'style':'width=100%;height:100%;position:relative;'}).inject(container);
new Element('div',{'class':'oculto dataChartContainer'}).inject(main);
var chart=new Element('div',{'style':'width:98%;height:98%;top:1%;left:1%;position:absolute;'}).inject(main);
new Element('canvas',{'style':'display:inline-block;width:100%;height:100%;border-left:1px solid #ccc;'}).inject(chart);
}


function fondoBarras(area, clase)
{
var mayor=0;
var valores=new Array();
$$('#'+area+' .'+clase).each(function(item,index){
	if (item.get('valor'))
		{
		var nuevoValor=item.get('valor')*1;
		}
	else
		{
		var nuevoValor=item.get('text')*1;
		}
	if (nuevoValor>mayor)
		{mayor=nuevoValor;}
	valores[index]=nuevoValor;
	});

$$('#'+area+' .'+clase).each(function(item,index){
	var barra=new Element('div',{'class':'barra'}).wraps(item);
	var anchura=Math.round((valores[index]/mayor)*100);
	barra.setStyle('width', anchura + '%');
	});
}

var monedaCambio=new Array();
var valoresCambio=new Array();

function formatoMonedaRaiz(raiz)
{
$$(raiz+' .simbolo[tipoSimbolo="CUR"]').each(function(item,index)
	{
	if (item.getPrevious('.valor'))
		{
		var valor=limpiarNumero(item.getPrevious('.valor').get('text'))*1;
		var nuevoValor=valor.decimal(2);
		item.getPrevious('.valor').set('text',nuevoValor);
		}
	});
}

function formatoMoneda()
{
$$('.simbolo[tipoSimbolo="CUR"]').each(function(item,index)
	{
	if (item.getPrevious('.valor'))
		{
		var valor=limpiarNumero(item.getPrevious('.valor').get('text'))*1;
		var nuevoValor=valor.decimal(2);
		item.getPrevious('.valor').set('text',nuevoValor);
		}
	else
		{
		if (item.getPrevious('.datos'))
			{
			var valor=limpiarNumero(item.getPrevious('.datos').get('text'))*1;
			var nuevoValor=valor.decimal(2);
			item.getPrevious('.datos').set('text',nuevoValor);
			}
		}
	});
}

function cambioMoneda(tabla,moneda)
{
monedaCambio=new Array();
valoresCambio=new Array();
$(tabla).getElements('.simbolo[tipo="CUR"]').each(function(item,index)
	{
	var origen=item.get('text');
	if (origen!=moneda)
		item.set('text',moneda);
		{
		if (item.getPrevious('.valor'))
				{
				var valor=limpiarNumero(item.getPrevious('.valor').get('text'))*1;
				if (monedaCambio.indexOf(origen)==-1)
					{
					var valorCambio=getCambio(origen,moneda)*1;
					monedaCambio.push(origen);
					valoresCambio.push(valorCambio);
					}
				else
					{
					var valorCambio=valoresCambio[monedaCambio.indexOf(origen)];
					}
				var nuevoValor=valorCambio*valor;
				item.getPrevious('.valor').set('text',nuevoValor);
				}
		}
	});
}

function getCambio(origen,destino)
{
var yearExchange='';
if (typeof(year)=='number')
	{var yearExchange=year;}
var respuesta='';
var req = new Request({   
            method: 'get',   
            url: 'ajax/exchange.php',   
						data: { 'origen' : origen, 'destino' : destino ,'year':yearExchange, 'ahora':new Date().toString("yyyy-MM-ddTHH:mm:ssZ")  }, 
						async:false,  
            onRequest: function() { },   
            onComplete: function(response) {respuesta=response;}   
        }).send(); 
return respuesta;
}

function columnaTituloEstadistica(tabla,campo)
//transforma tablaDiv en grafica de barras
{
$(tabla).getElements('.celda').each(function(item,index){item.addClass('oculto');});
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (item.getFirst('.celda[campo="'+campo+'"]'))
		{
		var areaBarra=new Element('div',{'class':'areaBarraTabla'}).inject(item);
		var areaTitulo=new Element('div',{'class':'tituloBarraTabla','html':item.getFirst('.celda[campo="'+campo+'"]').get('html')}).inject(areaBarra);
		var barra=new Element('div',{'class':'barraTabla'}).inject(areaBarra);	
		}
	});

}

function addBarra(tabla, campo, nivel)
{
//añade una barra y le da tamaño respecto a nivel 0, que tiene width 80%
var numNiveles=2;//sacarlo
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (item.getFirst('.celda[campo="'+campo+'"]'))
		{
		var barra=item.getElement('.barraTabla');
		var nuevaBarra=new Element('div',{'class':'barraNivel'+nivel}).inject(barra);
		var tituloBarra=new Element('div',{'class':'tituloBarraNivel'+nivel}).inject(barra);
		tituloBarra.set('html',item.getFirst('.celda[campo="'+campo+'"]').get('html'));
		if (nivel==0)
			{
			var valorRef=item.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text');
			nuevaBarra.set('valor',valorRef);
			}
		else
			{
			var valor=item.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text')*1;
			var valorRef=item.getElement('.barraNivel0').get('valor')*1;
			var width=Math.floor((valor/valorRef)*80);
			nuevaBarra.setStyle('width',width+'%');
			if (width<(10*(numNiveles+1-nivel)))
				{
				tituloBarra.setStyle('left',((6*(numNiveles-nivel))+1)+'%');
				}
			else
				{
				if (width>(100-(numNiveles*10)))
					{
					tituloBarra.setStyle('left',(80-(nivel*10))+'%');
					}
				else
					{
					tituloBarra.setStyle('right',(100-width+1)+((nivel-1)*6)+'%');
					}
				}
			}
		}
	});

}

function addMismoNivel(tabla, campo)
{
var numNiveles=2;//sacarlo
//añade una referencia sobre el nivel 0
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (item.getFirst('.celda[campo="'+campo+'"]'))
		{
		var barra=item.getElement('.barraTabla');
		var valor=item.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text')*1;
		var valorRef=item.getElement('.barraNivel0').get('valor')*1;
		var width=Math.floor((valor/valorRef)*80);
		if (width>80)
			{
			var nuevaBarra=new Element('div',{'class':'barraExceso'}).inject(barra);
			nuevaBarra.setStyle('width',(width-80)+'%');
			var tituloBarra=new Element('div',{'class':'tituloBarraExceso'}).inject(barra);
			tituloBarra.set('html',item.getFirst('.celda[campo="'+campo+'"]').get('html'));
			if (width>90)
				{
				tituloBarra.setStyle('right','11%');
				barra.getElement('.tituloBarraNivel0').setStyle('left','91%');
				}
			else
				{
				tituloBarra.setStyle('right',(100-width-1)+'%');
				barra.getElement('.tituloBarraNivel0').setStyle('left',(width+1)+'%');
				}
			}
		else
			{
			var nuevaBarra=new Element('div',{'class':'barraDefecto'}).inject(barra);
			nuevaBarra.setStyle('width',width+'%');
			var tituloBarra=new Element('div',{'class':'tituloBarraDefecto'}).inject(barra);
			tituloBarra.set('html',item.getFirst('.celda[campo="'+campo+'"]').get('html'));
			if (width<20)
				{
				tituloBarra.setStyle('left',(numNiveles*10)+'%');
				}
			else
				{
				if (width>70)
					{
					tituloBarra.setStyle('right',(100-width+1)+'%');
					}
				else
					{
					tituloBarra.setStyle('right',(100-width-7)+'%');
					}
				}
			}
		}
	});
}

function calcularTotalesGrupo(tabla,campo)
{
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (!item.hasClass('lineaGrupo'))
		{
		if (item.getPrevious('.lineaGrupo'))
			{
			var lineaGrupo=item.getPrevious('.lineaGrupo');
			if (item.getFirst('.celda[campo="'+campo+'"]'))
				{
				if (lineaGrupo.getFirst('.celda[campo="'+campo+'"]'))
					{
					var valorGrupo=lineaGrupo.getFirst('.celda[campo="'+campo+'"]').getElement('.valor');
					var valor=limpiarNumero(item.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
					var nuevoValor=valor+(valorGrupo.get('text')*1);
					valorGrupo.set('text',nuevoValor);
					}
				else
					{
					if (lineaGrupo.getElement('.clear'))
						{item.getFirst('.celda[campo="'+campo+'"]').clone().inject(lineaGrupo.getElement('.clear'),'before');}
					else
						{item.getFirst('.celda[campo="'+campo+'"]').clone().inject(lineaGrupo);}
					}
				}
			}
		}
	});
}


function addTotalsLine(table,fields)
{
var totalLine=$(table).getElement('.lineaTitulo').clone();
totalLine.inject($(table));
totalLine.getElements('.celda').each(function(item){item.empty();item.set('id',table+item.get('campo')+'TOTAL');});
totalLine.getElement('.celda').set('html','<strong>TOTAL</strong>');
fields.each(function(field)
	{
	calcularTotalesTabla(table,field,$(table+field+'TOTAL'));
	});

}

function calcularTotalesTabla(tabla,campo,destino)
{
destino.empty();
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	if (!item.hasClass('lineaGrupo'))
		{
		if (item.getFirst('.celda[campo="'+campo+'"]'))
			{
			if (destino.getFirst('.valor'))
				{
				var valor=limpiarNumero(item.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
				var nuevoValor=valor+(limpiarNumero(destino.getFirst('.valor').get('text'))*1);
				destino.getFirst('.valor').set('text',nuevoValor);
				}
			else
				{
				destino.set('html',item.getFirst('.celda[campo="'+campo+'"]').get('html'));
				}
			}
		}
	});
}

function calcularIncremento(linea, campoOrigen, campo, destino)
{
destino.empty();
var valorOrigen=limpiarNumero(linea.getFirst('.celda[campo="'+campoOrigen+'"]').getElement('.valor').get('text'))*1;
if (valorOrigen>0)
	{
	var valor=limpiarNumero(linea.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
	var incremento=Math.abs(((valor/valorOrigen)-1)*100);
	var incTexto=incremento.decimal(1);
	var span=new Element('span',{'class':'incremento','text':incTexto+'%'}).inject(destino);
	if (valorOrigen>valor)
		{
		span.set('text','-'+span.get('text'));
		span.addClass('negativo');
		}
	else
		{
		if (valorOrigen==valor)
			{span.addClass('igual');}
		else
			{
			span.addClass('positivo');
			span.set('text','+'+span.get('text'));
			}
		}
	}
}

function calcularPorcentaje(tabla, campoOrigen, campoDestino)
{
destino.empty();
var valorOrigen=limpiarNumero(linea.getFirst('.celda[campo="'+campoOrigen+'"]').getElement('.valor').get('text'))*1;
if (valorOrigen>0)
	{
	var valor=limpiarNumero(linea.getFirst('.celda[campo="'+campo+'"]').getElement('.valor').get('text'))*1;
	var incremento=Math.abs(((valor/valorOrigen)-1)*100);
	var incTexto=incremento.decimal(1);
	var span=new Element('span',{'class':'incremento','text':incTexto+'%'}).inject(destino);
	if (valorOrigen>valor)
		{
		span.set('text','-'+span.get('text'));
		span.addClass('negativo');
		}
	else
		{
		if (valorOrigen==valor)
			{span.addClass('igual');}
		else
			{
			span.addClass('positivo');
			span.set('text','+'+span.get('text'));
			}
		}
	}
}

function addRelativePercentage(table,referenceField,field)
{
$(table).getElements('.lineaDatos').each(function(line)
	{
	var val1=limpiarNumero(line.getFirst('.celda[campo="'+referenceField+'"]').getElement('.valor').get('text'))*1;
	var val2=limpiarNumero(line.getFirst('.celda[campo="'+field+'"]').getElement('.valor').get('text'))*1;
	var percentageText='_';
	var percentage=0;
	if (val1!=0)
		{
		percentage=(val2/val1)*100;
		percentageText=percentage.decimal(1);
		}
	if (percentage<80)
		{
		perClass='comparacionPoco';
		}
	else
		{
		if (percentage<100)
			{perClass='comparacionCasi';}
		else
			{perClass='comparacionMucho';}
		}
	new Element('span',{'class':'notVisible '+perClass,'style':'padding-left:20px','text':'('+percentageText+'%)'}).inject(line.getFirst('.celda[campo="'+field+'"]'),'bottom');
	});


}

function calcularTotalTabla(tabla,campo)
{
var total=0;
$$('#'+tabla+' .datos').each(function(item, index){
	if (item.get('campo')==campo)
	{
	var valor=item.getElement('.valor');
	var v=valor.get('valor');
	if (valor.get('valor'))
		{
		total+=valor.get('valor')*1;
		}
	else
		{
		total+=valor.get('text')*1;
		}
	}
	});
return total;
}

function displayTotal(tabla, campo, div)
{
var valor=calcularTotalTabla(tabla,campo);
$(div).set('valor',valor);
$(div).set('text',valor.decimal(2));
}

//compara el campo2 sobre el campo1(referencia). 0-80% verde. 80%-100% morado. >=100% rojo.
function compararCampos(elemento,campo1,campo2)
{
elemento.getElements('.datos[campo="'+campo2+'"]').each(function(item)
	{
	var linea=item.getParent('.lineaDatos');
	var referencias=linea.getElements('.datos[campo="'+campo1+'"]');
	if (referencias.length>0)
		{
		item.addClass('comparado');
		item.set('campoReferencia',campo1);
		var valorRef=limpiarNumero(referencias[0].getFirst('.valor').get('text'))*1;
		item.removeClass('comparacionPoco');
		item.removeClass('comparacionCasi');
		item.removeClass('comparacionMucho');
		if (valorRef==0)
			{
			item.addClass('comparacionPoco');
			}
		else
			{
			var valorComp=limpiarNumero(item.getFirst('.valor').get('text'))*1;
			var ratio=valorComp/valorRef;
			if (ratio<0.8)
				{
				item.addClass('comparacionPoco');
				}
			else
				{
				if (ratio<1)
					{item.addClass('comparacionCasi');}
				else
					{item.addClass('comparacionMucho');}
				}
			}
		}
	});
}

function tablePercentage(elemento,campo,campoDestino)
{
var total=0;
elemento.getElements('.lineaDatos').each(function(linea)
	{
	total+=linea.getElements('.datos[campo="'+campo+'"]').getFirst('.valor').get('text')*1;
	});
elemento.getElements('.lineaDatos').each(function(linea)
	{
	var percentage=(linea.getElements('.datos[campo="'+campo+'"]').getFirst('.valor').get('text')*100)/total;
	linea.getElements('.datos[campo="'+campoDestino+'"]').getFirst('.valor').set('text',percentage.decimal(2)+'%');
	});
}

function aplicarFuncion(elemento,campo1,campo2,campoDestino,funcion)
{
elemento.getElements('.lineaDatos').each(function(linea)
	{
	var valor1=linea.getElements('.datos[campo="'+campo1+'"]').getFirst('.valor').get('text')*1;
	var valor2=linea.getElements('.datos[campo="'+campo2+'"]').getFirst('.valor').get('text')*1;
	linea.getElements('.datos[campo="'+campoDestino+'"]').getFirst('.valor').set('text',eval(funcion+'('+valor1+','+valor2+')'));
	});
}

function dividir(dividendo,divisor)
{
var res=dividendo/divisor;
return res.decimal(2);
}


//modificar para que el salto entre niveles pueda ser mayor que 1
function acumuladoNiveles(elemento,nivel1, nivel2, campo, posicion)
{
if (elemento.getElements('.lineaDatos[nivel="'+nivel2+'"]').length>0)
	{
	var celdaTitulo=elemento.getElement('.lineaTitulo[nivel="'+nivel2+'"]').getElement('.celda[campo="'+campo+'"]');
	elemento.getElements('.lineaTitulo[nivel="'+nivel1+'"]').each(function(item)
		{
		var titulos=item.getElements('.celda.titulo');
		var posicionTitulo=posicion;
		if (titulos[0].hasClass('controles'))
			{
			posicionTitulo++;
			}
		var nuevoTitulo=celdaTitulo.clone();
		nuevoTitulo.inject(titulos[posicionTitulo],'after');
		nuevoTitulo.set('campo','Total'+campo);
		nuevoTitulo.addClass('tituloTotal');
		});

	var celdaDatos=elemento.getElement('.lineaDatos[nivel="'+nivel2+'"]').getElement('.celda[campo="'+campo+'"]');
	elemento.getElements('.lineaDatos[nivel="'+nivel1+'"]').each(function(item)
		{
		var datos=item.getElements('.celda.datos');
		var nuevoDato=celdaDatos.clone();
		nuevoDato.inject(datos[posicion],'after');
		nuevoDato.set('campo','Total'+campo);
		nuevoDato.addClass('datoTotal');
		nuevoDato.set('nivelCalculo',nivel2);
		nuevoDato.set('campoCalculo',campo);
		nuevoDato.getFirst('.valor').removeClass('editable');
		nuevoDato.getFirst('.valor').set('text','0');
		});

	elemento.getElements('.lineaDatos[nivel="'+nivel2+'"]').each(function(item)	
		{
		var celdaSuperior=elemento.getElement('.lineaDatos[nivel="'+nivel1+'"][linea="'+item.get('lineaSuperior')+'"]').getElement('.celda[campo="'+'Total'+campo+'"]');
		var valorSuperior=limpiarNumero(celdaSuperior.getFirst('.valor').get('text'))*1;
		var nuevoValor=valorSuperior+(limpiarNumero(item.getElement('.celda[campo="'+campo+'"]').getFirst('.valor').get('text'))*1);
		celdaSuperior.getFirst('.valor').set('text',nuevoValor);
		//cambiar el simbolo si lo hay
		if (item.getElement('.celda[campo="'+campo+'"]').getElements('.simbolo').length>0)
			{
			item.getElement('.celda[campo="'+campo+'"]').getElement('.simbolo').clone().inject(celdaSuperior.getFirst('.simbolo'),'after');
			celdaSuperior.getFirst('.simbolo').destroy();
			}
		});
	}

}

function actualizarCalculosTabla(linea)
{
var lineaId=linea.get('linea');
//actualizar acumulados de niveles
if (linea.hasClass('lineaNiveles'))
	{
	var nivel=linea.get('nivel')*1;
	if (nivel>0)
		{
		var tabla=linea.getParent('.tablaDiv');
		var idSup=linea.get('lineaSuperior');
		var nuevaLinea=tabla.getElement('.lineaDatos[nivel="'+(nivel-1)+'"][linea="'+idSup+'"]')
		nuevaLinea.getElements('.datos.datoTotal').each(function(celdaSuperior)
			{
			var nivelInferior=celdaSuperior.get('nivelCalculo');
			var campo=celdaSuperior.get('campoCalculo');
			celdaSuperior.getFirst('.valor').set('text','0');
			tabla.getElements('.lineaDatos[nivel="'+nivelInferior+'"][lineaSuperior="'+idSup+'"]').each(function(lineaInferior)		
				{
				var valorSuperior=limpiarNumero(celdaSuperior.getFirst('.valor').get('text'))*1;
				var nuevoValor=valorSuperior+(limpiarNumero(lineaInferior.getElement('.celda[campo="'+campo+'"]').getFirst('.valor').get('text'))*1);
				celdaSuperior.getFirst('.valor').set('text',nuevoValor);
				});
			});
		actualizarCalculosTabla(nuevaLinea);
		}
	}
	
//actualizar comparaciones entre campos
linea.getElements('.datos.comparado').each(function(item)
	{
	compararCampos(linea,item.get('campoReferencia'),item.get('campo'));
	});

}


function processLineChart(container,axesLabels) // labels array x, y
{
$$('.excelChartLine').removeClass('oculto');
if (!!window.HTMLCanvasElement)
	{
	var colors= new Array('#00e673','#e6e600','#00ace6','#ff80aa','#b3ff1a','#ccc','#ff4dff','#9933ff','#cc6699','#33ffcc','#8585ad','#ffff66','#993300','#ffa31a','#006600','#ff3300','#00ffff','#666633','#ccccff','#cc6600');
	var container=$(container);
	if (container.getElement('.colorSeries'))
		{
		colors=container.getElement('.colorSeries').get('text').split(';');
		}
	var labels=container.getElement('.labelsRow').get('text').split(';');
	var datasets=new Array();
	var i=0;
	var types=container.getElement('.seriesRow').get('text').split(';');
	
	types.each(function(item)
		{
		datasets[datasets.length]={label:item,fill:false,borderColor:colors[i],backgroundColor:colors[i],borderWidth:3,data:container.getElement('.dataRow[name="'+item+'"]').get('text').split(';')};
		i++;
		});
	if (container.getElement('.totalRow'))
		{datasets[datasets.length]={label:'TOTAL',fill:true,borderColor:'#ff4d4d',backgroundColor:'#ffdddd',borderWidth:3,data:container.getElement('.totalRow').get('text').split(';')};}
	
	
	var ctx = container.getElement('canvas').getContext("2d");
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: 
			{labels:labels,datasets:datasets
			},
		options: {
			maintainAspectRatio: false,
			responsive: true,
			 scales: 
				{
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: axesLabels[0]
							}
						}
					],
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: axesLabels[1]
							},
							ticks: {
									beginAtZero:true
								}
						}
					]
				}
			}
		});
	}	
}

function processBarChart(container,axesLabels,functions) // labels array x, y. functions array click-hover + function
{
$$('.excelChartLine').removeClass('oculto');
if (!!window.HTMLCanvasElement)
	{
	var colors= new Array('#00e673','#e6e600','#00ace6','#ff80aa','#b3ff1a','#ccc','#ff4dff','#9933ff','#cc6699','#33ffcc','#8585ad','#ffff66','#993300');
	var container=$(container);
	if (container.getElement('.colorSeries'))
		{
		colors=container.getElement('.colorSeries').get('text').split(';');
		}
	var labels=container.getElement('.labelsRow').get('text').split(';');
	var datasets=new Array();
	var i=0;
	var types=container.getElement('.seriesRow').get('text').split(';');
	
	types.each(function(item)
		{
		datasets[datasets.length]={label:item,fill:false,borderColor:colors[i],backgroundColor:colors[i],borderWidth:3,data:container.getElement('.dataRow[name="'+item+'"]').get('text').split(';')};
		i++;
		});
	
	var ctx = container.getElement('canvas').getContext("2d");
	

	var opt={
				maintainAspectRatio: false,
				responsive: true,
				 scales: 
					{
						xAxes: [
							{
								scaleLabel: {
									display: true,
									labelString: axesLabels[0]
								}
							}
						],
						yAxes: [
							{
								scaleLabel: {
									display: true,
									labelString: axesLabels[1]
								},
								ticks: {
										beginAtZero:true
									}
							}
						]
					}
				};
	
	if (typeof(functions)!=='undefined')
		{
		functions.each(function(f){
			if (f[0]=='click')
				{
				opt['onClick']=f[1];
				}
			if (f[0]=='hover')
				{
				opt['hover']={'onHover':f[1]};
				}
			});
		}
		
	var myLineChart = new Chart(ctx, {
		type: 'bar',
		data: 
			{labels:labels,datasets:datasets
			},
		options: opt
		});
	}	
}

function chartToExcel(el)
{
var container=el.getParent('.chartsContainer');

var destContainer=container.getElement('.statsChartArea');
if (container.getElement('.multipleChartsArea'))
	{
	var selected=container.getElement('.multipleChartsArea').getElement('.selectedChartArea');	
	var order=selected.get('order');
	if (destContainer.getElement('.multiChart[order="'+order+'"]'))
		{
		destContainer=destContainer.getElement('.multiChart[order="'+order+'"]');
		}
	}

var dataContainer=destContainer.getElement('.dataChartContainer');
var labels=dataContainer.getElement('.labelsRow').get('text').split(';');
var textoTabla=',';
labels.each(function(label)
	{textoTabla+='"'+csvEscape(label)+'",';});
textoTabla+="findelinea";

var types=dataContainer.getElement('.seriesRow').get('text').split(';');
types.each(function(type)
	{
	var data=dataContainer.getElement('.dataRow[name="'+type+'"]').get('text').split(';');
	textoTabla+='"'+csvEscape(type)+'",';
	data.each(function(dat)
		{textoTabla+='"'+csvEscape(dat)+'",';});
	textoTabla+="findelinea";
	});
if (dataContainer.getElement('.totalRow'))
	{
	var totalData=dataContainer.getElement('.totalRow').get('text').split(';')
	textoTabla+='"TOTAL",';
	totalData.each(function(dat)
		{textoTabla+='"'+csvEscape(dat)+'",';});
	textoTabla+="findelinea";
	}

var formulario=el.getParent('div').getNext('form');
formulario.set('action','ajax/tableAsCSV.php');
formulario.getElement('input').value=textoTabla;
formulario.submit();

}

function generateChart(el)
{
var container=el.getParent('.chartsContainer');
var destination=getRadioValue(container,'chartMenuOptionsRadio');
var type=getRadioTextValue(container,'chartMenuOptionsRadio');
if (destination.indexOf('?')==-1)
	{
	destination+='?';
	}
if (container.getElement('.statsFilterOptions[stat="'+type+'"]'))
	{
	destination+='&'+container.getElement('.statsFilterOptions[stat="'+type+'"]').toQueryString();
	}
container.getElements('.commonFilterOptions').each(function(item)
	{
	destination+='&'+item.toQueryString();
	});

var destContainer=container.getElement('.statsChartArea');
if (container.getElement('.multipleChartsArea'))
	{
	var selected=container.getElement('.multipleChartsArea').getElement('.selectedChartArea');	
	var order=selected.get('order');
	if (destContainer.getElement('.multiChart[order="'+order+'"]'))
		{
		destContainer=destContainer.getElement('.multiChart[order="'+order+'"]');
		destination+='&multipleChart='+order;
		}
	}
	
destContainer.empty();
new Element('div',{'class':'loading', 'style':'position:absolute;left:40%;top:100px'}).inject(destContainer);
destContainer.load(destination);
}