let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 500, canvas.height = 720;
let ballXCord = 100, ballYCord = 100; radius = 25; circleFillColor = "rgba(255,255,255)", textColor = "black";
let requestAnimationID=0, stopGame=true;
let score = document.getElementById('score');
let miss = document.getElementById('miss');

let btnStop = document.getElementById('btnStop');

let lostCharMuzik = new Audio("./sounds/loose.mp3"), successMuzik = new Audio("./sounds/success.wav");
let gameoverMuzik = new Audio("./sounds/gameover.wav"), gameoverImage = new Image();
gameoverImage.src = ("./images/gameover.png")
let gameMusic = new Audio("./sounds/uhhoo.mp3");
let keyboardChars = ['-','_','+',"=",'`','~','@','#','$','%','^','&','*','(',')','A','B','C','D','E','F','G','H','I','j','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7'];
let uniqueCharacters = [], charSymbols = [], allKeys = [], colorChangeCounter = 100, killObjCounter = 300, missCount= 0;
let counter=0, objBall, theScore = 0, allChars = [], strikeResult = [], maxMissCount = 10; buttonWidth=200, buttonHeight=46;
let  gameLevel=60, playBeginner = 65, playExpert = 55, gameover = false, maxBeginnerScore = 10, maxExpertScore = 20;

//class definition
class Ball{
    constructor(charactor){
        this.circleFillColor = circleFillColor;
        this.textColor = textColor;
        this.counter = counter;
        this.radius = radius;
        this.ballXCord = Math.ceil(Math.random()*((canvas.width-50)-100)+100)
        this.ballYCord = Math.ceil(Math.random()*((canvas.height-50)-100)+100)
        this.ctx = ctx;        
        this.speeds = [-1,-0.9,-0.8,-0.7,-0.6,-0.5,-0.4,-0.3, 0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];
        this.dx = this.speeds[Math.floor(Math.random()*(this.speeds.length-1) )];
        this.dy = this.speeds[Math.floor(Math.random()*(this.speeds.length-1) )];
        this.charactor = charactor;

        this.drawBall = function(){
            this.ctx.arc(this.ballXCord,this.ballYCord,this.radius,0,Math.PI*2,false);
            this.ctx.fillStyle = this.circleFillColor;           
            this.ctx.fill();            
            this.ctx.fillStyle = this.textColor;
            this.ctx.font = "24px Arial";
            this.ctx.fillText(this.charactor,this.ballXCord-7,this.ballYCord+6);
        }
        this.moveXY = function(){
            if(this.ballXCord+radius<canvas.width && this.ballXCord-radius>0 ){
                this.ballXCord = this.ballXCord + this.dx;                            
            }else{
                this.dx = -this.dx;
                this.ballXCord = this.ballXCord + this.dx
            }
            
            if(this.ballYCord+radius < canvas.height && this.ballYCord-radius > 0){
                this.ballYCord = this.ballYCord+this.dy;
            }else{
                this.dy = -this.dy;
                this.ballYCord = this.ballYCord + this.dy;
            }                     
        }
        this.ballLife = function(){
            this.counter = this.counter + Math.random() ;
            return this.counter;
        }
    }
}

function sortDesc(arr){
    arr.sort((elemLeft, elemRight)=>{
        if(elemLeft.missed > elemRight.missed){
            return -1;
        }else if(elemLeft.missed < elemRight.missed){
            return 1;
        }else{
            return 0;
        };
    });
}

function displayStats(arr){    
    let theKey = "", xCord=canvas.width/2-242, yCord=canvas.height/2+258;
    if(arr.length > 0){
        
        ctx.fillStyle = "white";
        ctx.font = "20px Comic Sans MS";
        ctx.fillText("Hey...Following key/keys are missed more the once:",canvas.width/2-224, canvas.height/2+225);
        for(let k=0; k<arr.length; k++){
            if(arr[k].missed > 0){
                theKey = arr[k].key;               
                xCord = xCord+20
                ctx.font = "18px Comic Sans MS";
                ctx.fillText(`${theKey},` ,xCord,yCord);
            }
        }
    }else{
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = "white";
        ctx.font = "24px Comic Sans MS";
        ctx.fillText("Welldone !  You hit max score with no key miss.",canvas.width/2-250, canvas.height/2);
    }
}


