var backgound = new Kinetic.Layer();
var layer1 = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var stage;
var posx;
var posy;

// Utiliser dans le cadre de l'ajout des différents composants dans le canvas
// 0 place / 1 transitions / 2 arcs
var kindOfAdd = -1;

// Voici les différentes variables utilisées dans le cadre de l'ajout d'un arc.
var place2transTEMP = -1;
var source = -1;

var model = 
{
	places: [],
	transitions: [],
	arcs: []
}

/*
 * 
 * Si jamais on a besoin :
 * 
function getXMLHttpRequest() {
        var xhr = null;
  
        if(window.XMLHttpRequest || window.ActiveXObject) {
                if(window.ActiveXObject) {
                        try {
                                xhr = new ActiveXObject("Msxml2.XMLHTTP");
                        } catch(e) {
                                xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                } else {
                        xhr = new XMLHttpRequest();
                }
        } else {
                alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
                return null;
        }
  
        return xhr;
}

function envoyerJson() {
	// tu crée l'objet :
	var xhr = getXMLHttpRequest();
	// t'as codé ce constructeur précédemment
	 
	if(xhr && xhr.readyState != 0){
	   xhr.abort();
	}
	 
	xhr.onreadystatechange = function(){
	   if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)){
		  // tu peux récupérer en JS le résultat du traitement avec xhr.responseText;
	   }
	   else if(xhr.readyState == 2 || xhr.readyState == 3){ // traitement non fini
		  // tu peux mettre un message ou un gif de chargement par exemple
	   }
	}
	xhr.open("POST", "traitement_ajout_exercice.php", true); // true pour asynchrone
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // seulement si t'as choisi la méthode POST !
	xhr.send("var="+varJS); // éventuellement t'envois plusieurs variables séparées par un &
}
*/



function detectArc(i,j) // i = place, j = transition. Retourne -1 si il y a un arc direct entre i et j, 1 si entre j et i et 0 sinon.
{
	for(var z=0;z<model.arcs.length;z++)
	{
		if(model.arcs[z].source==i && model.arcs[z].dest==j && model.arcs[z].place2trans==1)
			return -1;
		else if(model.arcs[z].source==j && model.arcs[z].dest==i && model.arcs[z].place2trans==0)
		{

			return 1;
		}

	}
	return 0;


}

function refreshOmega()
{
	var res = omega();
	if(res.length > 0) {
		$('#results').html("&nbsp &nbsp &nbsp &nbsp");
		for(var i=0; i<res[0].length; i++) 
		{
			$('#results').html($('#results').html()+"T"+(i+1)+"&nbsp");
		}
		$('#results').html($('#results').html()+"</br>");

		for(var i=0; i<res.length; i++) {
			$('#results').html($('#results').html()+"P"+(i+1)+"&nbsp &nbsp");
			for(var j=0; j<res[i].length; j++) {

				$('#results').html($('#results').html()+res[i][j]);
				$('#results').html($('#results').html()+"&nbsp &nbsp");

			}


			$('#results').html($('#results').html()+"</br>");
		}
	}
}

function refreshEveryMatrixResults() {
	for(var i=0; i < 3; i++) {
		refreshMatrix(i);
	}
}

function refreshMatrix(statut) {
	var res;
	var which;
	if(statut == 0) {
		res = omega();
		which = "matrice_w_results";
	}
	else if(statut == 1) {
		res = omegaPlus();
		which = "matrice_wplus_results";
	}
	else if(statut == 2) {
		res = omegaMoins();
		which = "matrice_wmoins_results";
	}

	if(res.length > 0) {
		var html = "<table class=\"matrice_results\"><tr><td></td>";

		for(var i=0;i<res[0].length;i++) {
			html += "<td class=\"matrice_results_1\">T"+(i+1)+"</td>";
		}
		html+= "</tr>";
		if(res[0].length > 0) {
			for(var i=0;i<res.length;i++) {
				html += "<tr><td class=\"matrice_results_1\">P"+(i+1)+"</td>";
				for(var j=0;j<res[i].length;j++) {
					html += "<td class=\"matrice_results_2\">"+res[i][j]+"</td>";
				}
				html += "</tr>";
			}
		}
		html += "</table>";
		if(document.getElementById(which) != null)
			document.getElementById(which).innerHTML = html;
	}
}

