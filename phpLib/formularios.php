<?php

/*!
 * formularios.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 formularios.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */


include_once "sql.php";
include_once "funcionesRepresentacion.php";

	
function writeTags($tabla, $id, $tam)
{
global $pdo;
$query="SELECT  `Tag` from Tags where `Tabla`='".$tabla."' and IdTabla=".$id." order by `Tag`";
/*$rs = mysql_query($query);
while ($obj = mysql_fetch_object($rs))*/
$rs = $pdo->prepare($query);
$rs->execute();
while ($obj=$rs->fetch(PDO::FETCH_OBJ))
{		
		if ($tam=="max")
		{$clases=" max tagSeleccionado";}
		else {$clases=" med";}
		echo '<span class="tag '.$clases.'" >'.$obj->Tag.'</span>';
}
}

function bloqueTags($tabla, $id, $tam,$editMode)
{
echo '<div class="lineaEtiquetas">';
if ($editMode){echo '<label class="editable oculto " tipocontrol="controlEtiquetas" for="Etiquetas"></label><div class="grupoInputs"><div class="actuales">';}
writeTags($tabla,$id,$tam);
if ($editMode){echo '</div></div></div>';}
else
	{echo '</div>';}
}

function linkDoc($tabla,$id)
{
global $pdo;
global $pathBase;
$query="SELECT  `Description`, `Link` from Files where `Tabla`='".$tabla."' and IdTabla=".$id;
/*$rs = mysql_query($query);
if ($obj = mysql_fetch_object($rs))*/
$rs = $pdo->prepare($query);
$rs->execute();
if ($obj=$rs->fetch(PDO::FETCH_OBJ))
{
$extension=strtolower(end(explode(".", $obj->Link)));
return '<div class="tipoFichero '.$extension.'"><a target="_blank" href="'.$pathBase.$obj->Link.'">'.$obj->Description.'</a></div>';
}
	}	

function formularioNuevoDocumento($tabla, $id, $link)
{
	echo'<div class="botonAdd conTip nuevoFichero showOnEdit" title="New file"></div>';
	echo '<div class="areaNuevoFichero oculto">';
	echo '<div class="botonCerrar cerrarNuevoFichero conTip" title="close"></div>';
	echo '<form id="nuevoDocumento'.$tabla.$id.'"  enctype="multipart/form-data" formId="'.$id.'" action="'.$link.'?id='.$id.'" method="post" class="mainForm">';
	formularioStandard('Files', array('Description'), 0,TRUE);
	formularioStandard('Files', array('Link'), 0,FALSE);
	echo '<input type="text" class="oculto" name="nuevoDocumento" value=""></input>';
	echo '<input type="text" class="oculto" name="Tabla" value="'.$tabla.'"></input>';
	echo '<input type="text" class="oculto" name="IdTabla" value="'.$id.'"></input>';
	//echo '<input type="submit" class="submit" value="Add"></input>';
	echo '<div class="botonFichero botonSubmit">UPLOAD</div>';
	echo '</form>';
	echo '<div id="uploadingFile"></div>';
	echo '</div>';
}

function formularioNuevaImagenLocalizada($action,$surname='')
{
	echo'<div id="botonNewPicture" class="botonAdd conTip nuevoFichero showOnEdit" title="New picture"></div>';
	echo '<div class="areaNuevoFichero oculto">';
	echo '<div class="botonCerrar cerrarNuevoFichero conTip" title="close"></div>';
	echo '<form id="formPicture'.$surname.'"  class="imagenLocalizada mainForm" enctype="multipart/form-data" action="'.$action.'" method="post" class="mainForm">';
	echo '<div class="mensajeFormPicture"></div>';
	echo '<div>Please select the picture file now</div>';
	formularioStandard('Files', array('Link'), 0,FALSE, TRUE);
	echo '<input class="oculto" type="text" name="Tabla"/><input class="oculto" type="text" name="IdTabla"/>
	<input class="oculto" type="text" name="XPos"/><input class="oculto" type="text" name="YPos"/>
	<input class="oculto" type="text" name="View"/><input class="oculto" type="text" name="ZPos"/>
	<input class="oculto" type="text" name="Geo"/><input class="oculto" type="text" name="Version" value="1"/>';
	echo '<div class="botonFichero botonSubmit">UPLOAD</div>';
	echo '</form>';
	echo '</div>';
}

