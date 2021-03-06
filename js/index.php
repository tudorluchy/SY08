<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/truncatable/jquery.truncatable.js"></script>
        <script type="text/javascript" src="js/jPages-master/js/jPages.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
        <script language="JavaScript" type="text/javascript">  
            $(document).ready(function(){  
                $("div.page_navigation").jPages({
                    containerID : "liste_exercices",
                    perPage : 5,
                    first       : "Premier",
                    previous    : "Précédent",
                    next        : "Suivant",
                    last        : "Dernier",
                    midRange : 10
                });
            });  
        </script> 
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
		<a class='lien_droite' href="connexion_admin.php" title=">Accéder au module d'administration">Administration</a>
		<h2>Les réseaux de Pétri</h2>
		<?php
			require_once(dirname(__FILE__).'/base/DB.class.php');
			DB::Init();
            $req = "SELECT * FROM sy08_exercice ORDER BY date DESC";
			$res = DB::SqlToArray($req);
            DB::Close();
            $nb_ex = 0;
            echo '<div id="liste_exercices">';
            foreach($res as $ligne) {
                if ($ligne['actif']) {
                    $nb_ex++;
                    echo '<div class="exo_selection">';
                    echo '<hr class="hr_go">';       
                    echo '<span class="exo_titre_bis">Exercice : '.$ligne['intitule'].'</span><br />';
                    echo '<span class="exo_enonce">'.$ligne['enonce'].'</span>';
                    echo '<a href="exercice.php?action=effectuer&id='.$ligne['id'].'"><img class="go" src="img/go.png" title="Start exercice!"/></a> <br />';
                    echo '<b>Niveau de difficulté : '.$ligne['difficulte'].'</b>';
                    echo '<hr class="hr_go">';
                    echo '</div>';
                }
			}
            echo "</div>";
            // affiche la pagination
            if ($nb_ex > 0) {
                echo '<div class="page_navigation"></div>';
            }
		?>	
	</div>	
	</body>
</html>
