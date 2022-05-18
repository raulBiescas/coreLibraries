/*!
 * mapas.js
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 mapas.js Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

//http://openlayers.org/dev/examples/select-feature-openpopup.html

var styleBase = new OpenLayers.Style({
    fillColor: "#ffcc66",
	fillOpacity:0.2,
    strokeColor: "#ff7733",
	pointRadius:4,
    strokeWidth: 2,
    label: "${type}",
	labelAlign: "lc",
	fontColor: "#000000",
	fontOpacity: 1,
	fontFamily: "Arial",
	fontSize: 12,
	fontWeight: "600"
});


 var myStyles = new OpenLayers.StyleMap({
	"default": new OpenLayers.Style({
	pointRadius:6,
	fillColor: "#ccff66",
	fillOpacity:0.2,
	strokeColor: "#ff7733",
	strokeWidth: 2
	}),
	"select": new OpenLayers.Style({
	pointRadius:6,
	fillColor: "#ccff66",
	fillOpacity:0.2,
	strokeColor: "#3377ff",
	strokeWidth: 2
	}),
	"temporary": new OpenLayers.Style({
	pointRadius:6,
	fillColor: "#ccff66",
	fillOpacity:0.2,
	strokeColor: "#11cc77",
	strokeWidth: 2
	}) 	
	});

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                }, 

                trigger: function(e) {
                    mapClicked(e.xy);
                }

            });
                            
var mapClick;
	
	
function crearMapaNoLabels(contenedor)
{
// create the custom layer
				OpenLayers.Layer.OSM.Toolserver = OpenLayers.Class(OpenLayers.Layer.OSM, {
					
					initialize: function(name, options) {
						var url = [
							"http://a.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png", 
							"http://b.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png", 
							"http://c.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png",
							"http://d.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png",
							"http://e.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png",
							"http://f.www.toolserver.org/tiles/" + name + "/${z}/${x}/${y}.png"
						];
						
						options = OpenLayers.Util.extend({numZoomLevels: 19}, options);
						OpenLayers.Layer.OSM.prototype.initialize.apply(this, [name, url, options]);
					},
					
					CLASS_NAME: "OpenLayers.Layer.OSM.Toolserver"
				});
				
				

	var map = new OpenLayers.Map(contenedor,{allOverlays: true,projection: new OpenLayers.Projection("EPSG:900913"),controls:[]});
	
	// basemap
	var osm=new OpenLayers.Layer.OSM.Toolserver('osm-no-labels');
	map.addLayer(osm);
	osm.setOpacity(0.5);
	// overlay
	var names=new OpenLayers.Layer.OSM.Toolserver('osm-labels-en', {isBaseLayer: false, visibility: false});
	map.addLayer(names);
	names.setOpacity(0.5);
	
	//map.addControl(new OpenLayers.Control.LayerSwitcher());
	//map.addControl(new OpenLayers.Control.MousePosition()); 
	var centroBase=new OpenLayers.LonLat(-3.7,40.4).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
          );
	map.setCenter(centroBase,6);
	return map;				
}		

function getRelativePointFromGeo(mapObject,geo,offset) //geo and offset string comma separated
{
var geoInfo=geo.split(',');
var offsetInfo=offset.split(',');
var offsetx=offsetInfo[0]*1;
var offsety=offsetInfo[1]*1;
var lonlat=new OpenLayers.LonLat(geoInfo[0],geoInfo[1]);
var coordinate=mapObject.getPixelFromLonLat(lonlat);
var x=coordinate.x;
if (x>offsetx)
	{x-=offsetx;}
else
	{if (x>=0){x=0;}}
var y=coordinate.y;
if (y>offsety)
	{y-=offsety;}
else
	{if (y>=0){y=0;}}
var newCoordinate={x:x, y:y};
var mapLonLat=mapObject.getLonLatFromPixel(newCoordinate);
return mapLonLat;
}

function crearMapaNoControls(contenedor)
{
	var map = new OpenLayers.Map(contenedor,{allOverlays: true,projection: new OpenLayers.Projection("EPSG:900913"),controls:[]});
	var wms1 = new OpenLayers.Layer.OSM();
	/*if (typeof google != 'undefined')
		{
		var gsat = new OpenLayers.Layer.Google(
			"Google Satellite",
			{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22,visibility:false}
			
		);

		map.addLayers([wms1,gsat]);
		}
	else
		{*/
		map.addLayers([wms1]);
		//}
	//map.addControl(new OpenLayers.Control.LayerSwitcher());
	//map.addControl(new OpenLayers.Control.MousePosition()); 
	var centroBase=new OpenLayers.LonLat(-3.7,40.4).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
          );
	map.setCenter(centroBase,6);
	return map;
}

