<?php

/*!
 * mapas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 mapas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

//new v1.0
function boxMap($boxId,$info,$editMode)
{
echo '<div class="mapa" id="mapaISP" site="'.$info.'"></div>';
if ($editMode){echo '<a target="_blank" href="buildISP.php?id='.$boxId.'"><div class="editarPlano showOnEdit conTip" title="edit map"></div></a>';}
}

function cabeceraEdicionMapa()
{
echo '<div id="cabeceraEdicionMapa">';
echo '<div id="modoEdicionMapa"><div id="cambioEdicion"></div><div id="borrarMapa"><span class="botonMapa"><a href="javascript:borrarMapa();">CLEAN MAP</a></span></div></div>';
echo '</div>';
}

function edicionTextoMapa($info)
{
echo'
<div class="elEdicionMapaTexto">
<div id="controlsTextMap">
<ul id="controlToggleText">
<li>
<input type="radio" name="textType" value="wkt" id="wktToggle"
onclick="toggleControlText(this);" checked="checked" />
<label for="wktToggle">WKT</label>
</li>
<li>
<input type="radio" name="textType" value="kml" id="kmlToggle"
onclick="toggleControlText(this);" />
<label for="kmlToggle">KML</label>
</li>
</ul>
</div>
<textarea id="geoTexto" rows="4" cols="30" tipo="wkt">'.$info.'</textarea>
<div class="comentario">* Projection EPSG:900913 (Spherical Merkator)<br/>Only first geometry will be saved</div>
<div class="centrado"><span class="botonMapa saveMapButton"><a href="javascript:guardarMapaTexto();">SAVE CHANGES</a></span></div>
</div>';
}

function controlEdicionMapa($opciones,$tabla, $id)
{
echo'
<div id="controls" class="elEdicionMapaDibujo" style="width:100%">
<div style="float:left;width:50%;">
<ul id="controlToggle">
<li>
<input type="radio" name="type" value="none" id="noneToggle"
onclick="toggleControl(this);" checked="checked" />
<label for="noneToggle">browse</label>
</li>';

foreach ($opciones as $item){

	switch ($item)
	{
	case 'punto':
		echo '<li>
			<input type="radio" name="type" value="point" id="pointToggle" onclick="toggleControl(this);" />
			<label for="pointToggle">draw a point</label>
			</li>';
		break;
	case 'linea':
		echo '<li>
			<input type="radio" name="type" value="line" id="lineToggle" onclick="toggleControl(this);" />
			<label for="lineToggle">draw a line</label>
			</li>';
		break;
	case 'mapa':
		echo '<li>
			<input type="radio" name="type" value="box" id="lineToggle" onclick="toggleControl(this);" />
			<label for="lineToggle">map box</label>
			</li>';
		break;
	case 'poligono':
		echo '<li>
			<input type="radio" name="type" value="polygon" id="polygonToggle" onclick="toggleControl(this);" />
			<label for="polygonToggle">draw a polygon</label>
			</li>';
		break;
	case 'regular':
		echo '<li>
			<input type="radio" name="type" value="regular" id="regularToggle" onclick="toggleControl(this);" />
			<label for="regularToggle">draw a regular polygon</label>
			<label for="sides"> - caras</label>
			<input id="sides" type="text" size="2" maxlength="2"
			name="sides" value="5" onchange="updateMap()" />
			<ul>
			<li>
			<input id="irregular" type="checkbox"
			name="irregular" onchange="updateMap()" />
			<label for="irregular">irregular</label>
			</li>
			</ul>
			</li>';
		break;
	case 'modificar':
		echo '</div><div style="width:50%;float:left;">';
		echo '<li>
			<input type="radio" name="type" value="modify" id="modifyToggle"
			onclick="toggleControl(this);" />
			<label for="modifyToggle">modify</label>
				<ul>
				<li>
				<input id="createVertices" type="checkbox" checked
				name="createVertices" onchange="updateMap()" />
				<label for="createVertices">allow new vortex</label>
				</li>
				<li>
				<input id="rotate" type="checkbox"
				name="rotate" onchange="updateMap()" />
				<label for="rotate">allow rotate</label>
				</li>
				<li>
				<input id="resize" type="checkbox"
				name="resize" onchange="updateMap()" />
				<label for="resize">allow scale</label>
				(<input id="keepAspectRatio" type="checkbox"
				name="keepAspectRatio" onchange="updateMap()" checked="checked" />
				<label for="keepAspectRatio">maintain aspect ratio</label>)
				</li>
				<li>
				<input id="drag" type="checkbox"
				name="drag" onchange="updateMap()" />
				<label for="drag">allow drag</label>
				</li>
				</ul>
			</li>';
		}
	}
echo '</div></ul><div class="clear"></div>
<div id="pieEdicionMapa" class="centrado"><span class="botonMapa saveMapButton"><a href="javascript:guardarMapa();">SAVE CHANGES</a></span></div>
<div class="mensaje oculto" id="geoFormMensaje"></div>
<div class="oculto"><form id="geoForm" method="post" action="ajax/geoUpdate.php">
<input type="text" name="tabla" value="'.$tabla.'"><input type="text" name="id" value="'.$id.'"><input id="geoFormCampoDistanciaY" type="text" name="distanciaY" value=""><input id="geoFormCampoDistancia" type="text" name="distancia" value=""><input id="geoFormAngulo" type="text" name="angulo" value=""><input id="geoFormCampoGeo" type="text" name="geo" value="">
</form></div></div>';
}

?>