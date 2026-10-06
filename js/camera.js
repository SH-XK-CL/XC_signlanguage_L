/**
 * camera.js — 摄像头采集 + MediaPipe HandLandmarker 集成（ES Module）
 * 从 CDN 加载 @mediapipe/tasks-vision；提供离线 vendoring 配置（见 docs）。
 * 检测循环：每帧 detectForVideo -> 回调 {hands, landmarks, handedness}
 * 并在 canvas 上绘制骨骼连线与关键点。
 */

import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
// 模型：默认 CDN；离线时把同文件放到 ./libs/mediapipe/ 并修改此处即可
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17]
];

class CameraController {
  constructor(video, canvas, onFrame) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onFrame = onFrame || (() => {});
    this.landmarker = null;
    this.stream = null;
    this.running = false;
    this.lastVideoTime = -1;
    this.drawingUtils = null;
    this._loop = this._loop.bind(this);
  }

  async initModel() {
    const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
    this.landmarker = await HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 2
    });
    if (this.ctx) this.drawingUtils = new DrawingUtils(this.ctx);
    return this.landmarker;
  }

  async start() {
    if (!this.landmarker) await this.initModel();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }, audio: false
    });
    this.video.srcObject = this.stream;
    await this.video.play();
    this.running = true;
    this._loop();
  }

  stop() {
    this.running = false;
    if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
  }

  _loop() {
    if (!this.running) return;
    const now = performance.now();
    if (this.video.readyState >= 2 && this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;
      const res = this.landmarker.detectForVideo(this.video, now);
      this._draw(res);
      const hands = (res.landmarks || []).map((lm) => lm);
      const handed = (res.handedness || []).map((h) => (h[0] ? h[0].categoryName : 'Unknown'));
      this.onFrame({ hands, handedness: handed, landmarks: res.landmarks || [] });
    }
    requestAnimationFrame(this._loop);
  }

  _draw(res) {
    const { ctx, canvas } = this;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0); // 镜像显示更自然
    const lms = res.landmarks || [];
    lms.forEach((lm) => {
      // 连线
      HAND_CONNECTIONS.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height);
        ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
      // 关键点
      lm.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f472b6';
        ctx.fill();
      });
    });
    ctx.restore();
  }
}

window.CameraController = CameraController;
window.HAND_CONNECTIONS = HAND_CONNECTIONS;
