<?php
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
				
				// import conversion
				require_once(dirname(__FILE__).'/convert_rdp_to_json.php');
				
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

	
?>
