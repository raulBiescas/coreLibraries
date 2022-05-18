/*!
 * tablas.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 tablas.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

Date.defineParser('%d/%m/%Y');

Number.prototype.decimal = function (num) {
    pot = Math.pow(10,num);
    return parseInt(this * pot) / pot;
} 

HtmlTable.defineParsers({
    html: {
        match: /foo/,
        convert: function(){return this.get('html')},
        number: false
    }
});

function noFiltrarTabla(tabla)
{
$$('#'+tabla+' tbody tr').each(function(item, index){
 item.setStyle('display','table-row');
});
	}

function filtrarTabla(tabla, validos)
{
$$('#'+tabla+' tbody tr').each(function(item, index){
	var ident=item.get('linea')*1;
	if (validos.contains(ident))
	{item.setStyle('display','table-row');}
	else
	{item.setStyle('display','none');}
});
	}

function enlazarCeldas(tabla, basePath, campo)
{
$$('#'+tabla+' td').each(function(item, index){
	if (item.get('campo')==campo)
		{
		var ident=item.getParent().get('linea');
		//mantener las propiedades editables
		var valor=item.getElement('.valor');
		var link  = new Element('a', { 'class':valor.get('class'),'href':basePath+'&id='+ident,'tipo':valor.get('tipo'),'campo':valor.get('campo'),'text':valor.get('text')}).inject(valor, 'after');
		valor.destroy();
		/*var texto=item.get('text');
		item.set('html','<a href="'+basePath+'&id='+ident+'">'+texto+'</a>');*/
			}
});
	}
	
function iconosCeldas(tabla, campo)
{
$$('#'+tabla+' th').each(function(item, index){
	if (item.get('campo')==campo)
		{
		item.set('parser','html');
			}
});

$$('#'+tabla+' td').each(function(item, index){
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
	$$('#'+tabla+' th').each(function(item, index){
	res.push(item.get('parser'));
});
return res;
	}	

//si simbolo es un número, indica la columna de la que se toma el símbolo
function crearColumnaResultado(tabla,operacion,posicion,titulo,simbolo)
{
var cabeceras=$$('#'+tabla+' th');
if (posicion==0)
{var nuevaCabecera=new Element('th',{}).inject(cabeceras[0],'before');}
else
{var nuevaCabecera=new Element('th',{}).inject(cabeceras[posicion-1],'after');}
nuevaCabecera.set('text',titulo);

$$('#'+tabla+' tbody tr').each(function(item, index)
{
	var col=new Array();
	item.getChildren('td').each(function(celda,j){
		if (celda.getFirst('.valor'))
			{col.push(celda.getFirst('.valor').get('text')*1);}
		else
			{col.push("");}
	});
	eval("var resultado="+operacion+";");
	
	
	
	var celdas=item.getChildren('td');
	var s=celdas[simbolo].getElement('.simbolo');
	var spanSimbolo=s.clone();
	if (posicion==0)
		{var nuevaCelda=new Element('td',{'class':'columnaResultado','operacion':operacion}).inject(celdas[0],'before');}
	else
		{var nuevaCelda=new Element('td',{'class':'columnaResultado','operacion':operacion}).inject(celdas[posicion-1],'after');}
		
	var spanResultado=new Element('span',{'class':'valor'}).inject(nuevaCelda);
	spanResultado.set('text',resultado);
	spanSimbolo.inject(spanResultado,'after');
	formatoSimbolo(spanSimbolo);
	
});

}

//optimizar para actualizar solo la linea afectada
function actualizarTabla(tabla)
{
$$('#'+tabla+' tbody tr').each(function(item, index)
{
	var col=new Array();
	item.getChildren('td').each(function(celda,j){
		if (celda.getFirst('.valor'))
			{col.push(celda.getFirst('.valor').get('text')*1);}
		else
			{col.push("");}
	});

	item.getChildren('.columnaResultado').each(function(celda,j){
		operacion=celda.get('operacion');
		eval("var resultado="+operacion+";");
		
		celda.getFirst('.valor').set('text',resultado);
		var spanSimbolo=celda.getFirst('.simbolo');
		formatoSimbolo(spanSimbolo);
		
		//celda.addClass('resultadoActualizado');
	});
	
	//setTimeout("$$('.resultadoActualizado').removeClass('resultadoActualizado');",5000);


});

	}

function centrarTabla(tabla)
{
$$('#'+tabla+' thead th').each(function(item,index)
	{
	var campo=item.get('campo');
	if (centrados.indexOf(campo)>-1)
		{
		item.addClass("centrada");
		}
	});
	
$$('#'+tabla+' tbody td').each(function(item,index)
	{
	var campo=item.get('campo');
	if (centrados.indexOf(campo)>-1)
		{
		item.addClass("centrada");
		}
	});
}

function eliminarColumnasVacias(tabla)
{

var vacios=new Array();

$$('#'+tabla+' thead tr').each(function(item, index){
	item.getChildren('th').each(function(celda,j){
		vacios[j]=1;
		});
	});

$$('#'+tabla+' tbody tr').each(function(item, index)
	{
	item.getChildren('td').each(function(celda,j){
		if (vacios[j])
			{
			if (celda.getFirst('.valor'))
				{
				var valor=celda.getFirst('.valor').get('text');
				if ((valor!='') && (valor!='0'))
					{vacios[j]=0;}
				}
			else
				{vacios[j]=0;}
			}
	});
});

//ocultar vacios
$$('#'+tabla+' thead tr').each(function(item, index){

item.getChildren('th').each(function(celda,j){
if (vacios[j])
	{celda.addClass('oculto');}
});
});

$$('#'+tabla+' tbody tr').each(function(item, index)
{
	item.getChildren('td').each(function(celda,j){
		if (vacios[j])
			{celda.addClass('oculto');}
	});
});

}

function crearFilaTotales(tabla,operacion,columnas)
{}


function crearGrafico(tabla,contenedor,referencia,columnas,tipo)
{}