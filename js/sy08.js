var layerArcs = new Kinetic.Layer();
var layerTransitions = new Kinetic.Layer();
var layerPlaces = new Kinetic.Layer();
var stage;
var posx;
var posy;

//Attention, pour calculer l'arbre de marquage, ça change des choses : 
//la plupart de nos fonctions se basent sur la var model, et là nous devons faire une sorte de simulation, sans toucher au model original.
//Du coup, j'ai mis model en paramètre des fonctions qui m'interesse, mais il pourrait être (très) interessant de faire un peu plus de la POO.

//http://geekz.fr/Les-reseaux-de-Petri?artsuite=3
//Marquage.js// Contient tout ce qu'il faut pour construire un arbre de marquage

var marquages = [];
var predecesseurs = [];
var transitionsFranchies; // Pour quasi vivant : Toutes les transitions sont franchies
var sauf; //borne un 1 pour tout marquage
var borne; //pas de w
var blocage;

var tabAccesCorrection = new Array(6);

var transition_width = 50;
var transition_height = 10;
var place_radius = 20;

//On ne peut pas utiliser l'opérateur ==
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
			res[i] = parseInt(v1[i],10)+parseInt(v2[i],10);

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
		if(parseInt(v1[i],10)>parseInt(v2[i],10))
			res.push(i);
		else if(parseInt(v2[i],10)>parseInt(v1[i],10))
			return [];


	}
	return res;

}













//Utiliser dans le cadre de l'ajout des diff�rents composants dans le canvas
//0 place / 1 transitions / 2 arcs
var kindOfAdd = -1;

//Voici les diff�rentes variables utilis�es dans le cadre de l'ajout d'un arc.
var place2transTEMP = -1;
var source = -1;

var idSelected = -1;
var kindOfSelected = -1; //1 pour places, 2 pour transitions et 3 pour arcs





function createPlace(x,y,m)
{
	var newY = y < 40 ? 40 : y;
	var newX = x < 40 ? 40 : x;
			
	newY = newY > 400-40 ? 400-40 : newY;
	newX = newX > 600-40 ? 600-40 : newX;
	var res = {
			coordx: newX,
			coordy: newY,
			properties : {
				marking : m
			}

	}
	model.places.push(res);

}