function omega()
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			res[i][j] = detectArc(i,j);
		}
	}
	return res;
}

function omegaMoins()
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			var da = detectArc(i,j);
			if(da==-1)
				res[i][j] = 1;
			else
				res[i][j] = 0;
		}
	}
	return res;	
}


function omegaPlus()
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			var da = detectArc(i,j);
			if(da==1)
				res[i][j] = 1;
			else
				res[i][j] = 0;
		}
	}
	return res;
}

function drawPlace(layer, i)
{

	var group = new Kinetic.Group({
		draggable : true

	});
	var cercle = new Kinetic.Circle({
		x: model.places[i].coordx,
		y: model.places[i].coordy,
		radius: 20,
		fill: 'red',
		stroke: 'black',
		strokeWidth: 4,
		name : i,
		fillText: "P" + i 
	});


	var label = new Kinetic.Text({
		x: model.places[i].coordx,
		y: model.places[i].coordy,
		text: 'P'+(i+1),
		fontSize: 18,
		fontFamily: 'Calibri',
		fill: '#555',
		padding: 20,
		align: 'center'
	});
	group.add(cercle);
	group.add(label);


	group.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au début du déplacement et redessiner à la fin (mais moins beau ^^)
		layer3.clear();
		layer3.removeChildren();
		model.places[cercle.getName()].coordx = cercle.getAbsolutePosition().x; 
		model.places[cercle.getName()].coordy = cercle.getAbsolutePosition().y; 
		refreshLines();
	});


	group.on('click', function() {
		if(kindOfAdd == 2) {
			// On défini le cercle comme l'élement premier de l'arc
			if(place2transTEMP == -1) {
				source = i;
				place2transTEMP = 1;
			}
			else if(place2transTEMP == 0){
				// on insère dans le JSON
				model.arcs.push({"place2trans": 0,"source": source, "dest": i});
				refreshLines();
				refreshEveryMatrixResults();

				place2transTEMP = -1;
				source = -1;
			}
		}
		else {
			// Sinon on affiche les caractéristiques de l'éléments (à voir si on le fait ou pas)
		}

		}, false
	);


	layer.add(group);


}

function drawTransition(layer, i)
{
	var rec = new Kinetic.Rect({
		x: model.transitions[i].coordx,
		y: model.transitions[i].coordy,
		width: 50,
		height: 10,
		fill: 'red',
		stroke: 'black',
		strokeWidth: 4,

		name : i
	});

	

	var group = new Kinetic.Group({
		draggable : true

	});

	group.add(rec);


	var label = new Kinetic.Text({
		x: model.transitions[i].coordx,
		y: model.transitions[i].coordy,
		text: 'T'+(i+1),
		fontSize: 18,
		fontFamily: 'Calibri',
		fill: '#555',
		padding: 20,
		align: 'center'
	});

	group.add(label);



	group.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au début du déplacement et redessiner à la fin (mais moins beau ^^)
		layer3.clear();
		layer3.removeChildren();
		model.transitions[rec.getName()].coordx = rec.getAbsolutePosition().x; 
		model.transitions[rec.getName()].coordy = rec.getAbsolutePosition().y; 
		refreshLines();
	});

	group.on('click', function() {
		if(kindOfAdd == 2) {
			// On défini le cercle comme l'élement premier de l'arc
			if(place2transTEMP == -1) {
				source = i;
				place2transTEMP = 0;
			}
			else if(place2transTEMP == 1){
				// on insère dans le JSON
				model.arcs.push({"place2trans": 1,"source": source, "dest": i});
				refreshLines();
				refreshEveryMatrixResults();
				place2transTEMP = -1;
				source = -1;
			}
		}
		else {
			// Sinon on affiche les caractéristiques de l'éléments (à voir si on le fait ou pas)
		}

		}, false
	);

	layer.add(group);

}

