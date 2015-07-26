document.getElementById('musicbox').onclick = function(){
	var audio = document.getElementById('music-elem');
	var isPaused = audio.paused;
	if(isPaused){
		audio.play();
		this.style.animationPlayState = "running";
		this.style.webkitAnimationPlayState = "running";
		this.style.mozAnimationPlayState = "running";
		this.style.oAnimationPlayState = "running";
		this.style.msAnimationPlayState = "running";
	}else{
		audio.pause();
		this.style.animationPlayState = "paused";
		this.style.webkitAnimationPlayState = "paused";
		this.style.mozAnimationPlayState = "paused";
		this.style.oAnimationPlayState = "paused";
		this.style.msAnimationPlayState = "paused";
	}
};

var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    document.getElementsByTagName('body')[0].ontouchstart = function(){
		document.getElementById('musicbox').click();
		document.getElementsByTagName('body')[0].ontouchstart = null;
	}
} else {
    window.onload = function(){
		document.getElementById('musicbox').click();
	}
}