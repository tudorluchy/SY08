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
		<h3>Les réseaux de Pétri</h3>
		<?php
			ini_set('display_errors', 1);
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
			$res = DB::SqlToArray("SELECT * FROM sy08_exercice ORDER BY date DESC");
			foreach($res as $ligne) {
				echo '<div class="exo_selection">';
				echo '<span class="exo_titre_bis">Exercice : '; echo $ligne['intitule']; echo '</span>';
				echo '<span class="exo_date">'; echo '<b>'; echo date_format(date_create($ligne['date']), 'd/m/Y H:i'); echo '</b>'; echo '</span> <br />';
				echo '<span class="exo_enonce">'; echo $ligne['enonce']; echo '</span>';
				echo '<a href="#>"><img class="go" src="img/go.png" title="Start exercice!"/></a> <br />';
				echo '<b>Niveau de difficulté : '; echo $ligne['difficulte'].'</b>';
				echo '</div>';
			}
		?>	
	</div>	
	</body>
</html>
