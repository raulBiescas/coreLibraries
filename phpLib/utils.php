<?php

/*!
 * utils.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 utils.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function separarMayuscula($string)
{
$strings=array();
$count = strlen($string);

$i = 0;
$ii = 0;

while($i < $count)
{
        $char = $string{$i};
        if(ereg("[A-Z]", $char, $val)){
        				$ii++;	
                $strings[$ii] = $char;
        } else {
                $strings[$ii] .= $char;
        }
$i++;
}

$res="";
foreach ($strings as $value)
{	
	if (count($value)==1)
		{$res.=$value;}
	else
		{$res.=" ".$value;}
	
	}

return(substr($res,1)); 
}

?>