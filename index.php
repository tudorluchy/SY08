<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
        <?php
        if ((isset($_POST['login']) && !empty($_POST['login'])) && (isset($_POST['pass']) && !empty($_POST['pass']))) { 
            ini_set('display_errors', 1); 
            require_once(dirname(__FILE__).'/base/DB.class.php');
            DB::Init();

            // on teste si une entrée de la base contient ce couple login / pass
            $sql = 'SELECT count(*) as nb FROM sy08_user WHERE login="'.mysql_escape_string($_POST['login']).'" AND mdp="'.mysql_escape_string($_POST['pass']).'"'; 
            $data = DB::SqlToArray($sql) or die('Erreur SQL !<br />'.$sql.'<br />'.mysql_error()); 

            // si on obtient une réponse, alors l'utilisateur est un membre
            if ($data[0]['nb'] == 1) { 
               session_start(); 
               $_SESSION['login'] = $_POST['login']; 
            } 
            // si on ne trouve aucune réponse, le visiteur s'est trompé soit dans son login, soit dans son mot de passe
            elseif ($data[0]['nb'] == 0) { 
               $erreur = 'Compte non reconnu.'; 
            } 
            // sinon, alors la, il y a un gros problème :)
            else { 
               $erreur = 'Probème dans la base de données : plusieurs membres ont les mêmes identifiants de connexion.'; 
            } 
         } else { 
            $erreur = 'Au moins un des champs est vide.'; 
         }  
        ?>
        
        <?php
        if (isset($_SESSION['login'])) { 
        ?>
           <a href="administration.php">Administration : Ajout et Edition des exercices</a></br></br> 
        <?php
        }
        ?>
        <a href="selection_exercices.php">Selection d'un exercice</a>

        <br />
        <br />
        Connexion à l'espace membre :<br />
        <form action="index.php" method="post">
            <fieldset class="fieldset_ajout_exercice">
                <label>Login : </label><input type="text" name="login" value="<?php if (isset($_POST['login'])) echo htmlentities(trim($_POST['login'])); ?>"><br />
                <label>Mot de passe : </label><input type="password" name="pass" value="<?php if (isset($_POST['pass'])) echo htmlentities(trim($_POST['pass'])); ?>"><br />
                <input type="submit" name="connexion" value="Connexion">
            </fieldset>
        </form>
        <?php
        if (isset($erreur)) echo '<br /><br />',$erreur;  
        ?>
    </body>
</html>

