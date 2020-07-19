
var turns=
{
    numOfTurn: 0,
    getNumOfTurn()
    {
        return numOfTurn;
    }
}
var timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function (e) {
    $('#basicUsage').html(timer.getTimeValues().toString());
});
var score=
{
    scorePlayer1: 0,
    scorePlayer2: 0 
}          


var stats=
{
    arr: [turns,timer,score]
}
function createStats()
{
    var statistic=document.getElementById("sts");
    statistic.appendChild(stats);
}