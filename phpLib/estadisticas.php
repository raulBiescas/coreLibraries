<?php
/*!
 * estadisticas.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 estadisticas.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function areaTotales($etiquetas)
{
echo '<div id="areaTotales" class="areaTotales">';
foreach($etiquetas as $etiqueta)
	{
	echo '<div class="lineaTotales">
	<div class="etTotales">'.separarMayuscula($etiqueta).'</div>
	<div class="espacioValorTotales"><span class="valorTotales" id="total'.$etiqueta.'"></span></div>
	</div>';
	}
echo '</div>';
}



function getStartEndPeriod($year,$period,$selectedPeriod)
{
$startDate='';
$endDate='';
	
switch($period)
	{
	case 'Quarter':
	case 'Quarterly':
		$q=substr($selectedPeriod,1,1)*1;
		$monthQuarter=1+(3*($q-1));
		if ($monthQuarter<10)
			{
			$monthQuarter='0'.$monthQuarter;
			}
		$startDate=$year.'-'.$monthQuarter.'-01';
		$endQuarter=($monthQuarter*1)+3;
		if ($endQuarter<10)
			{
			$endQuarter='0'.$endQuarter;
			}
		$endDate=$year.'-'.$endQuarter.'-01';
		if ($endQuarter==13)
			{
			$endDate=(($year*1)+1).'-01-01';	
			}
		break;
	case 'Month':
	case 'Monthly':
		if (!($selectedPeriod*1>0))
			{
			$months=array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
			$selectedPeriod=(array_search($selectedPeriod,$months))+1;
			}
		$startMonth=($selectedPeriod)*1;
		$endMonth=($selectedPeriod*1)+1;
		if ($startMonth<10)
			{
			$startMonth='0'.$startMonth;
			}
		$startDate=$year.'-'.$startMonth.'-01';
		if ($endMonth<10)
			{
			$endMonth='0'.$endMonth;
			}
		else
			{
			if ($endMonth==13)
				{
				$endMonth='01';
				$year++;
				}
			}
		$endDate=$year.'-'.$endMonth.'-01';
			
		break;
	case 'Week':
	case 'Weekly':
			$w=$selectedPeriod*1;
			$arr= getStartAndEndDate($w, $year);
			$startDate=$arr[0];
			$endDate=$arr[1];
		break;
	case 'Year':
	case 'Yearly':
			$startDate=$year.'-01-01';
			$endDate=($year+1).'-01-01';
		break;
	}	
return array($startDate,$endDate);
}


function getStartAndEndDate($week, $year)
{
$time = strtotime("1 January $year", time());
$day = date('w', $time);
$time += ((7*$week)+1-$day)*24*3600;
$return[0] = date('Y-m-d', $time);
$time += 7*24*3600;
$return[1] = date('Y-m-d', $time);
return $return;
}

function firstMonthDay($years)
{
$year= (date('Y')*1)-$years;
$month=(date('m')*1)+1;
if ($month==13){$month=1;}
$day='01';
return $year.'-'.$month.'-'.$day;
	
}

function statTableLine($title,$data, $last=false)
{
$class1='';
$class2='';
if ($last)
	{
		$class1='rounded-foot-left';
		$class2='rounded-foot-right';
	}
$html='<tr><td class="statTableLineHeader '.$class1.'">'.$title.'<td/>';
$i=1;
foreach ($data as $d)
	{
		if($i++==count($data))
			{$html.='<td class="'.$class2.'">'.$d.'</td>';}
		else
			{$html.='<td>'.$d.'</td>';}
	}

$html.='</tr>';
return $html;
}

function statTableTitle($labels)
{
$html='<tr><th class="rounded-company"><th/>';
$i=1;
foreach ($labels as $label)
	{
		if($i++==count($labels))
			{$html.='<th class="rounded-q4">'.$label[1].'</th>';}
		else
			{$html.='<th>'.$label[1].'</th>';}
	}

$html.='</tr>';
return $html;
}


function dayLabels($weeks)
{	
$labels=array();
$firstMonday=date('Y-m-d',mktime(0,0,0,date('m',strtotime('Monday this week')),date('d',strtotime('Monday this week'))-(7*($weeks-1)),date('Y',strtotime('Monday this week'))));	
$currentDay=$firstMonday;
$days=array($firstMonday);
$i=0;
while ($i<$weeks*7)
	{
	$value=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay)),date('Y',strtotime($currentDay))));
	$label=date('D jS M',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay)),date('Y',strtotime($currentDay))));
	$labels[$value]=array($i,$label);
	$i++;
	$currentDay=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay))+1,date('Y',strtotime($currentDay))));
	}
$days[]=$currentDay;
return array($labels,$days);
}

function dayLabelsToday($weeks)//negative weeks for past and positive for future
{	
$labels=array();
$weeksShift=(7*$weeks)-1;
$endDay=date('Y-m-d');
if ($weeks<0)
	{
	$weeksShift=7*($weeks+1);	
	}
$dayShift=date('Y-m-d',mktime(0,0,0,date('m',strtotime('Monday this week')),date('d',strtotime('Monday this week'))+($weeksShift),date('Y',strtotime('Monday this week'))));	
$currentDay=date('Y-m-d');
$endDay=$dayShift;
if ($weeks<0)
	{
	$weeksShift=7*($weeks+1);
	$currentDay=$dayShift;
	$endDay=date('Y-m-d');
	}
	
$days=array($currentDay,$endDay);
$i=0;
while ($currentDay<=$endDay)
	{
	$value=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay)),date('Y',strtotime($currentDay))));
	$label=date('D jS M',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay)),date('Y',strtotime($currentDay))));
	$labels[$value]=array($i,$label);
	$i++;
	$currentDay=date('Y-m-d',mktime(0,0,0,date('m',strtotime($currentDay)),date('d',strtotime($currentDay))+1,date('Y',strtotime($currentDay))));
	}
return array($labels,$days);
}

function monthLabels($years=1)
{
$labels=array();
$index=0;
$max=12*$years;
while ($index<$max)
	{
	$label=date('n,Y,M', strtotime('-'.($max-1-$index).' month',strtotime(date('Y-m-01')))) ;
	$values=explode(',',$label);
	if ($index==0 || ($values[0]*1==1))
		{
		$labels[($values[1]*1).($values[0]*1)]=array($index, $values[2].','.$values[1]);
		}
	else
		{
		$labels[($values[1]*1).($values[0]*1)]=array($index, $values[2]);
		}
	$index++;
	}
return $labels;
}

function yearMonthLabels($year)
{
$labels=array();
$index=0;
$max=12;
while ($index<$max)
	{
	$label=date('n,Y,M', strtotime('+'.($index).' month',strtotime(date('Y-01-01')))) ;
	$values=explode(',',$label);
	if ($index==0 || ($values[0]*1==1))
		{
		$labels[($values[1]*1).($values[0]*1)]=array($index, $values[2].','.$values[1]);
		}
	else
		{
		$labels[($values[1]*1).($values[0]*1)]=array($index, $values[2]);
		}
	$index++;
	}
return $labels;	
	
}

function weekMonhtlyLabels($months=1)
{
$labels=array();
$index=0;
$max=4*$months;
while ($index<$max)
	{
	$label=date('W,Y', strtotime('-'.($max-1-$index).' week')) ;
	$values=explode(',',$label);
	if (strlen($values[0])==1)
		{
		$values[0]='0'.$values[0]; // for weeks to have two characters when 1-9
		}
	if ($index==0 || ($values[0]*1==1))
		{
		$labels[$values[1].$values[0]]=array($index, 'W'.($values[0]*1).','.$values[1]);
		}
	else
		{
		$labels[$values[1].$values[0]]=array($index, $values[0]*1);
		}
	$index++;
	}
return $labels;
}

function periodLabels($year,$period,$currentPeriod)
{
$labels=array();	
switch ($period)
	{
	case 'Quarter':
	case 'Quarterly':
		$limit=4;
		if ($currentPeriod!='')
			{
			$limit=(substr($currentPeriod,1,1)*1)-1;	
			}
		$i=1;
		while ($i<=$limit)
			{
			$labels[$year.'-'.$i]=array($i-1,$year.'-'.$i);	
			$i++;
			}
		break;
	case 'Week':
	case 'Weekly':
		$limit=53;
		if ($currentPeriod!='')
			{
			$limit=($currentPeriod*1)-1;	
			}
		$i=1;
		while ($i<=$limit)
			{
			$w=$i;
			if ($i<10)
				{
				$w='0'.$i;	
				}
			$labels[$year.$w]=array($i-1,'W'.$w);
			$i++;		
			}
		break;
	case 'Month':
	case 'Monthly':
		$limit=11;
		$months=array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
		if ($currentPeriod!='')
			{
			$limit=($currentPeriod*1)-2;	
			}
		$i=0;
		while ($i<=$limit)
			{
			$labels[$months[$i]]=array($i,$months[$i]);
			$i++;		
			}
		break;
		
	}
	
return $labels;		
}

function weekLabels($years=1)
{
$labels=array();
$index=0;
$max=52*$years;
while ($index<$max)
	{
	$label=date('W,Y', strtotime('-'.($max-1-$index).' week')) ;
	$values=explode(',',$label);
	if (strlen($values[0])==1)
		{
		$values[0]='0'.$values[0]; // for weeks to have two characters when 1-9
		}
	if ($index==0 || ($values[0]*1==1))
		{
		$labels[$values[1].$values[0]]=array($index, 'W'.($values[0]*1).','.$values[1]);
		}
	else
		{
		$labels[$values[1].$values[0]]=array($index, $values[0]*1);
		}
	$index++;
	}
return $labels;
}

function emptyWeeklyData($years=1)
{
$data=array();
$index=0;
$max=52*$years;
while ($index<$max)
	{
	$data[$index]=0;
	$index++;
	}
return $data;
}

function emptyMonthlyData($years=1)
{
$data=array();
$index=0;
$max=12*$years;
while ($index<$max)
	{
	$data[$index]=0;
	$index++;
	}
return $data;
}

function chartMenuOptionsRadio($values) //$values is a bidimensional array with pairs radio name/destination link to get data
{
foreach($values as $value)
	{
	if ($value[0]=='titleBlock')
		{
		echo '<div class="chartOptionTitleBlock">'.$value[1].'</div>';
		}
	else
		{
		echo '<span style="padding-left:10px;"> </span><input type="radio" class="chartMenuOptionsRadio" name="chartMenuOptionsRadio" textValue="'.$value[0].'" value="'.$value[1].'">'.$value[0].'<br/>';
		}
	}
echo '<div class="submit button botonCrear launchChartStat" style="margin-top:10px;margin-bottom:20px;width:60%;margin-left:20%;">GET CHART</div>';
}

function chartMenuCommonFunctions($multiple=true)
{
echo '<div class="excelChartLine oculto"><span class="botonLink chartToExcel" style="padding-left:18px;">export to Excel (csv format)</span></div><form class="oculto" method="post"><input type="text" name="texto"></form>';
if ($multiple)
	{
	echo '<div class="multipleChartsArea">';
		echo '<div class="multipleChartsLeft">';
			echo '<span style="padding-left:10px;padding-right:5px"><strong>Multiple charts:</strong></span><select class="multipleChartsSelect">';
			echo selectFromArray(array('1','2','4'), '1');
		echo '</select></div>';
		echo '<div class="multipleChartsRight">';
			$i=1;
			while ($i<5)
				{
				
				echo '<div class="chartsAreaSelection area'.$i;
				if ($i==1)
					{
					echo ' selectedChartArea';	
					}
				else
					{
					echo ' oculto';
					}
				echo '" order="'.$i.'">'.$i.'</div>'; 
				$i++;
				}
		echo '</div>';
	echo '</div>';
	}

}

function dateFilteringOptions($years,$periods,$periodSelection,$multiple=0) //$years array and $periods array with possible values Year/ly, Quarter/ly, Month/ly, Week/ly. $multiple means max years to include
{
$thisYear=date('Y');
if (count($years)==1)
	{
	echo '<div class="standardLineFilterOptions yearSelection" current="'.$thisYear.'"><span class="oculto"><input type="text" name="year" value="'.$thisYear.'"></span><span style="padding-left:10px;padding-right:5px"><strong>Year ending:</strong></span>'.$years[0].'</div>';	
	}
else
	{
	echo '<div class="standardLineFilterOptions yearSelection" current="'.$thisYear.'"><span style="padding-left:10px;padding-right:5px"><strong>Year ending:</strong></span><select class="dateFilteringItem" name="year">';
	echo selectFromArray($years, '1');
	echo '</select></div>';
	}

if ($multiple>0)
	{
	$multipleValues=array();
	$i=1;
	while ($i<=$multiple)
		{
		$multipleValues[]=$i++;	
		}	
	echo '<div class="standardLineFilterOptions"><span style="padding-left:10px;padding-right:5px"><strong>Years to show:</strong></span><select class="dateFilteringItem" name="years">';
	echo selectFromArray($multipleValues, '1');
	echo '</select></div>';
	}
if (count($periods)==1)
	{
	echo '<div class="standardLineFilterOptions"><span style="padding-left:10px;padding-right:5px"><strong>Period:</strong></span>'.$periods[0].'</div>';	
	}
else
	{
	$extraClass='';
	if ($periodSelection){$extraClass='activatePeriodSelection';}
	echo '<div class="standardLineFilterOptions"><span style="padding-left:10px;padding-right:5px"><strong>Period:</strong></span><select class="dateFilteringItem '.$extraClass.'" name="period">';
	array_unshift ( $periods , '');
	echo selectFromArray($periods, '1');
	echo '</select></div>';
	}

$month=(date('n')*1)-1;
$quarter=floor($month/3)+1;
$thisquarter='Q'.$quarter;	
echo '<div class="oculto dateData" period="Quarter" now="'.$thisquarter.'">Q4,Q3,Q2,Q1</div>';

$month=date('M');
echo '<div class="oculto dateData" period="Month" now="'.$month.'">Dec,Nov,Oct,Sep,Aug,Jul,Jun,May,Apr,Mar,Feb,Jan</div>';

$week=date('W')*1;
$i=53;
$weeks=array();
while ($i>0)
	{
	$weeks[]=$i--;	
	}
echo '<div class="oculto dateData" period="Week" now="'.$week.'">'.implode(',',$weeks).'</div>';
echo '<div class="oculto dateData" period="Year" now="Selected">Selected</div>';
}

function currentPeriod($period)
{
$current='';
switch($period)
	{
	case 'Month':
	case 'Monthly':
		$current=date('n')*1;
		break;
	case 'Quarter':
	case 'Quarterly':
		$month=date('n')*1;
		$quarter=floor($month/3)+1;
		$current='Q'.$quarter;
		break;
	case 'Week':
	case 'Weekly':
		$current=date('W')*1;
		break;
	}
return $current;

	
}


function rateChartResults($arr) //requires totals rows start by 'total' element
{
$processed=array();

foreach($arr as $value)
	{
	if ($value[0]!='total')
		{
		$processed[]=$value;
		}
	}


foreach($arr as $value)
	{
	if ($value[0]=='total')
		{
		foreach($processed as $index=>$p)
			{
			if ($p[0]==$value[1] && $p[1]==$value[2])
				{
				$processed[$index][2]=($p[2]*1)/($value[3]*1);
				}
			}
		}
	}
	
return $processed;
}


function joinChartResults($arr,$types)
{
$processed=array();
$distinctLabels=array();

foreach($arr as $value)
	{
	$newLabel=$value[0];
	if (array_search($newLabel,$distinctLabels)===false)
		{
		$distinctLabels[]=$newLabel;
		}
	}

foreach ($distinctLabels as $label)
	{
	$intArray=array();
	$intArray[]=$label;
	foreach ($types as $type)
		{
		$intArray[]=0;	
		}
	$processed[]=$intArray;
	}

foreach($arr as $value)
	{
	$index1=array_search($value[0],$distinctLabels);
	$index2=array_search($value[1],$types)+1;
	$processed[$index1][$index2]=$value[2];
	}
	
return $processed;
}

function separateMasterData($arr,$keyWord)
{
$processed=array();
$distinctLabels=array();
$totalExists=false;
foreach($arr as $value)
	{
	$newLabel=$value[0];
	if (strpos($value[0],$keyWord)!==false)
		{
		$newLabel=str_replace($keyWord,'',$newLabel);
		}
	if (array_search($newLabel,$distinctLabels)===false)
		{
		if ($newLabel!='Total')
			{$distinctLabels[]=$newLabel;}
		else
			{
			$totalExists=true;
			}
		}
	}
if ($totalExists)
	{
	$distinctLabels[]='Total';
	}
foreach($distinctLabels as $l)
	{
	$processed[]=array($l,0,0);
	}
foreach($arr as $value)
	{
	$newLabel=$value[0];
	$index1=1;
	if (strpos($value[0],$keyWord)!==false)
		{
		$newLabel=str_replace($keyWord,'',$newLabel);
		$index1=2;
		}
	$index0=array_search($newLabel,$distinctLabels);
	$processed[$index0][$index1]=$value[1];
	}
$arr=$processed;	
return $arr;
}





?>