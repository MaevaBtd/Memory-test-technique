let currentImages = [];

let previousResults = [];

let playersTime = 0;

let refreshIntervalId;

let app = {

    init: function() {   
        const header = document.getElementById('header');
        
        app.addCard();     

        $.get("http://localhost:3000/api/results",
        function (data, status) {
           previousResults = data;
           $(function () {  
            $('<h3>Précédents gagnants</h3>').appendTo('#header');
        });

           data.forEach(player => {
            $(function () {  
                $('<p> Nom: '+ player.name + '<br>'+'Record: '+ player.time +' secondes </p>').appendTo('#header');
            }); 
           });
           
        });
    },

    addCard: function(){

        let monTableau = [];
        const plateau = document.getElementById('plateau');
        
        for(let index = 0; index<28; index++){
            let addDiv = document.createElement('div');
           
            addDiv.classList.add('carte');
            addDiv.classList.add('cache');

            $addDiv = $(addDiv);
            
            $addDiv.css("background-position", "0-"+ parseInt(index/2) + "00px");
            
            addDiv.addEventListener('click', app.changeClass);
            

            monTableau[index] = addDiv;
              
        }

        let randomTab = app.shuffle(monTableau);

        for(let index = 0; index<28; index++){
            
            plateau.appendChild(randomTab[index]);
        }

        $(plateau).one('click', function(){
            const progressBar = document.getElementsByClassName('progress-bar');
            $progressBar = $(progressBar); 
            let progress = 0;

            refreshIntervalId = setInterval(function() {
                playersTime = playersTime+1;
                progress = progress + 3,2;
                $progressBar.css("width", progress + "px");
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
                let plateau = document.getElementById('plateau');
                $plateau = $(plateau);
                $plateau.css("pointer-events", "none");
                setTimeout(function(){$(currentImages[0]).removeClass('image').addClass('cache');
                $(currentImages[1]).removeClass('image').addClass('cache'); 
                currentImages = [];
                $plateau.css("pointer-events", "auto");}, 1000);
            } else {
                currentImages = [];
                let cardsList = [...document.getElementsByClassName('carte')];
                let filteredCards = cardsList.filter(card => card.className === 'carte image');
                if (filteredCards.length === 28) {
                    clearInterval(refreshIntervalId);
                    setTimeout(function(){alert('Vous avez gagné en ' + playersTime + ' secondes');}, 200);
                    $.post("http://localhost:3000/api/results",
                    {
                        name: 'Jean-Michel',
                        time: playersTime
                    }, function(data) {
                        alert(data);
                });
                };
            };
        }; 
    },
    
}

document.addEventListener('DOMContentLoaded', app.init);