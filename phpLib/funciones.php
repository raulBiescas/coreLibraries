<?php

/*!
 * funciones.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 funciones.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function cleanFileName($str)
{
$str=str_replace('/','',$str);
$str=str_replace('>','',$str);
$str=str_replace('#','',$str);
$str=str_replace(' ','_',$str);
$str=str_replace('[','',$str);
$str=str_replace(']','',$str);
$str=str_replace('=','',$str);
$str=str_replace('%','',$str);
$str=str_replace('$','',$str);
$str=str_replace('+','',$str);
$str=str_replace(',','',$str);
$str=str_replace(';','',$str);
return $str;
}

function checkImage($mediapath)
{
$image = getimagesize($mediapath) ? true : false;
return $image;
}

function decimalTrunc($number, $digits, $separator='.')
{
$components=explode($separator,$number);
if (count($components)==2)
	{
	return $components[0].$separator.substr($components[1],0,$digits);	
	}
else
	{
	return $number;
	}
}

function alphanumeric($str)
{
$result = preg_replace("/[^a-zA-Z0-9]+/", "", $str);//only allows alphaNumeric
return($result);
}

function onlyNumeric($str)
{
$result = preg_replace("/[^0-9]+/", "", $str);//only allows numeric
return($result);
}

?>