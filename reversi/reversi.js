whiteDisk="<img src='whiteCircle.png' width='40px' height='40px'>"
blackDisk="<img src='blackCircle.png' width='40px' height='40px'>"
whiteDisk.onclick=0;
blackDisk.onclick=0;
numOfTurnes=0;
var clock;

player1={
    score:2,
    color: 'white',
    timesWith2DisksCounter:1,
    movesCounter: 0,
    movesCounterOfAllTheTime: 0,
    totalPlayerTime: 0,
    totalPlayerTimeAllGames: 0
}
player2={
    score:2,
    color: 'black',
    timesWith2DisksCounter:1,
    movesCounter: 0,
    movesCounterOfAllTheTime: 0,
    totalPlayerTime: 0,
    totalPlayerTimeAllGames: 0
}
var turn='white';
scoreBoard=document.getElementById("scoreBoard");
var currentTurnStartTime = new Date().getTime();
//restartBtn=document.getElementById("restartBtn");
//iQuitBtn=document.getElementById("quitFromGame");

function createGame(){
    createT();
    initialStatistics();
    clock=setInterval(function(){updateTimeDuration();},100)
    restartBtn.setAttribute("onclick","restartClicked(this)")
    quitFromGame.setAttribute("onclick","iQuitBtnClicked(this)")



}
function initialStatistics()
{
    document.getElementById("currentTurn").innerHTML = "Current Turn:</br>white ";
    document.getElementById("P1Avg").innerHTML = "average move time of white:</br>00:00:00 ";
    document.getElementById("P2Avg").innerHTML = "average move time of black:</br>00:00:00 ";
    document.getElementById("turnCount").innerHTML = "0 ";
    document.getElementById("turnCount").innerHTML="numbers of turn:</br>"+(numOfTurnes);
    document.getElementById("only2disksCounter").innerHTML="times with 2 disks:</br>white-"+player1.timesWith2DisksCounter+" black-"+player2.timesWith2DisksCounter;
    scoreBoard.innerHTML= `2`+" : "+`2`;

}
function createT()
{
    var tbl=document.getElementById("tbl");
    for(var i=0;i<10;i++)
    {
        var row=document.createElement("tr");
        for(var j=0; j < 10 ; j++)
        {
            var cel=document.createElement("td");
            cel.width="50px";
            cel.height="50px";
            cel.id=`${j},${i}`;
            cel.diskColor=null;
            row.appendChild(cel);   
            if(cel.id=='4,4' || cel.id=='5,5')
            {
                setCel(cel,'white');
            }
            if(cel.id=='4,5' || cel.id=='5,4')
            {
                setCel(cel,'black');
            }
            cel.setAttribute("onclick","cellClicked(this)");
            cel.setAttribute("onmouseover","cellMouseHover(this)");
            cel.setAttribute("onmouseout","cellMouseOut(this)");
            cel.className = "cell"; //same as: cel.setAttributes

        }
        tbl.appendChild(row);
        startTime = new Date().getTime();
        scoreBoard.innerHTML= `${player1.score}`+" : "+`${player2.score}`;
    }
    
}

function cellClicked(cell) {
    if (isValidMove(cell) == true) {
        setCel(cell,turn)
        if(turn=='white')
            player1.score++;
        else
            player2.score++; 
        numOfTurnes++;
        calculateMove(turn, cell);
        scoreBoard.innerHTML = `${player1.score}` + "  :  " + `${player2.score}`;
        checkIf2Score();
        ChangeTurnAndUpdatePlayerStatistics(turn);
        endOfGame = checkIfEndOfGame();
        if (endOfGame) {
            clearInterval(clock);
            for (var row = 0; row < 10; row++) {
                for (var col = 0; col < 10; col++) {
                    cel = document.getElementById(`${col},${row}`);
                    cel.onclick = null;
                }
            }
            document.getElementById("gameOver").style.visibility = "inherit";
            document.getElementById("winnerPresenting").innerHTML = endOfGame.color +" is the winner!!";
            document.getElementById("winnerPresenting").style.visibility = "inherit";
        }
    }
}
function ChangeTurnAndUpdatePlayerStatistics()
{
    if(turn=='white'){
        player=player1;
        elem="P1Avg";
        elem2="whiteAverageAllGame";
    }
    else{
        player=player2;
        elem="P2Avg";
        elem2="blackAverageAllGame";
    }    
    var CurrTime = new Date().getTime();
    player.totalPlayerTime += CurrTime - currentTurnStartTime;
    player.totalPlayerTimeAllGames += CurrTime - currentTurnStartTime;  
    player.movesCounter++;
    player.movesCounterOfAllTheTime++;
    document.getElementById(elem2).innerHTML = turn+"'s average move time in all games: " + msToTime(player.totalPlayerTimeAllGames / player.movesCounterOfAllTheTime);
    document.getElementById(elem).innerHTML = "average move time of "+turn+":</br> " + msToTime(player.totalPlayerTime / player.movesCounter);
    document.getElementById("turnCount").innerHTML="numbers of turn:</br>"+(numOfTurnes);
    document.getElementById("only2disksCounter").innerHTML="times with 2 disks:</br>white-"+player1.timesWith2DisksCounter+" black-"+player2.timesWith2DisksCounter;
    if(turn=='white'){
        turn='black';
        document.getElementById("currentTurn").innerHTML = "Current Turn:</br>Black";
    }
    else{
        turn='white';    
        document.getElementById("currentTurn").innerHTML = "Current Turn:</br>White";
    }
    currentTurnStartTime = new Date().getTime();
}