function formularioNuevaImagenGeneralDetalle($action,$surname='')
{
	echo'<div id="botonNewPicture" class="botonAdd conTip nuevoFichero showOnEdit" title="New picture"></div>';
	echo '<div class="areaNuevoFichero oculto">';
	echo '<div class="botonCerrar cerrarNuevoFichero conTip" title="close"></div>';
	echo '<form id="formPicture'.$surname.'"  class="imagenLocalizada mainForm" enctype="multipart/form-data" action="'.$action.'" method="post" class="mainForm">';
	echo '<div style="margin-left:5px;">This picture is for:</div>';
	echo '<div><span style="padding-left:10px;"></span><input type="radio" name="View" value="general" checked>General view';
	echo '<br/><span style="padding-left:10px;"></span><input type="radio" name="View" value="detail" >Detail<br/><br/></div>';
	echo '<div>Please select the picture file now</div>';
	formularioStandard('Files', array('Link'), 0,FALSE, TRUE);
	echo '<input class="oculto" type="text" name="Tabla"/><input class="oculto" type="text" name="IdTabla"/>';
	echo '<input class="oculto" type="text" name="Version" value="1"/>';
	echo '<div class="botonFichero botonSubmit">UPLOAD</div>';
	echo '</form>';
	echo '</div>';
}
	
function writeDocumentos($tabla, $id,$editMode=FALSE,$unicoId=0) 
{
global $pdo;
global $pathBase;
if ($unicoId==0)
{
echo '<div class="espacioNuevoDoc" id="espacioNuevoDoc0" num="0"></div>';
$where="`Tabla`='".$tabla."' and IdTabla=".$id;
}
else
{
$where="`Id`=".$unicoId;
}
$query="SELECT  `Id`, `Description`, DATE_FORMAT(`Date`,'%d/%m/%Y %H:%i') as `UploadDate`,`Link` from Files where ".$where." order by `Date` DESC";
/*$rs = mysql_query($query);
while ($obj = mysql_fetch_object($rs))*/
$rs = $pdo->prepare($query);
$rs->execute();
while ($obj=$rs->fetch(PDO::FETCH_OBJ))
	{
	$extension=strtolower(end(explode(".", $obj->Link)));
	echo '<div class="lineaFichero baseElemento" id="lineaFichero'.$obj->Id.'" documentoId="'.$obj->Id.'" >';
	
	/*
	//opcion de preview
	$query="select Id from Previews where Documento=".$obj->Id;
	$rs2=mysql_query($query);
	if ($obj2 = mysql_fetch_object($rs2))
		{
		echo '<div class="previewTool" title="Previsualizar" preview="'.$obj2->Id.'"></div>';				
			}
	*/
	if ($editMode)
		{
		echo '<form id="documentos'.$obj->Id.'" tablaForm="Files" idForm="'.$obj->Id.'" action="ajax/updateDocumentos.php" method="post" class="mainForm">';
		botonesForm('documentos'.$obj->Id);
			}
	echo'<div class="tipoFichero '.$extension.'"><strong><a class="tituloFichero';
	if ($editMode){echo ' editable';}
	echo'"';
	if ($editMode){echo ' tipo="varchar" campo="Description" ';}
	echo' target="_blank" href="'.$pathBase.$obj->Link.'">'.$obj->Description.'</a></strong>
	<span class="fechaFichero">'.$obj->UploadDate.'</span>';
	echo '<div class="lineaEtiquetas">';
	if ($editMode){echo '<label class="editable " tipocontrol="controlEtiquetas" for="Etiquetas"></label><div class="grupoInputs"><div class="actuales">';}
	else{
	echo'<span class="tagsFichero">';}
	writeTags('Files',$obj->Id,"med");
	if ($editMode){echo '</div></div></div><div class="clear"></div></div><div class="mensaje oculto"></div></form></div>';}
	else{
	echo '</span></div></div></div>';}
			
	}
}

