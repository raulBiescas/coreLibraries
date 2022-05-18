<?php

/*!
 * lineaTiempos.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 lineaTiempos.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

//valores: 0:id, 1:texto, 2:titulo, 3:tipo, 4:fecha, 5:diasAño
function lineaTiempos($year,$years,$values)
{
$i=0;	
$j=0;
while ($j<$years)
	{
		echo '<div class="bloqueAño" año="'.$year.'"><div class="tituloAño">'.$year.'</div><div class="bloqueTiempos"><div class="lineaMomentos">';
		
		$siguiente=false;
		while (!$siguiente)
			{
			if ($i<count($values))
				{
				$fecha=$values[$i][4];
				if ((substr($fecha,0,4)*1)<$year)
					{$i++;}
				else
					{
					if ((substr($fecha,0,4)*1)==$year)
						{
						$diaFin=substr($values[$i][4],8,2).'/'.substr($values[$i][4],5,2);
						echo '<div class="momento conTip '.$values[$i][3].'" momento="'.$values[$i][0].'" title="'.$diaFin.':'.htmlentities($values[$i][1],ENT_QUOTES,"UTF-8").'" dia="'.$values[$i][4].'" dias="'.$values[$i][5].'"><a href="contract.php?id='.$values[$i][0].'">'.$values[$i][2].'</a><div class="iconoMomento"></div><div class="union"></div></div>';
						$i++;
						}
					else
						{
						$siguiente=true;
						}
					}
				}
			else
				{
				$siguiente=true;
				}
			}
			
		echo '</div><div class="lineaPeriodos">';
		//barra para fechas
		
		//barra de trimestres y meses		
		$m=1;
		$fechaRef=date_create('2013-01-01');
		echo '<div class="adjustMonths">&nbsp;</div>';
		while ($m<13)
			{
			echo '<div class="monthBar">'.date('M',$fechaRef->getTimestamp()).'</div>';
			date_add($fechaRef, date_interval_create_from_date_string('1 month'));
			$m++;
			}

		echo	'</div></div></div>';	
	$j++;
	$year++;
	}
}

?>