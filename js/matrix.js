
// Source : invarian.cpp de PetriMaker



function getNbRows(mat)
{
	if(mat!==undefined)
		return mat.length;
	else
		return 0;
}

function getNbColumns(mat)
{
	if(mat[0]!==undefined)
		return mat[0].length;
	else
		return 0;
}

function extractColumn(mat,numero)
{
	var lignes = getNbRows(mat);
	var col = getNbColumns(mat);
	var res = new Array(lignes);
	
	for(var i=0;i<lignes;i++)
	{
		res[i] = mat[i][numero];
	
	}
	return res;

}




function Identity(dim)
{
	
	var res = new Array(dim);
	for(var i=0;i<dim;i++)
	{
		res[i] = new Array(dim);
		for(var j=0;j<dim;j++)
		{
			if(j==i)
				res[i][j]=1;
			else
				res[i][j]=0;
		
		}
	
	}
	return res;

}


function Transpose(mat)
{
	
	var res = new Array(getNbColumns(mat));
	for(var i=0;i<mat.length;i++)
	{
		
		for(var j=0;j<mat[i].length;j++)
		{
			if(res[j]===undefined)
				res[j] = new Array(getNbRows(mat));
			res[j][i]=mat[i][j];
		
		}
	
	}
	return res;

}

function ConcatRight(mat1,mat2)
{
	res = new Array();
	if(mat1.length==mat2.length)
	{
		for(var i=0;i<mat1.length;i++)
		{	
			res[i]=mat1[i].concat(mat2[i]);
		}
	
	}
	return res;

}


function CalculP_T (mat,nblignes,nbcol)
{ 

for (var c=0 ; c<nbcol ; c++)
	{
		for (var l1=0 ; l1<nblignes ; l1++)
		{
		if(mat[l1]!==undefined)
		{
			var elt1 = mat[l1][c];
			
			if (elt1 != 0)
			{
				for (var l2=l1+1 ; l2<nblignes ; l2++)
				{
					if(mat[l2]!==undefined)
					{
					var elt2 = mat[l2][c];
					if (elt2 != 0)
						if (elt1*elt2 < 0)
							Ajouter (mat, l1, l2, c, nblignes+nbcol);
					}
				}
			}
		}
		}

		Eliminer (mat, c);
		
		if (mat.length == 0) return;
	}
	DeleteColumns(mat,nbcol);
	return mat;
	
}

function Ajouter (mat, ligne_pivot, lignes, indice_colonne, nbtrans)
{
	mat[mat.length] = new Array(getNbColumns(mat));
	/*for(var i=0;i<mat[0].length;i++) // AddRow
	{
		mat[mat.length][i]=0;
	}*/
	for (var i=0 ; i<nbtrans ; i++)
	{
		var v1=0;
		var v2=0;
		if(mat[ligne_pivot][i]!==undefined)
		v1 =  Math.abs(mat[lignes][indice_colonne]) * mat[ligne_pivot][i];
		if(mat[lignes][i]!==undefined)
		v2 = Math.abs(mat[ligne_pivot][indice_colonne]) * mat[lignes][i];

		mat[mat.length-1][i]=v1+v2;
	}
	
}

function DeleteColumns(mat,nbColonnes)
{
	for(var i=0;i<mat.length;i++)
	{
		mat[i].splice(0,nbColonnes);
		
	
	}
	

}

function Eliminer (mat, colonne)
{          
	var Arret = false;

	while (!Arret)
	{
		Arret = true;
		for (var i = 0 ; i < mat.length ; i++)
		{
			if (mat[i][colonne] != 0)
			{
				mat.splice(i,1);
				Arret = false;
				break;
			}
		}
	}

}