function drawLine(layer, i)
{
	var pts = new Array();
	if(model.arcs[i].place2trans==1)
	{

		pts.push(model.places[model.arcs[i].source].coordx);
		pts.push(model.places[model.arcs[i].source].coordy);

		pts.push(model.transitions[model.arcs[i].dest].coordx);
		pts.push(model.transitions[model.arcs[i].dest].coordy);
	}
	else
	{
		pts.push(model.transitions[model.arcs[i].source].coordx);
		pts.push(model.transitions[model.arcs[i].source].coordy);

		pts.push(model.places[model.arcs[i].dest].coordx);
		pts.push(model.places[model.arcs[i].dest].coordy);


	}


	var redLine = new Kinetic.Line({
		points: pts,
		stroke: 'black',
		strokeWidth: 2,
		lineCap: 'round',
		lineJoin: 'round'
	});

	layer.add(redLine);

	var arrow = [];
	var angle = Math.atan2(pts[1]-pts[3], pts[0]-pts[2]);

	//http://yassinebenabbas.wordpress.com/article/opencv-dessiner-une-ligne-avec-une-31z31ug7b5vz5-7/
	//calcul des coordonnées de l’extrémité avec l’angle violet

	//La flèche à une magnitude spécifiée par le paramètre arrowMagnitude
	arrow[0] = pts[2];
	arrow[1] = pts[3];
	arrow[2] =  ( pts[2] +  10 * Math.cos(angle + Math.PI/6)) ;
	arrow[3]  =  ( pts[3]+  10 * Math.sin(angle + Math.PI/6)) ;
	var redLine1 = new Kinetic.Line({
		points: arrow,
		stroke: 'black',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round'
	});

	layer.add(redLine1);


	//calcul des coordonnées de l’extrémité avec l’angle vert
	arrow[2] = ( pts[2] +  10 * Math.cos(angle - Math.PI/6)) ;
	arrow[3] =  ( pts[3] +  10 * Math.sin(angle - Math.PI/6));
	//enfin, on dessine la deuxième extrémité
	var redLine2 = new Kinetic.Line({
		points: arrow,
		stroke: 'black',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round'
	});

	layer.add(redLine2);

}


function refreshLines()
{

	for(var i=0;i<model.arcs.length;i++)
	{
		drawLine(layer3,i);
	}
	layer3.draw();

}

$(window).load(function(){
	refreshOmega();
	for(var i=0;i<model.places.length;i++)
	{
		drawPlace(layer1,i);
	}

	for(var i=0;i<model.transitions.length;i++)
	{
		drawTransition(layer2,i);
	}
	refreshLines();

	posx=$('#container').findPos().x;
	posy=$('#container').findPos().y;

	stage = new Kinetic.Stage({
		container: 'container',
		width: 600,
		height: 400
	});

	mouseEventCallBack();
	

	
	//Calcul des P invariants :
	console.log(Pinvariants());
	
	//Calcul des T invariants :
	console.log(Tinvariants());
	
	//console.log(omegaMoins());
	//console.log(omegaPlus());

	stage.add(backgound);
	stage.add(layer1); // les places
	stage.add(layer2); // les transitions
	stage.add(layer3); // les arcs

})


function Pinvariants()
{
	var invP = omega();
	
	//Calcul des P invariants :
	return CalculP_T(ConcatRight(invP,Identity(getNbRows(invP))),getNbRows(invP),getNbColumns(invP));

}


function Tinvariants()
{
	var invT = Transpose(omega());
	
	//Calcul des P invariants :
	return CalculP_T(ConcatRight(invT,Identity(getNbRows(invT))),getNbRows(invT),getNbColumns(invT));

}

function activateAddPlace() {
	kindOfAdd = 0;
}

function activateAddTransition() {
	kindOfAdd = 1;
}

function activateAddArc() {
	kindOfAdd = 2;
}

