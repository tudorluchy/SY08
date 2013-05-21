var backgound = new Kinetic.Layer();
var layer1 = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var stage, stage2;
var posx;
var posy;

// Attention, pour calculer l'arbre de marquage, ça change des choses : 
// la plupart de nos fonctions se basent sur la var model, et là nous devons faire une sorte de simulation, sans toucher au model original.
// Du coup, j'ai mis model en paramètre des fonctions qui m'interesse, mais il pourrait être (très) interessant de faire un peu plus de la POO.

//http://geekz.fr/Les-reseaux-de-Petri?artsuite=3
// Marquage.js// Contient tout ce qu'il faut pour construire un arbre de marquage

var marquages = [];
var predecesseurs = [];
var transitionsFranchies; // Pour quasi vivant : Toutes les transitions sont franchies
var sauf; //borne un 1 pour tout marquage
var borne; //pas de w


// On ne peut pas utiliser l'opérateur ==
function compareVector(v1,v2) 
{

	if(v1.length != v2.length)
		return false;
		
	for(var i=0;i<v1.length;i++)
	{
		if(v1[i]!=v2[i])
			return false;
	
	}
	return true;

}

//opérateur + pas utilisable (concatene)
function addVector(v1,v2)
{
var res = [];
	if(v1.length != v2.length)
		return -1;
	
	for(var i=0;i<v1.length;i++)
	{
		if(v1[i]=="w" || v2[i]=="w")
			res[i]="w";
		else
			res[i] = parseInt(v1[i])+parseInt(v2[i]);
	
	}
	return res;

}



function getComposanteW(v1,v2) 
{
	res = [];
	if(v1.length != v2.length)
		return -1;
		
	for(var i=0;i<v1.length;i++)
	{
		if(v1[i]>v2[i])
			res.push(i);
		else if(v2[i]>v1[i])
			return false;
		
	
	}
	return res;
	
}













// Utiliser dans le cadre de l'ajout des diff�rents composants dans le canvas
// 0 place / 1 transitions / 2 arcs
var kindOfAdd = -1;

// Voici les diff�rentes variables utilis�es dans le cadre de l'ajout d'un arc.
var place2transTEMP = -1;
var source = -1;

var idSelected = -1;
var kindOfSelected = -1; //1 pour places, 2 pour transitions et 3 pour arcs





function createPlace(x,y,m)
{
	var res = {
	coordx: x,
	coordy: y,
	properties : {
			marking : m
			}
	
	}
	model.places.push(res);

}

function createTransition(x,y)
{
	var res = {
	coordx: x,
	coordy: y
	}
	model.transitions.push(res);

}

function createArc(_place2trans,_source,_dest,_value)
{

	var res = {
	place2trans: _place2trans,
	source: _source,
	dest : _dest,
	properties : {
			value : _value
			}
	
	}
	model.arcs.push(res);
	

}

 
var model = 
{
	places: [
	],
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
	// tu cr�e l'objet :
	var xhr = getXMLHttpRequest();
	// t'as cod� ce constructeur pr�c�demment
	 
	if(xhr && xhr.readyState != 0){
	   xhr.abort();
	}
	 
	xhr.onreadystatechange = function(){
	   if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)){
		  // tu peux r�cup�rer en JS le r�sultat du traitement avec xhr.responseText;
	   }
	   else if(xhr.readyState == 2 || xhr.readyState == 3){ // traitement non fini
		  // tu peux mettre un message ou un gif de chargement par exemple
	   }
	}
	xhr.open("POST", "traitement_ajout_exercice.php", true); // true pour asynchrone
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // seulement si t'as choisi la m�thode POST !
	xhr.send("var="+varJS); // �ventuellement t'envois plusieurs variables s�par�es par un &
}
*/