function selectfield($optionsarray, $selected = "") {
  $returnval = "";
  $i=0;
  foreach ($optionsarray as $field=>$value) {
  	if ($i++==0)
  	{$clase="primerOption";}
  	else {
  		$clase="miOption";}
	$valueRef=$value;
	$textvalue=$value;
	if (is_array($value))
		{
		$valueRef=$value[0];
		$textvalue=$value[0];
		if (count($value)>1)
			{
			$textvalue=$value[1];
			}
		}
    if ($valueRef == $selected) {
      $returnval .= "<option class='".$clase."' selected='selected' value='" . $valueRef . "'>" . $textvalue . "</option>\n";
    } else {
      $returnval .= "<option class='".$clase."' value='" . $valueRef . "'>" . $textvalue . "</option>\n";
    }
  }
  
  return $returnval;
}

function selectFromArray($optionsarray, $selected = "") {
  $returnval = "";
  $i=0;
  foreach ($optionsarray as $value) {
  	if ($i++==0)
  	{$clase="primerOption";}
  	else {
  		$clase="miOption";}
    if ($value == $selected) {
      $returnval .= "<option class='".$clase."' selected='selected' value='" . $value . "'>" . $value . "</option>";
    } else {
      $returnval .= "<option class='".$clase."' value='" . $value . "'>" . $value . "</option>";
    }
  }
  
  return $returnval;
}

//query tiene que tener dos valores, el primero para value y el segundo para el texto 
function selectFromQuery($query, $selected = "") {
	global $pdo;
  $returnval = "";
  $i=0;
  /*$rs=mysql_query($query);
  while ($arr=mysql_fetch_array($rs,MYSQL_NUM))*/
	$rs = $pdo->prepare($query);
	$rs->execute();
	while ($arr=$rs->fetch(PDO::FETCH_NUM))
	{
  	if ($i++==0)
  	{$clase="primerOption";}
  	else {
  		$clase="miOption";}
    if ($arr[1] == $selected) {
      $returnval .= "<option class='".$clase."' selected='selected' value='" . $arr[0]. "'>" . $arr[1] . "</option>";
    } else {
      $returnval .= "<option class='".$clase."' value='" . $arr[0] . "'>" . $arr[1] . "</option>";
    }
  }
  
  return $returnval;
}


function botonesForm($formulario)
{
	echo '

<div class="controlesFormulario controlesIniciales" formulario="'.$formulario.'">
					<div class="controlFormulario botonEditar edicion conTip" formulario="'.$formulario.'" title="edit" alt="edit"></div>		
					<div class="controlFormulario botonBorrar borrado conTip" formulario="'.$formulario.'" title="delete" alt="delete"></div>	
					<div class="clear"></div>
				</div>
<div class="controlesFormulario controlesFinales" formulario="'.$formulario.'">
					<div class="controlFormulario botonGuardar guardado conTip" formulario="'.$formulario.'" title="save" alt="save"></div>
					<div class="controlFormulario botonCancelar cancelado conTip" formulario="'.$formulario.'" title="cancel" alt="cancel"></div>
					<div class="clear"></div>
				</div>';
}

