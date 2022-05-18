/*!
 * funciones.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 funciones.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

var cmConversionValues=new Array(1,100,2.54,4.445);
var cmConversionUnits=new Array('cm','m','inches','Us');

function getSymbol(value)
{
switch(value)
	{
	case 	('EUR'):
	return '€';
	break;
	case 	('GBP'):
	return '£';
	break;
	case 	('USD'):
	return '$';
	break;
	default: 
	return value;
	}
}

function getScrollbarWidthLocal() {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;

}

function cmConversion(value,unit)
{
var index=cmConversionUnits.indexOf(unit);
if (index>-1)
	{
	return value*cmConversionValues[index];
	}
else
	{
	return false;
	}
}

function insertarComa(str, pos)
{
if (str.length > pos)
	{
	var posLeft=str.length-pos;
	str=str.substr(0,posLeft)+','+str.substr(posLeft); 
	str=insertarComa(str, pos+4);
	}
return str;
}

function menor(num1,num2)
{
if ((num1*1)<(num2*1))
	{return (num1*1);}
else
	{return (num2*1);}
}

function limpiarNumero(str)
{
return str.replace(/,/g,'');
}

function alphaNumeric(str)
{
return str.replace(/[^a-z0-9]/gi,'');
}

function devolverCeros(num)
{
var str='';
var i=0;
while (i<num)
	{
	str+='0';
	i++;
	}
return str;
}

function espaciosDecimales(str,pos)
{
var i=0;
var l=str.length-1;
while (i<pos)
	{
	if (str.charAt(l-i)=='.')
		{
		str+=devolverCeros(pos-i);
		i=pos;
		}
	i++;
	}
var l=str.length-1;
if (str.charAt(l-pos)!='.')
	{str+='.'+devolverCeros(pos);}
return str;
}

Number.prototype.decimal = function (num) {
    pot = Math.pow(10,num);
    var res=parseInt(this * pot) / pot;
	res=espaciosDecimales(res+'',num);
	if (num==0)
		{res=insertarComa(res,num+4);
		res = res.substring(0,res.length-1);
		}
	else
		{res=insertarComa(res,num+4);}
	return res;
} 

function cleanDecimal(str)
{
//assuming decimal has two decimal places separated by dot
var values=str.split('.');	
if (values[1]=='00')
	{
	return values[0];
	}
else
	{
	if (values[1]*1>95)
		{return (values[0]*1+1);}
	else
		{return str;}
	}
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractFileFromLink(str)
{
var path=str.split('/');
if (path.length>0)
	{
	var fileName=path[path.length-1];
	var fileComp=fileName.split('.');
	return decodeURIComponent(fileComp[0]);
	}
else
	{
	return 'file';
	}
}

function isStrictNumber(str)
{
var number = /^\d+$/;
var regex = RegExp(number);
return regex.test(str) && str.length>0;
}

function destroyFirst(className)
{
var elements=$$('.'+className);
var first=0;
var minTime=elements[0].get('timeStamp')*1;
var i=0;
elements.each(function(el)
	{
	if (i!=0)
		{
		var newTime=el.get('timeStamp')*1;
		if (newTime<minTime)
			{
			first=i;
			minTime=newTime;
			}
		}
	i++;
	});
elements[first].destroy();
}

function checkVisibilityStatus(el)
{
if (el.getStyle('display')!='none' && !el.hasClass('notVisible') && !el.hasClass('oculto'))
	{return true;}
else
	{return false;}
}

//type is html or text || notVisible for don't consider
function getVisibleContent(el,type,separator)
{
var result='';
type = typeof type !== 'undefined' ?  type : 'text';
separator = typeof separator !== 'undefined' ?  separator : ' ';
if (checkVisibilityStatus(el))
	{
	if (el.getChildren('div,span,a').length>0)
		{
		el.getChildren('div,span,a').each(function(item)
			{
			result+=getVisibleContent(item,type,separator)+separator;
			});
		}
	else
		{
		result=el.get(type)+separator;
		}
	}
result=result.replace(/  +/g, ' ').trim();
if (result=='' && el.getElement('.valor'))
	{
	result=el.getElement('.valor').get('text');
	}
if (result=='' && el.hasClass('titulo') && el.hasClass('celda'))
	{
	result=el.get('campo');
	}
return result;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

 Date.prototype.ddmmyyyy = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   return dd+'/'+mm+'/'+yyyy;
  };
  
   Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   return "".concat(yyyy).concat(mm).concat(dd);
  };

 Date.prototype.yyyymmddhhmm = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
   var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
   var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
   return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min);
  };




