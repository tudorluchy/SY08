var backgound = new Kinetic.Layer();
var layer1 = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var stage;

// Utiliser dans le cadre de l'ajout des différents composants dans le canvas
// 0 place / 1 transitions / 2 arcs
var kindOfAdd = -1;

// Voici les différentes variables utilisées dans le cadre de l'ajout d'un arc.
var place2transTEMP = -1;
var source = -1;

var model = 
{
	places: [
		{
			coordx: 355.60975609756,
			coordy: 119.45945945946
		},
		{
			coordx: 460.9756097561,
			coordy: 211.35135135135
		},
		{
			coordx: 250.24390243902,
			coordy: 211.35135135135
		},
		{
			coordx: 540,
			coordy: 82.702702702703
		},
		{
			coordx: 250.24390243902,
			coordy: 303.24324324324
		}
	],
	transitions: [
		{
			coordx: 460.9756097561,
			coordy: 137.83783783784
		},
		{
			coordx: 460.9756097561,
			coordy: 266.48648648649
		},
		{
			coordx: 302.92682926829,
			coordy: 156.21621621622
		},
		{
			coordx: 250.24390243902,
			coordy: 266.48648648649
		},
		{
			coordx: 250.24390243902,
			coordy: 340
		}
	],
	arcs: [
		{
			place2trans: 1,
			source: 0,
			dest: 0
		},
		{
			place2trans: 1,
			source: 0,
			dest: 2
		},
		{
			place2trans: 1,
			source: 3,
			dest: 0
		},
		{
			place2trans: 0,
			source: 0,
			dest: 1
		},
		{
			place2trans: 1,
			source: 1,
			dest: 1
		},
		{
			place2trans: 0,
			source: 1,
			dest: 3
		},
		{
			place2trans: 0,
			source: 2,
			dest: 2
		},
		{
			place2trans: 1,
			source: 2,
			dest: 3
		},
		{
			place2trans: 0,
			source: 3,
			dest: 4
		},
		{
			place2trans: 1,
			source: 4,
			dest: 4
		},
		{
			place2trans: 0,
			source: 4,
			dest: 0
		},
		{
			place2trans: 0,
			source: 1,
			dest: 2
		},
		{
			place2trans: 0,
			source: 2,
			dest: 3
		},
		{
			place2trans: 1,
			source: 3,
			dest: 3
		}
	]
}


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


function omega()
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			res[i][j] = detectArc(i,j);

		}
	}

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
				omega();

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
				omega();
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
	omega();
	for(var i=0;i<model.places.length;i++)
	{
		drawPlace(layer1,i);
	}

	for(var i=0;i<model.transitions.length;i++)
	{
		drawTransition(layer2,i);
	}
	refreshLines();



	stage = new Kinetic.Stage({
		container: 'container',
		width: 600,
		height: 400
	});

	mouseEventCallBack();

	stage.add(backgound);
	stage.add(layer1); // les places
	stage.add(layer2); // les transitions
	stage.add(layer3); // les arcs

	generateEveryMatrixInput();
})



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
					model.places.push({"coordx": event.pageX,"coordy": event.pageY-20})
					for(var i=0;i<model.places.length;i++)
					{
						drawPlace(layer1,i);
					}
				}
				else if(kindOfAdd == 1) {
					model.transitions.push({"coordx": event.pageX,"coordy": event.pageY-20})
					for(var i=0;i<model.transitions.length;i++)
					{
						drawTransition(layer2,i);
					}
				}
				refreshLines();
				omega();

				stage.clear();
				stage.add(backgound);
				stage.add(layer1); // les places
				stage.add(layer2); // les transitions
				stage.add(layer3); // les arcs

				generateEveryMatrixInput();
			}, false
		);
	}
	
function generateEveryMatrixInput() {
	for(var i=0; i < 3; i++) {
		generateMatrixInput(i);
	}
	//Calcul de l'invariant et determination du nombre de Pt
	generateInvariantInput(3/*nbPt*/);
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
			html += "<td><input type=\"text\" style=\"width:30px;\" value=\"0\" name=\""+which+"_"+i+"_"+j+"\"/></td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	
	if(document.getElementById(which) != null)
		document.getElementById(which).innerHTML = html;
}

function generateInvariantInput(nbPt) {

	var html = "<table id=\"invariant\"><tr><td></td>";
	var nbPlaces = model.places.length;

	for(var i=0;i<nbPlaces;i++) {
		html += "<td>P"+(i+1)+"</td>";
	}
	html+= "</tr>";
	for(var i=0;i<nbPt;i++) {
		html += "<tr><td>Pt"+(i+1)+"</td>";
		for(var j=0;j<nbPlaces;j++) {
			html += "<td><input type=\"text\" style=\"width:30px;\" value=\"0\" name=\"invariant_"+i+"_"+j+"\"/></td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	
	if(document.getElementById("invariant") != null)
		document.getElementById("invariant").innerHTML = html;
}