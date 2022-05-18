<?php

/*!
 * filtros.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 filtros.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once 'formularios.php';
include_once 'sql.php';

function tituloFiltro($texto)
{
echo '<div class="tituloFiltro">'.$texto.'</div>';
}

function botonFiltro($texto)
{
echo '<div class="botonFiltro">'.$texto.'<div class="relojFiltro"></div></div>';
}

function resultadosFiltro($texto, $tablaDiv)
{
echo '<div class="filterResults" tablaDiv="'.$tablaDiv.'">'.$texto.'<span class="filterTotalResults"></span></div>';
}

function smartSearch($camposBusqueda)
{
global $_GET;
$filtroSearch='';
$search='';
$clase="lineaFiltro";
if (array_key_exists('search',$_GET))
	{
	$search=$_GET['search'];
	if ($search!='')
		{
		$clase.=" filtroSeleccionado";
		$filtroSearch='(';
		foreach ($camposBusqueda as $c)
			{
			$filtroSearch.="(`".$c."` like '%".$search."%') OR "; 
			}
		$filtroSearch=substr($filtroSearch,0,-3).')';
		}
	}
echo '<div class="'.$clase.'">';
echo '<div class="nombreFiltro"><span class="imagenTituloFiltro"><img class="conTip" src="styles/images/search.png" title="Smart search"></img></span></div>';
echo '<div class="espacioSelect"><input type="text" name="search" value="'.$search.'"></div><div class="clear"></div>';
echo '</div>';//lineaFiltro
return $filtroSearch;
}

function filtroAMedida($campo,$valores,$realField='')
{
global $_GET;
$valor='ALL';
$clase="lineaFiltro";
if (array_key_exists($campo,$_GET))
	{
	$valor=$_GET[$campo];
	if ($valor!='ALL')
		{$clase.=" filtroSeleccionado";}
	}

echo '<div class="'.$clase.'">';
echo '<div class="nombreFiltro">'.$campo.'</div>';
echo '<div class="espacioSelect">';
echo '<select id="filtro'.$campo.'" name="'.$campo.'">';
array_unshift($valores,'ALL');
echo selectfield($valores,$valor);
echo '</select>';

echo '</div><div class="clear"></div>'; //espacioSelect
echo '</div>';//lineaFiltro
$filtroInicial='';
if ($valor!='ALL')
	{
	if ($realField!='')
		{
		$campo=$realField;
		}
	else
		{
		$campo='`'.$campo.'`';
		}
	$filtroInicial.=" and ".$campo."='".$valor."'";
	}

return $filtroInicial;	
	
}


function filtrosIniciales($campos,$tabla)
{
global $_GET;
global $filterSelectsSplitted;
$valores=array();
$clases=array();
$split=array();
if (isset($filterSelectsSplitted))
	{
	foreach($filterSelectsSplitted as $toSplit)
		{
		$split[]=$toSplit;
		}
	}
foreach ($campos as $campo)
	{
	if (array_key_exists($campo,$_GET))
		{
		$valores[]=$_GET[$campo];
		if ($_GET[$campo]!='ALL')
				{$clases[]="lineaFiltro filtroSeleccionado";}
		else
			{$clases[]="lineaFiltro";}
		}
	else
		{
		$valores[]='ALL';
		$clases[]="lineaFiltro";
		}
	}
	
$tipos=tipoCampos($tabla);

foreach ($campos as $indice =>$campo)
	{
	echo '<div class="'.$clases[$indice].'">';
	echo '<div class="nombreFiltro">'.$campo.'</div>';
	echo '<div class="espacioSelect">';
	$tipo=$tipos[$campo];
	if 	(strpos($tipo,"enum") === 0)
		{
		$codigo=str_replace("enum", "array", $tipo);
		$codigo="\$selectValues=".$codigo.';';
		eval($codigo);
		
		}
	else
		{
		if (strpos($tipo,"smallint") === 0)
			{
			$selectValues=array(array('0','No'),array('1','Yes'));
			}
		else
			{
			$selectValues=distincts($tabla,$campo);
			}
		}
	if (in_array($campo,$split,true))
		{
		echo '<span class="oculto"><input class="splitFilterValue" name="'.$campo.'" value="'.$valores[$indice].'"></span>';
		$selected=array();
		if ($valores[$indice]!='ALL')
			{
			$arr=explode(',;',$valores[$indice]);
			foreach($arr as $val)
				{
				$selected[]=$val;
				}
			}
		else
			{
			$selected[]='ALL';
			}
		foreach($selectValues as $val)
			{
			if ($val=='')
				{
				$val='blanks';
				}
			$checked='';
			if (in_array('ALL',$selected) || in_array($val,$selected))
				{
				$checked='checked';
				}
			echo '<input type="checkbox" class="filterRadioControl" value="'.$val.'" '.$checked.'>'.$val.'<br>';
			}
		
		}
	else
		{
		echo '<select id="filtro'.$campo.'" name="'.$campo.'">';
		if (is_array($selectValues[0]))
			{array_unshift($selectValues,array('ALL','ALL'));}
		else
			{array_unshift($selectValues,'ALL');}
		echo selectfield($selectValues,$valores[$indice]);
		echo '</select>';
		}
	echo '</div><div class="clear"></div>'; //espacioSelect
	echo '</div>';//lineaFiltro
	}
	

	
	
$filtroInicial='';
foreach ($valores as $indice => $valor)
	{
	$campo=$campos[$indice];
	if ($valor!='ALL')
		{
		if (in_array($campo,$split,true))
			{
			$f='';
			$arr=explode(',;',$valores[$indice]);
			foreach($arr as $val)
				{
				if ($val!='' && $val!='blanks')
					{$f.=" OR `".$campo."`='".$val."'";}
				else
					{
					if ($val=='blanks')
						{$f.=" OR `".$campo."`=''";}
					}
				}
			$filtroInicial.=" and (".substr($f,3).")";
			}
		else
			{$filtroInicial.=" and `".$campo."`='".$valor."'";}
		}
	}

if 	($filtroInicial!='')
	{
	$filtroInicial=' where '.substr($filtroInicial,4);
	}
return $filtroInicial;	
	
}

?>