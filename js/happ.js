const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let toggleButton = document.getElementById('toggleButton');
toggleButton.disabled = true;
let updatenote = document.getElementById('updatenote');

const modelParams = {
	flipHorizontal : true,
	maxNumBoxes: 2,
	iouThreshold: 0.5,
	scoreThreshold: 0.6
}
let isVideo = false;
let model = null;
toggleButton.addEventListener("click",function(){
	toggleVideo();
});
function toggleVideo(){
	if(!isVideo){
		updatenote.innerText = 'Starting Video';
		startVideo();
	}else{
		updatenote.innerText = 'Stopping Video';
		handTrack.stopVideo(video);
		isVideo = false;
		updatenote.innerText = 'Video is stopped!';
	}
}
function startVideo(){
	handTrack.startVideo(video).then(function (status){
		if(status){
			updatenote.innerText = 'Video is started,now tracking!';
			isVideo = true;
			rundetection();
		}else{
			updatenote.innerText = 'Enable Video';
		}
	})
};
function rundetection(){
	model.detect(video).then(predictions=>{
		model.renderPredictions(predictions,canvas,context,video);
		document.getElementById('A').classList.remove('Bigletter');
		document.getElementById('B').classList.remove('Bigletter');
		document.getElementById('C').classList.remove('Bigletter');
		document.getElementById('A').innerHTML = "";
		document.getElementById('B').innerHTML = "";
		document.getElementById('C').innerHTML = "";
		var acode = 
		`<div class="container">
			<div class="card">
				<div class="imgBx">
					<img style="height:200px;width:200px;" src="/Portfolio-Site/images/img5.png">
				</div>
				<h2>
					Stephen Wardell The Second Curry
				</h2>
			</div>
		</div>`;
		var bcode = 
		`<div class="container">
			<div class="card">
				<div class="imgBx">
					<img style="height:200px;width:200px;" src="/Portfolio-Site/images/img1.png">
				</div>
				<h2>
					Lionel Andres Igneista Messi
				</h2>
			</div>
		</div>`;
		var ccode = 
		`<div class="container">
			<div class="card">
				<div class="imgBx">
					<img style="height:200px;width:200px;" src="/Portfolio-Site/images/img3.jpg">
				</div>
				<h2>
					Prakhar Gandhi
				</h2>
			</div>
		</div>`;
		if(predictions.length!==0){
			let x = predictions[0].bbox[0];
			if(x<80){
				document.getElementById('A').innerHTML = acode;
				document.getElementById('A').classList.add('Bigletter');
			}
			else if(x>80 && x<200){
				document.getElementById('B').innerHTML = bcode;
				document.getElementById('B').classList.add('Bigletter');	
			}
			else if(x>200 && x<350){
				document.getElementById('C').innerHTML = ccode;
				document.getElementById('C').classList.add('Bigletter');
			}
		}
		if(isVideo){
			requestAnimationFrame(rundetection)
		}
	})
}

handTrack.load(modelParams).then(lmodel =>{
	model = lmodel;
	updatenote.innerText = 'Model is loaded!, Move your head or arm to left/center/right';
	toggleButton.disabled = false;
})