function detectArc(i,j) // i = place, j = transition. Retourne -<pondération de l'arc> si il y a un arc direct entre i et j, <pondération de l'arc> si entre j et i et 0 sinon.
{
	for(var z=0;z<model.arcs.length;z++)
	{
		if(model.arcs[z].source==i && model.arcs[z].dest==j && model.arcs[z].place2trans==1)
			return -model.arcs[z].properties['value'];
		else if(model.arcs[z].source==j && model.arcs[z].dest==i && model.arcs[z].place2trans==0)
		{

			return model.arcs[z].properties['value'];
		}

	}
	return 0;


}

function refreshomega(model)
{
	var res = omega(model);
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
		res = omega(model);
		which = "matrice_w_results";
	}
	else if(statut == 1) {
		res = omegaPlus(model);
		which = "matrice_wplus_results";
	}
	else if(statut == 2) {
		res = omegaMoins(model);
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

function omega(model)
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

function omegaMoins(model)
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			var da = detectArc(i,j);
			if(da<0)
				res[i][j] = Math.abs(da);
			else
				res[i][j] = 0;
		}
	}
	return res;	
}


function omegaPlus(model)
{
	var res = [];
	for(var i=0; i<model.places.length; i++) {
		res[i] = new Array(model.transitions.length);
		for(var j=0; j<model.transitions.length; j++) {
			var da = detectArc(i,j);
			if(da>0)
				res[i][j] = da;
			else
				res[i][j] = 0;
		}
	}
	return res;
}


function arbreDeCouverture()
{
 marquages = [];
 predecesseurs = [];
 var m0 = getMarquage(model);
 marquages.push(m0);
  predecesseurs.push(m0);
  
  borne=true;
  if(Math.max.apply(Math, m0)<=1)
	sauf=true;
	else
	sauf=false;
	
	console.log("sauf");
	console.log(sauf);
  transitionsFranchies = [];
 makeMeATree(model,0);
 
 $('body').append("</br>Le réseau est ");
 if(!borne)
	$('body').append("non ");
	$('body').append("borné</br>");
	
$('body').append("</br>Le réseau est ");
 if(!sauf)
	$('body').append("non ");
	$('body').append("sauf</br>");
	
	// Marche pas pour l'instant
	/*
	console.log("len");
	console.log(transitionsFranchies);
$('body').append("</br>Le réseau est ");
 if(transitionsFranchies.length != m0.length)
	$('body').append("non ");
	$('body').append("quasi vivant</br>");*/
	
}


//Méfiance avec les tableaux, c'est des passages par reférence ! --> jQuery.extend(true, {}, model)
// A force de programmer en javascript, on oublie un peu ces dangers classiques, j'ai perdu pas mal de temps avec ces conneries^^
function makeMeATree(model,level)
{
	var tmpModel = jQuery.extend(true, {}, model);
	var trFranchissables = getTransitionsFranchissables(model);
	var oldMarquage = getMarquage(model);
	if(level==0)
	$('body').append(oldMarquage+"</br>");
	
	for(var i=0; i<trFranchissables.length; i++) {
	if(level==0)
		predecesseurs.splice(1,predecesseurs.length);
	resModel = franchirTransition(jQuery.extend(true, {}, model),trFranchissables[i]);

	
	
	if(resModel!=false)
	{
	if(transitionsFranchies.indexOf(trFranchissables[i])==-1)
		transitionsFranchies.push(trFranchissables[i]);
	var newMarquage = getMarquage(resModel);
	for(var j=0;j<4*level;j++)
			$('body').append("&nbsp;");
		$('body').append("|___");
		$('body').append(newMarquage+"</br>");
		makeMeATree(resModel,level+1);
		}
		}
	

}

function checkIfNonBorne(newMarquage)
{

	for(var i=0; i<predecesseurs.length; i++) {
		
			var res = getComposanteW(newMarquage,predecesseurs[i]) 
			if(res!=false)
			{
			console.log(res);
			for(var j=0;j<res.length;j++)
			{
				newMarquage[res[j]]="w";
			}
			}
			return newMarquage;
		
		
	}
	return newMarquage;

}