function createTransition(x,y)
{
	var newY = y < 40 ? 40 : y;
	var newX = x < 40 ? 40 : x;
			
	newY = newY > 400-40 ? 400-40 : newY;
	newX = newX > 600-40 ? 600-40 : newX;
	var res = {
			coordx: newX,
			coordy: newY
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
	   if(xhr.readyState == 4 && (xhr.statut == 200 || xhr.statut == 0)){
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


function arbreDeCouverture(idElementAffichage)
{
	$(idElementAffichage).html("");
	marquages = [];
	predecesseurs = [];
	var m0 = getMarquage(model);
	marquages.push(m0);
	predecesseurs.push(m0);

	borne=true;
	blocage=false;
	if(Math.max.apply(Math, m0)<=1)
		sauf=true;
	else
		sauf=false;

	transitionsFranchies = [];
	makeMeATree(model,0, idElementAffichage);

/*
	$('#tree').append("</br>Le réseau est ");
	if(!borne)
		$('#tree').append("non ");
	$('#tree').append("borné</br>");

	$('#tree').append("</br>Le réseau est ");
	if(!sauf)
		$('#tree').append("non ");
	$('#tree').append("sauf</br>");
*/
	// A Vérifier


	//$('#tree').append("</br>Le réseau est ");
	if(transitionsFranchies.length != model.transitions.length) {
		//$('#tree').append("non ");
		quasivivant = false;
	}
	else 
		quasivivant = true;

	//$('#tree').append("quasi vivant</br>");



}


//jQuery.extend(true, {}, model) Poure recopier un objet 

function makeMeATree(model,level, idElementAffichage)
{
	var tmpModel = jQuery.extend(true, {}, model);
	var trFranchissables = getTransitionsFranchissables(model);

	var oldMarquage = getMarquage(model);

	if(level==0)
		$(idElementAffichage).append(oldMarquage+"");

	if(trFranchissables.length==0)
	{
		$(idElementAffichage).append(" Blocage");
		blocage=true;
	}
	for(var i=0; i<trFranchissables.length; i++) {
		if(transitionsFranchies.indexOf(trFranchissables[i])==-1)
			transitionsFranchies.push(trFranchissables[i]);
		if(level==0)
			predecesseurs.splice(1,predecesseurs.length);
			
		var mqs = jQuery.extend(true, [], marquages);
		resModel = franchirTransition(jQuery.extend(true, {}, model),trFranchissables[i]);

		if(resModel!=false)
		{
			$(idElementAffichage).append("</br>");
			var newMarquage = getMarquage(resModel);
			for(var j=0;j<4*level;j++)
				$(idElementAffichage).append("&nbsp;");
			$(idElementAffichage).append("|___");
			$(idElementAffichage).append(newMarquage+" (T"+(parseInt(trFranchissables[i],10)+1)+")");
			
			if(isNotOld(newMarquage,mqs))
				makeMeATree(resModel,level+1, idElementAffichage);
			else
				$(idElementAffichage).append(" (vieux)");
		}
	}


}

function checkIfNonBorne(newMarquage)
{
	var returnValue = jQuery.extend(true, [], newMarquage);
	for(var i=0; i<predecesseurs.length; i++) {

		var res = getComposanteW(newMarquage,predecesseurs[i]);		
		if(res.length>0)
		{
			for(var j=0;j<res.length;j++)
			{
				returnValue[res[j]]="w";
			}
		}
		//return returnValue;


	}
	return returnValue;

}


function isNotOld(newMarquage,marquages)
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
	var newMarquageNB = checkIfNonBorne(newMarquage);

	if(!compareVector(newMarquageNB,newMarquage))
	{
		borne=false;
		sauf=false;
	}
	newMarquage=newMarquageNB;
	//if(isNotOld(newMarquage))
	//{


		marquages.push(newMarquage);
		predecesseurs.push(newMarquage);

		model = setMarquage(model, newMarquage);
		if(Math.max.apply(Math, newMarquage)>1)
			sauf=false;
		return model;
	//}
	//return false;



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
		for(var j =0;j<getNbRows(oMoins);j++)
		{
			if(model.places[j].properties['marking']!="w")
			{
				if(model.places[j].properties['marking']<oMoins[j][i] )
				{			

					okPre= false;
				}
			}

		}
		if(okPre)
			res.push(i);


	}
	return res;



}

function drawPlace(layer, i)
{

	var isCurrentSource = (place2transTEMP==1 && source==i);
	var group = new Kinetic.Group({
	x: model.places[i].coordx,
		y: model.places[i].coordy,
		draggable : true,
		dragBoundFunc: function(pos) {
			
            var newY = pos.y < 40 ? 40 : pos.y;
			var newX = pos.x < 40 ? 40 : pos.x;
			
			newY = newY > 400-40 ? 400-40 : newY;
			newX = newX > 600-40 ? 600-40 : newX;
            return {
              x: newX ,
              y: newY
            };
          }

	});
	var cercle = new Kinetic.Circle({
		radius: place_radius,
		//fill: 'red',
		stroke: isCurrentSource ? 'red' : 'black',
		strokeWidth: 4,
		name : i,
		fillText: "P" + i 
	});


	var label = new Kinetic.Text({
		
		text: 'P'+(i+1),
		fontSize: 18,
		fontFamily: 'Calibri',
		fill: '#555',
		padding: 20,
		align: 'center'
	});
	
	var marking = new Kinetic.Text({
		
		text: ''+model.places[i].properties['marking'],
		fontSize: 18,
		fontFamily: 'Calibri',
		fill: '#555',
		x: parseInt(model.places[i].coordx,10)-group.getX()-place_radius,
		y: parseInt(model.places[i].coordy,10)-group.getY()-place_radius/2+4,
		width:38,
		align: 'center'
	});
	


	 
	group.add(cercle);
	group.add(marking);
	group.add(label);


	group.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au d�but du d�placement et redessiner � la fin (mais moins beau ^^)
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
			if(place2transTEMP == -1 || place2transTEMP==1) {
				source = i;
				place2transTEMP = 1;
			}
			else if(place2transTEMP == 0){
				// on ins�re dans le JSON
				if(model.transitions[source]!=undefined)
				{
					if(detectArc(i, source) != 0) {
						for(var z = 0; z < model.arcs.length; z++) {
							if(model.arcs[z].source==i && model.arcs[z].dest==source && model.arcs[z].place2trans==1)
							{
								model.arcs[z].source=source;
								model.arcs[z].dest=i;
								model.arcs[z].place2trans = 0;
								break;
							}
							else if(model.arcs[z].source==source && model.arcs[z].dest==i && model.arcs[z].place2trans==0)
							{
								source = i;
								place2transTEMP = 1;
								redrawAll();
								return;
							}
						}
					}
					else
						createArc(0,source,i,1);
					
					
					generateInvariantInput(0);
					generateInvariantInput(1);
					
					printMatricesInvariants();
					
				}
				place2transTEMP = -1;
				source = -1;
			}
			redrawAll();
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
	var isCurrentSource = (place2transTEMP==0 && source==i);
	var rec = new Kinetic.Rect({
		width: transition_width,
		height: transition_height,
		//fill: 'red',
		stroke: isCurrentSource ? 'red' : 'black',
		strokeWidth: 4,

		name : i
	});



	var group = new Kinetic.Group({
		x: model.transitions[i].coordx,
		y: model.transitions[i].coordy,
		draggable : true,
		dragBoundFunc: function(pos) {
			
            var newY = pos.y < 20 ? 20 : pos.y;
			var newX = pos.x < 20 ? 20 : pos.x;
			
			var newY = newY > 400-30 ? 400-30 : newY;
			var newX = newX > 600-70 ? 600-70 : newX;
            return {
              x: newX ,
              y: newY
            };
          }

	});

	group.add(rec);


	var label = new Kinetic.Text({
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
		model.transitions[rec.getName()].coordx = rec.getAbsolutePosition().x; 
		model.transitions[rec.getName()].coordy = rec.getAbsolutePosition().y; 
		refreshLines();
	});

	group.on('click', function() {
		if(kindOfAdd == 2) {
			// On d�fini le cercle comme l'�lement premier de l'arc
			if(place2transTEMP == -1 || place2transTEMP==0) {
				source = i;
				place2transTEMP = 0;
			}
			else if(place2transTEMP == 1){
				if(model.places[source]!=undefined)
				{
					// on ins�re dans le JSON
					
					// Si l'arc existe deja
					if(detectArc(source,i ) != 0) {
						for(var z = 0; z < model.arcs.length; z++) {
							if(model.arcs[z].source==i && model.arcs[z].dest==source && model.arcs[z].place2trans==0)
							{
								model.arcs[z].source=source;
								model.arcs[z].dest=i;
								model.arcs[z].place2trans = 1;
								break;
							}
							else if(model.arcs[z].source==source && model.arcs[z].dest==i && model.arcs[z].place2trans==1)
							{
								source = i;
								place2transTEMP = 0;
								redrawAll();
								return;
							}
						}
					}
					else
						createArc(1,source,i,1);
					
					generateInvariantInput(0);
					generateInvariantInput(1);

				}
				place2transTEMP = -1;
				source = -1;
			}
			redrawAll();
		}
		else {
			// Sinon on affiche les caract�ristiques de l'�l�ments (� voir si on le fait ou pas)
		}

	}, false
	);

	layer.add(group);

}

//http://stackoverflow.com/questions/6091728/line-segment-circle-intersection
//Source : transition, dest place
function getAnchorPointPlace(sourceX,sourceY,destX,destY)
{
	var theta = Math.atan2(destY-sourceY, destX-sourceX)
	return {
		  x: sourceX + place_radius * Math.cos(theta),
		  y: sourceY + place_radius * Math.sin(theta)
		};


}

//Source : place, dest transition
function getAnchorPointTransition(sourceX,sourceY,destX,destY)
{
	//Points d'ancrages possibles : les milieux des côtés du rectangle qui représente une transition
	var anchor1X = destX+transition_width/2;
	var anchor1Y = destY+transition_height/2;
	var len1 = Math.sqrt((sourceX-anchor1X)*(sourceX-anchor1X)+(sourceY-destY)*(sourceY-destY));
	var len2 = Math.sqrt((sourceX-destX)*(sourceX-destX)+(sourceY-anchor1Y)*(sourceY-anchor1Y));
	var len3 = Math.sqrt((sourceX-anchor1X)*(sourceX-anchor1X)+(sourceY-(destY+transition_height))*(sourceY-(destY+transition_height)));
	var len4 = Math.sqrt((sourceX-(destX+transition_width))*(sourceX-(destX+transition_width))+(sourceY-anchor1Y)*(sourceY-anchor1Y));
	if(len1<len2 && len1<len3 && len1<len4)
		return {
		  x: anchor1X,
		  y: destY
		};
	if(len2<len1 && len2<len3 && len2<len4)
		return {
		  x: destX,
		  y: anchor1Y
		};
	if(len3<len1 && len3<len2 && len3<len4)
		return {
		  x: anchor1X,
		  y: destY+transition_height
		};
	else
		return {
		  x: destX+transition_width,
		  y: anchor1Y
		};
}

function drawLine(layer, i)
{

	var group = new Kinetic.Group();
	var pts = new Array();
	
	if(model.arcs[i].place2trans==1)
	{
		var pt = getAnchorPointTransition(model.places[model.arcs[i].source].coordx,model.places[model.arcs[i].source].coordy,model.transitions[model.arcs[i].dest].coordx,model.transitions[model.arcs[i].dest].coordy);
		var pt2 = getAnchorPointPlace(model.places[model.arcs[i].source].coordx,model.places[model.arcs[i].source].coordy,model.transitions[model.arcs[i].dest].coordx,model.transitions[model.arcs[i].dest].coordy);
		pts.push(pt2.x);
		pts.push(pt2.y);
		
		
		pts.push(pt.x);
		pts.push(pt.y);
	}
	else
	{
		var pt = getAnchorPointTransition(model.places[model.arcs[i].dest].coordx,model.places[model.arcs[i].dest].coordy,model.transitions[model.arcs[i].source].coordx,model.transitions[model.arcs[i].source].coordy);
		pts.push(pt.x);
		pts.push(pt.y);
		var pt2 = getAnchorPointPlace(model.places[model.arcs[i].dest].coordx,model.places[model.arcs[i].dest].coordy,model.transitions[model.arcs[i].source].coordx,model.transitions[model.arcs[i].source].coordy);
		pts.push(pt2.x);
		pts.push(pt2.y);
	}
	

	var ponderation = new Kinetic.Text({
		
		text: ''+model.arcs[i].properties['value'],
		fontSize: 18,
		fontFamily: 'Calibri',
		fill: '#555',
		x : (pts[0]+pts[2])/2,
		y: (pts[1]+pts[3])/2,
		padding:10,
		align: 'center'
	});

	var redLine = new Kinetic.Line({
		points: pts,
		stroke: 'black',
		strokeWidth: 3,
		lineCap: 'round',
		lineJoin: 'round'
	});

	

	group.add(ponderation);
	group.add(redLine);
	
	
	

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
		strokeWidth:2,
		lineCap: 'round',
		lineJoin: 'round'
	});




	//calcul des coordonn�es de l�extr�mit� avec l�angle vert
	arrow[2] = ( pts[2] +  10 * Math.cos(angle - Math.PI/6)) ;
	arrow[3] =  ( pts[3] +  10 * Math.sin(angle - Math.PI/6));
	//enfin, on dessine la deuxi�me extr�mit�
	var redLine2 = new Kinetic.Line({
		points: arrow,
		stroke: 'black',
		strokeWidth:2,
		lineCap: 'round',
		lineJoin: 'round'
	});
	group.add(redLine1);
	group.add(redLine2);
	
	
	group.on('dblclick', function() {
		idSelected = i;
		kindOfSelected=3;
		displayProperties(model.arcs[i].properties,true); 

	},false);

	layer.add(group);
}