function mouseEventCallBack() {
	var previousPositionX;
	var previousPositionY;
	document.getElementById('container').addEventListener ('click', 
			function(event) {
				if(kindOfAdd == 0){
					model.places.push({"coordx": event.pageX-posx,"coordy": event.pageY-posy})
					for(var i=0;i<model.places.length;i++)
					{
						drawPlace(layer1,i);
					}
				}
				else if(kindOfAdd == 1) {
					model.transitions.push({"coordx": event.pageX-posx,"coordy": event.pageY-posy})
					for(var i=0;i<model.transitions.length;i++)
					{
						drawTransition(layer2,i);
					}
				}
				refreshLines();

				refreshEveryMatrixResults();
				printMatricesInvariants();
	console.log(Pinvariants());
	
	//Calcul des T invariants :
	console.log(Tinvariants());

				generateEveryMatrixInput();
				
				stage.clear();
				stage.add(backgound);
				stage.add(layer1); // les places
				stage.add(layer2); // les transitions
				stage.add(layer3); // les arcs

			}, false
		);
	}
	
jQuery.fn.extend({
   findPos : function() {
       obj = jQuery(this).get(0);
       var curleft = obj.offsetLeft || 0;
       var curtop = obj.offsetTop || 0;
       while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft
                curtop += obj.offsetTop
       }
       return {x:curleft,y:curtop};
   }
});

function generateEveryMatrixInput() {
	for(var i=0; i < 3; i++) {
		generateMatrixInput(i);
	}
	//Calcul de l'invariant et determination du nombre de Pt
	generateInvariantInput(0);
	generateInvariantInput(1);
}
	
