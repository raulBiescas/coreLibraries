<?php

/*!
 * actualizarDatos.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 actualizarDatos.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once "sql.php";
include_once "funcionesFecha.php";
include_once "updateEtiquetas.php";

function create($tabla)
{
global $pdo;
$query="insert into ".cleanTableName($tabla)." () values ()";
$rs = $pdo->prepare($query);
$rs->execute(); 
return $pdo->lastInsertId();
}

function update($tabla, $id, $valores)
{
global $pdo;
$tipos=tipoCampos($tabla);

$updateClause="";
$filasCambiadas=0;

$valueClause="";
$processedValues=array();

foreach ($valores as $key => $value)
{	
	if (array_key_exists($key, $tipos))
		{
		$cleanField=cleanTableName($key);	
		$valueClause.=$cleanField.",";
		$processedValues[$key]=$value;
		$parameter=cleanSqlParameterName($key);
		$updateClause.=$cleanField." = :".$parameter.",";
		
		switch(true)
			{
				case 	(strpos($tipos[$key],"datetime") === 0):
				if ($value!='')
					{	
					//$updateClause.=$cleanField." = '".sqlTimestamp($value)."',";
					$processedValues[$key]=sqlTimestamp($value);
					}
				break;
				case 	(strpos($tipos[$key],"date") === 0):
				if ($value!='')
					{	
					//$updateClause.=$cleanField." = '".sqlDate($value)."',";
					$processedValues[$key]=sqlDate($value);
					}
				break;
				case 	(strpos($tipos[$key],"timestamp") === 0):
				if ($value!='')
					{	
					//$updateClause.=$cleanField." = '".sqlTimestamp($value)."',";
					$processedValues[$key]=sqlTimestamp($value);
					}
				break;
				/*case 	(strpos($tipos[$key],"int") === 0):
				if ($value!='')
					{$updateClause.=$cleanField." = ".$value.",";}
				break;
				case 	(strpos($tipos[$key],"small") === 0):
				if ($value!='')
					{$updateClause.=$cleanField." = ".$value.",";}
				break;
				default:
					$updateClause.=$cleanField." = '".addslashes($value)."',";
				break;	*/
			}				
		}
	else 
		{
		if ($key=='etiquetas')
			{
			$filasCambiadas+=updateEtiquetas($value, $tabla, $id);						
			}
		}
	}

$updateClause=substr($updateClause, 0, -1);
$valueClause=substr($valueClause, 0, -1);

$cleanTable=cleanTableName($tabla);

$query="select ".$valueClause." from ".$cleanTable." where `Id`=:id";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id);
$rs->execute(); 
$lastValue=$rs->fetch(PDO::FETCH_ASSOC);

$i=0;
$query="update ".$cleanTable." set ".$updateClause." where `Id`=:id";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id);
foreach($processedValues as $key => $value)
	{
	$rs->bindValue(':'.cleanSqlParameterName($key),$value);
	}
$rs->execute(); 
$filasCambiadas+=$rs->rowCount();
if ($rs->rowCount()>0)
	{
	if (function_exists('logQuery')){logQuery($tabla,$id,$query);}
	if (function_exists('postProcesado')){postProcesado($tabla,$id,$processedValues,$lastValue);}
	}

return $filasCambiadas;
}

?>