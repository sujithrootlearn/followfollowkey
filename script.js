let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 600, canvas.height = 700;
let ballXCord = 100, ballYCord = 100; radius = 25; circleFillColor = "rgba(255,255,255)", textColor = "black";
let requestAnimationID=0, stopGame=true;
let btnStop = document.getElementById('btnStop');
let hideObject = false;
let keyboardChars = ['-','_','+',"=",'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7'];
let chars = [], charSymbols = [], counter=0, colorChangeCounter = 100, killObjCounter = 300, gameLevel = 60;

class Ball{
    constructor(charactor){
        this.circleFillColor = circleFillColor;
        this.textColor = textColor;
        this.counter = counter;
        this.ballXCord = Math.ceil(Math.random()*(500-100)+75)
        this.ballYCord = Math.ceil(Math.random()*(600-100)+75)
        this.ctx = ctx;        
        this.speeds = [-1,-0.9,-0.8,-0.7,-0.6,-0.5,-0.4,-0.3, 0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];
        this.dx = this.speeds[Math.floor(Math.random()*(this.speeds.length-1) )];
        this.dy = this.speeds[Math.floor(Math.random()*(this.speeds.length-1) )];
        this.charactor = charactor;
        this.drawBall = function(){
            this.ctx.arc(this.ballXCord,this.ballYCord,radius,0,Math.PI*2,false);
            this.ctx.fillStyle = this.circleFillColor;           
            this.ctx.fill();            
            this.ctx.fillStyle = this.textColor;
            this.ctx.font = "24px Arial";
            this.ctx.fillText(this.charactor,this.ballXCord-7,this.ballYCord+6);
        }
        this.moveXY = function(){
            if(this.ballXCord+radius<canvas.width && this.ballXCord-radius>0 ){
                this.ballXCord = this.ballXCord + this.dx;
                // this.ballYCord = this.ballYCord+ this.dy;            
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






function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    requestAnimationID = requestAnimationFrame(animate);

    while (chars.length < keyboardChars.length - gameLevel){
        let obj = new Ball(keyboardChars[Math.floor(Math.random()*(keyboardChars.length-1))])
        chars.push(obj);        
    }
    
    
    
  
    for(let i=0; i<chars.length; i++){
        ctx.beginPath()
        chars[i].drawBall();
        chars[i].moveXY();

        if(chars[i].ballLife() > Math.ceil(Math.random()*(600-100)+100)){
            chars[i].circleFillColor = "rgba(255,0,0,0.7)";
            chars[i].textColor = "white";
            if(chars[i].ballLife() > Math.ceil(Math.random()*(1000-800)+800)){
                chars.splice(i,1)
            }            
        }                                  
    }    
  

    if(!stopGame){
        cancelAnimationFrame(requestAnimationID);
    };

   
}
animate()








//control section
window.addEventListener('load',()=>{
    btnStop.addEventListener('click',()=>{
        stopGame = false;              
    });
    document.addEventListener('keydown', (evt)=>{
        for(let i=0; i<chars.length;i++){
            if(chars[i].charactor === evt.key){               
                chars.splice(i,1)       
            } 
        } 
              
    });


})