function isNotOld(newMarquage)
{

	for(var i=0; i<marquages.length; i++) {
		if(compareVector(newMarquage,marquages[i]))
		return false;
	}
	return true;

}

function franchirTransition(model,transition)
{

	var o = omega(model);
	
	var colToAdd = extractColumn(o,transition);
	var oldMarquage = getMarquage(model);

	var newMarquage = addVector(oldMarquage,colToAdd);
	var newMarquageNB = checkIfNonBorne(jQuery.extend(true, {}, newMarquage));
	console.log(newMarquage);
	console.log(newMarquageNB);
	if(!compareVector(newMarquageNB,newMarquage))
	{
		console.log("bbbbb");
		borne=false;
		sauf=false;
		}
	newMarquage=newMarquageNB;
	if(isNotOld(newMarquage))
	{
		
		
		marquages.push(newMarquage);
		predecesseurs.push(newMarquage);
		
		/*model = setMarquage(model, newMarquage);
		if(Math.max.apply(Math, newMarquage)>1)
			sauf=false;*/
		return model;
	}
	return false;
	
	

}

function getMarquage(model)
{	
var res = [];
for(var i=0; i<model.places.length; i++) {
	res[i]=model.places[i].properties['marking'];
}
return res;
}


function setMarquage(model, vectMarquage) 
{
if(vectMarquage.length != model.places.length)
return -1;
for(var i=0; i<vectMarquage.length; i++) {
	model.places[i].properties['marking']=vectMarquage[i];
}
return model;

}


