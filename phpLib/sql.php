<?php

/*!
 * sql.php
 * https://github.com/raulBiescas/coreLibraries
 * Version: 1.0.0
 *
 * Copyright 2021 sql.php Contributors
 * Released under the GNU General Public License v3.0
 * https://github.com/raulBiescas/coreLibraries/blob/main/LICENSE
 */

function incluir($campo)
{
$resultado=true;
if (strpos($campo,"LinkDocumento") === 0)
{$resultado=false;}
return $resultado;	
	}

function esDecimal($campo)
{
return (strpos($campo,"double") === 0) || (strpos($campo,"float") === 0) || (strpos($campo,"decimal") === 0);
}
	
function sqlDate($fecha)
{
$valores=explode("/",$fecha);
return $valores[2]."-".$valores[1]."-".$valores[0];
	}
	
function orCondition($arr,$campo)
{
$condition='';
foreach($arr as $val)
	{
	$condition.='`'.$campo.'` = '.$val.' OR ';
	}
return substr($condition,0,-3);
}

function sqlTimestamp($timestamp)
{
$hora=substr($timestamp, 10);
$fecha=substr($timestamp, 0,10);
$valores=explode("/",$fecha);
return $valores[2]."-".$valores[1]."-".$valores[0].$hora;
}
	
function selectClause ($tabla,$arr)
{
$sel="select ";
$tipos=tipoCampos($tabla);

foreach ($arr as $value)	
	{
		if (incluir($value))
		{
		switch(true)
			{
			case 	(strpos($tipos[$value],"date") === 0):
			$sel.="DATE_FORMAT(`".$tabla."`.`".$value."`,'%d/%m/%Y') as ".$value.",";
			break;
			case 	(strpos($tipos[$value],"timestamp") === 0):
			$sel.="DATE_FORMAT(`".$tabla."`.`".$value."`,'%d/%m/%Y %H:%i') as ".$value.",";
			break;
			case 	(strpos($tipos[$value],"time") === 0):
			$sel.="TIME_FORMAT(`".$tabla."`.`".$value."`,'%H:%i') as ".$value.",";
			break;
			default:
			$sel.="`".$tabla."`.`".$value."`,";
			break;	
			}	
		}
		}
return substr($sel,0,-1);
}

function distincts($tabla,$campo)
{
global $pdo;
$query="select distinct(`".$campo."`) from `".$tabla."` order by `".$campo."`"; 
/*$rs=mysql_query($query);
while ($arr=mysql_fetch_array($rs,MYSQL_NUM))*/
$rs = $pdo->prepare($query);
$rs->execute(); 
$res=array();				
while ($arr=$rs->fetch(PDO::FETCH_NUM))
	{
	$res[]=$arr[0];
	}
return $res;
}

//v1.0 modified
function tipoCampos($tabla)
{
global $pdo;
$res=array();

$query="show fields from ".cleanTableName($tabla);
$rs = $pdo->prepare($query);
$rs->execute(); 			
while ($obj=$rs->fetch(PDO::FETCH_OBJ))
{
	$res[$obj->Field]=$obj->Type;
	}
return $res;
	}

function getTables($query)
{
$fromPosition=	strpos($query, 'from') + 4;
$wherePosition= strpos($query, 'where');
if ($wherePosition===FALSE)
	{$wherePosition=strlen($query);}

$joinClause=substr($query, $fromPosition, $wherePosition - $fromPosition);	
	

$joinClause=str_replace('left','',$joinClause);
$joinClause=str_replace('inner','',$joinClause);
$joinClause=str_replace('right','',$joinClause);

while (strpos($joinClause, 'on')!==FALSE)
{
$onPosition=strpos($joinClause, 'on');
$joinPosition=strpos($joinClause, 'join', $onPosition);
if ($joinPosition===FALSE)
	{$joinPosition=strlen($joinClause);}

$joinClause=substr_replace($joinClause, '', $onPosition, $joinPosition-$onPosition);

	}
$tablas=explode('join', $joinClause);
$resultado=array();

foreach ($tablas as $value)
{
	if (strpos($value, '`')!==FALSE)
		{
			$value=trim($value);
			$value = preg_replace('/\s\s+/', ' ', $value);
			$value = str_replace('` ', '%separador%', $value);
			$value = str_replace(' `', '%separador%', $value);
			$value = str_replace('`', '', $value);
			$value = str_replace('%separador%%separador%', '%separador%', $value);
			$res=explode('%separador%', $value);
			}
	else {
		$value=trim($value);
		$value = preg_replace('/\s\s+/', ' ', $value);
		$res=explode(' ', $value);
		}
		
	if (count($res)==2)
		{$resultado[$res[0]]=$res[1];}
		else 
		{$resultado[$res[0]]=$res[0];}
	}
return $resultado;
	}


