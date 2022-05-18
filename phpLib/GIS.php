<?php

/*!
 * GIS.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 GIS.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

include_once "remoteConnection.php";

function calculateISPlength($ISProute)
{
$length=0;
$routeArr=explode(',',$ISProute);
$i=0;
$x=array();
$y=array();
foreach ($routeArr as $point)
	{
	if (strpos($point,' ')!==FALSE)
		{
		$pointArr=explode(' ',$point);
		$x[$i]=$pointArr[0];
		$y[$i]=$pointArr[1];
		if ($i>0)
			{$length+=sqrt(pow($x[$i]-$x[$i-1],2)+pow($y[$i]-$y[$i-1],2));}
		$i++;
		}
	}

return $length;
}

function coordinatesFromAddress($address,$city='',$country='',$pc='')
{
$osmLink="https://nominatim.openstreetmap.org/search/".urlencode($address)."?format=json&addressdetails=1&limit=1&polygon_svg=1";
if($city!='')
	{
	$extra='';
	if ($country!='')
		{
		$extra.="&country=".urlencode($country);
		}
	if ($pc!='')
		{
		$extra.="&postalcode=".urlencode($pc);
		}
	$osmLink="https://nominatim.openstreetmap.org/search?street=".urlencode($address)."&city=".urlencode($city).$extra."&format=json&addressdetails=1&limit=1&polygon_svg=1&accept-language=en";
	}

/*if ($address=='')
	{$address.=', ';}
if ($pc!='')
	{$pc.=', ';}
if ($city!='')
	{$city.=', ';}
$fulladdress=urlencode($address.$pc.$city.$country);

$googleLink="http://maps.googleapis.com/maps/api/geocode/json?address=".$fulladdress."&sensor=false";
echo $googleLink;
$http = new HttpConnection();  
$http->init();  
$response=$http->get($googleLink);
$resultado=json_decode($response);

$http->close();  

if ($resultado->status=='OK')
	{
	$lat=$resultado->results[0]->geometry->location->lat;
	$lng=$resultado->results[0]->geometry->location->lng;
	if (count($resultado->results[0]->address_components)>1)
		{$city=$resultado->results[0]->address_components[1]->long_name;}
	if (count($resultado->results[0]->address_components)>6)
		{
		$pc=$resultado->results[0]->address_components[6]->long_name;
		}
	else
		{$pc='';}
	return array($lat,$lng,$pc,$city);
	}
else
	{
	return false;
	}*/
	
$http = new HttpConnection();  
$http->init();  
$response=$http->get($osmLink);
$resultado=json_decode($response);
$http->close();

if (count($resultado)>0)
	{
	$lat=$resultado[0]->lat;	
	$lon=$resultado[0]->lon;	
	if (property_exists('address',$resultado[0]))
		{
		if (property_exists('city',$resultado[0]->address))
			{$city=$resultado[0]->address->city;}
		if (property_exists('postcode',$resultado[0]->address))
			{$pc=$resultado[0]->address->postcode;}
		
		}
	return array($lat,$lon,$pc,$city);
	}
else
	{
	return false;
	}	

}

//to calculate distance in meters from 2 latitude/longitude points
function haversineGreatCircleDistance(
  $latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6371000)
{
  // convert from degrees to radians
  $latFrom = deg2rad($latitudeFrom);
  $lonFrom = deg2rad($longitudeFrom);
  $latTo = deg2rad($latitudeTo);
  $lonTo = deg2rad($longitudeTo);

  $latDelta = $latTo - $latFrom;
  $lonDelta = $lonTo - $lonFrom;

  $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
    cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
  return $angle * $earthRadius;
}

function coordinatesCenter($info)
{
if (strpos($info,'POLYGON')!==FALSE || strpos($info,'POINT')!==FALSE || strpos($info,'LINESTRING')!==FALSE)
	{
	$info=str_replace('POLYGON','',$info);
	$info=str_replace('POINT','',$info);
	$info=str_replace('LINESTRING','',$info);
	$info=str_replace('(','',$info);
	$info=str_replace(')','',$info);
	$values=explode(',',$info);
	$x=0;
	$y=0;
	$i=0;
	foreach($values as $val)
		{
		$xy=explode(' ',$val);
		if (count($xy)==2)
			{
			$x+=$xy[0];
			$y+=$xy[1];
			$i++;
			}
		}
	if ($i>0)
		{return array($x/$i,$y/$i);}
	else
	{return false;}
	}
else {return false;}
	
}

function coordinatesBoundaries($info)
{
$minx=0;
$miny=0;
$maxx=0;
$maxy=0;

if (strpos($info,'POLYGON')!==FALSE || strpos($info,'POINT')!==FALSE || strpos($info,'LINESTRING')!==FALSE)
	{
	$info=str_replace('POLYGON','',$info);
	$info=str_replace('POINT','',$info);
	$info=str_replace('LINESTRING','',$info);
	$info=str_replace('(','',$info);
	$info=str_replace(')','',$info);
	$values=explode(',',$info);
	$first=true;	
	
	foreach($values as $val)
		{
		if ($first)
			{
			$first=false;	
			$xy=explode(' ',$val);
			if (count($xy)==2)
				{
				$minx=$xy[0];
				$maxx=$xy[0];
				$miny=$xy[1];
				$maxy=$xy[1];
				}			
			}
		else
			{
			$xy=explode(' ',$val);
			if (count($xy)==2)
				{
				if ($minx>$xy[0]){$minx=$xy[0];}
				if ($maxx<$xy[0]){$maxx=$xy[0];}
				if ($miny>$xy[1]){$miny=$xy[1];}
				if ($maxy<$xy[1]){$maxy=$xy[1];}
				}
			}
		}
	return array($minx,$maxx,$miny,$maxy);
	}
else {return false;}


}

//convert geo to merkator
function lon2x($lon) { return deg2rad($lon) * 6378137.0; }
function lat2y($lat) { return log(tan(M_PI_4 + deg2rad($lat) / 2.0)) * 6378137.0; }
//convert merkator to geo
function x2lon($x) { return rad2deg($x / 6378137.0); }
function y2lat($y) { return rad2deg(2.0 * atan(exp($y / 6378137.0)) - M_PI_2); }



?>