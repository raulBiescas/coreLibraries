<?php

/*!
 * tablas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 tablas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */


include_once 'sql.php';
include_once "formularios.php";
include_once "funcionesRepresentacion.php";

//el primer campo de la consulta es para el indice de las filas, no se representa

function tablaFiltroOrden($tabla, $campos, $filtro, $orden, $editMode=FALSE)
{
		$tipos=tipoCampos($tabla);		
		array_unshift($campos,'Id');
		$query=selectClause($tabla, $campos)." from `".$tabla."`";
		if ($filtro!='')
			{
			$query.=' where ' . $filtro;
			}
		if ($orden!='')
			{
			$query.=' order by ' . $orden[0].' '. $orden[1];
			}
		array_shift($campos);
		return(tablaCompleta($tabla,$campos,$tipos,$query,$editMode));
}

function tablaStandard($tabla, $campos,$editMode=FALSE)
{
					
		$tipos=tipoCampos($tabla);		
		array_unshift($campos,'Id');
		$query=selectClause($tabla, $campos)." from `".$tabla."`";
		array_shift($campos);
		return(tablaCompleta($tabla,$campos,$tipos,$query,$editMode));
}

function tablaFromQuery($nombre, $query)
{
	$res=descifrarQuery($query);
	array_shift($res[0]);
	return(tablaCompleta($nombre,$res[0],$res[1],$query,false));
	
	}

function tablaCompleta($tabla,$campos,$tipos,$query,$editMode)
{		
		global $pdo;
		if ($editMode){echo '<form id="formulario'.$tabla.'" tablaForm="'.$tabla.'" idForm="0" action="ajax/update.php" method="post">';}
		echo '<table id="'.$tabla.'"><thead><tr>';
		
		$contador=0;
		$extraFields=array();
		foreach ($campos as $value)			
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
	
		if (mostrarCampo($value))
		{echo '<th parser="'.$parser.'" campo="'.$value.'">'.procesarTitulo($value).'</th>';}
		
		$contador++;
					
			}
		
		echo '</tr></thead><tbody>';

		//$rs = mysql_query($query);
		$i=0;
		//while ($obj=mysql_fetch_object($rs))
		$rs = $pdo->prepare($query);
		$rs->execute(); 			
		while ($obj=$rs->fetch(PDO::FETCH_OBJ))
		{
			$valores = get_object_vars($obj);
			$id=array_shift($valores);
			echo '<tr linea="'.$id.'"';
			if ($editMode){echo ' class="baseElemento"';}
			echo'>';
			
			foreach ($extraFields as $extra)
			{
				$tipos[$extra[0]]=getTipoExtra($extra[0]);
				array_splice($valores,$extra[1],0,getExtra($extra[0],$tabla, $id));			
				}	
			
			foreach ($valores as $campo=>$value)		
				{
					if (is_numeric($campo))
						{$campo=$extraFields[$campo][0];}
					if (mostrarCampo($campo))
					{
					if	((strpos($tipos[$campo],"literal") === 0))
					{echo '<td campo="'.$campo.'">'.$value.'</td>';}
					else {
					if	((strpos($tipos[$campo],"date") === 0) && $value=='00/00/0000')
						{$value='';}
				echo '<td campo="'.$campo.'">';
				if ($editMode){echo '<span campo="'.$campo.'" tipo="'.$tipos[$campo].'" class="editable valor">';}
				else {echo '<span class="valor">';}			
				echo $value;
				echo '</span>';
				
				escribirSimbolo($campo, $tipos, $campos, $valores,$editMode);
				
				echo '</td>';
					}			
					}
					}
			if ($editMode){echo '<td class="columnaControles">
			<div class="controlesIniciales">
					<span class="separados"><img  class="boton edicionLinea" title="editar" alt="editar" src="styles/images/edit.png"/></span>
					<span class="separados"><img  class="boton borradoLinea" title="borrar" alt="borrar" src="styles/images/delete.png"/></span>					
				</div>
			<div class="controlesFinales">
					<span class="separados"><img  class="boton guardadoLinea" title="save" alt="save" src="styles/images/table_save.png"/></span>
					<span class="separados"><img   title="cancel" alt="cancel" class="boton canceladoLinea" src="styles/images/cancel.png"/></span>	
				</div><div class="oculto mensajeOculto"></div><div class="celdaMensaje"></div></td>';			
			}
			echo '</tr>';
			$i++;
		}
		
		echo '</tbody><tfoot></tfoot></table>';
		if ($editMode){echo '</form>';}
		return $i;
	}



?>