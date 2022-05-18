<?php

/*!
 * csvExport.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 csvExport.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */
 
function csvFromArray($arr)
{
$text='';
foreach ($arr as $line)
	{
	foreach($line as $val)
		{
		$text.='"'.str_replace('"','""',$val).'"'.',';
		}
	$text=substr($text,0,-1);
	$text.="\r\n";
	}

return $text;
}

function csvISOConvert($text)
{
return iconv( 'UTF-8','ISO-8859-1//TRANSLIT', $text);
}

function csvGenerate($text)
{
header('Content-Description: File Transfer'); 
header("Content-type: application/octet-stream");
header('Content-Disposition: attachment; filename="table.csv"');
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
//header("Content-Length: ". filesize($file));
header("Content-Length: ". strlen($text));
ob_clean();
flush();
echo $text;
exit;
}

?>