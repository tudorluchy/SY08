<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script src="js/jquery-ui/js/jquery-ui-1.10.3.custom.js"></script>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link href="js/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
	</head>
	<body>	
	<?php	
		require_once(dirname(__FILE__).'/base/DB.class.php');
		DB::Init();
		// post form
		if (isset($_POST["intitule"])) {
			$json = '';
			require_once(dirname(__FILE__).'/verif_files.php');
		}
		// action GET
		if (isset($_GET['action']) && $_GET['id'] > 0) {    
			// save
			if ($_GET['action'] == 'save') {
                if (!empty($json) && $json != '[]') {	
                     $json_final = $json;
                 } else {
                     if (isset($_POST['json'])) {
                         $json_final = $_POST['json'];
                     } else {
                         $json_final = '{ places : [], transitions : [], arc : [] }';
                     }
                 }
                if (isset($_POST['actif']) &&  $_POST['actif'] == 'on') {
                    $actif = 1;
                } else {
                    $actif = 0;
                }
                $sql_image = "";
                if (isset($_POST['enlever_image']) &&  $_POST['enlever_image'] == 'on') {
                    $sql_image  = ", image = ''";
                } else if (!empty ($_FILES['image_exo']['name'])){
                    $sql_image = " , image = '".$_FILES['image_exo']['name']."'";
                }
                $sql_fichier = "";
				if (isset($_POST['enlever_fichier']) &&  $_POST['enlever_fichier'] == 'on') {
                    $sql_fichier = ", fichier = ''";
                } else if (!empty ($_FILES['fichier_exo']['name'])){
                    $sql_fichier = " , fichier = '".$_FILES['fichier_exo']['name']."'";;
                }
				
				$sql_compteur = "";
                if (isset($_POST['reinit_compteur']) &&  $_POST['reinit_compteur'] == 'on') 
                    $sql_compteur  = ", nb_effectue = 0";
				
                $req = "UPDATE sy08_exercice SET intitule = '".$_POST['intitule']."', enonce = '".$_POST['enonce']."' , actif = ".$actif.", difficulte = '".$_POST['difficulte']."' , json = '".$json_final."'";
                if ($sql_image != "") {
                    $req .= $sql_image;
                }
                if ($sql_fichier != "") {
                    $req .= $sql_fichier;    
                }
				if ($sql_compteur != "") {
                    $req .= $sql_compteur;    
                }
				
                $req .= " WHERE id = ".$_GET['id'];
                //echo $req;
                DB::Sql($req);
                $req = 'SELECT * FROM sy08_exercice WHERE id = '.$_GET['id'];
				$res = DB::SqlToArray($req);
			// edit
			} else if ($_GET['action'] == 'edit') { 
                $req = 'SELECT * FROM sy08_exercice WHERE id = '.$_GET['id'];
				$res = DB::SqlToArray($req);
			}
		} else {
			header('Location: administration.php'); 
		}
        DB::Close();
	?>
	<script language="JavaScript" type="text/javascript">
		var model = <?php echo $res[0]['json']; ?>;
	</script>
	<div id='corps_form_ajout'>
		<h2>Modification de l'exercice : <?php echo $res[0]['intitule']; ?> <a class="lien_droite" href="administration.php" title="Retour à l'administration">Retour à l'administration</a></h3>
		<form name="ajout_exercice" method="POST" action="?action=save&id=<?php echo $_GET['id']; ?>"enctype="multipart/form-data" onsubmit="return verifForm(this)">
			<fieldset class="fieldset_ajout_exercice">
				<label>Intitule de l'énonce :</label><input type='text' name='intitule' title='Intitule' onblur="verifIntitule(this)" value="<?php echo $res[0]['intitule']; ?>"/><br />
				<label>L'énoncé :</label><textarea name='enonce' title='Enonce' rows="8" cols="100" onblur="verifEnonce(this)"><?php echo $res[0]['enonce']; ?></textarea><br />
                <?php if (!empty($res[0]['image']) && file_exists('upload_images/'.$res[0]['image'])) { ?>
					<label>Image :</label><img title='' src='upload_images/<?php echo $res[0]['image']; ?>'/><br />
				<?php } ?>
                <?php if (!empty($res[0]['fichier']) && file_exists('upload_fichiers/'.$res[0]['fichier'])) { ?>
                    <label>Fichier de correction : </label><a id="lien_correction" href="upload_fichiers/<?php echo $res[0]['fichier']; ?>">lien</a><br />
                <?php } ?>
                <label>Importer une image</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="10097152">     
				<input type="file" name="image_exo"> <br/>
				<span id="image_info"></span>
                <label>Importer un fichier de correction</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="10097152">     
				<input type="file" name="fichier_exo"> <br/><br/>
				<label>Niveau de difficulté</label>
				<select name='difficulte'>
					<option <?php if ($res[0]['difficulte'] == '+++') echo 'selected'; ?> value="+++">+++</option>
					<option <?php if ($res[0]['difficulte'] == '++') echo 'selected'; ?> value="++">++</option>
					<option <?php if ($res[0]['difficulte'] == '+') echo 'selected'; ?> value="+">+</option>
				</select><br />
                <label>Actif</label><input type="checkbox" name="actif" <?php if ($res[0]['actif'] == '1') echo "checked='true'";?>/><br />
                <?php if (!empty($res[0]['image']) && file_exists('upload_images/'.$res[0]['image'])) { ?>
                    <label>Enlever l'image</label><input type="checkbox" name="enlever_image" <?php if ($res[0]['image'] == '1') echo "checked='false'";?>/><br />
                <?php } ?>
                <?php if (!empty($res[0]['fichier']) && file_exists('upload_fichiers/'.$res[0]['fichier'])) { ?>
                    <label>Enlever le fichier</label><input type="checkbox" name="enlever_fichier" <?php if ($res[0]['fichier'] == '1') echo "checked='false'";?>/>
                <?php } ?>
                <label>Enlever l'image</label><input type="checkbox" name="enlever_image" <?php if ($res[0]['image'] == '1') echo "checked='false'";?>/><br />
                <label>Enlever le fichier</label><input type="checkbox" name="enlever_fichier" <?php if ($res[0]['fichier'] == '1') echo "checked='false'";?>/></br>
				Exercice effectué <?php echo $res[0]['nb_effectue']; ?> fois par les étudiants</br><label>Réinitialiser le compteur</label><input type="checkbox" name="reinit_compteur"/>
                <br /><br />
				<b>Resolution du graphe :</b><br />
				<div id='button_group'>
					<input type='button' value='Ajout Place' name='add_place' id='add_place' class='add_element'  />
					<input type='button' value='Ajout Transition' name='add_transition' id='add_transition' class='add_element'  />
					<input type='button' value='Ajout Arc' name='add_arc' id='add_arc' class='add_element' />
					<span class="lab_rdp">
						<label>Importer un fichier RDP</label>
						<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
						<input type="file" name="fichier_rdp">
					</span>
				</div>
				<input type="hidden" id="json" name="json" value="">
				<div id="container"></div>
				<div id="results">
					<div id="results_0"></div>
					<div id="results_1">
						<h3>Resultat W</h3>
						<div id="matrice_w_results"></div>
					</div>
					<div id="results_2">
					<h3>Resultat W+</h3>
						<div id="matrice_wplus_results"></div>
					</div>					
					<div id="results_3">
					<h3>Resultat W-</h3>
						<div id="matrice_wmoins_results"></div>
					</div>
					<div id="results_4">
					<h3>P invariants</h3>
						<div id="matrice_Pinvariants_results"></div>
					</div>
					<div id="results_4">
					<h3>T invariants</h3>
						<div id="matrice_Tinvariants_results"></div>
					</div>
				</div>
				<div id="arbreDeCouverture">
                    <br />
                    <input type="button" id="arbre_couverture_button" value="Afficher arbre de couverture" onClick="arbreDeCouverture('#arbreDeCouverture_content'); document.getElementById('arbre_couverture_button').value='Actualiser arbre de couverture'"/><div id="arbreDeCouverture_content"></div>
                </div>
				<input class="valider" type='submit' value='Valider'>
			</fieldset>	
		</form>
	</div>
	</body>
</html>