function crearMapaBase(contenedor)
{
	var map = new OpenLayers.Map(contenedor,{allOverlays: true,projection: new OpenLayers.Projection("EPSG:900913")});
	var wms1 = new OpenLayers.Layer.OSM();
	/*if (typeof google != 'undefined')
		{
		var gsat = new OpenLayers.Layer.Google(
			"Google Satellite",
			{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22,visibility:false}
		);

		map.addLayers([wms1,gsat]);
		}
	else
		{*/
	map.addLayers([wms1]);
		//}
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	//map.addControl(new OpenLayers.Control.MousePosition()); 
	var centroBase=new OpenLayers.LonLat(-3.7,40.4).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
          );
	map.setCenter(centroBase,6);
	return map;
}

function simpleAddToMap(info,linea,mapa,label)
{
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	var vectorLayer=mapa.getLayersByName('Info');
	if (vectorLayer.length>0)
		{var vectors=vectorLayer[0];}
	else
		{
		var vectors = new OpenLayers.Layer.Vector("Info", {
		styleMap: styleBase,
		renderers: renderer
		});
		}
	var geom=new OpenLayers.Geometry.fromWKT(info);
	//var bounds=geom.getBounds();
	var feature=new OpenLayers.Feature.Vector(geom,{idGeo:linea,type:label});
	vectors.addFeatures([feature]);
	mapa.addLayer(vectors);
	//map.zoomToExtent(bounds);
}

//funcionan en una estructura donde la etiqueta es el elemento clase valor dentro de clase superior y la info geo es el elemento clase valor dentro de un element de clase superior campo=Info
function addToMap(element,claseSuperior,mapa)
{
var padre=element.getParent('.'+claseSuperior);
var label=padre.getFirst('.valor').get('text');
var padreSuperior=padre.getParent();
var linea=padreSuperior.get('linea');
var info="";
padreSuperior.getElements('.'+claseSuperior).each(function(el){
	if (el.get('campo')=='Info')
		{
		info=el.getFirst('.valor').get('text');
		}
	});
if (element.hasClass('botonAddToMap'))
	{
	if (info!='')
		{
		simpleAddToMap(info,linea,mapa,label);
		element.removeClass('botonAddToMap');
		element.addClass('botonRemoveFromMap');
		element.set('title','remove from map');
		}
	}
else
	{
	var vectorLayer=mapa.getLayersByName('Info');
	var features=vectorLayer[0].removeFeatures(vectorLayer[0].getFeaturesByAttribute('idGeo',linea));
	vectorLayer[0].redraw();
	element.addClass('botonAddToMap');
	element.removeClass('botonRemoveFromMap');
	element.set('title','add to map');
	}

}

function addSitesToMap(tabla,mapa)
{
//añadir sites
$(tabla).getElements('.lineaDatos').each(function(item)
	{
	if (item.getFirst('.datos[campo="Info"]'))
		{
		var geo=item.getFirst('.datos[campo="Info"]').getFirst('.valor').get('text');
		var geom=new OpenLayers.Geometry.fromWKT(geo);
		var centro=geom.getCentroid();
		var adjudicado=false;
		if (typeof(subMaps)!='undefined')
			{
			subMaps.each(function(mapa)
				{
				var bounds=mapa.getExtent();
				if (bounds.contains(centro.x,centro.y))
					{
					addSiteToMap(mapa,item,centro);
					adjudicado=true;
					}
				});
			}
		if (!adjudicado)
			{
			addSiteToMap(map,item,centro);
			}
		}
	});

$(tabla).getElements('.lineaDatos').each(function(item)
	{
	item.addEvent('mouseenter',function(e){
		var id=0;
		if (e.target.hasClass('lineaDatos'))
			{id=e.target.get('linea');}
		else
			{
			id=e.target.getParent('.lineaDatos').get('linea');
			}
		seleccionadosSites(id);
		});
	item.addEvent('mouseleave',function(){quitarSeleccionados();});
	
	});
}

