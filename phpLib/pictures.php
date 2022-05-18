<?php

/*!
 * pictures.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 pictures.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once 'tablasDiv.php';

function writePictures($tabla, $id)
{
global $pdo;
$tipos=tipoCampos('Pictures');
$query="select Id, `Path`, Thumbnail,Medium, FullSize, `Updated` from Pictures where Tabla='".$tabla."' and IdTabla=".$id." order by `Updated` DESC";
$campos=array('Id','Path', 'Thumbnail','Medium', 'FullSize', 'Updated');
echo '<div id="tablaPictures'.$id.'" class="tablaPictures oculto">';
tablaDivSoloLineas($tabla,$campos,$tipos,$query,false,array());
echo '</div>';

$rs = $pdo->prepare($query);
$rs->execute(); 				
while ($arr=$rs->fetch(PDO::FETCH_NUM))
	
	{
	echo '<img class="thumbGalleryItem" gallery="gallery'.$id.'" src="'.$arr[1].$arr[2].'" idPicture="'.$arr[0].'" title="'.$arr[5].'"></img>';
	}
}

function writePicture($id)
{
global $pdo;
echo '<div class="ajaxPicture" id="picture'.$id.'">';
$tipos=tipoCampos('Pictures');
$query="select Id, `Path`, Thumbnail,Medium, FullSize, `Updated`,Tabla,IdTabla from Pictures where Id=".$id;
$campos=array('Id','Path', 'Thumbnail','Medium', 'FullSize', 'Updated');


$rs = $pdo->prepare($query);
$rs->execute(); 				
$arr=$rs->fetch(PDO::FETCH_NUM);
tablaDivSoloLineas('Pictures',$campos,$tipos,$query,false,array());
echo '<img class="thumbGalleryItem" gallery="gallery'.$arr[7].'" src="'.$arr[1].$arr[2].'" idPicture="'.$arr[0].'" title="'.$arr[5].'"></img>';

echo '</div>';

}



?>