function redrawAll()
{

	refreshLines();
	redrawPlaces();
	redrawTransitions();
	


}

function recurseClear(container)
{

	if(container instanceof Kinetic.Group || container instanceof Kinetic.Layer || container instanceof Kinetic.Container)
	{

		var children = container.getChildren();
		for(var i=0;i<children.length;i++)
		{
			recurseClear(children[i]);
			
		}
	}
	container.destroy();
	
}


function refreshLines()
{
	recurseClear(layerArcs);
	var l = new Kinetic.Layer();
	for(var i=0;i<model.arcs.length;i++)
	{
		drawLine(l,i);
	}
	
	stage.add(l);
	layerArcs=l;
}

function redrawPlaces()
{
	recurseClear(layerPlaces);
	var l = new Kinetic.Layer();
	for(var i=0;i<model.places.length;i++)
	{

		drawPlace(l,i);
	}
	stage.add(l);
	layerPlaces=l;

}

function redrawTransitions()
{

	recurseClear(layerTransitions);
	var l = new Kinetic.Layer();
	for(var i=0;i<model.transitions.length;i++)
	{
		drawTransition(l,i);
	}
	stage.add(l);
	layerTransitions=l;
}

function resetAccesCorrection() {
	var i = 0;
	while(i < tabAccesCorrection.length) {
		tabAccesCorrection[i] = false;
		i++;
	}
}