function seleccionadosSites(idSite)
{
$$('.knobSite[idTabla="'+idSite+'"]').addClass('knobRed');
$$('.tituloSiteMap[idTabla="'+idSite+'"]').addClass('tituloRed');
}

function quitarSeleccionados()
{
$$('.knobRed').removeClass('knobRed');
$$('.tituloSiteMap').removeClass('tituloRed');
}

function addSiteToMap(map,item,centro)
{
var nombre=item.getFirst('.celda[campo="Name"]').getFirst('.valor').get('text');
var clase="Blue";
if (item.getFirst('.celda[campo="Clase"]'))
	{
	if (item.getFirst('.celda[campo="Clase"]').getFirst('.valor').get('text')!='')
		{
		clase=item.getFirst('.celda[campo="Clase"]').getFirst('.valor').get('text');
		}
	}
var siteId=item.get('linea');
var contenido='<div class="contenedorMarcadorKnob contenedorKnob'+clase+'"><div class="marcadorKnob knobSite knob'+clase+' conTip" title="'+nombre+'" idTabla="'+siteId+'"></div><div class="tituloSiteMap" idTabla="'+siteId+'">'+nombre+'</div><div class="clear"></div></div>';
var popUp=new OpenLayers.Popup(nombre,
                   new OpenLayers.LonLat(centro.x,centro.y),
                   new OpenLayers.Size(220,20),
                   contenido,
                   false);
map.addPopup(popUp);					  
}

function addSubmaps(mapaDiv,tabla,mapa)
{
//function for adding submaps areas to a map from a table of submaps.
//global variable subMaps is required as array of submaps
var contenedor=$(mapaDiv).getParent('.baseMapas');

var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
var vectorLayer=mapa.getLayersByName('Maps');
if (vectorLayer.length>0)
	{var vectors=vectorLayer[0];}
else
	{
	var vectors = new OpenLayers.Layer.Vector("Maps", {
	styleMap: styleBase,
	renderers: renderer
	});
	}

$(tabla).getElements('.lineaDatos').each(function(item)
	{
	var idMapa=item.getFirst('.celda[campo="Map"]').getFirst('.valor').get('text');
	var xpos=item.getFirst('.celda[campo="XPos"]').getFirst('.valor').get('text')*1;
	var ypos=item.getFirst('.celda[campo="YPos"]').getFirst('.valor').get('text')*1;
	var xsize=item.getFirst('.celda[campo="XSize"]').getFirst('.valor').get('text')*1;
	var ysize=item.getFirst('.celda[campo="YSize"]').getFirst('.valor').get('text')*1;
	var geo=item.getFirst('.celda[campo="Info"]').getFirst('.valor').get('text');
	var titulo=item.getFirst('.celda[campo="Name"]').getFirst('.valor').get('text');
	var geom=new OpenLayers.Geometry.fromWKT(geo);
	var feature=new OpenLayers.Feature.Vector(geom,{type:''});
	vectors.addFeatures([feature]);
	var submap=new Element('div',{'class':'subMapa'}).inject(contenedor);
	submap.setStyle('width',xsize+'%');
	submap.setStyle('height',ysize+'%');
	submap.setStyle('top',ypos+'%');
	submap.setStyle('left',xpos+'%');
	var tituloMapa=new Element('div',{'class':'tituloSubMapa'}).inject(submap);
	tituloMapa.set('html','<a href="index.php?id='+idMapa+'">'+titulo+'</a>');
	var nuevoMapa=new Element('div',{'class':'contenedorMapa','id':'submapa'+idMapa}).inject(submap);
	//var mapa2=crearMapaNoLabels('submapa'+idMapa);
	var mapa2=crearMapaNoControls('submapa'+idMapa);
	var geom=new OpenLayers.Geometry.fromWKT(geo);
	var bounds=geom.getBounds();
	mapa2.zoomToExtent(bounds);
	subMaps[subMaps.length]=mapa2;
	});

mapa.addLayer(vectors);	
}

