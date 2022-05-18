<?php

/*!
 * crearDocumento.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 crearDocumento.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once "sql.php";
include_once "database.php";
include_once "funciones.php";

$tablaDoc="Files";
$baseDir="/var/www/html/3Rings/files/";
//$baseDir="/var/www/vhosts/files/";//para pruebas en local
$resultadoDoc='';

if (array_key_exists('Tabla', $_POST))
{
	$tablaDestino=$_POST['Tabla'];
	$idTablaDestino=$_POST['IdTabla'];
	switch($tablaDestino) {
	case 'POs':
	$query="select Budget from `POs` where Id=".$idTablaDestino;
	/*$rs1=mysql_query($query);
	$arr=mysql_fetch_array($rs1, MYSQL_NUM);*/
	$rs = $pdo->prepare($query);
	$rs->execute(); 
	$arr=$rs->fetch(PDO::FETCH_NUM);
	$query="select Country, Year, Budget  from `Budgets` where Id=".$arr[0];
	/*$rs1=mysql_query($query);
	$arr=mysql_fetch_array($rs1,MYSQL_NUM);*/
	$rs = $pdo->prepare($query);
	$rs->execute(); 
	$arr=$rs->fetch(PDO::FETCH_NUM);
	array_unshift($arr,'Budgets');
	$uploaddir=crearRecursivamente($baseDir, $arr);
	
	case 'History':
	$query="select Tabla,IdTabla, DATE_FORMAT(Created,'%Y.%m') from `History` where Id=".$idTablaDestino;
	/*$rs1=mysql_query($query);
	$arr=mysql_fetch_array($rs1, MYSQL_NUM);*/
	$rs = $pdo->prepare($query);
	$rs->execute(); 
	$arr=$rs->fetch(PDO::FETCH_NUM);
		switch($arr[0])
			{
			case 'Contracts':
			$query="select Country, Service  from `Contracts` where Id=".$arr[1];
			/*$rs1=mysql_query($query);
			$arrFinal=mysql_fetch_array($rs1,MYSQL_NUM);*/
			$rs = $pdo->prepare($query);
			$rs->execute(); 
			$arrFinal=$rs->fetch(PDO::FETCH_NUM);
			array_unshift($arrFinal,'Contracts');
			$arrFinal[]='History';
			$arrFinal[]=$arr[2];
			$uploaddir=crearRecursivamente($baseDir, $arrFinal);
			break;
			}
	break;
	default:$uploaddir = "uploads/";
	break;
	}
}
else{$uploaddir = "uploads/";}

if (!is_dir($baseDir.$uploaddir))
{
	mkdir($baseDir.$uploaddir);
	chmod($baseDir.$uploaddir,0777);
}

if (array_key_exists('Link', $_FILES))
	{
 	$uploadfile = $uploaddir . basename($_FILES['Link']['name']);
 	$error = $_FILES['Link']['error'];
 	$subido = false;
 	if( $error==UPLOAD_ERR_OK) { 
   	$subido = copy($_FILES['Link']['tmp_name'], $baseDir.$uploadfile); 
  	} 
   if($subido) { 
   	include_once 'actualizarDatos.php';
	 	$idDoc=create($tablaDoc);
	 	$_POST['Link']=str_replace(' ','%20',$uploadfile);
	 	update($tablaDoc, $idDoc, $_POST);
    $resultadoDoc.= "Upload successfull"; 
   } else {
    $resultadoDoc.= "Error: ".$error;
  }
	}
	else {$resultadoDoc.= 'Error when uploading';}

function crearRecursivamente($baseDir, $path)
{
$ruta='';
foreach ($path as $folder)
	{
	$folder=cleanFileName($folder);
	if (strlen($folder)>20)
		{
		$folder=substr($folder,0,20);
		}
	$ruta.=$folder.'/';
	if (!is_dir($baseDir.$ruta))
		{
		mkdir($baseDir.$ruta);
		chmod($baseDir.$ruta,0777);
		}
	}
	return $ruta;
}

?>