function descifrarQuery($query)
{
$tablas=	getTables($query);
$baseTipos=array();
foreach ($tablas as $key=>$value)
{
$baseTipos[$key]=tipoCampos($key);		
	}

$selectPosition=strpos($query, 'select')+6;
$fromPosition=	strpos($query, 'from');

$fieldsClause=substr($query, $selectPosition, $fromPosition - $selectPosition);	

$fields=explode(',', $fieldsClause);

$campos=array();
$tipos=array();

$i=0;

foreach ($fields as $value)
{
	$value = str_replace('distinct', '', $value);
	$value=trim($value);
	$value = preg_replace('/\s\s+/', ' ', $value);
	if (strpos($value, ' as ')!==FALSE)
	 {
		$asPosition=strpos($value, ' as ')+4;
		$fieldName=substr($value, $asPosition);
		$fieldName=trim($fieldName);
		$campo = str_replace('`', '', $fieldName);
	 	}
	else 
		{
		if (strpos($value, '(')===FALSE)
			{
				if (strpos($value, '.')!==FALSE)	
					{
						$res=explode('.', $value);
						$campo=str_replace('`', '', $res[1]);
						}
					else {$campo=str_replace('`', '', $value);}
						
				}
		else 
			{$campo='campo'.$i;}	
		}
	
	$campos[]=$campo;	
	
	if (strpos($value, ' as ')!==FALSE)
	 {
		$asPosition=strpos($value, ' as ');	
		$value=substr($value, 0,$asPosition);
		$value=trim($value);
		}
		
	if (strpos($value, '(')===FALSE)
			{
				if (strpos($value, '.')===FALSE)
					{
						foreach ($tablas as $key=>$value)
							{
							if (array_key_exists($campo,$baseTipos[$key]))
								{
									$tipos[$campo]=$baseTipos[$key][$campo];
									break;
									}	
							}				
						
						}
				else 
					{
						$res=explode('.', $value);
						$tabla=str_replace('`', '', $res[0]);
						if (!array_key_exists($tabla,$tablas))
							{$tabla=array_search($tabla,$tablas);}
						$tipos[$campo]=$baseTipos[$tabla][$campo];					
						
					}
			}
		else 
			{
				$tipos[$campo]=getFunctionType($value);
				}
$i++;
}
$resultado=array($campos,$tipos);
return $resultado;

	}
	
	
function getFunctionType($str)
{

		switch(true)
			{
			case 	(stripos($str,"date_") === 0):
			$tipo='date';
			break;
			case 	(stripos($str,"count") === 0):
			$tipo='int';
			break;
			case 	(stripos($str,"sum") === 0):
			$tipo='int';
			break;
			default:
			$tipo='varchar';
			break;	
			}	
return $tipo;	
	}	

function cleanSqlParameterName($name)
{
$result = preg_replace("/[^a-zA-Z0-9]+/", "", $name);//only allows alphaNumeric
return($result);
}

function cleanSqlInteger($value)
{
$result = preg_replace("/[^0-9]+/", "", $value);//only allows numeric
return($result);
}
	
function cleanTableName($name)
{
$name=str_replace('`', '', $name);
$name=str_replace('.', '`.`', $name);
return '`' . $name. '`';
}	


//v1.0 new 
function filterUpdateFields($tabla,$updateFields)
{
$camposTabla=tipoCampos($tabla);
$tablaUpdateFields=$updateFields;
foreach(array_keys($tablaUpdateFields) as $field)
	{
	$pair=explode('.',$field);
	if (count($pair)==2)
		{
		if ($pair[0]!=$tabla)
			{
			unset($tablaUpdateFields[$field]);
			}
		else
			{
			unset ($updateFields[$field]);
			}	
		}
	else
		{
		if (array_search($field,array_keys($camposTabla))===false)
			{
			unset($tablaUpdateFields[$field]);
			}
		else
			{
			unset ($updateFields[$field]);
			}
		}
	}
return array($tablaUpdateFields,$updateFields);
}

