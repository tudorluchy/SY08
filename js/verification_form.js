// suppresion element id
function removeElement(id) {
	var element = document.getElementById(id);
	element.parentNode.removeChild(element);
}

// suppresion exercice
function goto_confirm(url, exo) {
  if (confirm("Etes-vous sur de vouloir supprimer cet exercice ?")) {
	 // document.location.href = url;
	 exo = '.'+exo;
	 $(exo).remove();
  }
  return false; //pour ne pas revenir au début de la page
}

// surligne le champ d'un formulaire
function surligne(champ, erreur){
   if(erreur)
	  champ.style.backgroundColor = "#fba";
   else
	  champ.style.backgroundColor = "";
}

// verification intitule
function verifIntitule(champ)
{
   if(champ.value.length < 2 || champ.value.length > 100)
   {
	  surligne(champ, true);
	  return false;
   }
   else
   {
	  surligne(champ, false);
	  return true;
   }
}

// verification enonce
function verifEnonce(champ)
{
   if(champ.value.length < 2 || champ.value.length > 8000)
   {
	  surligne(champ, true);
	  return false;
   }
   else
   {
	  surligne(champ, false);
	  return true;
   }
}

// submit form
function verifForm(f)
{
   var intituleOk = verifIntitule(f.intitule);
   var enonceOk = verifEnonce(f.enonce);

	// init json dans le input caché
	document.getElementById('json').value = JSON.stringify(model);
	
   if (intituleOk && enonceOk) {
	  return true;
   } else {
	  alert("Veuillez remplir correctement tous les champs");
	  return false;
   }
}