function showGameStartButton(){
    let rect1X = 40, rect1Y = 10, rect2X = buttonWidth+60, rect2Y = 10;
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 9;    
    ctx.fillRect(rect1X, rect1Y, buttonWidth,buttonHeight);    
    ctx.fillRect(rect2X, rect2Y, buttonWidth,buttonHeight);   
    ctx.fillStyle = "black";
    ctx.font = "27px Comic Sans MS";
    ctx.fillText("Play Beginner",rect1X+20, rect1Y+30);
    ctx.fillText("Play Expert",rect2X+25, rect2Y+30);
    canvas.addEventListener('click',(evt)=>{
        let mouseClickX = evt.offsetX, mouseClickY = evt.offsetY;        
        if(mouseClickX >= rect1X && mouseClickX <= rect1X+buttonWidth){
            if(mouseClickY >= rect1Y && mouseClickY <= rect1Y+buttonHeight){
                stopGame = false;
                gameLevel = playBeginner;
                canvas.width = 600;
                canvas.height = 780;
                allKeys = [];
                animate();
            };
        }else if(mouseClickX >= rect2X && mouseClickX <= rect2X+buttonWidth){
            if(mouseClickY >= rect2Y && mouseClickY <= rect2Y+buttonHeight){
                stopGame = false;
                gameLevel = playExpert;
                canvas.width = 600;
                canvas.height = 780;
                allKeys = [];
                animate();
            }
        }

    })
}




//animation logic---------------------------------------------
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if(missCount != maxMissCount || theScore != 100){
    requestAnimationID = requestAnimationFrame(animate);
    };
    while(allKeys.length < (keyboardChars.length - gameLevel)){
        objBall = new Ball(keyboardChars[Math.floor(Math.random()*(keyboardChars.length))]);
        allKeys.push(objBall);                          
    }; 
    allKeys = [... new Map(allKeys.map((item)=> [item["charactor"], item])).values()];   
    
     
    for(let i=0; i<allKeys.length; i++){
        ctx.beginPath()
        allKeys[i].drawBall();
        allKeys[i].moveXY();

        if(allKeys[i].ballLife() > Math.ceil(Math.random()*(600-100)+100)){
            allKeys[i].circleFillColor = "rgba(255,0,0,0.7)";
            allKeys[i].textColor = "white";
            if(allKeys[i].ballLife() > Math.ceil(Math.random()*(1000-800)+800)){ 

                if(strikeResult.length > 0){
                    let theKey = allKeys[i].charactor;
                    let keyValueAlter = false;
                    for(let j=0; j<strikeResult.length; j++){
                        if(strikeResult[j].key === theKey){
                            strikeResult[j].missed += 1;
                            keyValueAlter = true;
                        };
                    };
                    if(!keyValueAlter){
                        strikeResult.push( {key: theKey, missed: 1} );
                    };
                }else{
                    let theKey = allKeys[i].charactor;
                    strikeResult.push( {key: theKey, missed: 1} );
                };

                allKeys.splice(i,1);
                missCount = missCount+1;
                miss.innerText = missCount;
                if(missCount >= maxMissCount){
                    stopGame = true;
                    gameover = true;
                    sortDesc(strikeResult);                 
                }else{
                    lostCharMuzik.play();
                };                
                if(theScore>0){
                    theScore = theScore-1;
                    score.innerText = theScore;                    
                };
            };            
        };        
        if(theScore >= 10){
            stopGame = true            
        };
                                         
    }; 

      
    if(stopGame){    
        if(!gameover && theScore === 0){
            showGameStartButton();
        };
        cancelAnimationFrame(requestAnimationID);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        
        if(missCount >= maxMissCount){            
            ctx.fillRect(0,0, canvas.width,canvas.height);
            displayStats(strikeResult);          
            ctx.drawImage(gameoverImage, canvas.width/2-gameoverImage.width/2,canvas.height/2-gameoverImage.height/2);
            gameoverMuzik.play();            
        } else if(theScore === 10){
            ctx.fillRect(0,0, canvas.width,canvas.height);
            displayStats(strikeResult);
        }        
        gameMusic.pause();        
    }else{
        gameMusic.play();
    }
  
};
animate()




//control section-------------------------------------------
window.addEventListener('load',()=>{
    btnStop.addEventListener('click',()=>{
        stopGame = true;
        location.reload();
        // if(!stopGame){
            
        // };                                   
    });
    // begginerBtn.addEventListener('click',()=>{
    //     if(stopGame===true){
    //         stopGame = false;            
    //         begginerBtn.style.display= "none";
    //         expertBtn.style.display = "none";
    //         canvas.width = 670;
    //         canvas.height = 760;
    //         gameLevel = 67;
    //         uniqueCharacters = [];
    //         allKeys = [];
    //         animate();            
    //     };        
    // });
    // expertBtn.addEventListener('click', ()=>{
    //     if(stopGame===true){
    //         stopGame = false;            
    //         begginerBtn.style.display= "none";
    //         expertBtn.style.display = "none";
    //         canvas.width = 670;
    //         canvas.height = 760;
    //         gameLevel = 60;
    //         uniqueCharacters = [];
    //         allKeys = [];
    //         animate();            
    //     };    
    // });


    document.addEventListener('keydown', (evt)=>{    
        for(let i=0; i<allKeys.length;i++){
            if(allKeys[i].charactor === evt.key){                    
                allKeys.splice(i,1);
                theScore = theScore+1; 
                score.innerText = theScore;                                                
                successMuzik.play();                               
            };           
        };             
    });
    
});