function geoRemoveAll(tabla,mapa)
{
var vectorLayer=mapa.getLayersByName('Info');
if (vectorLayer.length>0)
	{
	mapa.removeLayer(vectorLayer[0]);
	}
$$('#'+tabla+' .botonRemoveFromMap').each(function(element)
	{
	element.addClass('botonAddToMap');
	element.removeClass('botonRemoveFromMap');
	element.set('title','add to map');
	});
}

function geoAddAll(tabla, claseSuperior,mapa)
{
$$('#'+tabla+' .botonAddToMap').each(function(el)
	{
	addToMap(el,claseSuperior,mapa);
	});
}

function geoZoomToAll(mapa)
{
var vectorLayer=mapa.getLayersByName('Info');
if (vectorLayer.length>0)

	{
	var bounds = new OpenLayers.Bounds();
		vectorLayer[0].features.each(function(item,index)
		{
			var geom=item.geometry;
			var newBounds=geom.getBounds();
			bounds.extend(newBounds);
		
		});
		
	mapa.zoomToExtent(bounds);
	}
}

function geoZoomToElement(element,claseSuperior,mapa)
{
var padre=element.getParent('.'+claseSuperior);
var label=padre.getFirst('.valor').get('text');
var padreSuperior=padre.getParent();
var linea=padreSuperior.get('linea');
var vectorLayer=mapa.getLayersByName('Info');
if (vectorLayer.length>0)
	{
	var features=vectorLayer[0].getFeaturesByAttribute('idGeo',linea);
	if (features.length>0)
		{
		var geom=features[0].geometry;
		var newBounds=geom.getBounds();
		mapa.zoomToExtent(newBounds);
		}
	else
		{
		var botonElement=element.getPrevious('.botonAddToMap');
		addToMap(botonElement,claseSuperior,mapa)
		geoZoomToElement(element,claseSuperior,mapa);
		}
	}
else	
	{
	var botonElement=element.getPrevious('.botonAddToMap');
	addToMap(botonElement,claseSuperior,mapa)
	geoZoomToElement(element,claseSuperior,mapa);
	}

}

function crearMarcadores(mapa)
{
var contenedor=mapa.div;
var markers=contenedor.get('markers').split(';');
var geos=contenedor.get('geos').split(';');

var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

var style = new OpenLayers.Style({
    fillColor: "#ffcc66",
	fillOpacity:0.2,
    strokeColor: "#ff7733",
	pointRadius:6,
    strokeWidth: 2,
    label: "${type}",
	labelAlign: "cc",
	fontColor: "#000000",
	fontOpacity: 1,
	fontFamily: "Arial",
	fontSize: 16,
	fontWeight: "600"
});

var vectors = new OpenLayers.Layer.Vector("Info", {
styleMap: style,
renderers: renderer
});

var bounds = new OpenLayers.Bounds();
markers.each(function(item,index)
	{
	if (item!='')
		{
		var geom=new OpenLayers.Geometry.fromWKT(geos[index]);
		var newBounds=geom.getBounds();
		bounds.extend(newBounds);
		var feature=new OpenLayers.Feature.Vector(geom,{type:item});
		vectors.addFeatures([feature]);
		
		}
	
	});

mapa.addLayer(vectors);
mapa.zoomToExtent(bounds);

}

function guardarMapaTexto()
{
var nuevoGeo=$('geoTexto').value;
var tipoGeo=$('geoTexto').get('tipo');
if (tipoGeo=='wkt')
	{
	var geom=new OpenLayers.Geometry.fromWKT(nuevoGeo);
	var feature=new OpenLayers.Feature.Vector(geom,{});
	vectors.removeAllFeatures();
	vectors.addFeatures([feature]);
	vectors.redraw();
	}
else
	{
	if (tipoGeo=='kml')
		{
		vectors.removeAllFeatures();
		var conversor=new OpenLayers.Format.KML;
		var features=conversor.read(nuevoGeo);
		vectors.addFeatures([features[0]]);
		vectors.redraw();
		}
	}
guardarMapa();
}