function getTransitionsFranchissables(model)
{
	var res =[];
	var oMoins = omegaMoins(model);
	var oPlus = omegaPlus(model);
	for(var i =0;i<getNbColumns(oMoins);i++)
	{
		var okPre = true;
		var okPost = false;
		for(var j =0;j<getNbRows(oMoins);j++)
		{
			if(oPlus[j][i]!=0)
				okPost=true;
			if(model.places[j].properties['marking']<oMoins[j][i])
{			

				okPre= false;
				}

		}
				if(okPre && okPost)
				res.push(i);
				
	
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


	group.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au d�but du d�placement et redessiner � la fin (mais moins beau ^^)
		layer3.clear();
		layer3.removeChildren();
		model.places[cercle.getName()].coordx = cercle.getAbsolutePosition().x; 
		model.places[cercle.getName()].coordy = cercle.getAbsolutePosition().y; 
		refreshLines();
	});
	


	group.on('dblclick', function() {
		idSelected = i;
		kindOfSelected=1;
		displayProperties(model.places[i].properties,true); 
	
	},false);
	
	group.on('click', function() {
		if(kindOfAdd == 2) {
			// On d�fini le cercle comme l'�lement premier de l'arc
			if(place2transTEMP == -1) {
				source = i;
				place2transTEMP = 1;
			}
			else if(place2transTEMP == 0){
				// on ins�re dans le JSON
				createArc(0,source,i,1);

				refreshLines();
				refreshEveryMatrixResults();

				place2transTEMP = -1;
				source = -1;
			}
		}
		else {
		// Sinon on affiche les caract�ristiques de l'�l�ments (� voir si on le fait ou pas)
			
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

	group.on('dblclick', function() {
		idSelected = i;
		kindOfSelected=2;
		displayProperties(model.transitions[i].properties,true); 
	
	},false);

	group.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au d�but du d�placement et redessiner � la fin (mais moins beau ^^)
		layer3.clear();
		layer3.removeChildren();
		model.transitions[rec.getName()].coordx = rec.getAbsolutePosition().x; 
		model.transitions[rec.getName()].coordy = rec.getAbsolutePosition().y; 
		refreshLines();
	});

	group.on('click', function() {
		if(kindOfAdd == 2) {
			// On d�fini le cercle comme l'�lement premier de l'arc
			if(place2transTEMP == -1) {
				source = i;
				place2transTEMP = 0;
			}
			else if(place2transTEMP == 1){
				// on ins�re dans le JSON
				createArc(1,source,i,1);
				refreshLines();
				refreshEveryMatrixResults();
				place2transTEMP = -1;
				source = -1;
			}
		}
		else {
			// Sinon on affiche les caract�ristiques de l'�l�ments (� voir si on le fait ou pas)
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
		strokeWidth: 3,
		lineCap: 'round',
		lineJoin: 'round'
	});
	
	redLine.on('dblclick', function() {
		idSelected = i;
		kindOfSelected=3;
		displayProperties(model.arcs[i].properties,true); 
	
	},false);

	layer.add(redLine);

	var arrow = [];
	var angle = Math.atan2(pts[1]-pts[3], pts[0]-pts[2]);

	//http://yassinebenabbas.wordpress.com/article/opencv-dessiner-une-ligne-avec-une-31z31ug7b5vz5-7/
	//calcul des coordonn�es de l�extr�mit� avec l�angle violet

	//La fl�che � une magnitude sp�cifi�e par le param�tre arrowMagnitude
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


	//calcul des coordonn�es de l�extr�mit� avec l�angle vert
	arrow[2] = ( pts[2] +  10 * Math.cos(angle - Math.PI/6)) ;
	arrow[3] =  ( pts[3] +  10 * Math.sin(angle - Math.PI/6));
	//enfin, on dessine la deuxi�me extr�mit�
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


function redrawAll()
{
	layer1.clear();
	layer1.removeChildren();
	layer2.clear();
	layer2.removeChildren();
	layer3.clear();
	layer3.removeChildren();
	redrawPlaces();
	redrawTransitions();
	refreshLines();
	
	stage.clear();
	stage.add(backgound);
	stage.add(layer1); // les places
	stage.add(layer2); // les transitions
	stage.add(layer3); // les arcs
}

function redrawPlaces()
{
	for(var i=0;i<model.places.length;i++)
	{
		
		drawPlace(layer1,i);
	}

}

function redrawTransitions()
{
	for(var i=0;i<model.transitions.length;i++)
	{
		drawTransition(layer2,i);
	}
}

$(window).load(function(){

	$('body').append('<div id="dialog-modal" title="Properties"></div>')
	redrawPlaces()

	redrawTransitions()
	refreshLines();
	refreshEveryMatrixResults();

	printMatricesInvariants();

	posx=$('#container').findPos().x;
	posy=$('#container').findPos().y;

	stage = new Kinetic.Stage({
		container: 'container',
		width: 600,
		height: 400
	});
	

	
	var v1 =[1,0,0,1];
	var v2 = [1,0,0,1];

	console.log(compareVector(v1,v2));
	mouseEventCallBack();
	

	
	//Calcul des P invariants :
	//console.log(Pinvariants());
	
	//Calcul des T invariants :
	//console.log(Tinvariants());
	
	//console.log(omegaMoins(model));
	//console.log(omegaPlus(model));

	stage.add(backgound);
	stage.add(layer1); // les places
	stage.add(layer2); // les transitions
	stage.add(layer3); // les arcs

	$( "#dialog-modal" ).dialog({
	height: 200,
	width:500,
	modal: true,
	autoOpen: false
	});
	
	$( "#dialog-modal" ).dialog({
	close: function( event, ui ) {
	$( "#dialog-modal" ).html('');
	}
	});
	
	

})



function displayProperties(Json,editable) 
{
$( "#dialog-modal" ).html('');
	for(key in Json)
	{
		$( "#dialog-modal" ).append('<span class="key">'+key+' : </span>');
		if(editable)
			$( "#dialog-modal" ).append('<input type="text" class="value_edit" id="value_'+key+'"  value="'+Json[key]+'"/></br>');
		else
			$( "#dialog-modal" ).append(Json[key]+'</br>');
	}
	if(editable)
		$( "#dialog-modal" ).append('<input type="button" onclick="editProperty()" value="Valider"/>');
		
	$( "#dialog-modal" ).append('<input type="button" onclick="eraseElement()" value="Supprimer"/>');
$( "#dialog-modal" ).dialog( "open" );


}


function editProperty()
{
	if($( "#dialog-modal" ).dialog( "isOpen" ))
	{
		$(".value_edit").each(function(){
		if(kindOfSelected==1)
			model.places[idSelected].properties[$(this).attr('id').replace("value_","")]=$(this).val();
		if(kindOfSelected==2)
			model.transitions[idSelected].properties[$(this).attr('id').replace("value_","")]=$(this).val();
		if(kindOfSelected==3)
			model.arcs[idSelected].properties[$(this).attr('id').replace("value_","")]=$(this).val();
		});
	}
	$( "#dialog-modal" ).dialog("close" );
	
	//console.log(model.places);
}


function eraseElement()
{
	if($( "#dialog-modal" ).dialog( "isOpen" ))
	{
		if(kindOfSelected==1)
		{
			model.places.splice(idSelected,1);
			for(var i=0;i<model.arcs.length;i++)
			{
				if((model.arcs[i].place2trans==1 && model.arcs[i].source==idSelected) || (model.arcs[i].place2trans!=1 && model.arcs[i].dest==idSelected))
					model.arcs.splice(i,1);
			}
		}
		else if(kindOfSelected==2)
		{
			model.transitions.splice(idSelected,1);
			for(var i=0;i<model.arcs.length;i++)
			{
				if((model.arcs[i].place2trans!=1 && model.arcs[i].source==idSelected) || (model.arcs[i].place2trans==1 && model.arcs[i].dest==idSelected))
					model.arcs.splice(i,1);
			}
			
		}
		else if(kindOfSelected==3)
			model.arcs.splice(idSelected,1);
	}
	$( "#dialog-modal" ).dialog("close" );
	redrawAll();
}


function Pinvariants()
{
	var invP = omega(model);
	//Calcul des P invariants :
	return CalculP_T(ConcatRight(invP,Identity(getNbRows(invP))),getNbRows(invP),getNbColumns(invP));

}


function Tinvariants()
{
	var invT = Transpose(omega(model));
	
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
var containerEventListener;
function mouseEventCallBack() {
	var previousPositionX;
	var previousPositionY;
	containerEventListener = function(event) {
		if(kindOfAdd == 0){
			createPlace(event.pageX-posx,event.pageY-posy,0);
			//redrawPlaces();
			//redrawAll();
		}
		else if(kindOfAdd == 1) {
			createTransition(event.pageX-posx,event.pageY-posy);
			//redrawTransitions();
			//redrawAll();
		}
		redrawAll();
		//refreshLines();

		refreshEveryMatrixResults();

		printMatricesInvariants();
		//console.log(Pinvariants());


		//Calcul des T invariants :
		//console.log(Tinvariants());

		generateEveryMatrixInput();
		
		/*stage.clear();
		stage.add(backgound);
		stage.add(layer1); // les places
		stage.add(layer2); // les transitions
		stage.add(layer3); // les arcs*/
	}

	document.getElementById('container').addEventListener ('click', 
			containerEventListener, false
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
			html += "<td><input class=\"disable\" type=\"text\" style=\"width:30px;\" value=\"0\" id=\""+which+"_"+i+"_"+j+"\"/></td>";
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
					html += "<td><input class=\"disable\" type=\"text\" style=\"width:30px;\" value=\"0\" id=\""+which+"_"+i+"_"+j+"\"/></td>";
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
	var astuce ="";
	if(status == 0) {
		which = "matrice_w";
		astuce = "N'oubliez pas la relation suivante : <br/> W = (W+)-(W-)";
		res = omega(model);
	}
	else if(status == 1) {
		which = "matrice_wplus";
		astuce = "Deux choix possibles :<br/>1 lorsque la place P est une sortie de la transition T.<br />"+
				 "0 lorsque la place P n'appartient pas aux sorties de la transition T.";
		res = omegaPlus(model);
	}
	else if(status == 2) {
		which = "matrice_wmoins";
		astuce = "Deux choix possibles :<br/>		1 lorsque la place P est une entrée de la transition T.<br />"+
				 "		0 lorsque la place P n'appartient pas aux entrées de la transition T.";
		res = omegaMoins(model);
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
			// en fonction de which, �crire le message d'erreur ou erreur correspondante + modifier css
			if(document.getElementById(which+"_astuces") != null) {
				var html = '<b>Incorrect<br/>Indices : </b><br/>'+astuce;
				document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
				document.getElementById(which+"_astuces").style.visibility = "visible";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
		else if(identique == true) {
			// Modification css pour etre sur que le background est vert
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'Correct';
				document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
				document.getElementById(which+"_astuces").style.visibility = "visible";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
	else {
		if(document.getElementById(which+"_astuces") != null) {
			var html = 'Aucune matrice';
			document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
				document.getElementById(which+"_astuces").style.visibility = "visible";
			document.getElementById(which+"_astuces").innerHTML = html;
		}
	}
}

function controlerInvariant(status) {
	var which = "";
	var res;
	var astuce = "";
	if(status == 0) {
		which = "matrice_Tinvariants";
		astuce = "On cherche les composantes répétitives : <br/> Démontrez qu'il existe une séquence de franchissements S telle que T(S)=D (avec D un sous-ensemble non vide contenant l'ensemble des transitions) et W*S = 0.<br/>"+
				 "La démonstration a effectuée :<br/> Mj = Mi + W*S<br/>Mj = Mi<br/> ==>W*S = 0 <br/>"+
				 "N'oubliez pas que les composantes répétitives sont indépendantes du marquage !";
		res = Tinvariants();
	}
	else if(status == 1) {
		which = "matrice_Pinvariants";
		astuce = "Pour déterminer si le RdP est borné:<br/> Il faut calculer W, chercher les solutions telles que q &isin; N<sup>n</sup> du système d’équations q<sup>T</sup>W = 0<sub>1 x m</sub>, et former l’union des composantes conservatives, si elles existent.<br/>"+
				 "Un invariant de place est un ensemble de places pour lesquelles la somme (pondérées par le vecteur trouvé précédemment) est constante pour n’importe quel marquage accessible atteignable à partir du marquage initial.";
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
				// en fonction de which, �crire le message d'erreur ou erreur correspondante + modifier css
				if(document.getElementById(which+"_astuces") != null) {
					var html = '<b>Incorrect<br/>Indices : </b><br/>'+astuce;
					document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
					document.getElementById(which+"_astuces").style.visibility = "visible";
					document.getElementById(which+"_astuces").innerHTML = html;
				}
			}
			else if(identique == true) {
				// Modification css pour etre sur que le background est vert
				if(document.getElementById(which+"_astuces") != null) {
					var html = 'Correct';
					document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
					document.getElementById(which+"_astuces").style.visibility = "visible";
					document.getElementById(which+"_astuces").innerHTML = html;
				}
			}
		}
		else {
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'Aucune matrice';
				document.getElementById(which+"_astuces").style.backgroundColor = "#DD1111";
				document.getElementById(which+"_astuces").style.visibility = "visible";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
}

function printMatricesInvariants() {
	var res = Pinvariants();
	var res2 = Tinvariants();

	if(res !== undefined) {
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

	if(res2 !== undefined) {
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

function accesCorrection() {
	kindOfAdd = -1;
	var elements = document.getElementsByClassName('disable');
	for(var i = 0; i < elements.length; i++) {
		elements[i].disabled = true;
	}
	stage.clear();
	document.getElementById('container').innerHTML = "";
	stage2 = new Kinetic.Stage({
		container: 'container',
		width: 600,
		height: 400
	});
	stage2.add(backgound);
	stage2.add(layer1); // les places
	stage2.add(layer2); // les transitions
	stage2.add(layer3); // les arcs

	stage2.setListening(false);
	document.getElementById('container').removeEventListener ('click',	containerEventListener, false);

	stage = new Kinetic.Stage({
		container: 'container_cor',
		width: 600,
		height: 400
	});
}


