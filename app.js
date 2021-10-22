/*

1- On travaille dans un objet, qui sera lancé au chargement du DOM - OK

*/

/*
2 - Dans l'objet :
    - Une méthode qui réceptionne le listener du DOMContentLoaded
    - Ensuite on veut générer dynamiquement 28 div
    - Ensuite on les ajoute au DOM dans leur container
*/

/* 

3 - 

*/
var currentImages = [];


var app = {


    init: function() {
         
        app.addCard();
       
    },

    addCard: function(){

        var monTableau = [];
        var plateau = document.getElementById('plateau');
        
        for(var index = 0; index<28; index++){
            var addDiv = document.createElement('div');
           
            addDiv.classList.add('carte');
            addDiv.classList.add('cache');

            $addDiv = $(addDiv);
            
            $addDiv.css("background-position", "0-"+ parseInt(index/2) + "00px");
            
            addDiv.addEventListener('click', app.changeClass);
            

            monTableau[index] = addDiv;
              
        }

        var randomTab = app.shuffle(monTableau);

        for(var index = 0; index<28; index++){
            
            plateau.appendChild(randomTab[index]);
        }

        $(plateau).one('click', function(){
            var progressBar = document.getElementsByClassName('progress-bar');
            $progressBar = $(progressBar); 
            var progress = 0;
            var refreshIntervalId = setInterval(function() {
                progress = progress + 3,2;
                $progressBar.css("width", progress + "px");
                console.log(progress);
                if(progress >= 765) {
                    clearInterval(refreshIntervalId);
                    alert("c'est perdu :'(");
                };
                }, 1000);

            
        });
    },

    progressBar: function() {
        
    },

    shuffle: function (array) {
        let counter = array.length;
    
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);
    
            // Decrease counter by 1
            counter--;
    
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
    
        return array;
    },

    changeClass: function(evt){
        $(evt.target).removeClass('cache').addClass('image');
        
        currentImages.push(evt.target);
        
        app.checkPair();
    },

    checkPair: function() {
        if (currentImages.length === 2) {     
            if (currentImages[0].style.backgroundPositionY != currentImages[1].style.backgroundPositionY) {
                var plateau = document.getElementById('plateau');
                $plateau = $(plateau);
                $plateau.css("pointer-events", "none");
                setTimeout(function(){$(currentImages[0]).removeClass('image').addClass('cache');
                $(currentImages[1]).removeClass('image').addClass('cache'); 
                currentImages = [];
                $plateau.css("pointer-events", "auto");}, 1000);
            } else {
                currentImages = [];
                var cardsList = [...document.getElementsByClassName('carte')];
                var filteredCards = cardsList.filter(card => card.className === 'carte image');
                if (filteredCards.length === 28) {
                    setTimeout(function(){alert('Vous avez gagné');}, 200);
                };
            };
        }; 
    },
    
}


document.addEventListener('DOMContentLoaded', app.init);