//v1.0 new
function datoRelacionado($tabla,$id,$campoRelacion,$tablaOrigen,$campoOrigen,$nombre,$link,$campoRelacionOrigen='Id',$labels=true)
{
global $pdo;
$query="select a.Id,a.".cleanTableName($campoOrigen)." from ".cleanTableName($tablaOrigen)." a inner join ".cleanTableName($tabla)." b on a.".cleanTableName($campoRelacionOrigen)."=b.".cleanTableName($campoRelacion)." where b.Id=:id";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id);
$rs->execute(); 
$valores = get_object_vars($rs->fetch(PDO::FETCH_OBJ));
$tipos=tipoCampos($tablaOrigen);


$value=$campoOrigen;
$tipo=$tipos[$value];

$link1='';
$link2='';
if ($link!='')
	{$link=str_replace(':id',$valores ['Id'],$link);
	$link1='<a href="'.$link.'">';
	$link2='</a>';
	}
echo '<div id="linea'.$nombre.$id.'" class="lineaInputs">';
if ($labels){echo '<label for="'.$nombre.$id.'">'.procesarTitulo($nombre).'</label>';}
echo '<div class="grupoInputs">';
$valor=$valores[$value];
if	((strpos($tipo,"date") === 0) && $valor=='00/00/0000')
	{$valor='';}

switch(true)
{
	default:
	echo '<span class="datos"';
	echo ' campo="'.$value.'" tipo="'.$tipo.'" ';
	echo '>'.$link1.$valor.$link2.'</span>';
	break;
}	
	
echo '</div><div class="clear"></div></div>';	
	
}


function soloDatos($tabla, $campos, $id, $labels=TRUE,$editMode=FALSE,$editableFields=array())
{
global $pdo;
$query=selectClause($tabla, $campos)." from ".$tabla." where Id=:id";

$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id);
$rs->execute(); 
$valores = get_object_vars($rs->fetch(PDO::FETCH_OBJ));
$tipos=tipoCampos($tabla);

$editClass="";
if ($editMode){$editClass="editable";}

foreach ($campos as $value)
{	
	$fieldEditClass=$editClass;
	if (array_key_exists($value,$editableFields))
		{
		if (!$editableFields[$value])
			{$fieldEditClass="";}
		}
	if (mostrarCampo($value))
	{
	$tipo=$tipos[$value];
	echo '<div id="linea'.$value.$id.'" class="lineaInputs">';
	if ($labels){echo '<label for="'.$value.$id.'">'.procesarTitulo($value).'</label>';}
	echo '<div class="grupoInputs">';
	$valor=$valores[$value];
	if	((strpos($tipo,"date") === 0) && $valor=='00/00/0000')
		{$valor='';}
	
	switch(true)
	{
		default:
		echo '<span class="datos '.$fieldEditClass.'"';
		echo ' campo="'.$value.'" tipo="'.$tipo.'" ';
		echo '>'.$valor.'</span>';
		break;
	}	
	$condicion=false;
	if ($fieldEditClass=='editable'){$condicion=true;}
	if (isset($valores)){escribirSimbolo($value, $tipos, $campos, $valores,$condicion);}	
		
	echo '</div><div class="clear"></div></div>';
	}
}
}

function soloMenus($tabla, $campos, $labels=TRUE)
{
$tipos=tipoCampos($tabla);

$editClass="editable";

foreach ($campos as $value)
{	
	if (mostrarCampo($value))
	{
	$tipo=$tipos[$value];
	echo '<div id="linea'.$value.'" class="lineaInputs">';
	if ($labels){echo '<label for="'.$value.'">'.procesarTitulo($value).'</label>';}
	echo '<div class="grupoInputs">';
	$valor="";
	switch(true)
	{
		default:
		echo '<span class="datos '.$editClass.'"';
		echo ' campo="'.$value.'" tipo="'.$tipo.'" ';
		echo '>'.$valor.'</span>';
		break;
	}	
		
	echo '</div><div class="clear"></div></div>';
	}
}
}

