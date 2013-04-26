<?php

define("DB_HOST","localhost");
define("DB_USER","root");
define("DB_PASS","");
define("BASE","sy08");

class DB{
 
	public static $Base;
  
 	//tente la connexion sur le SGBD, en utilisant des constantes définies
	function Init()
	{
		$connectionString="host=".DB_HOST." port=5432 dbname=".BASE." user=".DB_USER." password=".DB_PASS;
		self::$Base=mysql_connect($connectionString);
		if(mysql_last_error()>0)
		{
			Site::message("Impossible d'ouvrir la base",ERREUR);
			Site::message(mysql_error());
		}
	}

 	//equiv. mysql_query, avec gestion d'erreur
	function Sql($requete)
	{
		if(!self::$Base)
			self::Init();
 
		@mysql_query("SET NAMES UTF8");
		$resultat=@mysql_query($requete);
 
		if(mysql_last_error()>0)
			Site::message("Erreur".mysql_error()."'",ERREUR);
		else
			return $resultat;
		return FALSE;
	}
	
	//retourne directement les enregistrements de la requete sous la forme d'un tableau asociatif
	function SqlToArray($requete)
	{
		$res=self::Sql($requete);
		$tab=array();
		while($row=mysql_fetch_assoc($res))
		{
			$tab[]=str_replace("&quot;", "", $row);
		}
		return $tab;	
	}

	function ProtectData($data)
	{
		if(!self::$Base)
			self::Init();
		
		@mysql_query("SET NAMES UTF8");
		//Strip_tags supprime toutes balise php et html
		//$resultat=@mysql_real_escape_string(strip_tags($data));
		
		$resultat=@mysql_real_escape_string(strip_tags($data));
 
		if(mysql_last_error()>0)
			Site::message("Impossible d'executer la requète: '".mysql_error()."'",ERREUR);
		else
			return $resultat;
		return FALSE;
	}
}
