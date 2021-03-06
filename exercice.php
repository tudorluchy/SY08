<?php
    require_once(dirname(__FILE__).'/base/DB.class.php');
    DB::Init();
    // effectuer exercice
    if ($_GET['action'] == 'effectuer' && $_GET['id'] > 0) {
        $req = 'SELECT * FROM sy08_exercice WHERE id = '.$_GET['id'];
        $res = DB::SqlToArray($req);
		$increment = 'UPDATE sy08_exercice SET nb_effectue=nb_effectue+1 where id = '.$_GET['id'];
		DB::Sql($increment);
    } else {
        header('Location: index.php');
    }
    // date : <span class="exo_date">'.date_format(date_create($res[0]['date']), 'd/m/Y H:i').'</span>
    DB::Close();
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui/js/jquery-ui-1.10.3.custom.js"></script>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link href="js/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
	</head>
	<body>	
	<script language="JavaScript" type="text/javascript">
		var model2 = <?php echo $res[0]['json']; ?>;
	</script>
	<div id='corps_form_ajout'>
		<h2>Exercice : <?php echo $res[0]['intitule']; ?> <a class="lien_droite" href="index.php" title="Revenir à la liste des exercices">Liste des exercices</a></h2>
        <?php echo $res[0]['enonce']; ?> <br /><br />
		<?php if (!empty($res[0]['image']) && file_exists('upload_images/'.$res[0]['image'])) { ?>
			<img title='Image exercice' src='upload_images/<?php echo $res[0]['image']; ?>'/><br />
		<?php } ?>
		<b>Resolution du graphe :</b><br />
		<div id='button_group'>
			<input type='button' value='Ajout Place' name='add_place' id='add_place' class='add_element'  />
			<input type='button' value='Ajout Transition' name='add_transition' id='add_transition' class='add_element'  />
			<input type='button' value='Ajout Arc' name='add_arc' id='add_arc' class='add_element' />
		</div>
		<input type="hidden" id="json" name="json" value="">
		<div id="container"></div>
		<div id="legende"><u>Légende:</u><br/><br/>
			Double-cliquer sur une place/transition pour accéder à ces propriétés. (Aucun bouton d'ajout ne doit être sélectionné) <br/><br/>
			La suppression d'un élément est disponible en double cliquant sur celui-ci. <br/><br/>
		</div>
		<div id="message_avertissement">Veuillez noter que si vous ajouter des places ou transitions alors que des modifications ont été effectuées sur les matrices ci-dessous, ces modifications seront perdues !
			Assurez-vous donc que votre graphe est correct avant de passer à la prochaine étape.
		</div>
		<table>
			<tr><td><h3>Calculer W+</h3></td></tr>
			<tr>
				<td><div id="matrice_wplus" class="matrices_input"></div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="Controler" onClick="controlerMatrice(1)" /></div></td>
				<td><div id="matrice_wplus_astuces" class="astuces"></div></td>
			</tr>		
			<tr><td><h3>Calculer W-</h3></td></tr>
			<tr>
				<td><div id="matrice_wmoins" class="matrices_input"></div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="Controler" onClick="controlerMatrice(2)" /></div></td>
				<td><div id="matrice_wmoins_astuces" class="astuces"></div></td>
			</tr>
			<tr><td><h3>Calculer W</h3></td></tr>
			<tr>
				<td><div id="matrice_w" class="matrices_input"></div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="controler" onClick="controlerMatrice(0)" /></div></td>
				<td><div id="matrice_w_astuces" class="astuces"></div></td>
			</tr>
			<tr><td><h3>Calculer les T invariants </h3></td></tr>
			<tr>
				<td><div id="matrice_Tinvariants" class="matrices_input"></div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="controler" onClick="controlerInvariant(0)" /></div></td>
				<td><div id="matrice_Tinvariants_astuces" class="astuces"></div></td>
			</tr>
			<tr><td><h3>Calculer les P invariants</h3></td></tr>
			<tr>
				<td><div id="matrice_Pinvariants" class="matrices_input"></div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="controler" onClick="controlerInvariant(1)" /></div></td>
				<td><div id="matrice_Pinvariants_astuces" class="astuces"></div></td>
			</tr>
			<tr><td><h3>Les propriétés du Rdp</h3></td></tr>
			<tr>
				<td><div id="RDP_proprietes" class="RDP_prop">
					<form name="formu_prop">
						<table>
						<tr>
							<td style="min-width:200px;">Le RdP est-il borné ?</td>
							<td><input type="radio" class="disable radio_button" name="rdpborne" value="oui">Oui</td>
							<td><input type="radio" class="disable radio_button" name="rdpborne" value="non">Non</td>
						</tr>
						<tr>
							<td style="min-width:200px;">Le RdP est-il sauf ?</td>
							<td><input type="radio" class="disable radio_button" name="rdpSauf" value="oui">Oui</td>
							<td><input type="radio" class="disable radio_button" name="rdpSauf" value="non">Non</td>					
						</tr>
						<tr>
							<td style="min-width:200px;">Le RdP est-il quasi vivant ?</td>
							<td><input type="radio" class="disable radio_button" name="rdpQuasiVivant" value="oui">Oui</td>
							<td><input type="radio" class="disable radio_button" name="rdpQuasiVivant" value="non">Non</td>					
						</tr>
						<tr>
							<td style="min-width:200px;">Existe-t-il au moins une situation de blocage ?</td>
							<td><input type="radio" class="disable radio_button" name="rdpBlocage" value="oui">Oui</td>
							<td><input type="radio" class="disable radio_button" name="rdpBlocage" value="non">Non</td>					
						</tr>
						</table>
					</form>
				</div></td>
				<td><div class="control_button_div"><input type="button" class="disable control_button" value="controler" onClick="controlerProprietes()" /></div></td>
				<td><div id="proprietes_astuces" class="astuces"><div id="proprietes_astuces_comp"></div><div id="proprietes_astuces_comp2">Arbre de couverture s'il existe : <input type="button" value="Afficher/Masquer" onClick="expandDiv(0);" /><div id="tree"></div></div></div></td>
			</tr>
		</table>
		<div>Pensez à cliquer sur chacun des boutons "controler" avant de cliquer sur correction.</div>
		<input class="disable" type="button" value="Accéder à la correction" onClick="accesCorrection();"/>
		<div id="correction" style="border-top: 1px solid red;">           
        </div>
		<?php if (!empty($res[0]['fichier']) && file_exists('upload_fichiers/'.$res[0]['fichier'])) { ?>
			<a id="lien_correction" class="invisible" href="upload_fichiers/<?php echo $res[0]['fichier']; ?>">Fichier d'aide lié à la correction</a> 
		<?php } ?>
	</div>
	</body>
</html>
