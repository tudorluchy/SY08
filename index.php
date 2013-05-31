<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
        <?php
        ini_set('display_errors', 1); 
        require_once(dirname(__FILE__).'/base/DB.class.php');
        DB::Init();
        if (isset($_POST['login']) && isset($_POST['pass'])) { 
            if (!empty($_POST['login']) && !empty($_POST['pass'])) {
                $sql = 'SELECT count(*) as nb FROM sy08_user WHERE login="'.DB::ProtectData($_POST['login']).'" AND mdp="'.DB::ProtectData($_POST['pass']).'"'; 
                $data = DB::SqlToArray($sql);
                DB::Close();
                if ($data[0]['nb'] == 1) { 
                   session_start(); 
                   $_SESSION['login'] = $_POST['login']; 
                } elseif ($data[0]['nb'] == 0) { 
                   $erreur = 'Compte non reconnu.'; 
                } else { 
                   $erreur = 'Problème dans la base de données : plusieurs membres ont les mêmes identifiants de connexion.'; 
                } 
            } else { 
                $erreur = 'Au moins un des champs est vide.'; 
            } 
        }  
        ?>
        <h2><a href="selection_exercices.php">Selection d'un exercice</a></h2>
        <?php
        if (isset($_SESSION['login'])) { 
            header('Location: administration.php');
        }
        ?>
        <form action="index.php" method="post">
            <fieldset class="fieldset_form_connexion">
            <legend>Connexion à l'espace d'administration</legend>
                <label>Login : </label><input type="text" name="login" value="<?php if (isset($_POST['login'])) echo htmlentities(trim($_POST['login'])); ?>"><br />
                <label>Mot de passe : </label><input type="password" name="pass" value="<?php if (isset($_POST['pass'])) echo htmlentities(trim($_POST['pass'])); ?>"><br />
                <input type="submit" name="connexion" value="Connexion">
            </fieldset>
        </form>
        <?php
        if (isset($erreur)) echo '<br />',$erreur;  
        ?>
    </body>
</html>