function calcularDistancia(origen,destino)
//calcula la distancia entre los centros de dos geometrías wkt
{
if (origen!=0)
	{
	var geom=new OpenLayers.Geometry.fromWKT(origen);
	var centro1=geom.getCentroid();
	var geom=new OpenLayers.Geometry.fromWKT(destino);
	var centro2=geom.getCentroid();
	//pasar los centros a wkt
	var lado1=new OpenLayers.Geometry.Curve();
	lado1.addPoint(centro1);
	lado1.addPoint(centro2);
	return lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"));
	}
else
	 {return 'NA';}
}

function guardarMapa(mapParameter)
{
if (typeof(mapParameter)!=="undefined")
	{
	var vectorLayer=mapParameter.getLayersByName('Vectores');
	if (vectorLayer.length>0)
		{var vectorsEditing=vectorLayer[0];}
	}
else
	{
	var vectorsEditing=vectors;
	}
var geometria=vectorsEditing.features[0].geometry.toString();
tramo=geometria;
$('geoFormCampoGeo').value=geometria;

if (geometria.indexOf('LINESTRING')==0)
	{
	$('geoFormCampoDistancia').value=(vectorsEditing.features[0].geometry.getGeodesicLength(new OpenLayers.Projection("EPSG:900913")))*1.05;
	}

if (geometria.indexOf('POLYGON')==0)
	{
	var vertices=vectorsEditing.features[0].geometry.getVertices();
	var lado1=new OpenLayers.Geometry.Curve();
	lado1.addPoint(vertices[0]);
	lado1.addPoint(vertices[1]);
	if (lado1.getBounds().getWidth()>lado1.getBounds().getHeight())
		{
		var primerLado='x';
		var angulo=(Math.atan2(lado1.getBounds().getHeight(),lado1.getBounds().getWidth()) / (2*Math.PI))*360;
		if ((vertices[0].x<vertices[1].x)&&(vertices[0].y>vertices[1].y))
			{angulo=angulo*(-1);}
		if ((vertices[0].x>vertices[1].x)&&(vertices[0].y<vertices[1].y))
			{angulo=angulo*(-1);}	
		angulo=(angulo+360)%360;
		}
	else
		{
		var primerLado='y';
		var angulo=((Math.atan2(lado1.getBounds().getHeight(),lado1.getBounds().getWidth()) / (2*Math.PI))*360)-90;
		if ((vertices[0].y<vertices[1].y)&&(vertices[0].x>vertices[1].x))
			{angulo=angulo*(-1);}
		if ((vertices[0].y>vertices[1].y)&&(vertices[0].x<vertices[1].x))
			{angulo=angulo*(-1);}	
		angulo=(angulo+360)%360;
		}
	
	var lado2=new OpenLayers.Geometry.Curve();
	lado2.addPoint(vertices[1]);
	lado2.addPoint(vertices[2]);
	if (primerLado=='x')
		 {
		$('geoFormCampoDistancia').value=lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"));
		$('geoFormCampoDistanciaY').value=lado2.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"));
		}
	else
		{
		$('geoFormCampoDistancia').value=lado2.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"));
		$('geoFormCampoDistanciaY').value=lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"));
		}
	$('geoFormAngulo').value=angulo;
	}

$('geoFormMensaje').set('load',{method:'post',data:serializarFormulario('geoForm')});
$('geoFormMensaje').load($('geoForm').get('action'));
	
/*var req=new Form.Request($('geoForm'),$('geoFormMensaje') , {
	resetForm:false,
    onSuccess: function(target,texto,textoXML) 
		{ 
		target.setStyle('display','block');
		setTimeout("$$('.mensaje').setStyle('display','none');",4000);
		}
	});
req.send();*/


}

function borrarMapa()
{
vectors.removeAllFeatures();
tramo='';
if ($('geoTexto'))
	{
	$('geoTexto').value="";
	}
}

