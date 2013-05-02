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
			$json = '';
			if (isset($_POST["intitule"])) {
				// image exo
				if (isset($_FILES["image_exo"]["name"]) && !empty($_FILES["image_exo"]["name"])) {
					// Copie dans le repertoire du script avec un nom
					// incluant l'heure a la seconde pres 
					$repertoireDestination = "upload_images/";
					$nomDestination = $_FILES["image_exo"]["name"];

					$allowedExts = array("gif", "jpeg", "jpg", "png");
					$extension = end(explode(".", $_FILES["image_exo"]["name"]));
					echo "<ul class='upload_info'>";
					if ((($_FILES["image_exo"]["type"] == "image/gif") 
						|| ($_FILES["image_exo"]["type"] == "image/jpeg")
						|| ($_FILES["image_exo"]["type"] == "image/jpg")
						|| ($_FILES["image_exo"]["type"] == "image/pjpeg")
						|| ($_FILES["image_exo"]["type"] == "image/x-png")
						|| ($_FILES["image_exo"]["type"] == "image/png"))
						&& ($_FILES["image_exo"]["size"] < 2097152)
						&& in_array($extension, $allowedExts)) {
							if ($_FILES["image_exo"]["error"] > 0) {
								$save = false;
								echo "<li>Return Code: " . $_FILES["image_exo"]["error"]. "</li>";
							} else {
								echo "<li>Upload: " . $_FILES["image_exo"]["name"] . "</li>";
								echo "<li>Type: " . $_FILES["image_exo"]["type"] . "</li>";
								echo "<li>Size: " . ($_FILES["image_exo"]["size"] / 1024) . " kB</li>";
								echo "<li>Temp file: " . $_FILES["image_exo"]["tmp_name"] . "</li>";
								
								if (!is_dir($repertoireDestination)) {
									if (!@mkdir($repertoireDestination, 0777)) {
										$error = error_get_last();
										// echo $error['message'];
										$save = false;
									}
								}
								if (file_exists($repertoireDestination.$nomDestination)){
									echo "<li>".$nomDestination . " already exists.</li>";
								} else {
									move_uploaded_file($_FILES["image_exo"]["tmp_name"], $repertoireDestination.$nomDestination);
									echo "<li>Stored in: " . $repertoireDestination.$nomDestination."</li>";
								}
							}
						} else {
							$save = false;
							echo "<li>Invalid file</li>";
						}
						echo "</ul>";
				}
				
				// fichier rdp
				if (isset($_FILES["fichier_rdp"]["name"]) && !empty($_FILES["fichier_rdp"]["name"])) {
					require_once(dirname(__FILE__).'/convert_rdp_to_json.php');
					// Copie dans le repertoire du script avec un nom
					// incluant l'heure a la seconde pres 
					$repertoireDestination = "upload_fichiersRDP/";
					$nomDestination = $_FILES["fichier_rdp"]["name"];

					$allowedExts = array("rdp", "RDP");
					$extension = end(explode(".", $_FILES["fichier_rdp"]["name"]));
					echo "<ul class='upload_info'>";
					if (($_FILES["fichier_rdp"]["size"] < 2097152)
						&& in_array($extension, $allowedExts)) {
							if ($_FILES["fichier_rdp"]["error"] > 0) {
								$save = false;
								echo "<li>Return Code: " . $_FILES["fichier_rdp"]["error"]. "</li>";
							} else {
								echo "<li>Upload: " . $_FILES["fichier_rdp"]["name"] . "</li>";
								echo "<li>Type: " . $_FILES["fichier_rdp"]["type"] . "</li>";
								echo "<li>Size: " . ($_FILES["fichier_rdp"]["size"] / 1024) . " kB</li>";
								echo "<li>Temp file: " . $_FILES["fichier_rdp"]["tmp_name"] . "</li>";
								
								if (!is_dir($repertoireDestination)) {
									if (!@mkdir($repertoireDestination, 0777)) {
										$error = error_get_last();
										// echo $error['message'];
										$save = false;
									}
								}
								if (file_exists($repertoireDestination.$nomDestination)){
									echo "<li>".$nomDestination . " already exists.</li>";
									$json = convert($repertoireDestination.$nomDestination);
									unlink($repertoireDestination.$nomDestination);
								} else {
									move_uploaded_file($_FILES["fichier_rdp"]["tmp_name"], $repertoireDestination.$nomDestination);
									echo "<li>Stored in: " . $repertoireDestination.$nomDestination."</li>";
									$json = convert($repertoireDestination.$nomDestination);
									unlink($repertoireDestination.$nomDestination);
								}
							}
						} else {
							$save = false;
							echo "<li>Invalid file</li>";
						}
						echo "</ul>";
				}
			}
			ini_set('display_errors', 1);
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
			// action GET
			if (isset($_GET['action'])) {
				if (!empty($json)) {
					$json_final = $json;
				} else {
					$json_final = $_POST['json'];
				}
				// save
				if ($_GET['action'] == 'save') {
					$req = "UPDATE sy08_exercice 
					SET intitule = '".$_POST['intitule']."'
					, enonce = '".$_POST['enonce']."' 
					, difficulte = '".$_POST['difficulte']."'
					, json = '".$json_final."' 
					WHERE id = ".$_GET['id'];
					DB::Sql($req);
					
					$res = DB::SqlToArray('SELECT * FROM sy08_exercice WHERE id = '.$_GET['id']);
				// edit
				} else if ($_GET['action'] == 'edit') { 
					$res = DB::SqlToArray('SELECT * FROM sy08_exercice WHERE id = '.$_GET['id']);
					
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
