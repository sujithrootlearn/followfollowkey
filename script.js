let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 500, canvas.height = 720;
let ballXCord = 100, ballYCord = 100; radius = 25; circleFillColor = "rgba(255,255,255)", textColor = "black";
let requestAnimationID=0, stopGame=true;
let score = document.getElementById('score');
let miss = document.getElementById('miss');
let begginerBtn = document.getElementById('begginerBtn');
let expertBtn = document.getElementById('expertBtn');
let btnStop = document.getElementById('btnStop');
// let hideObject = false;
let lostCharMuzik = new Audio("./sounds/loose.mp3"), successMuzik = new Audio("./sounds/success.wav");
let gameoverMuzik = new Audio("./sounds/gameover.wav"), gameoverImage = new Image();
gameoverImage.src = ("./images/gameover.png")
let gameMusic = new Audio("./sounds/uhhoo.mp3");
let keyboardChars = ['-','_','+',"=",'`','~','@','#','$','%','^','&','*','(',')','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7'];
let uniqueCharacters = [], charSymbols = [], allKeys = [], colorChangeCounter = 100, killObjCounter = 300, missCount= 0;
let counter=0, objBall, gameLevel=60,  theScore = 0;


//class definition
class Ball{
    constructor(charactor){
        this.circleFillColor = circleFillColor;
        this.textColor = textColor;
        this.counter = counter;
        this.radius = radius;
        this.ballXCord = Math.ceil(Math.random()*(500-100)+75)
        this.ballYCord = Math.ceil(Math.random()*(600-100)+75)
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


//animation logic---------------------------------------------
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    requestAnimationID = requestAnimationFrame(animate);

    while(allKeys.length < (keyboardChars.length - gameLevel)){
        objBall = new Ball(keyboardChars[Math.floor(Math.random()*(keyboardChars.length))]); 
        allKeys.push(objBall);                                    
    }    
    uniqueCharacters = [... new Map(allKeys.map((item)=> [item["charactor"], item])).values()];   
  
    for(let i=0; i<uniqueCharacters.length; i++){
        ctx.beginPath()
        uniqueCharacters[i].drawBall();
        uniqueCharacters[i].moveXY();

        if(uniqueCharacters[i].ballLife() > Math.ceil(Math.random()*(600-100)+100)){
            uniqueCharacters[i].circleFillColor = "rgba(255,0,0,0.7)";
            uniqueCharacters[i].textColor = "white";
            if(uniqueCharacters[i].ballLife() > Math.ceil(Math.random()*(1000-800)+800)){
                allKeys.splice(i,1);
                missCount = missCount+1;
                miss.innerText = missCount;
                if(missCount === 30){
                    stopGame = true;
                    gameoverMuzik.play();
                    ctx.drawImage(gameoverImage, canvas.width/2-gameoverImage.width/2,canvas.height/2-gameoverImage.height/2)
                }else{
                    lostCharMuzik.play();
                };                
                if(theScore>0){
                    theScore = theScore-1;
                    score.innerText = theScore;                    
                };
            };            
        };                                  
    }; 

    if(stopGame){
        cancelAnimationFrame(requestAnimationID);
        gameMusic.pause();
    }else{
        gameMusic.play();
    }
   
}
animate()





//control section-------------------------------------------
window.addEventListener('load',()=>{
    btnStop.addEventListener('click',()=>{
        stopGame = true;                     
    });
    begginerBtn.addEventListener('click',()=>{
        if(stopGame===true){
            stopGame = false;            
            begginerBtn.style.display= "none";
            expertBtn.style.display = "none";
            canvas.width = 670;
            canvas.height = 760;
            gameLevel = 66;
            uniqueCharacters = [];
            animate();            
        }        
    });
    document.addEventListener('keydown', (evt)=>{
        for(let i=0; i<uniqueCharacters.length;i++){
            if(uniqueCharacters[i].charactor === evt.key){                                
                    allKeys.splice(i,1);           
                    successMuzik.play();                
                    theScore = theScore+1;
                    score.innerText = theScore;         
                              
            };           
        };              
    });
})