function calculateMove(turn,cell)
{
    dirX=0;
    dirY=0;
    for(var i=0; i < 8; i++)
    {
        if(i==0 || i==1 || i==2)
            dirY=-1;
        if(i==0 || i==3 || i==5)
            dirX=-1;
        if(i==2 || i==4 || i==7)
            dirX=1;
        if(i==5 || i==6 || i==7)
            dirY=1;
        calculateMoveHelper(cell,turn,dirX,dirY)
        dirX=0;
        dirY=0;
    }
}

function calculateMoveHelper(cell,turn,dirX,dirY)
{
    x=parseInt(cell.id.charAt(0));
    y=parseInt(cell.id.charAt(2));
    x=x+dirX;
    y=y+dirY;
    if(x<10 && x>=0 && y<10 && y>=0)
    {
        nextCell=document.getElementById(`${x},${y}`);
        if(nextCell.diskColor==turn)
        {
            setCel(cell,turn);
            return true;
        }
        if(nextCell.diskColor==null)
            return false;
        else
        {
            res=calculateMoveHelper(nextCell,turn,dirX,dirY);
            if(res==true)
            {
                setCel(cell,turn);
                scoreManage(turn);
            }
            return res;
    }
    return false;
}

}
function isValidMove(cell)
{
    if(cell.diskColor==null)
    {
        return (isAnyNeighbors(cell));
    }
    return false;
}


function isAnyNeighbors(cell)
{
    x=cell.id.charAt(0);
    y=cell.id.charAt(2);
    xSaver = x;
    ySaver = y;
    for(var i=0; i<8;i++)
    {
        if(i==0 || i==1 || i==2)
            y--;
        if(i==0 || i==3 || i==5)
            x--;
        if(i==2 || i==4 || i==7)
            x++;
        if(i==5 || i==6 || i==7)
            y++;
        if(y<=9 && y>=0 && x>=0 && x<=9)
        {
            if(x<10 && x>=0 && y<10 && y>=0)
            {
                cellToCheck=document.getElementById(`${x},${y}`);
                    if (cellToCheck.diskColor!=null)
                        return true;
            }
        }
        x = xSaver;
        y = ySaver;
    }
    return false;
}
function setCel(cell,color)
{
    cell.diskColor=color;
    if(color=='white')
        cell.innerHTML="&nbsp"+whiteDisk;
    else if(color=='black')
        cell.innerHTML="&nbsp"+blackDisk;
    else
        cell.innerHTML='';   
    
}

function scoreManage(color)
{
    if(color=='white'){
        player1.score++;
        player2.score--;
    }
    else{
        player2.score++;
        player1.score--;
    }
}
function checkIfEndOfGame()
{
    if(player1.score+player2.score>=100){
        if(player1.score>player2.score){
            return player1;
        }
        else{
            return player2;
        }
    }
    else if(player1.score==0){
        return player2;
    }
    else if(player2.score==0){
        return player1;
    }
    else{
        return null;
    }
}
function checkIf2Score()
{
    if(player1.score===2){
        player1.timesWith2DisksCounter++;
    }
    if(player2.score===2){
        player2.timesWith2DisksCounter++;  
    }
}
function updateTimeDuration(){
    var currentTime=new Date().getTime();
    document.getElementById("gameDuration").innerHTML="game duration:</br>"+msToTime(currentTime-startTime);

}
function msToTime(duration) {
    
     var  seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds;
  }
  function cellMouseHover(cell)
  {    
            if(!isAnyNeighbors(cell) || cell.diskColor!=null )
                cell.style.backgroundColor = 'red';
            else
                cell.style.backgroundColor = 'blue';
        
  }
  function cellMouseOut(cell)
  {
      cell.style.backgroundColor= 'green';
  }
function restartClicked(btn)
{
    document.getElementById("gameOver").style.visibility = "hidden";
    document.getElementById("winnerPresenting").style.visibility = "hidden"; 
    turn='white';
    startTime = new Date().getTime();
    initialPlayers(player1);
    initialPlayers(player2);
    cleanTable();
    numOfTurnes=0;
    initialStatistics();
    currentTurnStartTime=new Date().getTime();
    clock=setInterval(function(){updateTimeDuration();},100)
    
}
function iQuitBtnClicked(btn)
{
    clearInterval(clock);
    if(turn=="white")
        winner=player2;
    else
        winner=player1;
    for (var row = 0; row < 10; row++) {
        for (var col = 0; col < 10; col++) {
            cel = document.getElementById(`${col},${row}`);
            cel.onclick = null;
        }
    }
    document.getElementById("gameOver").style.visibility = "inherit";
    document.getElementById("winnerPresenting").innerHTML = winner.color +" is the winner!!";
    document.getElementById("winnerPresenting").style.visibility = "inherit";
}

 function initialPlayers(player)
 {
     player.score=2;
     player.timesWith2DisksCounter=1;
     player.movesCounter=0;
     player.totalPlayerTime=0;
 } 
 function cleanTable(){
     for(var row=0;row<10;row++){
        for(var col=0;col<10;col++){
            cel=document.getElementById(`${col},${row}`);
            if(cel.id=='4,4' || cel.id=='5,5'){
                setCel(cel,'white');
            }
            else if(cel.id=='4,5' || cel.id=='5,4'){
                setCel(cel,'black');
            }
            else
                setCel(cel,null);
            cel.setAttribute("onclick","cellClicked(this)");
        }
     }

 } 

