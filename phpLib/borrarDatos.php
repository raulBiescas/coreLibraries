<?php

/*!
 * borrarDatos.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 borrarDatos.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function borrar($tabla,$id)
{
global $pdo;
$filasCambiadas=0;

$query="SELECT  * from `".$tabla."` where Id=".$id;
/*$rs = mysql_query($query);
$arr = mysql_fetch_array($rs,MYSQL_ASSOC);*/
$rs = $pdo->prepare($query);
$rs->execute(); 
$arr=$rs->fetch(PDO::FETCH_ASSOC);


$query="delete  from `".$tabla."` where Id=".$id;
/*$rs = mysql_query($query);
$filasCambiadas+=mysql_affected_rows();*/
$rs = $pdo->prepare($query);
$rs->execute(); 
$filasCambiadas+=$rs->rowCount();

if ($filasCambiadas==1)
	{
	guardarBorrado($tabla,$arr);
	guardarQuery($tabla,$id,$query);
	//borrar documentos
	$query="SELECT * from `Files` where `Tabla`='".$tabla."' and `IdTabla`=".$id;
	/*$rs = mysql_query($query);
	while($arr = mysql_fetch_array($rs,MYSQL_ASSOC))*/
	$rs = $pdo->prepare($query);
	$rs->execute(); 
	while($arr=$rs->fetch(PDO::FETCH_ASSOC))
		{
		$idDoc=$arr['Id'];
		$query="delete from Files where Id=".$idDoc;
		/*mysql_query($query);		
		$filasCambiadas+=mysql_affected_rows();*/
		$rs = $pdo->prepare($query);
		$rs->execute(); 
		$filasCambiadas+=$rs->rowCount();
		guardarBorrado('Files',$arr);
		guardarQuery('Files',$idDoc,$query);
		
		$query="delete  from Tags where Tabla='Files' and IdTabla=".$idDoc;
		/*mysql_query($query);		
		$filasCambiadas+=mysql_affected_rows();*/
		$rs = $pdo->prepare($query);
		$rs->execute(); 
		$filasCambiadas+=$rs->rowCount();
		guardarQuery('Tags','0',$query);
			}
	
	//borrar Tags
	$query="delete  from Tags where Tabla='".$tabla."' and IdTabla=".$id;
	/*mysql_query($query);		
	$filasCambiadas+=mysql_affected_rows();*/
	$rs = $pdo->prepare($query);
	$rs->execute(); 
	$filasCambiadas+=$rs->rowCount();
	guardarQuery('Tags','0',$query);

	}
return $filasCambiadas;
}

function guardarBorrado($tabla,$arr)
{
global $pdo;
$query="insert into Deleted (`Table`,`Element`) values ('".$tabla."','".addslashes(serialize($arr))."')";
//mysql_query($query);
$rs = $pdo->prepare($query);
$rs->execute(); 
}

function guardarQuery($tabla,$id,$query)
{
if (function_exists('logQuery')){logQuery($tabla,$id,$query);}
}


?>