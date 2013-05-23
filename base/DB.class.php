<?php


define("DB_HOST","localhost");
define("DB_USER","root");
define("DB_PASS","pass");
define("BASE","sy08");


class DB {
    
    /**
     *
     * @var type 
     */
	public static $Base;
  
    /**
     * tente la connexion sur le SGBD, en utilisant des constantes définies 
     */
	public function Init()
	{
		self::$Base = mysql_connect(DB_HOST, DB_USER, DB_PASS);
		mysql_select_db(BASE, self::$Base);
		if (mysql_error()>0)
		{
			echo "Impossible d'ouvrir la base.";
			echo mysql_error();
		}
	}

    /**
     * 
     * @param type $requete
     * @return boolean
     */
	public function Sql($requete)
	{
		if (!self::$Base) {
			self::Init();
		}
 
		@mysql_query("SET NAMES UTF8");
		$resultat = @mysql_query($requete);
 
		if (mysql_error()>0) {
			echo mysql_error();
		    return false;
		} else {
			return $resultat;
		}
	}
	
	/**
     * retourne directement les enregistrements de la requete sous la forme d'un tableau asociatif 
     * @param type $requete
     * @return type
     */
    public function SqlToArray($requete)
	{
		$res = self::Sql($requete);
		$tab = array();
		while ($row = mysql_fetch_assoc($res))
		{
			//$tab[] = str_replace("&quot;", "", $row);
		    $tab[] = $row;
		}
		return $tab;	
	}

    /**
     * 
     * @param type $data
     * @return boolean
     */
	public function ProtectData($data)
	{
		if (!self::$Base)
			self::Init();
		
		@mysql_query("SET NAMES UTF8");
		//Strip_tags supprime toutes balise php et html
		//$resultat=@mysql_real_escape_string(strip_tags($data));
		
		$resultat=@mysql_real_escape_string(strip_tags($data));
 
		if (mysql_error()>0) {
			echo mysql_error();
		} else {
			return $resultat;
		}
		return false;
	}
}