//requiere variables globales map, vectors, controls
function mapaParaEdicion(mapParameter)
{
// allow testing of specific renderers via "?renderer=Canvas", etc
if (typeof(mapParameter)!=="undefined")
	{
	var mapEditing=mapParameter;
	}
else
	{
	var mapEditing=map;
	}

var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

vectors = new OpenLayers.Layer.Vector("Vectores", {
styleMap: myStyles,
renderers: renderer
});
mapEditing.addLayer(vectors);

if (console && console.log) {
function report(event) {
console.log(event.type, event.feature ? event.feature.id : event.components);
}
vectors.events.on({
"beforefeaturemodified": report,
"featuremodified": report,
"afterfeaturemodified": report,
"vertexmodified": report,
"sketchmodified": report,
"sketchstarted": report,
"sketchcomplete": report
});
}

controls = {
point: new OpenLayers.Control.DrawFeature(vectors,
OpenLayers.Handler.Point),
line: new OpenLayers.Control.DrawFeature(vectors,
OpenLayers.Handler.Path),
box: new OpenLayers.Control.DrawFeature(vectors,
OpenLayers.Handler.Box),
polygon: new OpenLayers.Control.DrawFeature(vectors,
OpenLayers.Handler.Polygon),
regular: new OpenLayers.Control.DrawFeature(vectors,
OpenLayers.Handler.RegularPolygon,
{handlerOptions: {sides: 5}}),
modify: new OpenLayers.Control.ModifyFeature(vectors)
};
for(var key in controls) {
mapEditing.addControl(controls[key]);
}
document.getElementById('noneToggle').checked = true; 


}

 function updateMap() {
// reset modification mode
controls.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
var rotate = document.getElementById("rotate").checked;
if(rotate) {
controls.modify.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
}
var resize = document.getElementById("resize").checked;
if(resize) {
controls.modify.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
var keepAspectRatio = document.getElementById("keepAspectRatio").checked;
if (keepAspectRatio) {
controls.modify.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
}
}
var drag = document.getElementById("drag").checked;
if(drag) {
controls.modify.mode |= OpenLayers.Control.ModifyFeature.DRAG;
}
if (rotate || drag) {
controls.modify.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
}
controls.modify.createVertices = document.getElementById("createVertices").checked;
if (document.getElementById("sides"))
	{
	var sides = parseInt(document.getElementById("sides").value);
	sides = Math.max(3, isNaN(sides) ? 0 : sides);
	controls.regular.handler.sides = sides;
	var irregular = document.getElementById("irregular").checked;
	controls.regular.handler.irregular = irregular;
	}
}

function toggleControlText(element)
{
if (element.value=='wkt')
	{
	$('geoTexto').value=tramo;
	$('geoTexto').set('tipo','wkt');
	}
else
	{
	if (element.value=='kml')
		{
		var geom=new OpenLayers.Geometry.fromWKT(tramo);
		var feature=new OpenLayers.Feature.Vector(geom,{});
		var conversor=new OpenLayers.Format.KML;
		$('geoTexto').value=conversor.write(new Array(feature));
		$('geoTexto').set('tipo','kml');
		}
	}

}

function toggleControl(element) {
for(key in controls) {
var control = controls[key];
if(element.value == key && element.checked) {
control.activate();
} else {
control.deactivate();
}
}
} 

function getLatitude(geomText)
{
var geom=new OpenLayers.Geometry.fromWKT(geomText);
var centro=geom.getCentroid();
var centroBase=centro.transform(
			new OpenLayers.Projection("EPSG:900913"), // from Spherical Mercator
            new OpenLayers.Projection("EPSG:4326") // transform to WGS 1984           
          );
if (centroBase.y>0)
	{return centroBase.y.decimal(4)+'º N';}
else	
	{return Math.abs(centroBase.y).decimal(4)+'º S';}
}

function getLongitude(geomText)
{
var geom=new OpenLayers.Geometry.fromWKT(geomText);
var centro=geom.getCentroid();
var centroBase=centro.transform(
			new OpenLayers.Projection("EPSG:900913"), // from Spherical Mercator
            new OpenLayers.Projection("EPSG:4326") // transform to WGS 1984           
          );
if (centroBase.x>0)
	{return centroBase.x.decimal(4)+'º E';}
else	
	{return Math.abs(centroBase.x).decimal(4)+'º W';}
}

