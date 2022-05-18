<?php

/*!
 * calendar.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 calendar.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function createCalendar($type,$visible,$startDate)
{
//type is only weekly by now
$currentDay=$startDate;
echo '<div class="calendarContainer" visible="'.$visible.'">';
	echo '<div class="calendarControls"><div class="calendarBackward">previous week</div><div class="calendarGoTo"></div><div class="calendarForward">next week</div></div>';//add go to control
	echo '<div class="loadArea oculto"></div>';
	echo '<div class="calendarBody">';
		$i=0;
		$heightDivision=floor(90/($visible*1));
		$height=$heightDivision-1;
		$baseHeight=10;
		$baseLeft=9;
		$widthDivision=13;
		$dayIndex=0;
		while ($i<$visible)
			{
				
			$weekNumber=date("W",strtotime($currentDay));
			$year=date("Y",strtotime($currentDay));
			echo '<div class="calendarWeekLine" week="'.$weekNumber.'" year="'.$year.'" pos="'.$i.'" style="height:'.$height.'%;top:'.($baseHeight+($i*$heightDivision)).'%;">';
			echo '<div class="calendarWeekInfo" week="'.$weekNumber.'" year="'.$year.'"><div class="weekInfoTitle">Week: '.$weekNumber.'<br/>'.$year.'</div></div>';
			$j=0;
			while ($j<7)
				{
				$dayClass='labourDay';
				if ($j>4){$dayClass='weekendDay';}
				echo '<div class="calendarDay '.$dayClass.'" dayIndex="'.$dayIndex.'" day="'.$currentDay.'" style="left:'.($baseLeft+($j*$widthDivision)).'%;">';
					echo '<div class="calendarDayTitle">'.date("D M j",strtotime($currentDay)).'</div>';
					echo '<div class="calendarDayBody"></div>';
				echo '</div>';
				$dayIndex++;
				$j++;
				$currentDay=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay))+1,date('Y',strtotime($currentDay))));
				}
			echo '</div>';
			$i++;
			}
	echo '</div>';
echo '</div>';
}


function calendarDaysInfo($startDate,$shift)
{
$currentDay=date('Y-m-d',strtotime($startDate.' '.$shift));
//needs to receive type of calendar and number of elements
$visible=3;
$i=0;
$dayIndex=0;
$parents=array();
$elements=array();
while ($i<$visible)
	{
	$weekNumber=date("W",strtotime($currentDay));
	$year=date("Y",strtotime($currentDay));
	$parents[]=$weekNumber.';'.$year;
	$j=0;
	while ($j<7)
		{
		$elements[]=$currentDay.';'.date("D M j",strtotime($currentDay));
		$j++;
		$currentDay=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay))+1,date('Y',strtotime($currentDay))));
		}
	$i++;
	}
$response='<div class="parents">'.implode('#/#',$parents).'</div>';	
$response.='<div class="elements">'.implode('#/#',$elements).'</div>';
return $response;
	
}


?>