$(window).load(function(){

	$('body').append('<div id="dialog-modal" title="Properties"></div>');
	$('body').append('<div id="tree"></div>');
	
	$('.add_element').click(function(){
		$('.add_element').removeClass("activeButton");
		if(activateAddElement($(this).attr('id')))
			$(this).addClass("activeButton");
		redrawAll();
        
    });
	

	posx=$('#container').findPos().x;
	posy=$('#container').findPos().y;

	stage = new Kinetic.Stage({
		container: 'container',
		width: 600,
		height: 400
	});
	
	if(model.arcs.length>0 || model.transitions.length>0 || model.places.length>0)
		redrawAll();
	//redrawTransitions();
	//refreshLinesIni();
	//layer1=layertmp;
	//stage.add(layer1);
	//redrawPlaces();
	//redrawTransitions();
	
	
	
	
	refreshEveryMatrixResults();

	printMatricesInvariants();
	
	
	mouseEventCallBack();



	resetAccesCorrection();

	
	$( "#dialog-modal" ).dialog({
		height: 200,
		width:500,
		modal: true,
		autoOpen: false,
		position : [window.innerWidth/2-250,window.innerHeight/2-100]
	});
	
	

	




})

$(window).resize(function(){
    $( "#dialog-modal" ).dialog({
		position : [window.innerWidth/2-250,window.innerHeight/2-100]
	});
	posx=$('#container').findPos().x;
	posy=$('#container').findPos().y;
	});


function displayProperties(Json,editable) 
{
	$( "#dialog-modal" ).html('');
	for(key in Json)
	{
		$( "#dialog-modal" ).append('<span class="key">'+key+' : </span>');
		if(editable)
			$( "#dialog-modal" ).append('<input type="text" class="value_edit" id="value_'+key+'" maxlength="3" value="'+Json[key]+'"/></br>');
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
			if(!isNaN(parseInt($(this).val(),10)))
			{
				if(kindOfSelected==1)
					model.places[idSelected].properties[$(this).attr('id').replace("value_","")]=parseInt($(this).val(),10);
				if(kindOfSelected==2)
					model.transitions[idSelected].properties[$(this).attr('id').replace("value_","")]=parseInt($(this).val(),10);
				if(kindOfSelected==3)
					model.arcs[idSelected].properties[$(this).attr('id').replace("value_","")]=parseInt($(this).val(),10);
			}
			});
	}
	$( "#dialog-modal" ).html('');
	$( "#dialog-modal" ).dialog("close" );
	redrawAll();
	refreshEveryMatrixResults();
	printMatricesInvariants();

}