function ocultarControlesTexto()
{
$$('.elEdicionMapaTexto').addClass('oculto');	
$$('.elEdicionMapaDibujo').removeClass('oculto');	
$('cambioEdicion').set('html','<a href="javascript:ocultarControlesDibujo();">Text Mode</a>');
}

function ocultarControlesDibujo()
{
$$('.elEdicionMapaDibujo').addClass('oculto');	
$$('.elEdicionMapaTexto').removeClass('oculto');	
$('cambioEdicion').set('html','<a href="javascript:ocultarControlesTexto();">Drawing mode</a>');
}

function dimensionesPrimera(mapParameter)
{
if (typeof(mapParameter)!=="undefined")
	{
	var vectorLayer=mapParameter.getLayersByName('Vectores');
	if (vectorLayer.length>0)
		{var vectorsEditing=vectorLayer[0];}
	}
else
	{
	var vectorsEditing=vectors;
	}
if (vectorsEditing.features.length>0)
	{
	var geometria=vectorsEditing.features[0].geometry.toString();
	if (geometria.indexOf('POLYGON')==0)
		{
		var vertices=vectorsEditing.features[0].geometry.getVertices();
		var lado1=new OpenLayers.Geometry.Curve();
		lado1.addPoint(vertices[0]);
		lado1.addPoint(vertices[1]);
		if (lado1.getBounds().getWidth()>lado1.getBounds().getHeight())
			{
			var primerLado='x';
			}
		else
			{
			var primerLado='y';
			}
		
		var lado2=new OpenLayers.Geometry.Curve();
		lado2.addPoint(vertices[1]);
		lado2.addPoint(vertices[2]);
		if (primerLado=='x')
			 {
			$('dimensionX').set('text',Math.round(lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))).decimal(0)+'m');
			$('dimensionY').set('text',Math.round(lado2.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))).decimal(0)+'m');
			}
		else
			{
			var l1=Math.round(lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913")));
			var t1=l1.decimal(0);
			$('dimensionX').set('text',Math.round(lado2.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))).decimal(0)+'m');
			$('dimensionY').set('text',Math.round(lado1.getGeodesicLength(new OpenLayers.Projection("EPSG:900913"))).decimal(0)+'m');
			}
		}
	else
		{
		$('dimensionX').set('text','0m');
		$('dimensionY').set('text','0m');
		}
		
	}
else
	{
	$('dimensionX').set('text','0m');
	$('dimensionY').set('text','0m');
	}
}

function sitesCellProcessing(celda,linkValue,flags)
{
if (typeof(flags)=='undefined')
	{
	flags=false;
	}
var texto='';
if (celda.getElement('.datos'))
	{texto=celda.getElement('.datos').get('text');}
else
	{
	texto=celda.get('text');
	}
if (texto.trim()!='')
	{
	var sites=texto.split('#%#');
	var countries=new Array();
	var siteNames=new Array();
	var siteIds=new Array();
	var newHtml='';
	sites.each(function(site)
		{
		var values=site.split(';');
		if (flags)
			{
			var country=values[2].replace(/ /g, "_").toUpperCase();
			if (countries.indexOf(country)==-1)
				{
				countries[countries.length]=country;
				}
			}
		if (newHtml!='')
			{newHtml+=', ';}
		if (linkValue!='')
			{newHtml+='<a href="'+linkValue+values[1]+'">'+values[0]+'</a>';}
		else
			{newHtml+=values[0];}
		siteNames[siteNames.length]=values[0];
		siteIds[siteIds.length]=values[1];
		});
	celda.set('siteIds',siteIds.join(','));
	celda.set('siteNames',siteNames.join(','));
	if (celda.getElement('.datos'))
		{celda.getElement('.datos').set('html',newHtml);}
	else
		{
		texto=celda.set('html',newHtml);
		}
	if (flags)
		{
		countries.each(function(country)
			{
			new Element('div',{'class':'flagIcon flag'+country,'title':country}).inject(celda,'top');
			});
		}
	}
	
}

