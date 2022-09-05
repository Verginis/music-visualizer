var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim, level;
var colorPalette = ["#000", "rgba(22, 59, 72, 0.5)", "#00aeee", "#ffffff"];
var uploadLoading = false;
var categorie = document.querySelectorAll('.categorie');
var shape = 0;

for (let k = 0; k < categorie.length; k++) {

    categorie[k].addEventListener("click", ()=> {
            shape = k;
        })
}

function preload() {
	audio = loadSound("audio/RadioBombay.mp3");
}


function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}


function setup() {

	uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight);

	console.log(windowWidth);

	toggleBtn = createButton("Play / Pause");

	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");
	
	toggleBtn.mousePressed(toggleAudio);

	analyzer = new p5.Amplitude();
	fft = new p5.FFT();

	audio.loop();

}

function draw() {

	background(colorPalette[0]);

	noFill();

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

 

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);
  

	var mapTreble = map(treble, 0, 255, -radius, radius);
	var scaleTreble = map(treble, 0, 255, 1, 1.5);

	var mapbass = map(bass, 0, 255, -100, 800);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 4, 10);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight);

	pieces = mapMouseX;
	radius = 260;


	translate(windowWidth / 2, windowHeight / 2);

	if(shape == 0){
		strokeWeight(1);
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		fill(colorPalette[1]);
		scale(scalebass);
		circle(0, 0, radius);
	
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scaleMid);
		circle(0, 0, radius*1.5);
	
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scaleTreble);
		circle(0, 0, radius*2);

	}else if(shape == 1){

		for (i = 0; i < pieces; i += 0.5) {

			rotate(TWO_PI / pieces);
	
	
			/*----------  BASS  ----------*/
			push();
			strokeWeight(5);
			stroke(colorPalette[1]);
			scale(scalebass);
			rotate(frameCount * -0.5);
			line(mapbass, radius / 2, radius, radius);
			line(-mapbass, -radius / 2, radius, radius);
			pop();



			/*----------  MID  ----------*/
			push();
			strokeWeight(0.5);
			stroke(colorPalette[1]);
			scale(scaleMid);
			line(mapMid, radius / 2, radius, radius);
			line(-mapMid, -radius / 2, radius, radius);
			pop();


			/*----------  TREMBLE  ----------*/
			push();
			strokeWeight(0.5);
			stroke(colorPalette[1]);
			scale(scaleTreble);
			line(mapTreble, radius / 2, radius, radius);
			line(-mapTreble, -radius / 2, radius, radius);
			pop();
	
		}
	}else if(shape == 2){
		level = analyzer.getLevel();

		if (!audio.isPlaying()) {
			var mapBassX = map(mouseX, 0, width, 400, 1200);
	
			for (var b = 0; b < 70; b++) {
	
				push();
				noFill();
				stroke(colorPalette[1]);
				rotate(b);
				var mapScale = map(b, 0, 100, 0, 3);
				strokeWeight(1);
				bezier(mapBassX - b, 20, 10, 20, 100, 50, mouseY, mouseY);
				pop();
	
			}
		} else {
	
			/*----------  BASS  ----------*/
			var _mapBassX = map(mouseX, 0, width, 400, 1200);
			for (var b = 0; b < bass; b++) {
				var _mapScale = map(b, 0, bass, 0, 3);
				push();
				noFill();
				stroke(colorPalette[1]);
				rotate(b * frameCount);
				strokeWeight(_mapScale);
				bezier(_mapBassX - b, 20, 10, 20, 100, 50, mouseY, mouseY);
				pop();
			}
	
	
			/*----------  MID  ----------*/
			for (var m = 0; m < mid; m += 20) {
	
				var angle = m * 3 * random();
				strokeWeight(1);
				push();
	
				fill(random(100, 255), random(100, 255), random(100, 255), random(0, 255));
				fill(colorPalette[2]);
				rotate(angle * 5);
				scale(level / 2);
	
				if (audio.currentTime() > 5) {
					rect(mouseX + m * 10, mouseY + m * 50, m * 7, m * 7);
				}
	
				pop();
	
			}
	
	
			/*----------  TREMBLE  ----------*/
			for (var j = 5; j < treble; j += 20) {
	
				var angleT = j * 3 * random();
				strokeWeight(1);
				push();
				fill(colorPalette[3]);
				rotate(angleT * 5);
				scale(level / 4);
	
				if (audio.currentTime() > 7) {
					rect(mouseX * j + 10, mouseY * j, 200 * j, j * 5);
				}
				pop();
	
			}
	
		}
	}
	



}


function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
