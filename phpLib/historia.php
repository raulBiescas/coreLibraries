<?php
/*Se necesita que el contenedor superior tenga la clase contenedorGlobalHistoria*/

/*!
 * historia.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 historia.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function allHistory($tabla, $id, $editMode=true,$files=true, $tags=true,$images=true)
{
global $pdo;
$clasesExtra='';
if ($files)
	{$clasesExtra.=' soporteFicheros';}
if ($images)
	{$clasesExtra.=' soporteImagenes';}	
if ($editMode)
{
	formularioNuevoDocumento('History', 0, 'ajax/fileHistory.php');
	}
echo '<div class="contenedorHistoria'.$clasesExtra.'" table="History">';
echo '<div class="ampliacionTotalHistoria conTip" title="Full screen"></div>';
if ($editMode)
	{
	echo '<div class="cabeceraHistoria showOnEdit">';
		echo '<form id="nuevoPost'.$tabla.$id.'"  action="ajax/newEntry.php" method="post" formId="'.$id.'" class="mainForm">';
		echo '<div class="botonAdd conTip newEntry" title="New entry"></div>';
		formularioStandard('History', array('Title'), 0,FALSE);
		echo '<input type="text" class="oculto" name="Tabla" value="'.$tabla.'"></input>';
		echo '<input type="text" class="oculto" name="IdTabla" value="'.$id.'"></input>';
		echo '<input type="text" class="oculto" name="Format" value="History"></input>';
		echo '</form>';
	echo '</div>';//cabeceraHistoria
	
	echo '<div class="nuevaHistoria" id="nuevaHistoria'.$id.'"></div>';
	}	

$query="select Id from History where Tabla=:tabla and IdTabla=:id order by Created DESC";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id,PDO::PARAM_INT);
$rs->bindValue(':tabla',$tabla);
$rs->execute(); 
$res=$rs->fetchAll(PDO::FETCH_NUM);
$rs->closeCursor();
foreach ($res as $arr)
	{
	displayHistory($arr[0],$editMode,$files,$tags,$images);	
	}

echo '</div>';//contenedorHistoria	

}

function displayHistory($id,$editMode, $files=true, $tags=true,$images=true,$table='History')
{
global $pdo;
$extraField='';
if ($table=='Chapters')
	{
	$extraField=',`Index`';
	}
$query="SELECT  `Id`, `Title`, `Text`, DATE_FORMAT(`Created`,'%d/%m/%Y') as `Created`".$extraField." from `".$table."` where Id=:id";
$rs = $pdo->prepare($query);
$rs->bindValue(':id',$id,PDO::PARAM_INT);
$rs->execute(); 
$res=$rs->fetch(PDO::FETCH_NUM);
$rs->closeCursor();
$clasesExtra='';
if ($files)
	{$clasesExtra.=' contenedorFicheros';}
if ($images)
	{$clasesExtra.=' contenedorImagenes';}	
echo '<div id="bloqueHistoria'.$table.$id.'" historia="'.$id.'" class="bloqueHistoria baseElemento '.$clasesExtra.' '.$table.'Block'.'">';
if ($editMode)
	{
	echo '<form id="historia'.$id.'" tablaForm="'.$table.'" idForm="'.$id.'" action="ajax/updateHistoria.php" method="post" class="mainForm">';
	botonesForm('historia'.$id);
	}
	echo '<div id="supHist'.$table.$id.'" class="superiorHistoria">';
		echo '<div class="fechaHistoria">'; 
			$ocultarFecha='';
			if ($table=='Chapters')
				{
				echo '<span class="indexChapter" chapterNumber="'.$res[4].'">'.$res[4].'</span>';
					$ocultarFecha='oculto';
				}
			echo '<span class="'.$ocultarFecha.'">';
				soloDatos($table,array('Created'),$id,FALSE,FALSE);//sin edicion, javascript trunca hora y muestra solo fecha
			echo '</span>';
		echo '</div>';
		echo '<div class="tituloHistoria">'; 
			soloDatos($table,array('Title'),$id,FALSE,$editMode);
		echo '</div>';
		echo '<div class="clear"></div>';
	echo '</div>';//superiorHistoria
	echo '<div class="medioHistoria">';
		echo '<div class="botonesMostrar">';
			echo '<div class="botonMostrar conTip" title="show"></div><div class="botonOcultar oculto conTip" title="hide"></div>';
		echo '</div>';//botonesMostrar
		if ($tags)
			{
			echo '<div class="tagsHistoria"><div class="lineaEtiquetas">';
			if ($editMode){echo '<label class="editable oculto " tipocontrol="controlEtiquetas" for="Etiquetas"></label><div class="grupoInputs"><div class="actuales">';}
			else
				{echo'<span class="tagsFichero">';}
			writeTags($table,$id,"med");
			if ($editMode){echo '</div></div></div></div>';}
			else
				{echo '</span></div></div>';}
			}
		if ($files)
			{
			echo '<div class="numFiles">';
				echo '<span class="fondoNumFiles"></span>';
			echo '</div>';//numFiles
			}
		if ($images)
			{
			echo '<div class="numPictures">';
				echo '<span class="fondoNumPictures"></span>';
			echo '</div>';//numPictures
			}
		if ($editMode && ($files || $images))
			{
			echo '<div class="botonAdd showOnEdit conTip nuevoFicheroHistoria" historia="'.$id.'" title="New file/picture"></div>';
			}
		echo '<div class="clear"></div>';
	echo '</div>';//medioHistoria
	echo '<div class="inferiorHistoria"><div style="width:100%;">';
	echo '<div class="ficherosHistoria">';
		if ($files)
			{
			/*if ($editMode)
			{echo '<div class="lineaNFicheroHistoria showOnEdit"><span class="nuevoFicheroHistoria" historia="'.$id.'">New file</span></div>';}*/
			writeDocumentos($table, $id);
			}
	echo '</div>';
	echo '<div style="float:left;" class="textoHistoria textoFormateado">';
		soloDatos($table,array('Text'),$id,FALSE,$editMode);
	
	echo '</div></div>';
	echo '<div class="clear"></div>';
	if ($images)
		{
		echo '<div class="thumbGalleryHistory" id="gallery'.$id.'" tablaDatos="tablaPictures'.$id.'">';
		writePictures($table, $id);
		echo '</div>';
		}
	
	//espacio para last updated
	
	echo '</div>';//inferiorHistoria
	if ($editMode)
		{echo '<div class="mensaje"></div></form>';}
echo '</div>';//bloqueHistoria


}

function replaceFile()
{

}

function deleteFile()
{
	
}

function getFileVersions()
{
		
}	


function copyFile()
{
}

function getCopiedFiles()
{
}

function pasteFile()
{
	
}

function loadTechnologyLibrary()
{

}








?>