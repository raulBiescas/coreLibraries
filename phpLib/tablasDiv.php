<?php


/*!
 * tablasDiv.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 tablasDiv.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once 'sql.php';
include_once "funcionesRepresentacion.php";
include_once "formularios.php";


//simple functions
function generarCabeceraDiv($titulos)
{
echo '<div class="lineaTitulo lineaTabla">';

foreach ($titulos as $titulo)
{echo '<div class="celda titulo" campo="'.$titulo.'">'.$titulo.'</div>';}

echo '</div>';
}

function generarTablaDiv($datos)
{
foreach ($datos as $indice =>$fila)
	{
	$identificador=array_shift($fila);
	echo '<div class="lineaDatos lineaTabla" identificador="'.$identificador.'">';
	foreach ($fila as $numCampo => $dato)
		{echo '<div class="celda datos" campo="'.$numCampo.'">'.$dato.'</div>';}
	
	echo '</div>';
	}
}


//el primer campo de la consulta es para el indice de las filas, no se representa

function tablaDivStandard($name,$tabla, $campos, $filtro,$orden, $editMode=FALSE,$noEditables=array(),$controles='Left')
{		
		$tipos=tipoCampos($tabla);		
		array_unshift($campos,'Id');
		$query=selectClause($tabla, $campos)." from `".$tabla."`".$filtro.$orden;
		array_shift($campos);
		return(tablaDivCompleta($name,$tabla,$campos,$tipos,$query,$editMode,$noEditables,$controles));
}


function tablaDivFromQuery($name,$nombre, $query)
{
	$res=descifrarQuery($query);
	array_shift($res[0]);
	return(tablaDivCompleta($name,$nombre,$res[0],$res[1],$query));
	
	}

function tablaDivCompletaFromArray($name,$tabla, $campos, $vector, $noEditables,$controles='Left')
{

$vectorProcesado=array();
foreach ($vector as $linea)
	{
	$nuevaLinea=array();
	$i=0;
	foreach ($linea as $valor)
		{
		$nuevaLinea[$campos[$i]]=$valor;
		$i++;
		}
	$vectorProcesado[]=$nuevaLinea;
	}

	
array_splice($campos,0,1);
$tipos=tipoCampos($tabla);	
tablaDivCompleta($name, $tabla,$campos,$tipos,$vectorProcesado,true,$noEditables,$controles);
}

function tablaDivSoloLineas($tabla,$campos,$tipos,$query,$editMode,$extraFields,$noEditables=array(),$controles='Left')
{
global $pdo;
if (!is_array($query))
		{
		$rs = $pdo->prepare($query);
		$rs->execute(); 			
		//$rs = mysql_query($query);
		$query=array();
		//while ($obj=mysql_fetch_object($rs))
		while ($obj=$rs->fetch(PDO::FETCH_OBJ))
		{$query[] = get_object_vars($obj);}
		}
		
		$i=0;
		foreach ($query as $valores)
		{
			$id=array_shift($valores);
			if ($editMode)
				{echo '<form id="formulario'.$tabla.$id.'" class="tablaDivForm" tablaForm="'.$tabla.'" linea="'.$id.'" idForm="'.$id.'" action="ajax/update.php" method="post">';}
			echo '<div class="lineaDatos lineaTabla';
			if ($editMode){echo ' baseElemento';}
			echo'" num="'.$i.'" linea="'.$id.'" tabla="'.$tabla.'">';
			if ($editMode){echo  '<div class="mensajeLineaActualizada oculto"></div>';}
			STabla_linea($tabla,$id,$valores,$editMode,$campos,$extraFields,$tipos,$noEditables,$controles);
			echo '<div class="clear"></div></div>';
			if ($editMode)
				{echo '</form>';}
			$i++;
		}
}

function tablaDivCompleta($name,$tabla,$campos,$tipos,$query,$editMode,$noEditables=array(),$controles='Left')
{
		echo '<div class="tablaDiv" tabla="'.$tabla.'" id="'.$name.'">';
		//if ($editMode){echo '<form id="formulario'.$name.'" tablaForm="'.$tabla.'" idForm="0" action="ajax/update.php" method="post">';}
		echo '<div class="lineaTitulo lineaTabla">';
		$extraFields=sTabla_titulo($editMode,$campos,$tipos,$controles);
		echo '<div class="clear"></div></div><div class="tbody">';
		
		$i=tablaDivSoloLineas($tabla,$campos,$tipos,$query,$editMode,$extraFields,$noEditables,$controles);
		
		echo '</div>';
		//if ($editMode){echo '</form>';}
		echo '</div>';
		return $i;
	}

function sTabla_titulo($editMode,$campos,$tipos,$controles='Left')
{
if ($editMode && (($controles=='Left')||($controles=='Both'))){echo '<div class="celda titulo controles"></div>';}

$contador=0;
$extraFields=array();
foreach ($campos as $index=>$value)			
{
if (array_key_exists($value, $tipos)) 
{
switch(true)
	{
	case 	(strpos($tipos[$value],"date") === 0):
	$parser='date';
	break;
	case 	(strpos($tipos[$value],"int") === 0):
	$parser='number';
	break;
	case 	(esDecimal($tipos[$value])):
	$parser='float';
	break;
	case 	(strpos($tipos[$value],"tinyint(1)") === 0):
	$parser='input-checked';
	break;
	default:
	$parser='string';
	break;	
	}
}
else 
	{
		$parser='string';
		$extraFields[]=array($value,$contador);
		}

$claseExtra="";
$tipoSimbolo="";
if (count($campos)>($index+1))
	{
	if (strpos($campos[$index+1],"_CUR") > 0) 
		{
		$claseExtra="simboloIncluido";
		$tipoSimbolo="Currency";
		}
	if (strpos($campos[$index+1],"_UNIT") > 0)	
		{
		$claseExtra="simboloIncluido";
		$tipoSimbolo="Unit";
		}
	}
		
if (mostrarCampo($value))
{echo '<div class="celda titulo '.$claseExtra.'" tipoSimbolo="'.$tipoSimbolo.'" parser="'.$parser.'" tipo="'.$tipos[$value].'" campo="'.$value.'">'.procesarTitulo($value).'</div>';}

$contador++;
			
	}

if ($editMode && (($controles=='Right')||($controles=='Both'))){echo '<div class="celda titulo controles"></div>';}
return $extraFields;
}
	
function STabla_linea($tabla, $id,$valores,$editMode,$campos,$extraFields,$tipos,$noEditables,$controles)
{			
			if ($editMode && (($controles=='Left')||($controles=='Both'))){echo '<div class="celda controles">
			<div class="controlesIniciales">
					<span class="separados"><img  class="boton edicionLinea" title="edit" alt="edit" src="styles/images/edit.png"/></span>
					<span class="separados"><img  class="boton borradoLinea" title="delete" alt="delete" src="styles/images/delete.png"/></span>					
				</div>
			<div class="controlesFinales">
					<span class="separados"><img  class="boton guardadoLinea" title="save" alt="save" src="styles/images/table_save.png"/></span>
					<span class="separados"><img   title="cancel" alt="cancel" class="boton canceladoLinea" src="styles/images/cancel.png"/></span>	
				</div><div class="oculto mensajeOculto"></div><div class="celdaMensaje"></div></div>';			
			}
			
			foreach ($extraFields as $extra)
			{
				$tipos[$extra[0]]=getTipoExtra($extra[0]);
				array_splice($valores,$extra[1],0,getExtra($extra[0],$tabla, $id));			
				}	
			$j=0;
			foreach ($valores as $campo=>$value)		
				{
					if (is_numeric($campo))
						{$campo=$extraFields[$campo][0];}
					if (mostrarCampo($campo))
					{
					if	((strpos($tipos[$campo],"literal") === 0))
					{echo '<div class="celda datos" campo="'.$campo.'">'.$value.'</div>';}
					else {
					if	((strpos($tipos[$campo],"date") === 0) && (strpos($value,"00") === 0))
						{$value='';}
					if	((strpos($tipos[$campo],"timestamp") === 0) && (strpos($value,"00") === 0))
						{$value='';}
					if	((strpos($tipos[$campo],"datetime") === 0) && (strpos($value,"00") === 0))
						{$value='';}
				echo '<div class="celda datos" tipo="'.$tipos[$campo].'" campo="'.$campo.'">';
				if (count($noEditables)>0)
					{$condicion=$editMode && (array_search($campo, $noEditables)===false);}
				else
					{$condicion=$editMode;}
				if ($condicion)
					{
					echo '<span campo="'.$campo.'" tipo="'.$tipos[$campo].'" class="editable valor';
					global $autocompleters;
					if (isset($autocompleters))
						{if (array_search($campo, $autocompleters)!==false){echo " autocompletar";}}
					echo'">';
					
					}
				else {echo '<span class="valor">';}			
				echo $value;
				echo '</span>';
				
				escribirSimbolo($campo, $tipos, $campos, $valores,$condicion);
				
				echo '</div>';
					}			
					}
					$j++;
					}
				
			if ($editMode && (($controles=='Right')||($controles=='Both'))){echo '<div class="celda controles">
			<div class="controlesIniciales">
					<span class="separados"><img  class="boton edicionLinea" title="edit" alt="edit" src="styles/images/edit.png"/></span>
					<span class="separados"><img  class="boton borradoLinea" title="delete" alt="delete" src="styles/images/delete.png"/></span>					
				</div>
			<div class="controlesFinales">
					<span class="separados"><img  class="boton guardadoLinea" title="save" alt="save" src="styles/images/table_save.png"/></span>
					<span class="separados"><img   title="cancel" alt="cancel" class="boton canceladoLinea" src="styles/images/cancel.png"/></span>	
				</div><div class="oculto mensajeOculto"></div><div class="celdaMensaje"></div></div>';			
			}
						

}

function referencesBlock($tabla,$id,$editMode,$suffix='')
{
echo '<div class="referencesBlock" suffix="'.$suffix.'">';
tablaDivStandard('ReferencesTable'.$tabla.$id,$suffix.'References', array('Type','Reference'), " where Tabla='".$tabla."' and IdTabla=".$id.' ' ,'', $editMode,array(),'Left');
if ($editMode)
	{
	echo '<form id="nuevaReference'.$tabla.'" action="ajax/newReference.php" method="post" class="referencesLine showOnEdit">';
		echo '<div class="referencesNewLine">';
			echo '<input class="oculto" type="text" name="Tabla" value="'.$tabla.'"><input class="oculto" type="text" name="IdTabla" value="'.$id.'">';
			formularioStandard($suffix.'References', array('Type','Reference'), 0,FALSE);
			echo '<div class="lineaInputs addReference" title="add reference"></div>';
			echo '<div class="clear"></div>';
		echo '</div>';
	echo '</form>';
	}
echo '</div>';
}

?>