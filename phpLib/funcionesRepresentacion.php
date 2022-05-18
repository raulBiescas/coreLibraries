<?php

/*!
 * funcionesRepresentacion.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 funcionesRepresentacion.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function mostrarCampo($campo)
{
$resultado=true;

if ((strpos($campo,"_CUR") > 0) ||(strpos($campo,"_UNIT") > 0))
{$resultado=false;}

return $resultado;	
	}
	
function escribirSimbolo($campo, $tipos, $campos, $valores,$editMode=FALSE)
{
$encontradoSimbolo=false;
$editClass="";
if ($editMode){$editClass="editable";}
if ((esDecimal($tipos[$campo])) && (in_array($campo.'_CUR',$campos)))	
					//{echo '<span class="simbolo" tipo="CUR">'.simbolo($valores[$campo.'_CUR']).'</span>';
					{echo '<span class="simbolo datos useDbValue '.$editClass.'" tipoSimbolo="CUR" campo="'.$campo.'_CUR" dbValue="'.$valores[$campo.'_CUR'].'" tipo="'.$tipos[$campo.'_CUR'].'">'.simbolo($valores[$campo.'_CUR']).'</span>';
					$encontradoSimbolo=true;}
if ((esDecimal($tipos[$campo])) && (in_array($campo.'_UNIT',$campos)))	
					{echo '<span class="simbolo datos '.$editClass.'" campo="'.$campo.'_UNIT" tipo="'.$tipos[$campo.'_UNIT'].'">'.$valores[$campo.'_UNIT'].'</span>';
					$encontradoSimbolo=true;}	
if ((strpos($tipos[$campo],"int") === 0) && (in_array($campo.'_UNIT',$campos)))	
					{echo '<span class="simbolo datos '.$editClass.'" campo="'.$campo.'_UNIT" tipo="'.$tipos[$campo.'_UNIT'].'">'.$valores[$campo.'_UNIT'].'</span>';
					$encontradoSimbolo=true;}		
if ((strpos($campo,"%") !== false))	
					{echo '<span class="simbolo" tipo="%">%</span>';
					$encontradoSimbolo=true;}	
if (!$encontradoSimbolo)
	{
	$indice=array_search($campo,$campos);
	if ($indice<(count($campos)-1))
		{
		if ((strpos($campos[$indice+1],"_CUR") !== false) || (strpos($campos[$indice+1],"_UNIT") !== false))
			{
			{echo '<span class="simbolo" tipo="'.$valores[$campos[$indice+1]].'">'.simbolo($valores[$campos[$indice+1]]).'</span>';
					$encontradoSimbolo=true;}	
			}
		}
	}
	
	}

function getTipoExtra($campo)
{
return 'literal';	
	}

function getExtra($campo,$tabla, $id)
{
if (strpos($campo,":") > 0)
	{
	$valores = explode(":", $campo);
	if ($valores[0]=='LinkDocumento')
		{
		return linkDoc($tabla,$id);
		}
	}
	
}

function procesarTitulo($campo)
{
if (strpos($campo,":") > 0)
{
$valores = explode(":", $campo);
return separarMayuscula($valores[1]);
	}
else 
{return separarMayuscula($campo);}
	}

function separarMayuscula($string)
{
$strings=array();
$count = strlen($string);
$strings[0]='';
$i = 0;
$ii = 0;

while($i < $count)
{
        $char = $string{$i};
        if(preg_match("[A-Z]", $char, $val)){
        				$ii++;	
                $strings[$ii] = $char;
        } else {
                $strings[$ii] .= $char;
        }
$i++;
}

$res="";
foreach ($strings as $value)
{	$res.=$value." ";
	}

return($res); 
}	

?>