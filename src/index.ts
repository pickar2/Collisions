let {Body, SimplePhysics} = require('./js/physics');
let {Vector, Timer} = require('./js/utils');

class Particle extends Body {
    constructor(radius: number, color: string) {
        super(radius);
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function getRandomInt(to: number, from = 0) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function getRandomFloat(to: number, from = 0) {
    return Math.random() * (to - from) + from;
}

function getRandomColor() {
    return getRandomInt(16777215).toString(16);
}

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let info = document.getElementById("info") as HTMLDivElement;

const WIDTH = 1280;
const HEIGHT = 720;

const UPDATES_PER_SECOND = 60;
const MS_PER_UPDATE = 1000.0 / UPDATES_PER_SECOND;
const MS_PER_UPDATE_INV = 1 / MS_PER_UPDATE;

let particleCount = 500;
let particleMinSize = 5;
let particleMaxSize = 12;
let particleMinVelocity = -4;
let particleMaxVelocity = 4;

let particles = [] as Particle[];
let physics = new SimplePhysics();

let frameTime = -1;
let updateTime = -1;

let timer = new Timer();
function loop() {
    timer.reset();
    update();
    updateTime = timer.getElapsedTime();
    drawScene();
    frameTime = timer.getElapsedTime();
}

function update() {
    physics.simulate(particles);
}

function drawScene() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let p of particles) {
        p.draw(ctx);
    }
    updatePage();
}

function updatePage() {
    info.innerHTML = `
        <p>fps = ${Math.min(1000 / frameTime, UPDATES_PER_SECOND)}</p>
        <p>frameTime = ${frameTime}ms</p>
        <p>ups = ${Math.min(1000 / updateTime, UPDATES_PER_SECOND)}</p>
        <p>updateTime = ${updateTime}ms</p>
    `;
}

console.log("START");

for (let i = 0, p; i < particleCount; i++) {
    p = new Particle(getRandomInt(particleMaxSize + 1, particleMinSize), "#" + getRandomColor());
    p.setPosition(getRandomInt(WIDTH), getRandomInt(HEIGHT));
    p.setVelocity(getRandomFloat(particleMinVelocity, particleMaxVelocity), getRandomFloat(particleMinVelocity, particleMaxVelocity));

    particles.push(p);
}

setInterval(loop, MS_PER_UPDATE);

console.log("END");