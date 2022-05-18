/*!
 * miTab.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 miTab.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function newMiTab(contenedor)
{
var i=0;
$$('#'+contenedor+' li').each(function(item,index){
	if (i==0)
		{
		item.addClass('active');
		}
	item.set('tabNumber',i);
	item.addEvent('click',function(event){selectTab(event.target,contenedor);});
	i++;
});

var i=0;
$$('#'+contenedor+' .tabContent').each(function(item,index){
	if (i!=0)
		{
		item.addClass('oculto');
		}
	i++;
});

}

function selectTab(el,contenedor)
{
var num=el.get('tabNumber')*1;
$$('#'+contenedor+' li').each(function(item,index){
	if (index==num)
		{
		item.addClass('active');
		}
	else
		{
		item.removeClass('active');
		}
});
$$('#'+contenedor+' .tabContent').each(function(item,index){
	if (index==num)
		{
		item.removeClass('oculto');
		}
	else
		{
		item.addClass('oculto');
		}
});



}