//v1.0 new
function createDBElement($tabla,$updateFields=array(),$defaultFields=array())
{
global $pdo;
foreach (array_keys($defaultFields) as $default)
	{
	if (array_search($default,array_keys($updateFields))!==false)
		{
		unset($defaultFields[$default]);
		}
	}
$totalFields=array_merge(array_keys($updateFields),array_keys($defaultFields));
$fieldSentence='';
foreach($totalFields as $field)
	{
	$fieldSentence.=cleanTableName($field).',';
	}
$fieldSentence='('.substr($fieldSentence,0,-1).') ';

$valueSentence='';
foreach($totalFields as $field)
	{
	$valueSentence.=':'.cleanSqlParameterName($field).',';
	}

$valueSentence='('.substr($valueSentence,0,-1).') ';

try{
	$query="insert into ".cleanTableName($tabla)." ".$fieldSentence." values ".$valueSentence;
	$rs = $pdo->prepare($query);
	foreach ($updateFields as $key=>$value)
		{
		$rs->bindValue(':'.cleanSqlParameterName($key),$value);
		}
	foreach ($defaultFields as $key=>$value)
		{
		$rs->bindValue(':'.cleanSqlParameterName($key),$value);
		}
	$rs->execute();
	return $pdo->lastInsertId();
	}catch(PDOExecption $e){
		//throw exception e->getMessage()
		return 0;
	}	
	
	
}

//v1.0 new
function copyDBElement($tabla,$id,$fieldsToCopy,$updateFields=array(),$defaultFields=array()) //base fields to copy are 
{
global $pdo;
foreach (array_keys($defaultFields) as $default)
	{
	if (array_search($default,$fieldsToCopy)!==false ||array_search($default,array_keys($updateFields))!==false)
		{
		unset($defaultFields[$default]);
		}
	}

foreach(array_keys($updateFields) as $update)
	{
	if (array_search($update,$fieldsToCopy)!==false)
		{
		unset($fieldsToCopy[array_search($update,$fieldsToCopy)]);
		}
	}
$totalFields=array_merge($fieldsToCopy,array_keys($updateFields),array_keys($defaultFields));
$fieldSentence='';
foreach($totalFields as $field)
	{
	$fieldSentence.=cleanTableName($field).',';
	}
$fieldSentence='('.substr($fieldSentence,0,-1).') ';

$selectSentence="select ";
foreach($totalFields as $field)
	{
	if (array_search($field,$fieldsToCopy)!==false)
		{
		$selectSentence.=cleanTableName($field).',';
		}
	else
		{
		$selectSentence.=':'.cleanSqlParameterName($field).',';
		}
	}
$selectSentence=substr($selectSentence,0,-1);
try{
	$query="insert into ".cleanTableName($tabla)." ".$fieldSentence.$selectSentence." from ".cleanTableName($tabla)." where Id=:id";
	$rs = $pdo->prepare($query);
	$rs->bindValue(':id',$id,PDO::PARAM_INT);
	foreach ($updateFields as $key=>$value)
		{
		$rs->bindValue(':'.cleanSqlParameterName($key),$value);
		}
	foreach ($defaultFields as $key=>$value)
		{
		$rs->bindValue(':'.cleanSqlParameterName($key),$value);
		}
	$rs->execute();
	return $pdo->lastInsertId();
	}catch(PDOExecption $e){
		//throw exception e->getMessage()
		return 0;
	}
	

}

	
function sanitizeSqlName($name)
{
return '`' . str_replace('`', '``', $name) . '`';
}

function sqlCopyRow($table,$id)
{
global $pdo;
$query = "SELECT * FROM `".$table."`  WHERE Id= " . $id;
$rs = $pdo->prepare($query);
$rs->execute();
$result = $rs->fetchAll(PDO::FETCH_ASSOC);
unset($result[0]['Id']); //Remove ID from array
$query = " INSERT INTO `".$table."`";
$query .= " ( " .implode(", ",array_keys($result[0])).") ";
$query .= " VALUES (";
foreach(array_values($result[0]) as $res)
	{
	$query.=$pdo->quote($res).', ';
	}
$query=substr($query,0,-2);
$query.= ")";
$rs = $pdo->prepare($query);
$rs->execute();
return $pdo->lastInsertId();

}


?>