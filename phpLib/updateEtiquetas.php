<?php

/*!
 * updateEtiquetas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 updateEtiquetas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function updateEtiquetas($etiquetas, $tabla, $id)
{
global $pdo;
$filasCambiadas=0;
$nuevos1=explode(' ',trim($etiquetas));
$nuevos=array();
foreach ($nuevos1 as $val)
	{
	$nuevos[]=trim($val);
	}
$query="select Id, Tag from Tags where Tabla='".$tabla."' and IdTabla=".$id; 
$actuales=array();
$tagsSolo=array();

$rs = $pdo->prepare($query);
$rs->execute(); 			
while ($arr=$rs->fetch(PDO::FETCH_BOTH))

	{$actuales[]=$arr;
	$tagsSolo[]=$arr['Tag'];}

foreach ($actuales as $value)
{
if (array_search($value[1],$nuevos)===FALSE)
	{
		$query="delete from Tags where Id=".$value['Id']; 

		$rs = $pdo->prepare($query);
		$rs->execute(); 
		$filasCambiadas+=$rs->rowCount();	
		if (function_exists('logQuery')){logQuery('Tags',$value['Id'],$query);}
		}
	
	}

foreach ($nuevos as $value)
{
	if ((array_search($value,$tagsSolo)===FALSE) && ($value!=''))
	{	
		$query="insert into Tags (Tag, Tabla, IdTabla) values ('".$value."','".$tabla."',".$id.")";

		$rs = $pdo->prepare($query);
		$rs->execute(); 
		$filasCambiadas+=$rs->rowCount();
		$tagId=$pdo->lastInsertId();
		if (function_exists('logQuery')){logQuery('Tags',$tagId,$query);}
		}
	
	}

return $filasCambiadas;

	}
	
?>


