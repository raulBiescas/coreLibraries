/*!
 * pictures.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 pictures.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

var posicionesFotos=new Array();
var mismaPosicion=new Array();
var vistaMismaPosicion=new Array();
var margenFotos=50;
var editandoPlano=false;
var galleryForMap="";
var picturePopUps=new Array();
var picturePopUpGeos=new Array();
var picturePlaceSelect=false;

window.addEvent('domready', function() {
$$('.thumbGalleryItem').each(function(item){eventosImagen(item);});
});

//v1.0 new 22/7
function groupPictures(tablaPictures) //groups and shows pictures per viewGroup parameter. contenedorImagenes parent of table
{
var views=new Array();
var tablaId=tablaPictures.get('id');
var parentGallery=tablaPictures.getParent('.contenedorImagenes');
if (parentGallery.get('requiredViews'))
	{
	views=parentGallery.get('requiredViews').split(',');
	}
tablaPictures.getElements('.lineaDatos').each(function(line)
	{
	var view=line.get('viewGroup');
	if (views.indexOf(view)==-1)
		{
		views[views.length]=view;
		}
	});
var parentGallery=tablaPictures.getParent('.contenedorImagenes');

views.each(function(view)
	{
	var areaPictures=new Element('div',{'class':'areaView clear','view':view}).inject(parentGallery);
	var viewTitle=new Element('div',{'class':'areaViewTitle','html':'<span>'+view+'</span>'}).inject(areaPictures);
		var imageControls=new Element('div',{'class':'imageControls'}).inject(viewTitle);
			var edit=new Element('div',{'class':'botonEditarImagenes  showOnEdit','title':'edit images'}).inject (imageControls);
			edit.addEvent('click',function(e){editGalleryImages(e);});
			var noValid=new Element('div',{'class':'noValidPicturesButton  botonBorrar showOnEdit','title':'all no longer valid'}).inject (imageControls);
			noValid.addEvent('click',function(e){galleryPicturesNoValid(e);});
			new Element('div',{'class':'oculto receptionArea'}).inject (imageControls);
		var botonOld=new Element('div',{'class':'botonOldPictures botonLink','text':'get old pictures','status':'noloaded'}).inject (viewTitle);
		botonOld.addEvent('click',function(e){oldPictures(e.target);});
	var gallery=new Element('div',{'id':tablaId+view+'new','class':'picturesGallery newGallery','tablaDatos':tablaId}).inject(areaPictures);

	});	
tablaPictures.getElements('.lineaDatos').each(function(line)
	{
	var view=line.get('viewGroup');
	var gallery=parentGallery.getElement('.areaView[view="'+view+'"]').getElement('.newGallery');
	addPictureToGallery(line, gallery);
	
	});
	
}

//new v1.0
function editGalleryImages(e)
{
var parentArea=e.target.getParent('.areaView');
if (!parentArea){parentArea=e.target.getParent('.contenedorImagenes');}
var galeria=parentArea.getElement('.picturesGallery');
if (galeria)
	{
	galeria.getElements('.thumbGalleryItem').each(function(imagen)
		{
		botonesEdicionImagen(imagen);
		});
	}
}

//new v1.0
function galleryPicturesNoValid(e)
{
var controls=e.target.getParent('.imageControls');
var parentArea=e.target.getParent('.areaView');
if (!parentArea){parentArea=e.target.getParent('.contenedorImagenes');}
var galeria=parentArea.getElement('.picturesGallery');
if (galeria)
	{
	galeria.getElements('.thumbGalleryItem').each(function(imagen)
		{
		var idPicture=imagen.get('idPicture');
		espacioRespuesta=new Element('div',{'class':'mensaje textoPeque oculto respuestaFoto','style':'float:left;','idPicture':idPicture}).inject(controls.getElement('.receptionArea'));
		espacioRespuesta.load('ajax/borrarImagen.php?id='+idPicture);
		});
	}
}

//new v1.0
function afterImageDeletion(id)
{
$$('.respuestaFoto[idPicture="'+id+'"]').each(function(item){item.removeClass('oculto');});
$$('.thumbGalleryItem[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.destroy();
	});
$$('.thumbRackItem[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.destroy();
	});
$$('.thumbElementView[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.destroy();
	});
$$('.punteroFoto[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.destroy();
	});
$$('.espacioBotonesImagen[idPicture="'+id+'"]').each(function(espacioBotones)
	{espacioBotones.destroy();});
setTimeout(function(){
$$('.respuestaFoto[idPicture="'+id+'"]').each(function(item){item.destroy();});},2000);		
	
}

//v1.0 new 23/7
function afterImageRotation(id,path,fileName)
{
$$('.respuestaFoto[idPicture="'+id+'"]').each(function(item){item.removeClass('oculto');});
$$('.thumbGalleryItem[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.src = path+'thumbnail/'+fileName;
	if (imagen.getParent('.picturesGallery'))
		{
		var tabla=imagen.getParent('.picturesGallery').get('tablaDatos');
		var idPicture=imagen.get('idPicture');
		if ($(tabla))
			{
			if ($(tabla).getElement('.lineaDatos[linea="'+idPicture+'"]'))
				{
				var linea=$(tabla).getElement('.lineaDatos[linea="'+idPicture+'"]');
				linea.getElement('.celda[campo="Thumbnail"]').getElement('.valor').set('text','thumbnail/'+fileName);
				linea.getElement('.celda[campo="Medium"]').getElement('.valor').set('text','medium/'+fileName);
				linea.getElement('.celda[campo="FullSize"]').getElement('.valor').set('text',fileName);
				}
			}
		}
	});
$$('.thumbRackItem[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.src = path+'thumbnail/'+fileName;
	});
$$('.thumbElementView[idPicture="'+id+'"]').each(function(imagen)
	{
	imagen.src =path+'thumbnail/'+fileName;
	});
$$('.espacioBotonesImagen[idPicture="'+id+'"]').each(function(espacioBotones)
	{espacioBotones.getElements('.botonEdicionImagenes').each(function(item){item.set('blocked','0');});});
setTimeout(function(){
$$('.respuestaFoto[idPicture="'+id+'"]').each(function(item){item.destroy();});},2000);	
}


//v1.0 new 22/7
function addPictureToGallery(line, gallery)
{
var idPicture=line.get('linea');
var thumbnail=getValorLinea(line,'Path')+getValorLinea(line,'Thumbnail');
var updated=getValorLinea(line,'Updated');
var tablaSup=getValorLinea(line,'Tabla');
var idTabla=getValorLinea(line,'IdTabla');
var view=getValorLinea(line,'View');
var imagen=new Element('img',{'class':'thumbGalleryItem','src':thumbnail,'title':updated+' (Click to enlarge)','idPicture':idPicture}).inject(gallery);
eventosImagen(imagen);

if (view.search('dir')==0) //check for floorplan
	{
	if (line.getParent('.contenedorImagenes'))
		{
		if (line.getParent('.contenedorImagenes').get('floorplanContainer'))
			{
			var floorplan=$(line.getParent('.contenedorImagenes').get('floorplanContainer')).getElement('.floorplan');
			addPictureToFloorplan(line,floorplan,gallery.get('id'));	
				
			}
		}
	}
	

}

//v1.0 stay
function eventosImagen(imagen)
{
imagen.addEvent('click',function(e){mostrarImagen(e.target);});
imagen.addEvent('mouseenter',function(e){resaltarImagenPlano(e.target);});
imagen.addEvent('mouseleave',function(e){resaltarImagenPlano(e.target);});
}

//v1.0 stay
function resaltarImagenPlano(el)
{
var idPicture=el.get('idPicture');
var i=0;
$$('.punteroFoto[idPicture="'+idPicture+'"]').each(function(item)
	{
	i++;
	item.toggleClass('punteroResaltado');
	});
if (i==0)
{
$$('.elementoFoto[idPicture="'+idPicture+'"]').each(function(item)
	{
	item.toggleClass('punteroResaltado');
	});
}
}

//v1.0 modified
function oldPictures(el)
{
var container=el.getParent('.contenedorImagenes');
var tablaSup=container.get('tablaSup');
var idTabla=container.get('idTabla');
var view='';
if (el.getParent('.areaView'))
	{
	container=el.getParent('.areaView');
	view=container.get('view');
	}

switch (el.get('status'))
	{
	case 'noloaded':
		var galleryName=container.getElement('.picturesGallery').get('id')+'old';
		var oldArea=new Element('div',{'class':'picturesGallery oldGallery','id':galleryName,'tablaDatos':'tabla'+galleryName, 'tablaSup':tablaSup, 'idTabla':idTabla}).inject(container);
		oldArea.load('ajax/oldPictures.php?tabla='+tablaSup+'&idTabla='+idTabla+'&gallery='+galleryName+'&view='+view);
	break;
	case 'oldShowing':
		container.getElement('.botonOldPictures').set('text','see old pictures');
		container.getElement('.botonOldPictures').set('status','newShowing');
		container.getElement('.newGallery').removeClass('oculto');
		container.getElement('.oldGallery').addClass('oculto');
	break;
	case 'newShowing':
		container.getElement('.botonOldPictures').set('text','see new pictures');
		container.getElement('.botonOldPictures').set('status','oldShowing');
		container.getElement('.newGallery').addClass('oculto');
		container.getElement('.oldGallery').removeClass('oculto');
	break;
	}
}

function inicializarOldPictures(gallery)
{
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
ordenarTablaDiv(tabla,'Updated','DESC');
var month='';
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	var idPicture=item.get('linea');
	var thumbnail=item.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+item.getFirst('.celda[campo="Thumbnail"]').getFirst('.valor').get('text');
	var updated=item.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
	var newMonth=updated.substring(0,7);
	if (newMonth!=month)
		{
		month=newMonth;
		new Element('div',{'class':'picturesDateSeparator','text':month+'->'}).inject($(gallery));
		}
	var imagen=new Element('img',{'class':'thumbGalleryItem oldPicture','src':thumbnail,'title':updated+' (Click to enlarge)','idPicture':idPicture}).inject($(gallery));
	eventosImagen(imagen);
	});
if ($(gallery).getParent('.contenedorImagenes'))
	{
	var container=$(gallery).getParent('.contenedorImagenes');
	if ($(gallery).getParent('.areaView'))
		{
		container=$(gallery).getParent('.areaView');
		}
	container.getElement('.botonOldPictures').set('text','see new pictures');
	container.getElement('.botonOldPictures').set('status','oldShowing');
	container.getElement('.newGallery').addClass('oculto');
	container.getElement('.oldGallery').removeClass('oculto');
	}
}

function limpiarBasuraImagenes(target)
{
$$('.nuevaFoto').each(function(item){item.destroy();});
editandoPlano=false;
picturePlaceSelect=false;
$$('#'+target+' .mensajeFormPicture').addClass('oculto');
$$('#'+target+' .areaNuevoFichero').addClass('oculto');
$$('.espacioBotonesImagen').each(function(item){item.destroy();});
$$('.hiddenWhileNewPicture').removeClass('hiddenWhileNewPicture');
}


function picturesTabAbandonada(target)
{
limpiarBasuraImagenes(target);
igualarZ('.elementoFoto');
}

function picturesTabSeleccionada(target)
{
llevarAlFrente('.elementoFoto');
if ($('listaLayers'))
	{
	if (!($('listaLayers').getElement('.itemLayer[layer="Pictures"]')))
		{
		nuevaLayer('Pictures','pictureSelection','elementoFoto');
		}
	}
}


function inicializarPicturesMap(mapObject,gallery)
{
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	var idPicture=item.get('linea');
	var thumbnail=item.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+item.getFirst('.celda[campo="Thumbnail"]').getFirst('.valor').get('text');
	var updated=item.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
	
	var image=new Element('img',{'class':'thumbGalleryItem','src':thumbnail,'title':updated+' (Click to enlarge)','idPicture':idPicture}).inject($(gallery));
	eventosImagen(image);

	var geo=item.getFirst('.celda[campo="Geo"]').getFirst('.valor').get('text');
	//mira si ya hay un iconoFoto para esa posición
	if (posicionesFotos.indexOf(geo)==-1)
		{
		posicionesFotos[posicionesFotos.length]=geo;
		}
	});

posicionesFotos.each(function(geo)
	{
	contenido='<div style="width:100%;height:100%;position:relative;" class="containerMapPictures">';
	contenido+='<div class="iconoFoto elementoFoto" geo="'+geo+'" style="top:17px;left:17px;"></div>';
	$(tabla).getElements('.lineaDatos').each(function(item,index)
		{
		if (item.getFirst('.celda[campo="Geo"]').getFirst('.valor').get('text')==geo)
			{
			var idPicture=item.get('linea');
			var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
			var tablaSup=item.getFirst('.celda[campo="Tabla"]').getFirst('.valor').get('text');
			var idTabla=item.getFirst('.celda[campo="IdTabla"]').getFirst('.valor').get('text');
			var style="top:0px; left:17px;";
			switch(view)
				{
				case 'dir315':style="top:0px; left:0px;";break;
				case 'dir045':style="top:0px; left:34px;";break;
				case 'dir090':style="top:17px; left:34px;";break;
				case 'dir135':style="top:34px; left:34px;";break;
				case 'dir180':style="top:34px; left:17px;";break;
				case 'dir225':style="top:34px; left:0px;";break;
				case 'dir270':style="top:17px; left:0px;";break;
				}
			contenido+='<div id="punteroFoto'+idPicture+'" idPicture="'+idPicture+'" gallery="'+galleryForMap+'" class="punteroFoto elementoFoto '+view+'" style="'+style+'" geo="'+geo+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="'+view+'" claseBase="dir"></div>';
			}
		});
	contenido+='</div>';
	var mapLonLat=getRelativePointFromGeo(map,geo,'25,25');
	picturePopUps[picturePopUps.length]=new OpenLayers.Popup('picture',
		   mapLonLat,
		   new OpenLayers.Size(53,53),
		   contenido,
		   false);
	picturePopUpGeos[picturePopUpGeos.length]=geo;
	map.addPopup(picturePopUps[picturePopUps.length-1]);
	});
	
$$('.punteroFoto').each(function(puntero){eventosFotoDireccional(puntero);});
$$('.iconoFoto').each(function(icono){icono.addEvent('click',function(e){pictureIconClick(e.target);});});
nuevaLayer('Pictures','','containerMapPictures');
map.events.register("zoomend", map, function() {
            repositionPictures();
        });
}

function repositionPictures()
{
var i=0;
while (i<picturePopUps.length)
	{
	picturePopUps[i].lonlat=getRelativePointFromGeo(map,picturePopUpGeos[i],'25,25');
	picturePopUps[i].updatePosition();
	i++;
	}

}


function addPictureMap(mapObject)
{
editandoPlano=true;
picturePlaceSelect=true;
$('formPicture').getElement('.mensajeFormPicture').removeClass('oculto');
$('formPicture').getElement('.mensajeFormPicture').set('html','Please click on the map to locate the picture. <br/><br/><br/><a href="javascript:limpiarBasuraImagenes('+"'"+'picturesArea'+"'"+');">cancel</a>');

mapClick= new OpenLayers.Control.Click();
mapObject.addControl(mapClick);
mapClick.activate();
}

function pictureIconClick(el)
{
if (picturePlaceSelect)
	{
	var tablaSup=$(galleryForMap).get('tablaSup');
	var idTabla=$(galleryForMap).get('idTabla');
	mapClick.deactivate();
	var geo=el.get('geo');
	var container=el.getParent('.containerMapPictures');
	container.getElements('div').addClass('hiddenWhileNewPicture');
	var grados=315;
	var i=0;
	var clase='';
	while (i<3)
		{
		var g=((grados+(i*45))%360);
		if (g<100)
			{clase='dir0'+g;}
		else
			{clase='dir'+g;}
		new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto '+clase, 'style':'top:0px;left:'+(17*i)+'px;', 'geo':geo, 'tablaSup':tablaSup, 'idTabla':idTabla, 'view':clase }).inject(container);
		i++;
		}
	new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto dir270', 'style':'top:17px;left:0px;', 'geo':geo, 'tablaSup':tablaSup, 'idTabla':idTabla, 'view':'dir270' }).inject(container);
	new Element('div',{'class':'iconoFoto elementoFoto nuevaFoto', 'style':'top:17px;left:17px;', 'geo':geo }).inject(container);
	new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto dir090', 'style':'top:17px;left:34px;', 'geo':geo, 'tablaSup':tablaSup, 'idTabla':idTabla, 'view':'dir090' }).inject(container);
	grados=225;
	var i=0;
	while (i<3)
		{
		var g=grados-(i*45);
		if (g<100)
			{clase='dir0'+g;}
		else
			{clase='dir'+g;}
		new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto '+clase, 'style':'top:34px;left:'+(17*i)+'px;', 'geo':geo, 'tablaSup':tablaSup, 'idTabla':idTabla, 'view':clase }).inject(container);
		i++;
		}
	$$('.punteroFoto').addEvent('click',function(e){picturePointerSelectedMap(e.target);});
	}
}

function mapClicked(coordinate)
{
picturePlaceSelect=false;
var tablaSup=$(galleryForMap).get('tablaSup');
var idTabla=$(galleryForMap).get('idTabla');
mapClick.deactivate();
var lonlat = map.getLonLatFromPixel(coordinate);
contenido='<div style="width:100%;height:100%;position:relative;">';
var grados=315;
var i=0;
var clase='';
while (i<3)
	{
	var g=((grados+(i*45))%360);
	if (g<100)
		{clase='dir0'+g;}
	else
		{clase='dir'+g;}
	contenido+='<div class="punteroFoto elementoFoto nuevaFoto '+clase+'" style="top:0px;left:'+(17*i)+'px;" geo="'+lonlat.lon+','+lonlat.lat+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="'+clase+'"></div>';
	i++;
	}
contenido+='<div class="punteroFoto elementoFoto nuevaFoto dir270" style="top:17px;left:0px;" geo="'+lonlat.lon+','+lonlat.lat+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="dir270"></div>';
contenido+='<div class="iconoFoto elementoFoto nuevaFoto" geo="'+lonlat.lon+','+lonlat.lat+'" style="top:17px;left:16px;"></div>';
contenido+='<div class="punteroFoto elementoFoto nuevaFoto dir090" style="top:17px;left:34px;" geo="'+lonlat.lon+','+lonlat.lat+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="dir090" claseBase="dir"></div>';
grados=225;
var i=0;
while (i<3)
	{
	var g=grados-(i*45);
	if (g<100)
		{clase='dir0'+g;}
	else
		{clase='dir'+g;}
	contenido+='<div class="punteroFoto elementoFoto nuevaFoto '+clase+'" style="top:34px;left:'+(17*i)+'px;" geo="'+lonlat.lon+','+lonlat.lat+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="'+clase+'"></div>';
	i++;
	}
contenido+='</div>';
var x=coordinate.x;
if (x>25)
	{x-=25;}
else
	{x=0;}
var y=coordinate.y;
if (y>25)
	{y-=25;}
else
	{y=0;}
var newCoordinate={x:x, y:y};
var mapLonLat=map.getLonLatFromPixel(newCoordinate);
var popUp=new OpenLayers.Popup('picture',
   mapLonLat,
   new OpenLayers.Size(53,53),
   contenido,
   false);
map.addPopup(popUp);
$$('.punteroFoto').addEvent('click',function(e){picturePointerSelectedMap(e.target);});
}

function picturePointerSelectedMap(el)
{
el.addClass('punteroSeleccionado');
$('formPicture').getElement('.mensajeFormPicture').addClass('oculto');
$('formPicture').getElement('input[name="Geo"]').value=el.get('geo');
$('formPicture').getElement('input[name="Tabla"]').value=el.get('tablaSup');
$('formPicture').getElement('input[name="IdTabla"]').value=el.get('idTabla');
$('formPicture').getElement('input[name="View"]').value=el.get('view');
$$('.nuevaFoto').each(function(item){
	if ((!item.hasClass('iconoFoto'))&&(!item.hasClass('punteroSeleccionado')))
		{item.destroy();}
	});
}

function situarNuevaImagenMap(idPicture,mapObject,gallery)
{
$$('.nuevaFoto').each(function(item){item.destroy();});
$$('.hiddenWhileNewPicture').removeClass('hiddenWhileNewPicture');
editandoPlano=false;
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
var item=$(tabla).getElement('.lineaDatos[linea="'+idPicture+'"]');
var tablaSup=item.getFirst('.celda[campo="Tabla"]').getFirst('.valor').get('text');
var idTabla=item.getFirst('.celda[campo="IdTabla"]').getFirst('.valor').get('text');
var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
var geo=item.getFirst('.celda[campo="Geo"]').getFirst('.valor').get('text');

//mira si ya hay un iconoFoto para esa posición
if (posicionesFotos.indexOf(geo)==-1)
	{
	contenido='<div style="width:100%;height:100%;position:relative;" class="containerMapPictures">';
	contenido+='<div class="iconoFoto elementoFoto" geo="'+geo+'" style="top:17px;left:17px;"></div>';
	var style="top:0px; left:17px;";
	switch(view)
		{
		case 'dir315':style="top:0px; left:0px;";break;
		case 'dir045':style="top:0px; left:34px;";break;
		case 'dir090':style="top:17px; left:34px;";break;
		case 'dir135':style="top:34px; left:34px;";break;
		case 'dir180':style="top:34px; left:17px;";break;
		case 'dir225':style="top:34px; left:0px;";break;
		case 'dir270':style="top:17px; left:0px;";break;
		}
	contenido+='<div id="punteroFoto'+idPicture+'" idPicture="'+idPicture+'" gallery="'+gallery+'" class="punteroFoto elementoFoto '+view+'" style="'+style+'" geo="'+geo+'" tablaSup="'+tablaSup+'" idTabla="'+idTabla+'" view="'+view+'" claseBase="dir"></div>';
	contenido+='</div>';
	var mapLonLat=getRelativePointFromGeo(map,geo,'25,25');
	picturePopUps[picturePopUps.length]=new OpenLayers.Popup('picture',
					   mapLonLat,
					   new OpenLayers.Size(53,53),
					   contenido,
					   false);
	picturePopUpGeos[picturePopUpGeos.length]=geo;
	map.addPopup(picturePopUps[picturePopUps.length-1]);
	}
else
	{
	//mira si hay una foto que se sustituya
	var previos=$$('.punteroFoto[geo="'+geo+'"][view="'+view+'"]');
	if (previos.length>0)
		{
		var previa=previos[0].get('idPicture');
		previos[0].destroy();
		$(gallery).getElement('.thumbGalleryItem[idPicture="'+previa+'"]').destroy();
		$(tabla).getElement('.lineaDatos[linea="'+previa+'"]').destroy();
		}
	var iconosFoto=$$('.iconoFoto[geo="'+geo+'"]');
	if (iconosFoto.length==1)
		{
		var container=iconosFoto[0].getParent('.containerMapPictures');
		var style="top:0px; left:17px;";
		switch(view)
			{
			case 'dir315':style="top:0px; left:0px;";break;
			case 'dir045':style="top:0px; left:34px;";break;
			case 'dir090':style="top:17px; left:34px;";break;
			case 'dir135':style="top:34px; left:34px;";break;
			case 'dir180':style="top:34px; left:17px;";break;
			case 'dir225':style="top:34px; left:0px;";break;
			case 'dir270':style="top:17px; left:0px;";break;
			}
		new Element('div',{'id':"punteroFoto"+idPicture, 'idPicture':idPicture, 'gallery':gallery, 'class':'punteroFoto elementoFoto '+view, 'style':style, 'geo':geo, 'tablaSup':tablaSup, 'idTabla':idTabla, 'view':view, 'claseBase':'dir'}).inject(container);
	
		}
	}

eventosFotoDireccional($('punteroFoto'+idPicture));
$$('.iconoFoto').each(function(icono){icono.addEvent('click',function(e){pictureIconClick(e.target);});});
}



function situarNuevaImagen(idPicture,floorPlan, gallery)
{
$(floorPlan).getFirst('.areaPlanta').getElements('.nuevaFoto').each(function(item){item.destroy();});
editandoPlano=false;
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
var item=$(tabla).getElement('.lineaDatos[linea="'+idPicture+'"]');
var tablaSup=item.getFirst('.celda[campo="Tabla"]').getFirst('.valor').get('text');
var idTabla=item.getFirst('.celda[campo="IdTabla"]').getFirst('.valor').get('text');
var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
var xpos=item.getFirst('.celda[campo="XPos"]').getFirst('.valor').get('text')*1;
var ypos=item.getFirst('.celda[campo="YPos"]').getFirst('.valor').get('text')*1;
var grados=view.substring(3)*1;
//mira si ya hay un iconoFoto para esa posición
if (posicionesFotos.indexOf(xpos+'_'+ypos)==-1)
	{
	new Element('div',{'id':'iconoFoto'+idPicture,'class':'iconoFoto elementoFoto','tablaSup':tablaSup,'idTabla':idTabla,'gallery':gallery,'idPicture':idPicture ,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
	posicionesFotos[posicionesFotos.length]=xpos+'_'+ypos;
	situarElementos($(floorPlan),'#iconoFoto'+idPicture);	
	llevarAlFrente('#iconoFoto'+idPicture);
	}
else
	{
	//mira si hay una foto que se sustituya
	var previos=$$('.punteroFoto[xpos="'+xpos+'"][ypos="'+ypos+'"][grados="'+grados+'"]');
	if (previos.length>0)
		{
		var previa=previos[0].get('idPicture');
		previos[0].destroy();
		$(gallery).getElement('.thumbGalleryItem[idPicture="'+previa+'"]').destroy();
		$(tabla).getElement('.lineaDatos[linea="'+previa+'"]').destroy();
		}
	}
//añadir iconos de vistas direccionales
var puntero=new Element('div',{'id':'punteroFoto'+idPicture,'class':'punteroFoto elementoFoto','tablaSup':tablaSup,'idTabla':idTabla,'offset':'16','grados':grados,'claseBase':'dir','gallery':gallery,'idPicture':idPicture ,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
eventosFotoDireccional(puntero);
situarElementos($(floorPlan),'#punteroFoto'+idPicture);
llevarAlFrente('#punteroFoto'+idPicture);
}

function inicializarPictures(floorPlan, gallery)//fotos posicionadas interior, válido para fotos panorámicas
{
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	var idPicture=item.get('linea');
	var thumbnail=item.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+item.getFirst('.celda[campo="Thumbnail"]').getFirst('.valor').get('text');
	var updated=item.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
	var tablaSup=item.getFirst('.celda[campo="Tabla"]').getFirst('.valor').get('text');
	var idTabla=item.getFirst('.celda[campo="IdTabla"]').getFirst('.valor').get('text');
	var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
	var image=new Element('img',{'class':'thumbGalleryItem','src':thumbnail,'title':updated+' (Click to enlarge)','idPicture':idPicture}).inject($(gallery));
	eventosImagen(image);
	//diferenciar exterior o interior
	var xpos=item.getFirst('.celda[campo="XPos"]').getFirst('.valor').get('text')*1;
	var ypos=item.getFirst('.celda[campo="YPos"]').getFirst('.valor').get('text')*1;
	//mira si ya hay un iconoFoto para esa posición
	if (posicionesFotos.indexOf(xpos+'_'+ypos)==-1)
		{
		new Element('div',{'class':'iconoFoto elementoFoto','tablaSup':tablaSup,'idTabla':idTabla,'gallery':gallery,'idPicture':idPicture ,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
		posicionesFotos[posicionesFotos.length]=xpos+'_'+ypos;
		}
	//añadir iconos de vistas direccionales
	var grados=view.substring(3)*1;
	var puntero=new Element('div',{'class':'punteroFoto elementoFoto','tablaSup':tablaSup,'idTabla':idTabla,'offset':'16','grados':grados,'claseBase':'dir','gallery':gallery,'idPicture':idPicture ,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
	eventosFotoDireccional(puntero);
	});

situarElementos($(floorPlan),'.elementoFoto');	
}
function simplePictureFormInitialization(gallery)
{
$('formPicture').getElement('input[name="Tabla"]').value=$(gallery).get('tablaSup');
$('formPicture').getElement('input[name="IdTabla"]').value=$(gallery).get('idTabla');
}

function inicializarSimplePictures(gallery)//just a simple gallery
{
var tabla=$(gallery).get('tablaDatos');
$(tabla).addClass('oculto');
$(tabla).getElements('.lineaDatos').each(function(item,index)
	{
	var idPicture=item.get('linea');
	var thumbnail=item.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+item.getFirst('.celda[campo="Thumbnail"]').getFirst('.valor').get('text');
	var updated=item.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
	var tablaSup=item.getFirst('.celda[campo="Tabla"]').getFirst('.valor').get('text');
	var idTabla=item.getFirst('.celda[campo="IdTabla"]').getFirst('.valor').get('text');
	var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
	var image=new Element('img',{'class':'thumbGalleryItem','src':thumbnail,'title':updated+' (Click to enlarge)','idPicture':idPicture}).inject($(gallery));
	eventosImagen(image);
	});
}

function eventosFotoDireccional(puntero)
{
puntero.addEvent('click',function(e){mostrarImagen(e.target);});
puntero.addEvent('mouseover',function(e){
	var gallery=e.target.get('gallery');
	var idPicture=e.target.get('idPicture');
	var imagen=$(gallery).getElement('img[idPicture="'+idPicture+'"]');
	//scroll al elemento, solo funciona si el padre de la galería es un div que tenga el scroll
	var myFx = new Fx.Scroll($(gallery).getParent('div'), {
    duration: 1000,
    wait: false
	}).toElement(imagen,'y');
	imagen.addClass('fotoResaltada');
	});
puntero.addEvent('mouseout',function(e){
	var gallery=e.target.get('gallery');
	var idPicture=e.target.get('idPicture');
	var imagen=$(gallery).getElement('img[idPicture="'+idPicture+'"]');
	imagen.removeClass('fotoResaltada');
	});
}

function mostrarImagen(el)
{
var permiso=true;
if (typeof(bloqueoEventos)=="function")
	{
	permiso=!bloqueoEventos();
	}

if (permiso)
	{
	$$('.popUpElement').removeClass('oculto');
	$('popUp').empty();
	var idPicture=el.get('idPicture')

	if (el.get('gallery'))
		{var gallery=el.get('gallery');}
	else
		{var gallery=el.getParent('.picturesGallery').get('id');}
	var tablaDatos=$(gallery).get('tablaDatos');
	var linea=$(tablaDatos).getElement('.lineaDatos[linea="'+idPicture+'"]');
	var medium=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="Medium"]').getFirst('.valor').get('text');
	var fullsize=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="FullSize"]').getFirst('.valor').get('text');
	var updated=linea.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
	var view='';
	if (linea.getFirst('.celda[campo="View"]'))
	 {view=linea.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');}
	

	//en funcion de la vista
	if ((view.indexOf('dir')==0) && (!el.hasClass('oldPicture')))
		{
		crearEstructuraFotos($('popUp'),el,false);
		}
	else
		{
		crearEstructuraFotos($('popUp'),el,true);
		crearNavegacionFotos($('popUp'),el);
		}
		

	var fotoCentral=new Element('div',{'class':'contenedorFoto','posicion':'0'}).inject($('popUp').getElement('.marcoFotos'));
	var linkFull=new Element('a',{'href':fullsize,'target':'_blank'}).inject(fotoCentral);
	var image=new Element('img',{'class':'fotoEnMarco conTip ','galeria':gallery,'tablaDatos':tablaDatos,'view':view,'title':updated+' (Click for fullsize)','idPicture':idPicture,'src':medium}).inject(linkFull);

	image.addEvent('load',function(event){ajustarContenedorFoto(event.target);});
	if ((view.indexOf('dir')==0) && (!el.hasClass('oldPicture'))){mostrarDireccion(image);}

	}
}

function mostrarDireccion(imagen)
{
var idPicture=imagen.get('idPicture');
var punteros=$$('.punteroFoto[idPicture="'+idPicture+'"]');
if (punteros.length>0)
	{
	var cl=punteros[0].get('class');
	var contenedor=imagen.getParent('.contenedorFoto');
	var clases=cl.split(" ");
	var direccion="";
	clases.each(function(item)
		{
		if (item.indexOf('dir')==0)
			{
			direccion=item;
			}
		});
	new Element('div',{'class':direccion+' direccionFoto'}).inject(contenedor);
	}
}

function ajustarContenedorFoto(foto)
{
var tamFoto=foto.getSize().x;//no funciona si no se ha cargado la foto...
var tamTotal=foto.getParent('.marcoFotos').getSize().x;
var contenedorFoto=foto.getParent('.contenedorFoto');
contenedorFoto.setStyle('width',tamFoto+'px');
var posicion=contenedorFoto.get('posicion')*1;
if (posicion==0)
	{
	//ajustar fotoCentral y cargar laterales + eventos navegación
	var offsetX=Math.round((tamTotal-tamFoto)/2);
	contenedorFoto.setStyle('left',offsetX+'px');
	//vistas que agregan fotos laterales: dir, usan marcos sinNavegacion, navegacion custom
	if (foto.getParent('.marcoFotos').hasClass('sinNavegacion'))
		{
		mismaPosicion.empty();
		vistaMismaPosicion.empty();
		//vista panorámica, encontrar fotos en la misma posicion
		var tablaDatos=foto.get('tablaDatos');
		var idPicture=foto.get('idPicture');
		var linea=$(tablaDatos).getElement('.lineaDatos[linea="'+idPicture+'"]');
		var unifiedPosition='';
		if (linea.getFirst('.celda[campo="XPos"]'))
			{
			unifiedPosition=linea.getFirst('.celda[campo="XPos"]').getFirst('.valor').get('text')+'_'+linea.getFirst('.celda[campo="YPos"]').getFirst('.valor').get('text');
			}
		if (linea.getFirst('.celda[campo="Geo"]'))
			{
			unifiedPosition=linea.getFirst('.celda[campo="Geo"]').getFirst('.valor').get('text');
			}
		$$('#'+tablaDatos+' .lineaDatos').each(function(item)
			{
			var newUnifiedPosition='';
			if (item.getFirst('.celda[campo="XPos"]'))
				{
				newUnifiedPosition=item.getFirst('.celda[campo="XPos"]').getFirst('.valor').get('text')+'_'+item.getFirst('.celda[campo="YPos"]').getFirst('.valor').get('text');
				}
			if (item.getFirst('.celda[campo="Geo"]'))
				{
				newUnifiedPosition=item.getFirst('.celda[campo="Geo"]').getFirst('.valor').get('text');
				}
			if (unifiedPosition==newUnifiedPosition)
				{
				var view=item.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
				if (view.indexOf('dir')==0)
					{
					var grados=view.substring(3)*1;
					vistaMismaPosicion.push(grados/45);
					mismaPosicion.push(item.get('linea'));
					}
				}
			});
		if (mismaPosicion.length>1)
			{
			//añadir fotos izq/dcha	
			siguienteFoto(foto,'izq');
			siguienteFoto(foto,'dcha');
			
			//añadir areas navegacion
			var navIzq=new Element('div',{'class':'fotoNav toLeft','activo':'no'}).inject(foto.getParent('.marcoFotos'));
			navIzq.addEvent('mouseenter',function(e){empezarNavegacion(e.target);});
			navIzq.addEvent('mouseleave',function(e){e.target.set('activo','no');});
			var navDcha=new Element('div',{'class':'fotoNav toRight','activo':'no'}).inject(foto.getParent('.marcoFotos'));
			navDcha.addEvent('mouseenter',function(e){empezarNavegacion(e.target);});
			navDcha.addEvent('mouseleave',function(e){e.target.set('activo','no');});
			}
		}
	}
else
	{
	if (posicion>0)
		{var posicionAnterior=posicion-1;}
	else	
		{var posicionAnterior=posicion+1;}
	var fotoAnterior=foto.getParent('.marcoFotos').getElement('.contenedorFoto[posicion="'+posicionAnterior+'"]');
	if (posicion>0)
		{
		var newLeft=parseInt(fotoAnterior.getStyle('left'))+parseInt(fotoAnterior.getStyle('width'))+margenFotos;
		}
	else
		{
		var newLeft=parseInt(fotoAnterior.getStyle('left'))-tamFoto-margenFotos;
		}
	contenedorFoto.setStyle('left',newLeft+'px');
	}
}

function empezarNavegacion(el)
{
el.set('activo','yes');
setTimeout(function(){moverFotos(el)},800);
}

function moverFotos(el)
{
if (el.get('activo')=='yes')
	{
	desactivarEventosFotos(el);
	var marco=el.getParent('.marcoFotos');
	var fotoCentral=marco.getElement('.contenedorFoto[posicion="0"]');
	if (el.hasClass('toLeft'))
		{
		var sentido=1;
		var direccion='izq';
		}
	else
		{
		var sentido=-1;
		var direccion='dcha';
		}
	var fotoLateral=marco.getElement('.contenedorFoto[posicion="'+sentido+'"]');
	var desplazamiento=sentido*(Math.round(parseInt(fotoCentral.getStyle('width'))/2)+Math.round(parseInt(fotoLateral.getStyle('width'))/2)+margenFotos);
	marco.getElements('.contenedorFoto').each(function(item)
		{
		var posicion=item.get('posicion')*1;
		item.set('posicion',posicion+sentido);
		//solo si la foto está cargada
		if (item.getElement('img').complete)
			{
			var nuevoLeft=parseInt(item.getStyle('left'))+desplazamiento;
			new Fx.Tween(item, {property: 'left'}).start(nuevoLeft);
			}

		});
	//seguir cargando fotos	
	if (!marco.getElement('.contenedorFoto[posicion="'+((-1)*sentido*2)+'"]'))
		{
		var fotoTarget=marco.getElement('.contenedorFoto[posicion="'+((-1)*sentido)+'"]').getElement('img');
		setTimeout(function(){siguienteFoto(fotoTarget,direccion);},1000);
		}
	setTimeout(function(){moverFotos(el)},1500);
	}
}


function siguienteFoto(foto,lado)
{
var tablaDatos=foto.get('tablaDatos');
var gallery=foto.get('galeria');
var marco=foto.getParent('.marcoFotos');
var posicion=foto.getParent('.contenedorFoto').get('posicion')*1;
if (lado=='izq')
	{
	var sentido=-1;
	}
else
	{	
	var sentido=1;
	}
var nuevaPosicion=posicion+sentido;
if (marco.getElements('.contenedorFoto[posicion="'+nuevaPosicion+'"]').length==0)
	{
	var vista=foto.get('View');
	var vistaInicio=(vista.substring(3)*1)/45;
	var i=1;
	while (i<9)
		{
		var nuevaVista=(vistaInicio+(sentido*i))%8;
		if (nuevaVista<0)
			{
			nuevaVista=8+nuevaVista;
			}
		if (vistaMismaPosicion.indexOf(nuevaVista)!=-1)
			{
			var nuevaFoto=mismaPosicion[vistaMismaPosicion.indexOf(nuevaVista)];
			var linea=$(tablaDatos).getElement('.lineaDatos[linea="'+nuevaFoto+'"]');
			var medium=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="Medium"]').getFirst('.valor').get('text');
			var fullsize=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="FullSize"]').getFirst('.valor').get('text');
			var updated=linea.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
			var view=linea.getFirst('.celda[campo="View"]').getFirst('.valor').get('text');
			var fotoCentral=new Element('div',{'class':'contenedorFoto','posicion':nuevaPosicion}).inject($('popUp').getElement('.marcoFotos'));
			var linkFull=new Element('a',{'href':fullsize,'target':'_blank'}).inject(fotoCentral);
			var image=new Element('img',{'class':'fotoEnMarco conTip','galeria':gallery,'tablaDatos':tablaDatos,'view':view,'title':updated+' (Click for fullsize)','idPicture':nuevaFoto,'src':medium}).inject(linkFull);
			mostrarDireccion(image);
			image.addEvent('load',function(event)
				{
				ajustarContenedorFoto(event.target);
				if (event.target.getParent('.contenedorFoto').get('posicion')=='1')
					{
					siguienteFoto(event.target,'dcha');
					}
				if (event.target.getParent('.contenedorFoto').get('posicion')=='-1')
					{
					siguienteFoto(event.target,'izq');
					}
				});
			
			i=9;
			}
		else
			{
			i++;
			}
		}
	}
}


function crearEstructuraFotos(contenedor,picture,navegacionEnabled)
{
//de  picture se puede sacar idPicture, gallery (si tiene directamente y si no parent clase picturesGallery) y de gallery tablaDatos
var cabecera=new Element('div',{'class':'cabeceraFotos'}).inject(contenedor);
var zoom=new Element('div',{'class':'zoomSelect conTip','title':'Activate zoom','text':'OFF'}).inject(cabecera);
zoom.addEvent('click',function(e){activarZoom(e.target);});
if (navegacionEnabled)
	{
	var marco=new Element('div',{'id':'marcoFotos','class':'marcoFotos'}).inject(contenedor);
	var navegacion=new Element('div',{'class':'navegacionFotos'}).inject(contenedor);
	}
else
	{
	var marco=new Element('div',{'id':'marcoFotos','class':'marcoFotos sinNavegacion'}).inject(contenedor);
	}
}

function crearNavegacionFotos(contenedor, picture)
{
var navegacion=contenedor.getElement('.navegacionFotos');
var thumbarea=new Element('div',{'id':'thumbarea'}).inject(navegacion);
var thumbareaContent=new Element('div',{'id':'thumbareaContent'}).inject(thumbarea);

var idPicture=picture.get('idPicture');

//trasladar la galería
if (picture.get('gallery'))
	{var gallery=picture.get('gallery');}
else
	{var gallery=picture.getParent('.picturesGallery').get('id');}
indPicture=0;
var tablaDatos=$(gallery).get('tablaDatos');
$(gallery).getElements('.thumbGalleryItem').each(function(item,index)
	{
	var nuevoThumb=item.clone().inject(thumbareaContent);
	nuevoThumb.removeClass('thumbGalleryItem');
	nuevoThumb.set('tablaDatos',tablaDatos);
	if (nuevoThumb.get('idPicture')==idPicture)
		{indPicture=index;}
	nuevoThumb.addEvent('click',function(e){seleccionThumb(e.target);});
	});
var scrollGalleryObj = new scrollGallery({start:indPicture,imagearea:'none'});
}

//para bloquear eventos que puedan dar problemas al navegar las fotos
function desactivarEventosFotos(el)
{
var contenedor=el.getParent('.popUpContent');
contenedor.getElements('.zoomSelect').each(function(item)
	{
	if (item.get('text')=='ON')
		{
		activarZoom(item);
		}
	});
}

function activarZoom(el)
{
var estado=el.get('text');
if (estado=='OFF')
	{
	el.set('text','ON');
	el.set('title','Disable zoom');
	var cabecera=el.getParent('.cabeceraFotos');
	var marco=cabecera.getNext('.marcoFotos');
	var contenedor=marco.getElement('.contenedorFoto[posicion="0"]');
	if (contenedor)
		{
		contenedor.getElements('img').each(function(imagen)
			{
			var link=imagen.getParent('a');
			new Zoomer(imagen, {
								big: link.get('href'),
								smooth: 10
							});
			});
		}
	}
else
	{
	el.set('text','OFF');
	el.set('title','Activate zoom');
	$$('.zoomer-wrapper').each(function(item)
		{
		var imagen=item.getFirst('img');
		imagen.inject(item,'before');
		item.destroy();
		});
	}
}

function seleccionThumb(el)
{
var idPicture=el.get('idPicture');
var tablaDatos=el.get('tablaDatos');
var linea=$(tablaDatos).getElement('.lineaDatos[linea="'+idPicture+'"]');
var medium=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="Medium"]').getFirst('.valor').get('text');
var fullsize=linea.getFirst('.celda[campo="Path"]').getFirst('.valor').get('text')+linea.getFirst('.celda[campo="FullSize"]').getFirst('.valor').get('text');
var updated=linea.getFirst('.celda[campo="Updated"]').getFirst('.valor').get('text');
$('popUp').getElement('.marcoFotos').empty();
var fotoCentral=new Element('div',{'class':'contenedorFoto','posicion':0}).inject($('popUp').getElement('.marcoFotos'));
var linkFull=new Element('a',{'href':fullsize,'target':'_blank'}).inject(fotoCentral);
var image=new Element('img',{'class':'fotoEnMarco conTip','title':updated+' (Click for fullsize)','idPicture':idPicture,'src':medium}).inject(linkFull);
image.addEvent('load',function(event){ajustarContenedorFoto(event.target);});
}

function botonesEdicionImagen(imagen)
{
var idPicture=imagen.get('idPicture');
var espacioBotones;
if (imagen.hasClass('thumbRackItem') || imagen.hasClass('thumbElementView'))
	{
	espacioBotones=new Element('div',{'class':'espacioBotonesImagen edicionNivel2 enRack','idPicture':idPicture}).inject(imagen,'after');
	espacioBotones.setStyle('top',imagen.getStyle('top'));
	}
else
	{
	espacioBotones=new Element('div',{'class':'espacioBotonesImagen edicionNivel2 enGaleria','idPicture':idPicture}).inject(imagen,'after');
	}
var botonC=new Element('div',{'class':'rotateClockwise botonEdicionImagenes conTip', 'blocked':'0','title':'Rotate clockwise'}).inject(espacioBotones);
botonC.addEvent('click',function(e){imageRotate(e.target,'clockwise');});
var botonA=new Element('div',{'class':'rotateAnticlockwise botonEdicionImagenes conTip','blocked':'0', 'title':'Rotate anticlockwise'}).inject(espacioBotones);
botonA.addEvent('click',function(e){imageRotate(e.target,'anticlockwise');});
var botonD=new Element('div',{'class':'imageDelete botonEdicionImagenes conTip', 'blocked':'0', 'title':'No longer valid'}).inject(espacioBotones);
botonD.addEvent('click',function(e){imageDelete(e.target);});
}

function imageDelete(el)
{
if (el.get('blocked')=='1')
	{
	alert('Please wait until last changes are completed');
	}
else
	{
	if (confirm("Please confirm this picture is no longer valid"))
		{
		var espacioBotones=el.getParent('.espacioBotonesImagen');
		var idPicture=espacioBotones.get('idPicture');
		espacioBotones.getElements('.botonEdicionImagenes').each(function(item){item.set('blocked','1');});
		var espacioRespuesta;
		if (espacioBotones.hasClass('enGaleria'))
			{
			espacioRespuesta=new Element('div',{'class':'mensaje textoPeque oculto respuestaFoto','style':'float:left;','idPicture':idPicture}).inject(espacioBotones,'after');
			}
		else
			{
			espacioRespuesta=new Element('div',{'class':'mensaje textoPeque oculto respuestaFoto','style':'float:left;','idPicture':idPicture}).inject(espacioBotones,'after');
			}
		espacioRespuesta.load('ajax/borrarImagen.php?id='+idPicture);
		}
	}
}

function imageRotate(el,direction)
{
if (el.get('blocked')=='1')
	{
	alert('Please wait until last changes are completed');
	}
else
	{
	var espacioBotones=el.getParent('.espacioBotonesImagen');
	var idPicture=espacioBotones.get('idPicture');
	espacioBotones.getElements('.botonEdicionImagenes').each(function(item){item.set('blocked','1');});
	var espacioRespuesta;
	if (espacioBotones.hasClass('enGaleria'))
		{
		espacioRespuesta=new Element('div',{'class':'mensaje textoPeque oculto respuestaFoto','style':'float:left;','idPicture':idPicture}).inject(espacioBotones,'after');
		}
	else
		{
		espacioRespuesta=new Element('div',{'class':'mensaje textoPeque oculto respuestaFoto','style':'float:left;','idPicture':idPicture}).inject(espacioBotones,'after');
		}
	espacioRespuesta.load('ajax/rotarImagen.php?id='+idPicture+'&direction='+direction);
	}
}

function addPicture(floorPlan) //para fotos direccionales
{
editandoPlano=true;
$('formPicture').getElement('.mensajeFormPicture').removeClass('oculto');
$('formPicture').getElement('.mensajeFormPicture').set('html','Please click on the plan to locate the picture. <br/><br/><br/><a href="javascript:limpiarBasuraImagenes('+"'"+'picturesArea'+"'"+');">cancel</a>');

var eventoAddPicture=function(e)
{
if (e.target.hasClass('elementoFoto'))
	{
	if (e.target.hasClass('iconoFoto'))
		{
		//añadir punteros
		var xpos=e.target.get('xpos');		
		var ypos=e.target.get('ypos');
		var tablaSup=e.target.get('tablaSup');
		var idTabla=e.target.get('idTabla');
		$(floorPlan).getFirst('.areaPlanta').getElements('.nuevaFoto').each(function(item){item.destroy();});
		new Element('div',{'class':'iconoFoto elementoFoto nuevaFoto','tablaSup':tablaSup,'idTabla':idTabla,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
		var grados=0;
		var i=0;
		while (i<8)
			{
			var puntero=new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto','tablaSup':tablaSup,'idTabla':idTabla,'offset':'16','grados':(grados+(45*i)),'claseBase':'dir','xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
			i++;
			}
		situarElementos($(floorPlan),'.nuevaFoto');
		}
	else
		{
		e.target.addClass('punteroSeleccionado');
		$('formPicture').getElement('.mensajeFormPicture').addClass('oculto');
		$(floorPlan).getFirst('.areaPlanta').removeEvent('click', eventoAddPicture);
		
		$('formPicture').getElement('input[name="Tabla"]').value=e.target.get('tablaSup');
		$('formPicture').getElement('input[name="IdTabla"]').value=e.target.get('idTabla');
		
		if ((e.target.get('tablaSup')=='Floors')||(e.target.getParent('.floorWrapper').hasClass('oneRoom')))
			{
			var offsetX=0;
			var offsetY=0;
			}
		else	
			{
			var room=$(floorPlan).getElement('.roomInPlant[idRoom="'+e.target.get('idTabla')+'"]');
			var offsetX=room.get('xpos');
			var offsetY=room.get('ypos');
			}
		var xpos=e.target.get('xpos')*1;
		var ypos=e.target.get('ypos')*1;
		
		$('formPicture').getElement('input[name="XPos"]').value=xpos-offsetX;
		$('formPicture').getElement('input[name="YPos"]').value=ypos-offsetY;
		
		$('formPicture').getElement('input[name="View"]').value='dir'+e.target.get('grados');
		$(floorPlan).getFirst('.areaPlanta').getElements('.nuevaFoto').each(function(item){
			if ((!item.hasClass('iconoFoto'))&&(!item.hasClass('punteroSeleccionado')))
				{item.destroy();}
			});
		}
	
	}
else
	{
	$(floorPlan).getFirst('.areaPlanta').getElements('.nuevaFoto').each(function(item){item.destroy();});
	var idRoom=0;
	if ((e.target.hasClass('roomInPlant')) && (e.target.get('tipoElemento')!="common"))
		{
		var tablaSup='Rooms';
		idRoom=e.target.get('idroom')*1;
		var idTabla=idRoom;
		var room=e.target;
		}
	if (e.target.getParent('.roomInPlant'))
		{
		if (e.target.getParent('.roomInPlant').get('tipoElemento')!="common")
			{
			var tablaSup='Rooms';
			idRoom=e.target.getParent('.roomInPlant').get('idroom')*1;
			var idTabla=idRoom;
			var room=e.target.getParent('.roomInPlant');
			}
		}
	if (e.target.getParent('.floorWrapper').hasClass('oneRoom'))
		{
		var tablaSup='Rooms';
		var room=e.target.getParent('.floorWrapper');
		idRoom=room.get('idRoom')*1;
		var idTabla=idRoom;
		}
	var posicionCursor=getPosicionPlanta(e);
	if (idRoom==0)
		{
		var tablaSup='Floors';
		//se crea en el floor
		var idTabla=$(floorPlan).get('floorId');
		}
		
	var posTotal=normalizar($(floorPlan),posicionCursor,0,0);
	var xpos=posTotal[0];
	var ypos=posTotal[1];
	
	//añadir punteros e iconoFoto
	new Element('div',{'class':'iconoFoto elementoFoto nuevaFoto','tablaSup':tablaSup,'idTabla':idTabla,'xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
	
	var grados=0;
	var i=0;
	while (i<8)
		{
		var puntero=new Element('div',{'class':'punteroFoto elementoFoto nuevaFoto','tablaSup':tablaSup,'idTabla':idTabla,'offset':'16','grados':(grados+(45*i)),'claseBase':'dir','xpos':xpos,'ypos':ypos,'xsize':0,'ysize':0}).inject($(floorPlan).getFirst('.areaPlanta'));
		i++;
		}
	situarElementos($(floorPlan),'.nuevaFoto');
	}
}

$(floorPlan).getFirst('.areaPlanta').addEvent('click', eventoAddPicture);

}

//v1.0 to remove
function picturesNoLongerValid(e)
{
var posCursor=e.page;
$('cuadroInfo').empty();
$('cuadroInfo').removeClass('oculto');
$('cuadroInfo').setStyle('width','200px');
$('cuadroInfo').setStyle('height','100px');
$('cuadroInfo').setStyle('left',(posCursor.x-20)+'px');
$('cuadroInfo').setStyle('top',(posCursor.y-40)+'px');
var tabla=e.target.get('tablaSup');
var idTabla=e.target.get('idTabla');
var cerrar=new Element('div',{'class':'conTip','style':'position:absolute;top:2px;right:2px;cursor:pointer;width:15px;height:15px','text':'X','title':'close'}).inject($('cuadroInfo')); 
cerrar.addEvent('click',function(){$('cuadroInfo').addClass('oculto');$('cuadroInfo').empty();});
new Element('div',{'style':'margin-top:10px;margin-left:10px','html':'<span class="botonLink continueNotValidPictures" parameters="tabla='+tabla+'&idTabla='+idTabla+'">All pictures no longer valid</span>'}).inject($('cuadroInfo')); 
if (tabla=='Rooms')
	{
	new Element('div',{'style':'margin-top:10px;margin-left:10px','html':'<br/><br/><span class="botonLink continueNotValidPictures" parameters="extra=includeRacks&tabla='+tabla+'&idTabla='+idTabla+'">Include racks as well</span>'}).inject($('cuadroInfo')); 
	}

$$('.continueNotValidPictures').addEvent('click',function(e){$('cuadroInfo').load('ajax/picturesNotValid.php?'+e.target.get('parameters'));});
}