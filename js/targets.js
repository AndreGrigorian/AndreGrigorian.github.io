const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
var time = 10;//in seconds
var timerOn = false;
var allTargets = [];

var targetClicked = 0;
var misClicks = 0; 


document.addEventListener('click', function(e) {
    e = e || window.event;
    var elem = e.target, 
        text = elem.textContent || elem.innerText;  
    
    if(timerOn && elem.id.includes("target")){
        var currTarget = document.getElementById(elem.id);
        relocateTarget(currTarget); 
        targetClicked++;
        misClicks--;
        var sound = new Audio("audio/hitSound.mp3");
        sound.play();
    }
    
}, false);



startBtn.addEventListener("click", function(){
    
    document.getElementById("results").style.display = "none";
    timerOn = true;
    var deadline = Date.parse(new Date()) + (time*1000)
    initializeClock('clockdiv', deadline);
    stopBtn.style.display = "block";
    startBtn.style.display = "none";
    createTargets(5);

    

});

stopBtn.addEventListener("click", function(){
    misClicks--;
    clearTargets();
});

document.addEventListener("click", function(){
    misClicks++;
});


function createTargets(num){
    for(var i =0; i< num; i++){
        var newTarget = document.createElement("span");
        newTarget.style.borderRadius = "50%";
        newTarget.style.display = "inline-block";
        newTarget.style.position = "absolute";
        newTarget.id = "target" + i;
        allTargets.push(newTarget);
        document.body.insertBefore(newTarget, document.getElementById("timeContainer"));
        relocateTarget(newTarget);
    }
}


function relocateTarget(elem){
    var maxTargetSize = 120;
    var minTargetSize = 40;
    var margin = 100;

    var windowH = window.innerHeight;
    var windowW = window.innerWidth;
    
    elem.style.left = Math.floor(Math.random() * (windowW-margin-maxTargetSize) + margin);
    elem.style.top = Math.floor(Math.random() * (windowH-margin-maxTargetSize) + margin);
    var randomSize = Math.floor(Math.random() * (maxTargetSize - minTargetSize) + minTargetSize);
    elem.style.width = randomSize;
    elem.style.height = randomSize;
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    elem.style.backgroundColor = "#" + randomColor;

}




function getResults(){
    misClicks--;

    document.getElementById("results").style.display = "block";
    var accuracyTxt = document.getElementById("accuracy");
    var targetsTxt = document.getElementById("targetsClicked");
    var missed = document.getElementById("targetsMissed");
    

    // var accuracy = ((targetClicked >= misClicks) && (targetClicked!= 0 && misClicks!=0) ? 
    //     Math.floor(((targetClicked-misClicks)/targetClicked) * 100) : 0 );
    var accuracy = (targetClicked/(targetClicked + misClicks)) * 100;
    
    accuracyTxt.innerHTML = "Accuracy: " + accuracy.toFixed(2)  + "%";
    targetsTxt.innerHTML = "Targets Hit: " + targetClicked;
    missed.innerHTML = "Targets Missed: " + misClicks;

}

function getTimeRemaining(endtime){
    const total = endtime - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
  
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
}


function clearTargets(){
    for(var i =0; i< allTargets.length;i++){
        allTargets[i].remove();
    }
    targetClicked = 0;
    misClicks = 0;
    allTargets = [];
    timerOn = false;
    stopBtn.style.display = "none";
    startBtn.style.display = "block";
}

function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    //every 1/10 of the time a random target will relocate
    var intervalTime = (time >= 10 ? Math.floor(time/10) : time);


    const timeinterval = setInterval(() => {
      const t = getTimeRemaining(endtime);
      clock.innerHTML =   t.minutes + ':' + t.seconds;
      if(timerOn){//start clicked
        if((t.total)/1000 % intervalTime == 0){
            var randomTarget = Math.floor(Math.random() * allTargets.length);
            relocateTarget(allTargets[randomTarget]);
            
            console.log(t.total);
        }

        if (t.total <= 0) {
            clearInterval(timeinterval);
            clock.innerHTML = "Times Up";
            
            //show results
            getResults();
            clearTargets();
            
        }
      }else{//stop clicked
        clearInterval(timeinterval);
        clock.innerHTML = "00:00";
      }

    },1000);
  }

