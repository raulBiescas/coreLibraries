<?php

/*Se necesita que el contenedor superior tenga la clase contenedorGlobalHistoria*/

/*!
 * books.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 books.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once 'historia.php';

function getBook($tabla, $id, $mainTag='', $editMode=true,$files=true, $tags=true,$images=true)
{
global $pdo;
$clasesExtra='';
if ($files)
	{$clasesExtra.=' soporteFicheros';}
if ($images)
	{$clasesExtra.=' soporteImagenes';}	
if ($editMode)
{
	formularioNuevoDocumento('Chapters', 0, 'ajax/fileHistory.php');
	}
echo '<div class="contenedorBook contenedorHistoria'.$clasesExtra.'" table="Chapters">';
echo '<div class="ampliacionTotalHistoria conTip" title="Book in full screen"></div>';
echo '<div class="bookIcon"></div>';
if ($editMode)
	{
	echo '<div class="cabeceraHistoria showOnEdit">';
		echo '<form id="nuevoPost'.$tabla.$id.$mainTag.'"  action="ajax/newEntry.php" method="post" formId="'.$id.'" class="mainForm">';
		echo '<div class="botonAdd conTip newEntry" title="New entry"></div>';
		formularioStandard('Chapters', array('Title'), 0,FALSE);
		echo '<input type="text" class="oculto" name="Tabla" value="'.$tabla.'"></input>';
		echo '<input type="text" class="oculto" name="Format" value="Chapters"></input>';
		echo '<input type="text" class="oculto" name="IdTabla" value="'.$id.'"></input>';
		echo '<input type="text" class="oculto" name="MainTag" value="'.$mainTag.'"></input>';
		echo '</form>';
	echo '</div>';//cabeceraHistoria
	
	echo '<div class="nuevaHistoria" id="nuevaHistoria'.$id.$mainTag.'"></div>';
	}	

$query="select Id from Chapters where Tabla=:tabla and IdTabla=:id and MainTag=:mainTag order by `Index` ASC";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id,PDO::PARAM_INT);
$rs->bindValue(':tabla',$tabla);
$rs->bindValue(':mainTag',$mainTag);
$rs->execute(); 
$res=$rs->fetchAll(PDO::FETCH_NUM);
$rs->closeCursor();
foreach ($res as $arr)
	{
	displayHistory($arr[0],$editMode,$files,$tags,$images,'Chapters');	
	}

echo '</div>';//contenedorHistoria	

}

?>