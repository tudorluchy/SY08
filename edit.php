<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>	
		<?php
			ini_set('display_errors', 1);
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
			// action GET
			if (isset($_REQUEST['action'])) {
				// save
				if ($_REQUEST['action'] == 'save') {
					$req = "UPDATE sy08_exercice 
					SET intitule = '".$_REQUEST['intitule']."'
					, enonce = '".$_REQUEST['enonce']."' 
					, difficulte = '".$_REQUEST['difficulte']."' 
					WHERE id = ".$_REQUEST['id'];
					DB::Sql($req);
					
					$res = DB::SqlToArray('SELECT * FROM sy08_exercice WHERE id = '.$_REQUEST['id']);
				// edit
				} else if ($_GET['action'] == 'edit') { 
					$res = DB::SqlToArray('SELECT * FROM sy08_exercice WHERE id = '.$_REQUEST['id']);
					
				}
			} else {
				header('Location: administration.php'); 
			}
	?>
	<script language="JavaScript" type="text/javascript">
		var model = <?php echo $res[0]['json']; ?>;
	</script>
	<div id='corps_form_ajout'>
		<h3>Modification de l' exercice : <?php echo $res[0]['intitule']; ?></h3>
		<form name="ajout_exercice" method="POST" action="?action=save&id=<?php echo $_REQUEST['id'] ?>"enctype="multipart/form-data" onsubmit="return verifForm(this)">
			<fieldset class="fieldset_ajout_exercice">
				<label>Intitule de l'énonce :</label><input type='text' name='intitule' title='Intitule' onblur="verifIntitule(this)" value="<?php echo $res[0]['intitule']; ?>"/><br />
				<label>L'énoncé :</label><textarea name='enonce' title='Enonce' rows="8" cols="100" onblur="verifEnonce(this)"><?php echo $res[0]['enonce']; ?></textarea><br />
				<label>Importer une image</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
				<input type="file" name="image_exo"> <br/>
				<span id="image_info"></span>
				<label>Niveau de difficulté</label>
				<select name='difficulte'>
					<option <?php if ($res[0]['difficulte'] == '+++') echo 'selected '; ?> value="+++">+++</option>
					<option <?php if ($res[0]['difficulte'] == '++') echo 'selected '; ?> value="++">++</option>
					<option <?php if ($res[0]['difficulte'] == '+') echo 'selected '; ?> value="+">+</option>
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
				<div id="container"></div>
				<div id="results"></div>
				<input class="valider" type='submit' value='Valider'>
			</fieldset>	
		</form>
	</div>
	</body>
</html>
