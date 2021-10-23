// Déclaration des variables globales
let currentImages = [];
let previousResults = [];
let playersTime = 0;
let playersName = '';
let refreshIntervalId;

let app = {

    // Fonction qui s'execute au démarrage de l'application
    init: function() {   
        // Génération des cartes
        app.addCard();     

        // Appel Ajax pour récupérer les résultats précédement enregistrés en base de données
        $.get("http://localhost:3000/api/results",
        function (data, status) {
            previousResults = data;
            $(function () {  
                $('<h3>Précédents gagnants</h3>').appendTo('#header');
            });
            // Génération de l'affichage de chaque résultat
            data.forEach(player => {
                $(function () {  
                    $('<p> Nom: '+ player.name + '<br>'+'Record: '+ player.time +' secondes </p>').appendTo('#header');
                }); 
            });   
        });
    },

    addCard: function(){
        // Liste des images à afficher sur le plateau
        let imagesList = [];

        const plateau = document.getElementById('plateau');
        
        // Génère une liste de 28 cartes et attribue une image à chacune dans un ordre au hasard
        for(let index = 0; index<28; index++){
            // Création d'une <div>
            let addDiv = document.createElement('div');
           
            // Ajout de class déterminant l'affiche de cette <div>
            addDiv.classList.add('carte');
            addDiv.classList.add('cache');

            // Les images du memory viennent d'une seule image, on décale donc la position de l'image dans la div afin d'afficher 14 images différentes, 2 fois
            $addDiv = $(addDiv);
            $addDiv.css("background-position", "0-"+ parseInt(index/2) + "00px");
            
            // Sur chaque <div> on écoute l'evenement 'click' qui déclenchera la fonction 'changeClass'
            addDiv.addEventListener('click', app.changeClass);
            
            // A chaque itération on ajoute une <div> au tableau 'imageList'
            imagesList[index] = addDiv;  
        }

        // Dans un tableau on mélange aléatoirement les <div> contenant les images
        let randomTab = app.shuffle(imagesList);

        // Chaque <div> est ajoutée au plateau
        for(let index = 0; index<28; index++){   
            plateau.appendChild(randomTab[index]);
        }

        // Au premier evenement 'click' sur le plateau, le timer se met en route
        $(plateau).one('click', function(){
            // On récupère dans une variable la barre de progression
            const progressBar = document.getElementsByClassName('progress-bar');
            $progressBar = $(progressBar); 
            let progress = 0;

            // Avec setInterval, on modifie la barre de progression pour qu'elle augmente chaque seconde
            refreshIntervalId = setInterval(function() {
                playersTime = playersTime+1;
                progress = progress + 3,2;
                $progressBar.css("width", progress + "px");
                // Si la barre de progression arrive au bout, on stop le setInterval et on affiche un message informant le joureur qu'il a perdu
                if(progress >= 770) {
                    clearInterval(refreshIntervalId);
                    alert("c'est perdu :'(");
                };
                }, 1000);          
        });
    },

    // Fonction permettant un mélange aléatoire des images. On lui passe le tableau des images comme parametre
    shuffle: function (array) {
        let counter = array.length;
    
        // Tant qu'il y a des éléments dans le tableau, à chaque itération on repositione aléatoirement une <div> dans le tableau
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
    
            counter--;
    
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        // On retourne le tableau ainsi généré
        return array;
    },

    // Fonction permettant d'afficher l'image de la div cliquée en interchangeant les class 'cache' et 'image'
    changeClass: function(evt){
        $(evt.target).removeClass('cache').addClass('image');
        
        // On ajoute au tableau 'currentImage' la <div> venant d'être séléctionnée
        currentImages.push(evt.target);
        
        // A chaque execution de la fonction, on vérifie si les deux dernière images affichées sont identiques
        app.checkPair();
    },

    // Fonction permettant de comparer les deux dernières images affichées
    checkPair: function() {
        // A partir du moment où le tableau currentImage contient 2 images, on les compare
        if (currentImages.length === 2) {     
            // Si les images sont différentes, on bloque la possibilité de cliquer sur le plateau,
            // puis au bout d'une seconde on cache de nouveau les deux images affichées, on vide le tableau currentImage et on réactive le click
            if (currentImages[0].style.backgroundPositionY != currentImages[1].style.backgroundPositionY) {
                let plateau = document.getElementById('plateau');
                $plateau = $(plateau);
                $plateau.css("pointer-events", "none");

                setTimeout(function(){$(currentImages[0]).removeClass('image').addClass('cache');
                $(currentImages[1]).removeClass('image').addClass('cache'); 
                currentImages = [];
                $plateau.css("pointer-events", "auto");}, 1000);

            } else {
                // Si les images sont identiques, on vide le tableau currentImage et on vérifie s'il reste des images face cachée. 
                currentImages = [];
                let cardsList = [...document.getElementsByClassName('carte')];
                let filteredCards = cardsList.filter(card => card.className === 'carte image');
                // Si toutes les images sont face visible, on stope la barre de progression, puis on sauvegarde le nom du joueur et le temps de jeu en base de données
                if (filteredCards.length === 28) {
                    clearInterval(refreshIntervalId);
                    // Après un petit délais permettant à la dernière carte de s'afficher correctement, on effectue l'appel Ajax POST pour la sauvegarde des données. 
                    setTimeout(function(){
                        playersName = prompt('Vous avez gagné en ' + playersTime + ' secondes ! Entrez votre nom pour figurer au tableau des scores :');
                        $.post("http://localhost:3000/api/results",
                        {
                            name: playersName,
                            time: playersTime
                        },"json");
                    }, 200);
                };
            };
        }; 
    },  
}

document.addEventListener('DOMContentLoaded', app.init);