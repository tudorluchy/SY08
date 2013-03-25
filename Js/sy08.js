var backgound = new Kinetic.Layer();
var layer1 = new Kinetic.Layer();
var layer2 = new Kinetic.Layer();
var layer3 = new Kinetic.Layer();
var model = {
	places : [
	{
		coordx : 150,
		coordy :150,
	},
	{
		coordx : 300,
		coordy :150,
	}
	],
	
	transitions : [
	{
		coordx : 50,
		coordy : 20,
	},
	{
		coordx : 100,
		coordy : 20,
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
	}
	],
	
	
	
	

}


function drawPlace(layer, i)
{
	var rec = new Kinetic.Rect({
        x: model.places[i].coordx,
        y: model.places[i].coordy,
        width: 50,
        height: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
		draggable: true,
		name : i
      });
	  
	  
	  
	  rec.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au début du déplacement et redessiner à la fin (mais moins beau ^^)
	 layer3.clear();
layer3.removeChildren();
	  model.places[rec.getName()].coordx = rec.getAbsolutePosition().x; 
	  model.places[rec.getName()].coordy = rec.getAbsolutePosition().y; 
	  refreshLines();

     
      });
	layer.add(rec);
}

function drawTransition(layer, i)
{
	var cercle = new Kinetic.Circle({
        x: model.transitions[i].coordx,
        y: model.transitions[i].coordy,
        radius: 20,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
		draggable: true,
		name : i
      });

	  
	  cercle.on('dragmove',function() { // Si trop de lag en rafraichissant tout le temps, possible de clear au début du déplacement et redessiner à la fin (mais moins beau ^^)
layer3.clear();
layer3.removeChildren();
		model.transitions[cercle.getName()].coordx = cercle.getAbsolutePosition().x; 
		model.transitions[cercle.getName()].coordy = cercle.getAbsolutePosition().y; 
		refreshLines();
     
      });
	layer.add(cercle);
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
        stroke: 'red',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round'
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