function generateMatrixInput(statut) {
	var which="";
	if(statut == 0)
		which = "matrice_w";
	else if(statut == 1)
		which = "matrice_wplus";
	else if(statut == 2)
		which = "matrice_wmoins";

	var html = "<table id=\""+which+"\"><tr><td></td>";
	var nbPlaces = model.places.length;
	var nbTransitions = model.transitions.length;

	for(var i=0;i<nbTransitions;i++) {
		html += "<td>T"+(i+1)+"</td>";
	}
	html+= "</tr>";
	for(var i=0;i<nbPlaces;i++) {
		html += "<tr><td>P"+(i+1)+"</td>";
		for(var j=0;j<nbTransitions;j++) {
			html += "<td><input type=\"text\" style=\"width:30px;\" value=\"0\" id=\""+which+"_"+i+"_"+j+"\"/></td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	
	if(document.getElementById(which) != null)
		document.getElementById(which).innerHTML = html;
}

function generateInvariantInput(statut) {
	var which="";
	var res = undefined;

	if(statut == 0) {
		which = "matrice_Tinvariants";
		res = Tinvariants();
	}
	else if(statut == 1) {
		which = "matrice_Pinvariants";
		res = Pinvariants();
	}

	var html="";

	if(res != undefined) {
		html = "<table id=\""+which+"\"><tr><td></td>";
		var nbLig = res.length;
		if(nbLig > 0) {
			var nbCol = res[0].length;

			for(var i=0;i<nbCol;i++) {
				html += "<td>T"+(i+1)+"</td>";
			}
			html+= "</tr>";
			for(var i=0;i<nbLig;i++) {
				html += "<tr><td>P"+(i+1)+"</td>";
				for(var j=0;j<nbCol;j++) {
					html += "<td><input type=\"text\" style=\"width:30px;\" value=\"0\" id=\""+which+"_"+i+"_"+j+"\"/></td>";
				}
				html += "</tr>";
			}
			html += "</table>";
		}
	}
	if(document.getElementById(which) != null)
		document.getElementById(which).innerHTML = html;
}

function controlerMatrice(status) {
	var which = "";
	var res;
	if(status == 0) {
		which = "matrice_w";
		res = omega();
	}
	else if(status == 1) {
		which = "matrice_wplus";
		res = omegaPlus();
	}
	else if(status == 2) {
		which = "matrice_wmoins";
		res = omegaMoins();
	}
	
	var nbPlaces = model.places.length;
	var nbTransitions = model.transitions.length;
	if(nbPlaces >0 && nbTransitions > 0) {
		var identique = true;
		var i=0;
		while(i<nbPlaces && identique) {
			var j =0;
			while(j<nbTransitions && identique) {
				if(document.getElementById(which+"_"+i+"_"+j) != null) {
					var current = document.getElementById(which+"_"+i+"_"+j).value;
					if(current != res[i][j])
						identique = false;
				}
				j++;
			}
			i++;
		}
		if(identique == false) {
			// en fonction de which, écrire le message d'erreur ou erreur correspondante + modifier css
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'incorrect';
				document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
		else if(identique == true) {
			// Modification css pour etre sur que le background est vert
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'correct';
				document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
	else {
		if(document.getElementById(which+"_astuces") != null) {
			var html = 'Aucune matrice';
			document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
			document.getElementById(which+"_astuces").innerHTML = html;
		}
	}
}

function controlerInvariant(status) {
	var which = "";
	var res;
	if(status == 0) {
		which = "matrice_Tinvariants";
		res = Tinvariants();
	}
	else if(status == 1) {
		which = "matrice_Pinvariants";
		res = Pinvariants();
	}

	if(res != undefined) {
		var nbLig = res.length;
		if(nbLig > 0) {
			var nbCol = res[0].length;

			var identique = true;
			var i=0;
			while(i<nbLig && identique) {
				var j =0;
				while(j<nbCol && identique) {
					if(document.getElementById(which+"_"+i+"_"+j) != null) {
						var current = document.getElementById(which+"_"+i+"_"+j).value;
						if(current != res[i][j])
							identique = false;
					}
					j++;
				}
				i++;
			}
			if(identique == false) {
				// en fonction de which, écrire le message d'erreur ou erreur correspondante + modifier css
				if(document.getElementById(which+"_astuces") != null) {
					var html = 'Incorrect';
					document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
					document.getElementById(which+"_astuces").innerHTML = html;
				}
			}
			else if(identique == true) {
				// Modification css pour etre sur que le background est vert
				if(document.getElementById(which+"_astuces") != null) {
					var html = 'Correct';
					document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
					document.getElementById(which+"_astuces").innerHTML = html;
				}
			}
		}
		else {
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'Aucune matrice';
				document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
}

function printMatricesInvariants() {
	var res = Pinvariants();
	var res2 = Tinvariants();

	if(res != undefined) {
		if(res.length > 0) {
			var html = "<table class=\"matrice_Pinvariants_results\"><tr><td></td>";

			for(var i=0;i<res[0].length;i++) {
				html += "<td class=\"matrice_results_1\">P"+(i+1)+"</td>";
			}
			html+= "</tr>";

			for(var i=0;i<res.length;i++) {
				html += "<tr><td class=\"matrice_results_1\">Pt"+(i+1)+"</td>";
				for(var j=0;j<res[i].length;j++) {
					html += "<td class=\"matrice_results_2\">"+res[i][j]+"</td>";
				}
				html += "</tr>";
			}
			html += "</table>";
			if(document.getElementById("matrice_Pinvariants_results") != null)
				document.getElementById("matrice_Pinvariants_results").innerHTML = html;
		}
	}

	if(res2 != undefined) {
		if(res2.length > 0) {
			var html = "<table class=\"matrice_Tinvariants_results_1\"><tr><td></td>";

			for(var i=0;i<res2[0].length;i++) {
				html += "<td class=\"matrice_results_1\">T"+(i+1)+"</td>";
			}
			html+= "</tr>";

			for(var i=0;i<res2.length;i++) {
				html += "<tr><td class=\"matrice_results_1\">Pt"+(i+1)+"</td>";
				for(var j=0;j<res2[i].length;j++) {
					html += "<td class=\"matrice_results_2\">"+res2[i][j]+"</td>";
				}
				html += "</tr>";
			}
			html += "</table>";
			if(document.getElementById("matrice_Tinvariants_results") != null)
				document.getElementById("matrice_Tinvariants_results").innerHTML = html;
		}
	}
}