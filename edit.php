<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link href="js/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link href="js/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
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
		// action GET
		if (isset($_GET['action'])) {
			// save
			if ($_GET['action'] == 'save') {
				if (!empty($json)) {
					$json_final = $json;
				} else {
					$json_final = $_POST['json'];
				}
				$req = "UPDATE sy08_exercice SET intitule = '".$_POST['intitule']."', enonce = '".$_POST['enonce']."' , image = '".$_FILES['image_exo']['name']."' , difficulte = '".$_POST['difficulte']."' , json = '".$json_final."' WHERE id = ".$_GET['id'];
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
	?>
	<script language="JavaScript" type="text/javascript">
		var model = <?php echo $res[0]['json']; ?>;
	</script>
	<div id='corps_form_ajout'>
		<h3>Modification de l' exercice : <?php echo $res[0]['intitule']; ?></h3>
		<form name="ajout_exercice" method="POST" action="?action=save&id=<?php echo $_GET['id']; ?>"enctype="multipart/form-data" onsubmit="return verifForm(this)">
			<fieldset class="fieldset_ajout_exercice">
				<label>Intitule de l'énonce :</label><input type='text' name='intitule' title='Intitule' onblur="verifIntitule(this)" value="<?php echo $res[0]['intitule']; ?>"/><br />
				<label>L'énoncé :</label><textarea name='enonce' title='Enonce' rows="8" cols="100" onblur="verifEnonce(this)"><?php echo $res[0]['enonce']; ?></textarea><br />
				<?php if (!empty($res[0]['image'])) { ?>
					<label>Image :</label><img title='' src='upload_images/<?php echo $res[0]['image']; ?>'/><br />
				<?php } ?>
				<label>Importer une image</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
				<input type="file" name="image_exo"> <br/>
				<span id="image_info"></span>
				<label>Niveau de difficulté</label>
				<select name='difficulte'>
					<option <?php if ($res[0]['difficulte'] == '+++') echo 'selected'; ?> value="+++">+++</option>
					<option <?php if ($res[0]['difficulte'] == '++') echo 'selected'; ?> value="++">++</option>
					<option <?php if ($res[0]['difficulte'] == '+') echo 'selected'; ?> value="+">+</option>
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
				<div id="results"></div>
				<input class="valider" type='submit' value='Valider'>
			</fieldset>	
		</form>
	</div>
	</body>
</html>
