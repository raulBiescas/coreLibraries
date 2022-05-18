<?php

/*!
 * etiquetas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 etiquetas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function getEtiquetas($tabla)
{
global $pdo;
$tagsOrdenados=array();
$tagsFrecuentes=array();

$query="SELECT count(`Id`) as cuenta, `Tag` from Tags where `Tabla`='".$tabla."' group by `Tag` order by cuenta DESC";
/*$rs = mysql_query($query);
while ($obj = mysql_fetch_object($rs))*/
$rs = $pdo->prepare($query);
$rs->execute();
while ($obj=$rs->fetch(PDO::FETCH_OBJ))
{
$tagsFrecuentes[]=$obj->Tag;
	}
	
$tagsOrdenados=unserialize(serialize($tagsFrecuentes));
sort($tagsOrdenados);

$result=array();
	
foreach ($tagsOrdenados as $value)
	{
		$pos=array_search($value, $tagsFrecuentes);
		$pos1=$pos/count($tagsFrecuentes);
		if ($pos1>0.66)
		{$tam="min";}
		else 
			{
				if ($pos1>0.33)
				{$tam="med";}
				else {$tam="max";}
			}
		$result[]=array($value,$tam);
	}

return $result;
}


?>