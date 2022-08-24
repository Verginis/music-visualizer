var song;
var button;
function setup(){
  createCanvas(200,200);
  song=loadSound("../audio/RadioBombay.mp3",togglePlaying);
  button=createButton("play");
 button.mousePressed(togglePlaying);
  song.setVolume(0.3);
 background(51);
}
function togglePlaying(){
 song.play();
}
