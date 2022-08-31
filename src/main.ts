import './style.css'

const daysElem = document.querySelector('#days')
const STARTDATE = new Date(2014, 5, 23)
const curDate = new Date()
const timestamps = curDate.getTime() - STARTDATE.getTime();
const days = Math.floor(timestamps / 1000 / 60 / 60 / 24)
daysElem && (daysElem.innerHTML = String(days))

const appElem = document.querySelector<HTMLElement>('#app')!;
const audiobtn = document.querySelector('.audiobtn');
const audio = document.querySelector<HTMLMediaElement>('#audio')!;

let audioCtxInited = false;
let analyser: any, dataArray: any, bufferLength: number;

document.addEventListener('colorChange', (e: any)=>{
    const color = e.detail.value
    appElem.style.backgroundColor = color
  }
);

function once(target: any, event: any, callback: any) {
  const handle = function() {
    callback()
    target.removeEventListener(event, handle)
  }
  target.addEventListener(event, handle)
}
once(document, 'click', () => {
  if (!audioCtxInited) initAudioAnalyser()
  if (audio.paused) {
    audiobtn?.classList.add('animate')
    audio.play()
  }
})

audiobtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!audioCtxInited) initAudioAnalyser()
  if (audio.paused) {
    audiobtn.classList.add('animate')
    audio.play()
  } else {
    audiobtn.classList.remove('animate')
    audio.pause()
  }
})

class Circle {
  color: string;
  x: number;
  y: number;
  duration = 2;
  diameter = 0;
  endDiameter: number;
  p5: any;
  moving = true;
  rate = 60; // FPS
  progress = 0; // 动画进度
  constructor(x: number, y: number, color: string, p5: any) {
    this.color = color
    this.x = x
    this.y = y
    this.endDiameter = this.calcEnd();
    this.p5 = p5;
  }
  calcEnd() {
    const lt = Math.ceil(Math.sqrt(this.x**2 +  this.y**2))
    const rt = Math.ceil(Math.sqrt((window.innerWidth - this.x)**2 +  this.y**2))
    const lb = Math.ceil(Math.sqrt(this.x**2 +  (window.innerHeight - this.y)**2))
    const rb = Math.ceil(Math.sqrt((window.innerWidth - this.x)**2 +  (window.innerHeight - this.y)**2))
    return Math.max(lt * 2, rt * 2, lb * 2, rb * 2);
  }
  render() {
    this.p5.noStroke()
    this.p5.fill(this.color)
    this.p5.ellipse(this.x, this.y, this.diameter, this.diameter)
  }
  zoom() {
    if (this.diameter >= this.endDiameter) {
      this.moving = false;
      const event = new CustomEvent("colorChange",{
        detail: {
          value: this.color
        }
      });
      document.dispatchEvent(event)
    }
    if (this.moving) {
      const percent = this.progress / (this.duration * this.rate)
      this.diameter = easeOutCubic(percent) * this.endDiameter
      this.progress += 1;
    }
  }
}

const allCircles: Circle[] = []
const sketch = (p: any) => {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.frameRate(60)
  }
  p.mouseClicked = function() {
    const x = p.mouseX
    const y = p.mouseY
    const color = `hsl(${ Math.round(Math.random() * 255) }, 46%, 42%)`
    allCircles.push(new Circle(x, y, color, p))
  }
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
  p.draw = function() {
    p.clear()
    allCircles.filter((item) => item.moving).forEach((item) => {
      item.render()
      item.zoom()
    })

    // 画音频
    if (analyser) {
      analyser.getByteFrequencyData(dataArray);
      p.noStroke()
      p.fill("rgba(255, 255, 255, 0.2)")
      const barWidth = (p.width / bufferLength) * 2.5;
      let x = 0
      for (let i=0; i<bufferLength; i++) {
        const barHeight = dataArray[i]
        p.rect(x, p.height - barHeight/2, barWidth, barHeight/2)
        x += barWidth + 1
      }
    }
  }
}
new p5(sketch, 'paint')

function initAudioAnalyser() {
  audioCtxInited = true;
  const ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  const source = ctx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(ctx.destination);
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

