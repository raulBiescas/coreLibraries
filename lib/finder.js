/*!
 * finder.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 finder.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function searchAction(el)
{
var block=el.getParent('.finderBlock');
var resultsBlock=block.getElement('.resultsFinderBlock');
var extraParameters='';
$$('.globalSeachParameters').each(function(form){extraParameters+=form.toQueryString()});
loadForm(resultsBlock,block.getElement('form'),'POST',block.get('relativePath')+'ajax/getFinderResults.php',extraParameters);
}


function initFinderBlock(finder)
{
finder.getElements('.finderButton').addEvent('click',function(e){searchAction(e.target);});
finder.getElements('input[type="text"]').addEvent('keyup',function(e)
	{
	if (e.key=='enter')
		{
		e.stopPropagation();
		var block=e.target.getParent('.finderBlock');
		if (block.getElement('.finderButton'))
			{searchAction(block.getElement('.finderButton'));}
		}
	});
finder.getElements('.clearSearch').addEvent('click', function(e)
	{
	var block=e.target.getParent('.finderBlock');
	block.getElements('.finderInputBlock').each(function(item){item.getElements('input[type="text"]').set('value','');});
	block.getElement('.resultsFinderBlock').empty();
	});
}

function finderResultsLoaded(field)
{
var resultsField=$('results'+field);
var resultsEstrucuture=resultsField.getPrevious('.resultsEstrucuture');
var tables=resultsEstrucuture.getElement('.resultTables').get('text').split(',');
var finderBlock=resultsField.getParent('.finderBlock');
var searchResultsPages=resultsField.getNext('.searchResultsPages');
var counter=0;
resultsField.getElements('.lineaDatos').each(function(line)
	{
	var resLine=new Element('div',{'class':'finderBlockResLine','searchIndex':counter }).inject(searchResultsPages);
	line.set('searchIndex',counter);
	var resLink=new Element('div',{'class':'finderBlockResLink', 'style':'float:left;'}).inject(resLine);
	var table=tables[tables.length-1];
	var idTable=line.get('linea');
	if (tables.length>1)
		{
		idTable=getValorLinea(line,'Id'+table);
		}
	//case for Network Elements only, should be moved from here...
	resLink.load(finderBlock.get('relativePath')+'ajax/getElementDescription.php?tabla='+table+'&id='+idTable);
	resLink.addEvent('networkDescriptorLoaded',function(el)
		{
		var descriptors=el.getElements('.filaDescriptorRed');
		descriptors.each(function(item){item.addClass('oculto');});
		//if not local
		el.getElements('.descriptorSites').each(function(item){
			item.removeClass('oculto');
			
			});

		el.getElements('.descriptorRooms').each(function(item){item.removeClass('oculto');item.getElement('.descriptorRedSecundario').addClass('oculto');});
		el.getElements('.descriptorEqChassis').each(function(item){item.removeClass('oculto');item.getElement('.descriptorRedSecundario').addClass('oculto');});
		
		descriptors[descriptors.length-1].removeClass('oculto');
		descriptors[descriptors.length-1].addClass('resLinkResult');
		descriptors[descriptors.length-1].getElement('.descriptorRedSecundario').addClass('oculto');
		
		if (el.getElement('.descriptorRed').get('tabla')=='Sites')
				{el.getElements('.descriptorRedSecundario').removeClass('oculto');}
		
		var htmlReasons='';
		
		var inputs=el.getParent('.finderBlock').getElements('.finderInputBlock');
		var visibleDescriptor=getVisibleContent(el,'text',' ');
		var infoLine=el.getParent('.finderBlock').getElement('.searchResultsArea').getElement('.lineaDatos[searchIndex="'+el.getParent('.finderBlockResLine').get('searchIndex')+'"]');
		var foundFields=new Array();
		inputs.each(function(item)
			{
			if (item.getElement('input'))
				{
				var values=item.getElement('input').value.split(' ');
				values.each(function(value)
					{
					value=value.toLowerCase();
					if (visibleDescriptor.toLowerCase().indexOf(value) === -1)
						{
						infoLine.getElements('.datos').each(function(dato)
							{
							var dataValue=dato.getElement('.valor').get('text');
							if (dataValue.toLowerCase().indexOf(value) > -1)
								{
								var field=dato.get('campo');
								if (foundFields.indexOf(field)==-1)
									{
									foundFields[foundFields.length]=field;
									if (field!='Name' && field!='Description')
										{
										htmlReasons+='<span class="searchReasonField"><i>'+field+':</i></span>';
										}
									htmlReasons+='<span class="searchReasonData">'+dataValue+'</span>';
									}
								}
							});
						}
					});
				}
			});
		new Element('div',{'class':'finderBlockResReason', 'style':'float:left;','html':htmlReasons}).inject(el.getParent('.finderBlockResLine').getElement('.clear'),'before');
		if (typeof(descriptorLoadedInFinder)=='function')
			{
			descriptorLoadedInFinder(el);
			}
		});
	
	new Element('div',{'class':'clear'}).inject(resLine);
	counter++;
	});
if (counter==0)
	{
	new Element('div',{'style':'color:red','text':'No results found'}).inject(searchResultsPages);
	}
}