function eraseElement()
{

	if($( "#dialog-modal" ).dialog( "isOpen" ))
	{
		if(kindOfSelected==1)
		{
			model.places.splice(idSelected,1);
			if(place2transTEMP==1 && source==idSelected)
			{
				place2transTEMP = -1;
				source = -1;
			}
			for(var i=0;i<model.arcs.length;i++)
			{
				if((model.arcs[i].place2trans==1 && model.arcs[i].source==idSelected) || (model.arcs[i].place2trans!=1 && model.arcs[i].dest==idSelected))
				{
					model.arcs.splice(i,1);
					i--;
				}
				else
				{
					if(model.arcs[i].place2trans==1 && model.arcs[i].source>idSelected)
					{
						model.arcs[i].source = model.arcs[i].source-1;
					}

					if(model.arcs[i].place2trans!=1 && model.arcs[i].dest>idSelected)
					{
						model.arcs[i].dest = model.arcs[i].dest-1;
					}
				}

			}
		}
		else if(kindOfSelected==2)
		{
			model.transitions.splice(idSelected,1);
			if(place2transTEMP==0 && source==idSelected)
			{
				place2transTEMP = -1;
				source = -1;
			}
			for(var i=0;i<model.arcs.length;i++)
			{
				if((model.arcs[i].place2trans!=1 && model.arcs[i].source==idSelected) || (model.arcs[i].place2trans==1 && model.arcs[i].dest==idSelected))
				{
					model.arcs.splice(i,1);
					i--;
				}
				else
				{
					if(model.arcs[i].place2trans!=1 && model.arcs[i].source>idSelected)
					{
						model.arcs[i].source = model.arcs[i].source-1;
					}

					if(model.arcs[i].place2trans==1 && model.arcs[i].dest>idSelected)
					{
						model.arcs[i].dest = model.arcs[i].dest-1;
					}
				}
			}

		}
		else if(kindOfSelected==3)
			model.arcs.splice(idSelected,1);
	}
	$( "#dialog-modal" ).dialog("close" );
	redrawAll();
	refreshEveryMatrixResults();
	generateInvariantInput(0);
	generateInvariantInput(1);
	printMatricesInvariants();
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



function activateAddElement(id)
{
	if(id=='add_place')
		return activateAddPlace();
	else if(id=='add_transition')
		return activateAddTransition();
	else if(id=='add_arc')
		return activateAddArc();
}

function activateAddPlace() {
	if(kindOfAdd!=0)
	{
		kindOfAdd = 0;
		place2transTEMP = -1;
		source = -1;
	}
	else
	{
		kindOfAdd = -1;
		place2transTEMP = -1;
		source = -1;
		return false;
	}
	return true;
	
	
}

function activateAddTransition() {
	if(kindOfAdd!=1)
	{
		kindOfAdd = 1;
		place2transTEMP = -1;
		source = -1;
		
	}
	else
	{
		kindOfAdd = -1;
		place2transTEMP = -1;
		source = -1;
		return false;
	}
	return true;
		

}

function activateAddArc() {
	if(kindOfAdd!=2)
	{
		kindOfAdd = 2;
		place2transTEMP = -1;
		source = -1;
	}
	else
	{
		kindOfAdd = -1;
		place2transTEMP = -1;
		source = -1;
		return false;
	}
	return true;
}

function desactivateAdd() {
	kindOfAdd = -1;
}

var containerEventListener;
function mouseEventCallBack() {
	var previousPositionX;
	var previousPositionY;
	containerEventListener = function(event) {
		if(kindOfAdd == -1)
			return;
		if(kindOfAdd == 0 || kindOfAdd == 1) {
			if(kindOfAdd == 0){
				if(model.places.length < 10)
					createPlace(event.pageX-posx,event.pageY-posy,0);
				else
					alert('Impossible de mettre plus de 10 places');
				//redrawPlaces();
				//redrawAll();
			}
			else if(kindOfAdd == 1) {
				if(model.transitions.length < 10)
					createTransition(event.pageX-posx,event.pageY-posy);
				else
					alert('Impossible de mettre plus de 10 transitions');
				//redrawTransitions();
				//redrawAll();
			}
			redrawAll();
			resetAccesCorrection();
			
			// On cache tout les éléments 'astuces' dans le cas ou ils étaient précédemment affichés !
			var elements = document.getElementsByClassName('astuces');
			for(var i=0; i < elements.length; i++) {
				elements[i].style.visibility = "hidden";
			}
			generateEveryMatrixInput();
		}

		
		
		refreshEveryMatrixResults();
		printMatricesInvariants();
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


function generateEveryMatrixInputCor() {
	for(var i=3; i < 6; i++) {
		generateMatrixInput(i);
	}
	//Calcul de l'invariant et determination du nombre de Pt
	generateInvariantInput(2);
	generateInvariantInput(3);
}

function generateMatrixInput(statut) {
	var which="";
	if(statut == 0)
		which = "matrice_w";
	else if(statut == 1)
		which = "matrice_wplus";
	else if(statut == 2)
		which = "matrice_wmoins";
	else if(statut == 3)
		which = "matrice_w_cor";
	else if(statut == 4)
		which = "matrice_wplus_cor";
	else if(statut == 5)
		which = "matrice_wmoins_cor";

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
	else if(statut == 2) {
		which = "matrice_Tinvariants_cor";
		res = Tinvariants();
	}
	else if(statut == 3) {
		which = "matrice_Pinvariants_cor";
		res = Pinvariants();
	}

	var html="";

	if(res != undefined) {
		html = "<table id=\""+which+"\"><tr><td></td>";
		var nbLig = res.length;
		if(nbLig > 0) {
			var nbCol = res[0].length;

			for(var i=0;i<nbCol;i++) {
				if(statut == 0 || statut == 2)
					html += "<td>T"+(i+1)+"</td>";
				else if(statut == 1 || statut == 3)
					html += "<td>P"+(i+1)+"</td>";
			}
			html+= "</tr>";
			for(var i=0;i<nbLig;i++) {
				html += "<tr><td>Pt"+(i+1)+"</td>";
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

function controlerMatrice(statut) {
	var which = "";
	var res;
	var astuce ="";
	if(statut == 0) {
		which = "matrice_w";
		astuce = "N'oubliez pas la relation suivante : <br/> W = (W+)-(W-)";
		res = omega(model);
	}
	else if(statut == 1) {
		which = "matrice_wplus";
		astuce = "Deux choix possibles :<br/>Egal au poids de l'arc lorsque la place P est une sortie de la transition T.<br />"+
		"0 lorsque la place P n'appartient pas aux sorties de la transition T.";
		res = omegaPlus(model);
	}
	else if(statut == 2) {
		which = "matrice_wmoins";
		astuce = "Deux choix possibles :<br/>Egal au poids de l'arc lorsque la place P est une entrée de la transition T.<br />"+
		"		0 lorsque la place P n'appartient pas aux entrées de la transition T.";
		res = omegaMoins(model);
	}
	else if(statut == 3) {
		which = "matrice_w_cor";
		astuce = "N'oubliez pas la relation suivante : <br/> W = (W+)-(W-)";
		res = omega(model);
	}
	else if(statut == 4) {
		which = "matrice_wplus_cor";
		astuce = "Deux choix possibles :<br/>Egal au poids de l'arc lorsque la place P est une sortie de la transition T.<br />"+
		"0 lorsque la place P n'appartient pas aux sorties de la transition T.";
		res = omegaPlus(model);
	}
	else if(statut == 5) {
		which = "matrice_wmoins_cor";
		astuce = "Deux choix possibles :<br/>Egal au poids de l'arc lorsque la place P est une entrée de la transition T.<br />"+
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
				if(statut == 0)
					tabAccesCorrection[0] = true;
				else if(statut ==1)
					tabAccesCorrection[1] = true;
				else if(statut == 2)
					tabAccesCorrection[2] = true;

				document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
				document.getElementById(which+"_astuces").style.visibility = "visible";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
	else {
		if(document.getElementById(which+"_astuces") != null) {
			var html = 'Aucune matrice';
			document.getElementById(which+"_astuces").style.backgroundColor = "#FE9A2E";
			document.getElementById(which+"_astuces").style.visibility = "visible";
			document.getElementById(which+"_astuces").innerHTML = html;
		}
	}
}

function controlerInvariant(statut) {
	var which = "";
	var res;
	var astuce = "";
	if(statut == 0) {
		which = "matrice_Tinvariants";
		astuce = "On cherche les composantes répétitives : <br/> Démontrez qu'il existe une séquence de franchissements S telle que T(S)=D (avec D un sous-ensemble non vide contenant l'ensemble des transitions) et W*S = 0.<br/>"+
		"La démonstration a effectuée :<br/> Mj = Mi + W*S<br/>Mj = Mi<br/> ==>W*S = 0 <br/>"+
		"N'oubliez pas que les composantes répétitives sont indépendantes du marquage !";
		res = Tinvariants();
	}
	else if(statut == 1) {
		which = "matrice_Pinvariants";
		astuce = "Pour déterminer si le RdP est borné:<br/> Il faut calculer W, chercher les solutions telles que q &isin; N<sup>n</sup> du système d’équations q<sup>T</sup>W = 0<sub>1 x m</sub>, et former l’union des composantes conservatives, si elles existent.<br/>"+
		"Un invariant de place est un ensemble de places pour lesquelles la somme (pondérées par le vecteur trouvé précédemment) est constante pour n’importe quel marquage accessible atteignable à partir du marquage initial.";
		res = Pinvariants();
	}
	if(statut == 2) {
		which = "matrice_Tinvariants_cor";
		astuce = "On cherche les composantes répétitives : <br/> Démontrez qu'il existe une séquence de franchissements S telle que T(S)=D (avec D un sous-ensemble non vide contenant l'ensemble des transitions) et W*S = 0.<br/>"+
		"La démonstration a effectuée :<br/> Mj = Mi + W*S<br/>Mj = Mi<br/> ==>W*S = 0 <br/>"+
		"N'oubliez pas que les composantes répétitives sont indépendantes du marquage !";
		res = Tinvariants();
	}
	else if(statut == 3) {
		which = "matrice_Pinvariants_cor";
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
					if(statut == 0)
						tabAccesCorrection[3] = true;
					else if(statut == 1)
						tabAccesCorrection[4] = true;
					document.getElementById(which+"_astuces").style.backgroundColor = "#119911";
					document.getElementById(which+"_astuces").style.visibility = "visible";
					document.getElementById(which+"_astuces").innerHTML = html;
				}
			}
		}
		else {
			if(document.getElementById(which+"_astuces") != null) {
				var html = 'Aucun invariant';

				if(statut == 0)
					tabAccesCorrection[3] = true;
				else if(statut == 1)
					tabAccesCorrection[4] = true;


				document.getElementById(which+"_astuces").style.backgroundColor = "#FE9A2E";
				document.getElementById(which+"_astuces").style.visibility = "visible";
				document.getElementById(which+"_astuces").innerHTML = html;
			}
		}
	}
	else {
		if(document.getElementById(which+"_astuces") != null) {
			var html = 'Aucun invariant';

			if(statut == 0)
				tabAccesCorrection[3] = true;
			else if(statut == 1)
				tabAccesCorrection[4] = true;

			document.getElementById(which+"_astuces").style.backgroundColor = "#FE9A2E";
			document.getElementById(which+"_astuces").style.visibility = "visible";
			document.getElementById(which+"_astuces").innerHTML = html;
		}
	}
}


function controlerProprietes() {
	var astuce = "";

	if (!(formu_prop.rdpborne[0].checked || formu_prop.rdpborne[1].checked) ||
		!(formu_prop.rdpSauf[0].checked || formu_prop.rdpSauf[1].checked) ||
		!(formu_prop.rdpQuasiVivant[0].checked || formu_prop.rdpQuasiVivant[1].checked) ||
		!(formu_prop.rdpBlocage[0].checked || formu_prop.rdpBlocage[1].checked)) {
		document.getElementById("proprietes_astuces_comp2").style.display = 'none';
		document.getElementById("proprietes_astuces").style.backgroundColor = "#DD1111";
		document.getElementById("proprietes_astuces").style.visibility = "visible";
		document.getElementById("proprietes_astuces_comp").innerHTML = "Veuillez renseigner l'ensemble des propriétés !";		
	}
	else {
		document.getElementById("proprietes_astuces_comp2").style.display = 'inherit';
		var saufTMP = false;
		var borneTMP = false;
		var quasivivantTMP = false;
		var allIsCorrect = true;
		blocageTMP = false;

		if(formu_prop.rdpborne[0].checked)
			borneTMP = true;
		if(formu_prop.rdpSauf[0].checked)
			saufTMP = true;
		if(formu_prop.rdpQuasiVivant[0].checked)
			quasivivantTMP = true;
		if(formu_prop.rdpBlocage[0].checked)
			blocageTMP = true;

		arbreDeCouverture("#tree");
		if(borne != borneTMP) {
			if(borne)
				astuce += "Incorrect : le rdp est borné !<br/>";
			else
				astuce += "Incorrect : Le rdp est non borné.<br/>";
			allIsCorrect = false;
		}
		else {
			if(borne)
				astuce += "Correct : Le rdp est bien borné.<br/>";
			else
				astuce += "Correct : Le rdp est bien non borné.<br/>";
		}
		if(sauf != saufTMP) {
			if(sauf)
				astuce += "Incorrect : le rdp est sauf !<br/>";
			else
				astuce += "Incorrect : Le rdp est non sauf.<br/>";
			allIsCorrect = false;
		}
		else {
			if(sauf)
				astuce += "Correct : Le rdp est bien sauf.<br/>";
			else
				astuce += "Correct : Le rdp est bien non sauf.<br/>";
		}
		if(quasivivant != quasivivantTMP) {
			if(quasivivant)
				astuce += "Incorrect : le rdp est quasi vivant !<br/>";
			else
				astuce += "Incorrect : Le rdp est non quasi vivant.<br/>";
			allIsCorrect = false;
		}
		else{
			if(quasivivant)
				astuce += "Correct : Le rdp est bien quasi vivant.<br/>";
			else
				astuce += "Correct : Le rdp est bien non quasi vivant.<br/>";
		}
		if(blocage != blocageTMP) {
			if(blocage)
				astuce += "Incorrect : le rdp est en situation de blocage !<br/>";
			else
				astuce += "Incorrect : Le rdp n'est pas en situation de blocage.<br/>";
			allIsCorrect = false;
		}
		else{
			if(blocage)
				astuce += "Correct : Le rdp est bien en situation de blocage.<br/>";
			else
				astuce += "Correct : Le rdp est bien en situation de non blocage.<br/>";
		}

		if(allIsCorrect) {
			document.getElementById("proprietes_astuces").style.backgroundColor = "#119911";
			tabAccesCorrection[5] = true;
		}
		else
			document.getElementById("proprietes_astuces").style.backgroundColor = "#DD1111";
		document.getElementById("proprietes_astuces").style.visibility = "visible";
		document.getElementById("proprietes_astuces_comp").innerHTML = astuce;
	}
}


function controlerProprietesCorrection() {
	var astuce = "";

	if (!(formu_prop_cor.rdpBorne_cor[0].checked || formu_prop_cor.rdpBorne_cor[1].checked) ||
		!(formu_prop_cor.rdpSauf_cor[0].checked || formu_prop_cor.rdpSauf_cor[1].checked) ||
		!(formu_prop_cor.rdpQuasiVivant_cor[0].checked || formu_prop_cor.rdpQuasiVivant_cor[1].checked) ||
		!(formu_prop_cor.rdpBlocage_cor[0].checked || formu_prop_cor.rdpBlocage_cor[1].checked)) {
		
		document.getElementById("proprietes_astuces_cor_comp2").style.display = 'none';
		document.getElementById("proprietes_astuces_cor").style.backgroundColor = "#DD1111";
		document.getElementById("proprietes_astuces_cor").style.visibility = "visible";
		document.getElementById("proprietes_astuces_cor_comp").innerHTML = "Veuillez renseigner l'ensemble des propriétés !";		
	}
	else {
		document.getElementById("proprietes_astuces_cor_comp2").style.display = 'inherit';
		var saufTMP = false;
		var borneTMP = false;
		var quasivivantTMP = false;
		var blocageTMP = false;
		var allIsCorrect = true;

		if(formu_prop_cor.rdpBorne_cor[0].checked)
			var borneTMP = true;
		if(formu_prop_cor.rdpSauf_cor[0].checked)
			var saufTMP = true;
		if(formu_prop_cor.rdpQuasiVivant_cor[0].checked)
			var quasivivantTMP = true;
		if(formu_prop_cor.rdpBlocage_cor[0].checked)
			var blocageTMP = true;

		arbreDeCouverture("#treeCorrection");
		if(borne != borneTMP) {
			if(borne)
				astuce += "Incorrect : le rdp est borné !<br/>";
			else
				astuce += "Incorrect : Le rdp est non borné.<br/>";
			allIsCorrect = false;
		}
		else {
			if(borne)
				astuce += "Correct : Le rdp est bien borné.<br/>";
			else
				astuce += "Correct : Le rdp est bien non borné.<br/>";
		}
		if(sauf != saufTMP) {
			if(sauf)
				astuce += "Incorrect : le rdp est sauf !<br/>";
			else
				astuce += "Incorrect : Le rdp est non sauf.<br/>";
			allIsCorrect = false;
		}
		else {
			if(sauf)
				astuce += "Correct : Le rdp est bien sauf.<br/>";
			else
				astuce += "Correct : Le rdp est bien non sauf.<br/>";
		}
		if(quasivivant != quasivivantTMP) {
			if(quasivivant)
				astuce += "Incorrect : le rdp est quasi vivant !<br/>";
			else
				astuce += "Incorrect : Le rdp est non quasi vivant.<br/>";
			allIsCorrect = false;
		}
		else{
			if(quasivivant)
				astuce += "Correct : Le rdp est bien quasi vivant.<br/>";
			else
				astuce += "Correct : Le rdp est bien non quasi vivant.<br/>";
		}
		if(blocage != blocageTMP) {
			if(blocage)
				astuce += "Incorrect : le rdp est en situation de blocage !<br/>";
			else
				astuce += "Incorrect : Le rdp n'est pas en situation de blocage.<br/>";
			allIsCorrect = false;
		}
		else{
			if(blocage)
				astuce += "Correct : Le rdp est bien en situation de blocage.<br/>";
			else
				astuce += "Correct : Le rdp est bien en situation de non blocage.<br/>";
		}
		
		astuce += "";
		if(allIsCorrect)
			document.getElementById("proprietes_astuces_cor").style.backgroundColor = "#119911";
		else
			document.getElementById("proprietes_astuces_cor").style.backgroundColor = "#DD1111";
		document.getElementById("proprietes_astuces_cor").style.visibility = "visible";
		document.getElementById("proprietes_astuces_cor_comp").innerHTML = astuce;
	}
}

function printMatricesInvariants() {
	var res = Pinvariants();
	var res2 = Tinvariants();

	if(document.getElementById("matrice_Pinvariants_results") != null)
	{
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
			else
				document.getElementById("matrice_Pinvariants_results").innerHTML = "";
		}
		else
			document.getElementById("matrice_Pinvariants_results").innerHTML = "";
	}

	if(document.getElementById("matrice_Tinvariants_results") != null)
	{
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
			else
				document.getElementById("matrice_Tinvariants_results").innerHTML = "";
		}
		else
			document.getElementById("matrice_Tinvariants_results").innerHTML = "";
	}
}

var correctionActive = false;

function accesCorrection() {
	if(model.places.length < 1 || model.transitions.length < 1) {
		alert('Vous ne pouvez pas accéder à la correction. \nEssayer de réfléchir un minimum avant de demander la correction !');
		return;
	}
	var i = 0;
	while(i < tabAccesCorrection.length) {
		if(tabAccesCorrection[i] == false) {
			alert('Vous ne pouvez pas accéder à la correction. \nTout les éléments ci-dessus doivent être controlés !');
			return;
		}
		i++;
	}
	if(!correctionActive)
	{
		$('.add_element').removeClass("activeButton");
		$('.add_element').unbind('click');
		$('.add_element').attr("disabled", "disabled");
		correctionActive = true;
		kindOfAdd = -1;
		if(document.getElementById('lien_correction') != undefined)
			document.getElementById('lien_correction').style.visibility = "visible";
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
		//stage2.add(backgound);
		//copie des layers sinon ca bug et lorsqu'on modifie le model apres, et bien y a des impacts sur le résultat d'avant alors que ce n'est pas souhaité, on veut que cela reste intacte
		var layerPlacesCopie = layerPlaces.clone();
		var layerTransitionsCopie = layerTransitions.clone();
		var layerArcsCopie = layerArcs.clone();
		stage2.add(layerPlacesCopie); // les places
		stage2.add(layerTransitionsCopie); // les transitions
		stage2.add(layerArcsCopie); // les arcs

		stage2.setListening(false);
		document.getElementById('container').removeEventListener ('click',	containerEventListener, false);
		insertionCode();
		stage = new Kinetic.Stage({
			container: 'container_cor',
			width: 600,
			height: 400
		});
		// TODO : supprimer si on a une bdd sur la machine
		var model2 = {places:[{coordx:355.60975609756,coordy:119.45945945946,properties : {marking :1}},{coordx:460.9756097561,coordy:211.35135135135,properties : {marking :1}},{coordx:250.24390243902,coordy:211.35135135135,properties : {marking :1}},{coordx:540,coordy:82.702702702703,properties : {marking :1}},{coordx:250.24390243902,coordy:303.24324324324,properties : {marking :1}}],transitions:[{coordx:460.9756097561,coordy:137.83783783784},{coordx:460.9756097561,coordy:266.48648648649},{coordx:302.92682926829,coordy:156.21621621622},{coordx:250.24390243902,coordy:266.48648648649},{coordx:250.24390243902,coordy:340}],arcs:[{place2trans:1,source:0,dest:0,properties : {value :1}},{place2trans:1,source:0,dest:2,properties : {value :1}},{place2trans:1,source:3,dest:0,properties : {value :1}},{place2trans:0,source:0,dest:1,properties : {value :1}},{place2trans:1,source:1,dest:1,properties : {value :1}},{place2trans:0,source:1,dest:3,properties : {value :1}},{place2trans:0,source:2,dest:2,properties : {value :1}},{place2trans:1,source:2,dest:3,properties : {value :1}},{place2trans:0,source:3,dest:4,properties : {value :1}},{place2trans:1,source:4,dest:4,properties : {value :1}},{place2trans:0,source:4,dest:0,properties : {value :1}},{place2trans:0,source:1,dest:2,properties : {value :1}},{place2trans:0,source:2,dest:3,properties : {value :1}},{place2trans:1,source:3,dest:3,properties : {value :1}}]};
		model = model2;

		redrawAll();

		//Est ce que ça sert à quelque chose ? Je commente pour le moment
		//stage.add(layerPlaces); // les places et transitions
		//stage.add(layerTransitions); // les transitions
		//stage.add(layerArcs); // les arcs
		stage.setListening(false);
		generateEveryMatrixInputCor();
		
	}
}


function insertionCode() {
	var html = "<h3 style=\"color:red;text-align:center;\">Correction</h3><div id=\"container_cor\"></div>"+
	"<table>"+
	"<tr><td><h3>Calculer W+</h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"matrice_wplus_cor\" class=\"matrices_input\"></div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"Controler\" onClick=\"controlerMatrice(4)\" /></div></td>"+
	"<td><div id=\"matrice_wplus_cor_astuces\" class=\"astuces\"></div></td>"+
	"</tr>"+
	"<tr><td><h3>Calculer W-</h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"matrice_wmoins_cor\" class=\"matrices_input\"></div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"Controler\" onClick=\"controlerMatrice(5)\" /></div></td>"+
	"<td><div id=\"matrice_wmoins_cor_astuces\" class=\"astuces\"></div></td>"+
	"</tr>"+
	"<tr><td><h3>Calculer W</h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"matrice_w_cor\" class=\"matrices_input\"></div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"controler\" onClick=\"controlerMatrice(3)\" /></div></td>"+
	"<td><div id=\"matrice_w_cor_astuces\" class=\"astuces\"></div></td>"+
	"</tr>"+
	"<tr><td><h3>Calculer les T invariants </h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"matrice_Tinvariants_cor\" class=\"matrices_input\"></div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"controler\" onClick=\"controlerInvariant(2)\" /></div></td>"+
	"<td><div id=\"matrice_Tinvariants_cor_astuces\" class=\"astuces\"></div></td>"+
	"</tr>"+
	"<tr><td><h3>Calculer les P invariants</h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"matrice_Pinvariants_cor\" class=\"matrices_input\"></div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"controler\" onClick=\"controlerInvariant(3)\" /></div></td>"+
	"<td><div id=\"matrice_Pinvariants_cor_astuces\" class=\"astuces\"></div></td>"+
	"</tr>"+
	"<tr><td><h3>Les propriétés du Rdp</h3></td></tr>"+
	"<tr>"+
	"<td><div id=\"RDP_proprietes_cor\" class=\"RDP_prop\">"+
	"<form name=\"formu_prop_cor\">"+
	"<table>"+
	"<tr>"+
	"<td style=\"min-width:200px;\">Le RdP est-il borné ?</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpBorne_cor\" value=\"oui\">Oui</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpBorne_cor\" value=\"non\">Non</td>"+
	"</tr>"+
	"<tr>"+
	"<td style=\"min-width:200px;\">Le RdP est-il sauf ?</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpSauf_cor\" value=\"oui\">Oui</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpSauf_cor\" value=\"non\">Non</td>"+				
	"</tr>"+
	"<tr>"+
	"<td style=\"min-width:200px;\">Le RdP est-il quasi vivant ?</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpQuasiVivant_cor\" value=\"oui\">Oui</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpQuasiVivant_cor\" value=\"non\">Non</td>"+				
	"</tr>"+
	"<tr>"+
	"<td style=\"min-width:200px;\">Existe-t-il au moins une situation de blocage ?</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpBlocage_cor\" value=\"oui\">Oui</td>"+
	"<td><input type=\"radio\" class=\"disable radio_button\" name=\"rdpBlocage_cor\" value=\"non\">Non</td>"+				
	"</tr>"+
	"</table>"+
	"</form>"+
	"</div></td>"+
	"<td><div class=\"control_button_div\"><input type=\"button\" class=\"disable control_button\" value=\"controler\" onClick=\"controlerProprietesCorrection()\" /></div></td>"+
	"<td><div id=\"proprietes_astuces_cor\" class=\"astuces\"><div id=\"proprietes_astuces_cor_comp\"></div><div id=\"proprietes_astuces_cor_comp2\">Arbre de couverture s'il existe :<input type=\"button\" value=\"Afficher/Masquer\" onClick=\"expandDiv(1);\" /><br/><div id=\"treeCorrection\"></div></div></div></td>"+
	"</tr>"+
	"</table>";
	document.getElementById('correction').innerHTML = html;
}



var treeAffichageActiver = false;
var treeCorrectionAffichageActiver = false;
function expandDiv(statut) {
	if(statut == 0) {
		if(treeAffichageActiver) {
				document.getElementById('tree').style.display = 'none';
				treeAffichageActiver = false;
		}
		else {
			document.getElementById('tree').style.display = 'inherit';
			treeAffichageActiver = true;
		}
	}
	else if(statut ==1) {
		if(treeCorrectionAffichageActiver) {
				document.getElementById('treeCorrection').style.display = 'none';
				treeCorrectionAffichageActiver = false;
		}
		else {
			document.getElementById('treeCorrection').style.display = 'inherit';
			treeCorrectionAffichageActiver = true;
		}
	}
}