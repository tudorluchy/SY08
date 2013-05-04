<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>	
	<?php	
		ini_set('display_errors', 1); 
		require_once(dirname(__FILE__).'/base/DB.class.php');
		DB::Init();
		// post form
		if (isset($_POST["intitule"])) {
			$json = '';
			require_once(dirname(__FILE__).'/verif_files.php');
		}
	?>
	<div id="corps_modif">
		<h3>Modification des exercices</h3>
		<b>Voici la liste des énoncés qui sont disponible actuellement</b>
		<?php
			// action
			if (isset($_REQUEST['action'])) {
				// delete exercice
				if ($_GET['action'] == 'delete') {
					$res = DB::Sql('DELETE FROM sy08_exercice WHERE id = '.$_GET['id']);
				// edit exercice
				} else if ($_GET['action'] == 'edit') {
					header('Location: edit.php?id='.$_GET['id']); 
				// save exercice
				} else if ($_GET['action'] == 'save') {
					if (!empty($json)) {	
						$json_final = $json;
					} else {
						$json_final = $_POST['json'];
					}
					$res = DB::Sql("INSERT INTO sy08_exercice (intitule, enonce, image, difficulte, json, date) 
					VALUES ('".$_POST['intitule']."', '".$_POST['enonce']."', '".$_FILES['image_exo']['name']."', '".$_POST['difficulte']."', 
					'".$json_final."', NOW())");
				}
			} 
			// affichage exos
			$res = DB::SqlToArray("SELECT * FROM sy08_exercice ORDER BY date DESC");
            foreach($res as $ligne) {
				echo '<div class="exo">';
				echo '<span class="exo_titre">'; 
				echo 'Exercice : '; echo $ligne['intitule'].' - '.date_format(date_create($ligne['date']), 'd/m/Y H:i').'</span>'; 
				echo '<a href="edit.php?action=edit&id='.$ligne['id'].'"><img src="img/edit.png" title="Modifier cet exercice"/></a><a href="?action=delete&id='.$ligne['id'].'"><img src="img/delete.png" title="Supprimer cet exercice"/></a>';
				echo '</div>';	
			}
		?>
    </div>
	<div id="corps_form_ajout">
		<h3>Ajout d'un exercice</h3>
		<form name="ajout_exercice" method="POST" action="?action=save" enctype="multipart/form-data" onsubmit="return verifForm(this)">
			<fieldset class="fieldset_ajout_exercice">
				<label>Intitule de l'énonce :</label><input type='text' name='intitule' title='Intitule' onblur="verifIntitule(this)" value="<?php if(isset($_POST['intitule'])){echo $_POST['intitule'];}?>"><br />
				<label>L'énoncé :</label><textarea name='enonce' title='Enonce' rows="8" cols="100" onblur="verifEnonce(this)"><?php if(isset($_POST['enonce'])){echo $_POST['enonce'];} ?></textarea><br />
				<label>Importer une image</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
				<input type="file" name="image_exo"> <br/>
				<span id="image_info"></span>
				<label>Niveau de difficulté</label>
				<select name='difficulte'>
					<option value="+++">+++</option>
					<option selected value="++">++</option>
					<option value="+">+</option>
				</select><br/ ><br/ >
				<b>Resolution du graphe :</b><br/ >
				<div id='button_group'>
					<input type='button' value='Ajout Place' name='add_place' onClick='activateAddPlace()' />
					<input type='button' value='Ajout Transition' name='add_transition' onClick='activateAddTransition()' />
					<input type='button' value='Ajout Arc' name='add_arc' onClick='activateAddArc()' />
					<span class="lab_rdp">
						<label>Importer un fichier RDP</label>
						<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
						<input type="file" name="fichier_rdp">
					</span>
				</div>
				<input type="hidden" id="json" name="json" value="">
				<div id="container"></div>
				<div id="results">
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
				</div>
				<input class="valider" type='submit' value='Valider'>
			</fieldset>	
		</form>
	</div>
	</body>
</html>
