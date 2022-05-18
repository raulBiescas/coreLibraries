<?php

/*!
 * graficas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 graficas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

//$resultado is bi-dimensional array, first value for each element is the index
function tablaParaGrafica($valores,$titulos)
	{
	$thead='';
	foreach($titulos as $titulo)
		{
		$thead.='<th>'.$titulo.'</th>';
		}
	$thead='<thead><tr>'.$thead.'</tr></thead>';
	
	$tbody='';
	$tfoot='';
	
	foreach ($valores as $valor)
		{
		$tfoot.='<td>'.$valor[0].'</td>';
		array_shift($valor);
		$res='';
		foreach($valor as $val)
			{
			$res.='<td>'.$val.'</td>';
			}
		$tbody.='<tr>'.$res.'</tr>';
		}
	$tbody='<tbody>'.$tbody.'</tbody>';
	$tfoot='<tfoot><tr>'.$tfoot.'</tr></tfoot>';
	
	return $thead.$tbody.$tfoot;
	
	}

?>