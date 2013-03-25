var backgound = new Kinetic.Layer();
var layer1 = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var model = {
	places : [
	{
		coordx : 50,
		coordy :50,
	},
	{
		coordx : 300,
		coordy :50,
	}
	],
	
	transitions : [
	{
		coordx : 150,
		coordy : 150,
	},
	{
		coordx : 300,
		coordy : 150,
	},
	{
		coordx : 300,
		coordy : 300,
	}
	],
	
	arcs : [
	{
		source : 0,
		dest : 0,
		place2transition : 1
	},
	{
		source : 0,
		dest : 1,
		place2transition : 0
	},
	{
		source : 1,
		dest : 2,
		place2transition : 1
	}
	],
	
	
}


function detectArc(i,j) // i = place, j = transition. Retourne 1 si il y a un arc direct entre i et j, -1 si entre j et i et 0 sinon.
{
	for(var z=0;z<model.arcs.length;z++)
	{
		if(model.arcs[z].source==i && model.arcs[z].dest==j && model.arcs[z].place2transition==1)
			return 1;
		else if(model.arcs[z].source==j && model.arcs[z].dest==i && model.arcs[z].place2transition==0)
		{
			
			return -1;
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
	console.log(res);
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
	layer.add(group);
	
}

function drawLine(layer, i)
{
	var pts = new Array();
	if(model.arcs[i].place2transition==1)
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
        lineCap: 'butt',
        lineJoin: 'miter'
      });
	layer.add(redLine);
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
	
	

var stage = new Kinetic.Stage({
        container: 'container',
        width: 600,
        height: 400
      });


      stage.add(backgound);
	  stage.add(layer1);
	  stage.add(layer2);
	  stage.add(layer3);

})