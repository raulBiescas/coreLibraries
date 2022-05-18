<?php


/*!
 * funcionesFecha.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 funcionesFecha.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

date_default_timezone_set('Europe/London');

function tiemposRespuesta($id)
{
global $pdo;
$query="select RepairSLA, ResponseSLA, Raised, Attendance, ArrivedOnSite, FaultFixed, ResponseTime, RepairTime from Tasks where Id=".$id;
/*$rs=mysql_query($query);
$arr=array();
$arr=mysql_fetch_array($rs,MYSQL_NUM);*/
$rs = $pdo->prepare($query);
$rs->execute(); 
$arr = $rs->fetch(PDO::FETCH_NUM);
if (($arr[0]=='Agreed Attendance') || ($arr[0]=='FCD'))
	{
	$referencia=3;
	}
else
	{
	$referencia=2;
	}
$tiempoRespuesta='not set';
$tiempoReparacion='not set';
if (strpos($arr[$referencia],"00") !== 0)
	{
	if (strpos($arr[4],"00") === 0)
		{
		$tiempoRespuesta=tiempoPasado(strtotime($arr[$referencia]));
		}
	else
		{
		$tiempoRespuesta=formatoTiempo($arr[6]);
		}
	if (strpos($arr[5],"00") === 0)
		{
		$tiempoReparacion=tiempoPasado(strtotime($arr[$referencia]));
		}
	else
		{
		$tiempoReparacion=formatoTiempo($arr[7]);
		}
	}

return array($tiempoRespuesta, $tiempoReparacion);

}


function tiempoPasado($timestamp)
{
	return formatoTiempo(time()-$timestamp);
	}

function formatoTiempo($timestamp)
{	
	$signo='';
	if ($timestamp<0)
	{
	$signo='-';
	$timestamp=$timestamp*(-1);
	}
	$horas=floor($timestamp/3600);
	$minutos=floor(($timestamp-($horas*3600))/60);
	if ($minutos<10)
		{$minutos='0'.$minutos;}
	return $signo.$horas.':'.$minutos;	
	}

function formatoFecha($timestamp)
{
	return date("d.m.Y H:i", $timestamp);	
	}
	?>
	
