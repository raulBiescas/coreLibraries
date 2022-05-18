<?php

/*!
 * niveles.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 niveles.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */
 
include_once 'sql.php';
include_once 'tablasDiv.php';

$rsObj=array();
$nivelActual=0;
$idsActuales=array(0);
$resultados=array();
$campos=array();
$tiposCampos=array();
$extraFields=array();

function cargarTiposCampos()
{
global $niveles;
global $tiposCampos;
$tiposCampos=array();
foreach ($niveles as $nivel)
	{
	$tiposCampos[]=tipoCampos($nivel);
	}
}

function generarTituloNivelSuperior()
{
global $pdo;
global $niveles;
global $consultas;
global $tiposCampos;
$nivelActual=0;
$campos=array();
$editMode=true;

$consulta=$consultas[$nivelActual];
/*$rs=mysql_query($consulta);
$vectorResultados=mysql_fetch_assoc($rs);*/
$rs = $pdo->prepare($consulta);
$rs->execute(); 
$vectorResultados = $rs->fetch(PDO::FETCH_ASSOC);
array_shift($vectorResultados);	
$campos[$nivelActual]=array_keys($vectorResultados);

echo '<div class="lineaTitulo lineaTabla lineaNiveles nivel'.$nivelActual.'" lineaSuperior="0" tabla="'.$niveles[$nivelActual].'" nivel="'.$nivelActual.'"><div class="espacioMenuNiveles"></div>';
		sTabla_titulo($editMode,$campos[$nivelActual],$tiposCampos[$nivelActual],'Left');
		echo '<div class="clear"></div></div>';

}

function generarLineaNivel($id)
{
global $pdo;
global $niveles;
global $consultas;
global $tiposCampos;
$nivelActual=0;
$campos=array();
$editMode=true;

$consulta=$consultas[$nivelActual];
/*$rs=mysql_query($consulta);
$vectorResultados=mysql_fetch_assoc($rs);*/
$rs = $pdo->prepare($consulta);
$rs->execute(); 
$vectorResultados = $rs->fetch(PDO::FETCH_ASSOC);
array_shift($vectorResultados);	
$campos[$nivelActual]=array_keys($vectorResultados);

echo '<div class="lineaDatos lineaTabla nivel'.$nivelActual.' lineaNiveles" lineaSuperior="0" tabla="'.$niveles[$nivelActual].'" nivel="'.$nivelActual.'" id="lineaCreada'.$id.'" linea="'.$id.'"><div class="menuNiveles"></div>'; 
	
	if ($editMode)
		{echo '<form id="formulario'.$niveles[$nivelActual].$id.'" tablaForm="'.$niveles[$nivelActual].'" linea="'.$id.'" idForm="'.$id.'" action="ajax/update.php" method="post">';
		echo  '<div class="mensajeLineaActualizada oculto"></div>';}
	
	STabla_linea($niveles[$nivelActual],$id,$vectorResultados,$editMode,$campos[$nivelActual],array(),$tiposCampos[$nivelActual],array(),'Left');
	
	if ($editMode)
		{echo '</form>';}
		
	echo '<div class="clear"></div></div>';
}

function recorrerNiveles($editMode,$noEditables)
{
global $pdo;
global $niveles;
global $consultas;
global $rsObj;
global $nivelActual;
global $idsActuales;
global $vectorResultados;
global $campos;
global $tiposCampos;
global $extraFields;

$consulta=$consultas[$nivelActual];
$consulta=str_replace('nivelAnterior',$idsActuales[$nivelActual],$consulta);


//$rs[$nivelActual]=mysql_query($consulta);
$rsObj[$nivelActual] = $pdo->prepare($consulta);
$rsObj[$nivelActual]->execute(); 
$i=0;
//while ($vectorResultados[$nivelActual]=mysql_fetch_assoc($rs[$nivelActual]))
while ($vectorResultados[$nivelActual]=$rsObj[$nivelActual]->fetch(PDO::FETCH_ASSOC))
{
	//representar datos
	$id=array_shift($vectorResultados[$nivelActual]);	
	$campos[$nivelActual]=array_keys($vectorResultados[$nivelActual]);
	
	if ($i==0)
		{		
		echo '<div class="lineaTitulo lineaNiveles lineaTabla nivel'.$nivelActual.'" tabla="'.$niveles[$nivelActual].'" lineaSuperior="'.$idsActuales[$nivelActual].'" nivel="'.$nivelActual.'"><div class="espacioMenuNiveles"></div>';
		$extraFields[$nivelActual]=sTabla_titulo($editMode,$campos[$nivelActual],$tiposCampos[$nivelActual],'Left');
		echo '<div class="clear"></div></div>';
		}
	
	echo '<div class="lineaDatos lineaTabla nivel'.$nivelActual.' lineaNiveles" tabla="'.$niveles[$nivelActual].'" lineaSuperior="'.$idsActuales[$nivelActual].'" nivel="'.$nivelActual.'" linea="'.$id.'"><div class="menuNiveles"></div>'; 
	
	if ($editMode)
		{echo '<form id="formulario'.$niveles[$nivelActual].$id.'" tablaForm="'.$niveles[$nivelActual].'" linea="'.$id.'" idForm="'.$id.'" action="ajax/update.php" method="post">';
		echo  '<div class="mensajeLineaActualizada oculto"></div>';}
	
	STabla_linea($niveles[$nivelActual],$id,$vectorResultados[$nivelActual],$editMode,$campos[$nivelActual],$extraFields[$nivelActual],$tiposCampos[$nivelActual],$noEditables,'Left');
	
	if ($editMode)
		{echo '</form>';}
		
	echo '<div class="clear"></div></div>';

	//buscar nivel superior
	if (count($niveles)!=$nivelActual+1)
		{
		$nivelActual+=1;
		$idsActuales[$nivelActual]=$id;
		//generar consulta siguiente nivel
		recorrerNiveles($editMode,$noEditables);
		}
$i++;
}

$nivelActual-=1;
}


?>