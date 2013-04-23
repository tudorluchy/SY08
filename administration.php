<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		<script language="JavaScript" type="text/javascript">
			// suppresion element id
			function removeElement(id) {
				var element = document.getElementById(id);
				element.parentNode.removeChild(element);
			}

			// suppresion exercice
			function goto_confirm(url, exo) {
			  if (confirm("Etes-vous sur de vouloir supprimer cet exercice ?")) {
				 // document.location.href = url;
				 exo = '.'+exo;
				 $(exo).remove();
			  }
			  return false; //pour ne pas revenir au début de la page
			}
			
			// surligne le champ d'un formulaire
			function surligne(champ, erreur){
			   if(erreur)
				  champ.style.backgroundColor = "#fba";
			   else
				  champ.style.backgroundColor = "";
			}
			
			// verification intitule
			function verifIntitule(champ)
			{
			   if(champ.value.length < 2 || champ.value.length > 100)
			   {
				  surligne(champ, true);
				  return false;
			   }
			   else
			   {
				  surligne(champ, false);
				  return true;
			   }
			}
			
			// verification enonce
			function verifEnonce(champ)
			{
			   if(champ.value.length < 2 || champ.value.length > 8000)
			   {
				  surligne(champ, true);
				  return false;
			   }
			   else
			   {
				  surligne(champ, false);
				  return true;
			   }
			}
			
			// submit form
			function verifForm(f)
			{
			   var intituleOk = verifIntitule(f.intitule);
			   var enonceOk = verifEnonce(f.enonce);
				
			   if (intituleOk && enonceOk) {
				  return true;
			   } else {
				  alert("Veuillez remplir correctement tous les champs");
				  return false;
			   }
			}
		</script>
	</head>
	<body>	
	<?php	
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
						echo "<li>Invalid file</li>";
					}
					echo "</ul>";
			}
			
			// fichier rdp
			if (isset($_FILES["fichier_rdp"]["name"]) && !empty($_FILES["fichier_rdp"]["name"])) {
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
								}
							}
							if (file_exists($repertoireDestination.$nomDestination)){
								echo "<li>".$nomDestination . " already exists.</li>";
							} else {
							  move_uploaded_file($_FILES["fichier_rdp"]["tmp_name"], $repertoireDestination.$nomDestination);
							  echo "<li>Stored in: " . $repertoireDestination.$nomDestination."</li>";
							}
						}
					} else {
						echo "<li>Invalid file</li>";
					}
					echo "</ul>";
			}
		}
	?>
	<div id="corps_modif">
		<h3>Modification des exercices</h3>
		<b>Voici la liste des énoncés qui sont disponible actuellement</b>
		<div class="exo">
			<span class="exo_titre exo_remove1">Exercice 1 : Intitulé de l'exercice</span> <a class="exo_remove1" href="#"><img class="exo_remove1" src='img/edit.png' title='Modifier cet exercice'/></a> <a class="exo_remove1" href="#>" onclick="return goto_confirm('#', 'exo_remove1');"><img class="exo_remove1" src='img/delete.png' title='Supprimer cet exercice'/></a>
		</div>
		<div class="exo">
			<span class="exo_titre exo_remove2">Exercice 2 : Intitulé de l'exercice</span> <a class="exo_remove2" href="#>"><img class="exo_remove2" src='img/edit.png' title='Modifier cet exercice'/></a> <a class="exo_remove2" href="#>" onclick="return goto_confirm('#', 'exo_remove2');"><img class="exo_remove2" src='img/delete.png' title='Supprimer cet exercice'/></a>
		</div>
	</div>
	<div id="corps_form_ajout">
		<h3>Ajout d'un exercice</h3>
		<form name="ajout_exercice" method="POST" action="#" enctype="multipart/form-data" onsubmit="return verifForm(this)">
			<fieldset class="fieldset_ajout_exercice">
				<label>Intitule de l'énonce :</label><input type='text' name='intitule' title='Intitule' onblur="verifIntitule(this)"/><br />
				<label>L'énoncé :</label><textarea name='enonce' title='Enonce' rows="8" cols="100" onblur="verifEnonce(this)"></textarea><br />
				<label>Importer une image</label>
				<input type="hidden" name="MAX_FILE_SIZE" value="2097152">     
				<input type="file" name="image_exo"> <br/>
				<span id="image_info"></span>
				<label>Niveau de difficulté</label>
				<select>
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
				<div id="container"></div>
				<div id="results"></div>
				<input class="valider" type='submit' value='Valider'>
			</fieldset>	
		</form>
	</div>
	</body>
</html>
