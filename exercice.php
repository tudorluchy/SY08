<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/kinetic.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/matrix.js"></script>
		<script type="text/javascript" src="js/sy08.js"></script>
		<script type="text/javascript" src="js/JSON-js-master/json2.js"></script>
		<script type="text/javascript" src="js/verification_form.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>	
		<?php
			ini_set('display_errors', 1);
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
			// action GET
			if ($_GET['action'] == 'effectuer') {
				$res = DB::SqlToArray('SELECT * FROM sy08_exercice WHERE id = '.$_GET['id']);
			}
	?>		
	<div id='corps_form_ajout'>
		<h3>Exercice : <?php echo $res[0]['intitule']; echo '<span class="exo_date">'.date_format(date_create($res[0]['date']), 'd/m/Y H:i').'</span>'; ?></h3>
		<?php echo $res[0]['enonce']; ?> <br /><br />
		<?php if (!empty($res[0]['image'])) { ?>
			<img title='' src='upload_images/<?php echo $res[0]['image']; ?>'/><br />
		<?php } ?>
		<b>Resolution du graphe :</b><br/ >
		<div id='button_group'>
			<input type='button' value='Ajout Place' name='add_place' onClick='activateAddPlace()' />
			<input type='button' value='Ajout Transition' name='add_transition' onClick='activateAddTransition()' />
			<input type='button' value='Ajout Arc' name='add_arc' onClick='activateAddArc()' />
		</div>
		<input type="hidden" id="json" name="json" value="">
		<div id="container"></div>
		<div id="results"></div>
	</div>
	</body>
</html>
