<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/truncatable/jquery.truncatable.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script language="JavaScript" type="text/javascript">
			 $(function(){
				$('.exo_enonce').truncatable({
	 								limit:400,
	 								more: '.....',
	 								less: true,
	 								hideText: '[cacher]'
	 							});
			});
		</script>
	</head>
	<body>	
	<div id="corps_selection">
		<h1 id="titre_exos">Exercices</h1>
		Sur cette page vous ai présenté un ensemble d'exercices.
		<h2>Les réseaux de Pétri <a class='lien_droite' href="administration.php" title="Aller à l'administration">Administration</a></h2>
		<?php
			ini_set('display_errors', 1);
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
            $req = "SELECT * FROM sy08_exercice ORDER BY date DESC";
			$res = DB::SqlToArray($req);
            
            foreach($res as $ligne) {
				echo '<div class="exo_selection">';
				echo '<span class="exo_titre_bis">Exercice : '.$ligne['intitule'].'</span>';
				echo '<span class="exo_date"> <b>'.date_format(date_create($ligne['date']), 'd/m/Y H:i').'</b> </span> <br />';
				echo '<span class="exo_enonce">'.$ligne['enonce'].'</span>';
				echo '<a href="exercice.php?action=effectuer&id='.$ligne['id'].'"><img class="go" src="img/go.png" title="Start exercice!"/></a> <br />';
				echo '<b>Niveau de difficulté : '.$ligne['difficulte'].'</b>';
				echo '</div>';
			}
		?>	
	</div>	
	</body>
</html>