//v1.0 modified
function formularioNuevoElemento($tabla, $campos, $target,$size='side',$button=true)
{	
	$formClass='';
	$labels=true;
	if ($size=='side')
		{
		$formClass='sideForm';
		$labels=false;
		}
	echo '<form id="nuevo'.$tabla.'" tabla="'.$tabla.'" action="'.$target.'" method="post" class="'.$formClass.'">';
	formularioStandard($tabla, $campos, 0,$labels);
	if ($button){echo '<div class="lineaInputs"><input type="submit" value="New" class="submit" /></div>';}
	echo '</form>';
	}

function formularioStandard($tabla, $campos, $id,$labels=TRUE,$allowCapture=FALSE)
{
global $pdo;
if ($id!=0)
	{
		$query=selectClause($tabla, $campos)." from ".$tabla." where Id=".$id;
		/*$rs = mysql_query($query);
		$valores = get_object_vars(mysql_fetch_object($rs));*/
		$rs = $pdo->prepare($query);
		$rs->execute(); 
		$valores = get_object_vars($rs->fetch(PDO::FETCH_OBJ));
		}

$tipos=tipoCampos($tabla);

foreach ($campos as $value)
{	
	if (mostrarCampo($value))
	{
	echo '<div id="linea'.$value.$id.'" class="lineaInputs">';
	if ($labels){generarEtiqueta($value, $id);}
	echo '<div class="grupoInputs">';	
	
	if ($id!=0)
	{$valor=$valores[$value];}
	else {$valor="";}


	generarControl($valor,$id,$value,$tipos[$value],$allowCapture);
	
	//<span class="oculto datos editable" campo="'.$value.'" tipo="'.$tipos[$value].'"></span> no inicia bien el formulario
	
	if (isset($valores)){escribirSimbolo($value, $tipos, $campos, $valores,true);}	
	
	echo '</div><div class="clear"></div></div>';
	}
	}
	
	}

function generarEtiqueta($campo, $id)
{
echo '<label for="'.$campo.$id.'">'.$campo.'</label>';
	}

function generarControl($valor,$id,$campo,$tipo,$allowCapture=FALSE)
{
	if ($id!=0)
	{
		if	((strpos($tipo,"date") === 0) && $valor=='00/00/0000')
		{$valor='';}
	}	
	
	switch(true)
	{
	case 	(strpos($tipo,"enum") === 0):
	$s=$tipo;
	$codigo=str_replace("enum", "array", $s);
	$codigo="\$selectValues=".$codigo.';';
	eval($codigo);
	
	echo '<select id="'.$campo.$id.'" name="'.$campo.'">';
		
	echo selectfield($selectValues,$valor);
	echo '</select>';
	
	break;
	
	case 	((strpos($tipo,"int") === 0)||(strpos($tipo,"smallint") === 0)):
	$clase="number validate-integer";
	echo '<input type="text" class="'.$clase.'" title="'.$campo.'" name="'.$campo.'" id="'.$campo.$id.'" value="'.htmlspecialchars($valor).'"></input>';
	break;	
	case 	(esDecimal($tipo)):
	$clase="number validate-numeric";
	echo '<input type="text" class="'.$clase.'" title="'.$campo.'" name="'.$campo.'" id="'.$campo.$id.'" value="'.htmlspecialchars($valor).'"></input>';
	break;
	default:
	$clase="inputText";
	if ($campo=='Link')
	{
	if ($allowCapture)
		{echo '<input  type="file" accept="image/*" capture="camera"  title="'.$campo.'" name="'.$campo.'" id="'.$campo.$id.'" ></input>'; }
	else
		{echo '<input  type="file" title="'.$campo.'" name="'.$campo.'" id="'.$campo.$id.'" ></input>'; }
		}
	else
	{
	if (strpos($campo,"Mail") > -1)
	{$clase.=" validate-email";}
	echo '<input type="text" class="'.$clase.'" title="'.$campo.'" name="'.$campo.'" id="'.$campo.$id.'" value="'.htmlspecialchars($valor).'"></input>'; 
	break;
	}	
	}	
	}

?>