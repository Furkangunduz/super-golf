const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const FPS = 60;
const WIDTH = 1200;
const HEIGHT = 800;
const gravitiy = 10;

canvas.width = WIDTH;
canvas.height = HEIGHT;

var mousePos = {
    x: 0,
    y: 0,
};
var showThrowLine = true;

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.angle = 0;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.isDirectionReady = false;
        this.isForceReady = false;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {}
}

class Line {
    constructor(x, y, width, lineHeight, color = "white") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.lineHeight = lineHeight;
        this.color = color;
        this.angle = 1;
        this.radian = 0;
        this.force = 1;
        this.direction = "up";
        this.forceDirection = "down";
    }
    draw() {
        c.strokeStyle = this.color;
        c.lineWidth = this.width;
        this.radian = (this.angle * Math.PI) / 180;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(
            this.x + Math.cos(this.radian) * this.lineHeight,
            this.y + Math.sin(this.radian) * this.lineHeight
        );
        c.stroke();
    }
    directionAnimation() {
        this.draw();
        if (this.angle == 0) this.direction = "up";
        else if (this.angle == -90) this.direction = "down";
        this.angle =
            this.direction == "up"
                ? this.angle - 1
                : this.direction == "down"
                ? this.angle + 1
                : 0;
    }
    ForceAnimation() {
        this.draw();
        if (this.force <= 0) this.forceDirection = "up";
        else if (this.force >= 1) this.forceDirection = "down";
        this.radian = (this.angle * Math.PI) / 180;
        this.force =
            this.forceDirection == "up" ? this.force + 0.04 : this.force - 0.04;

        c.strokeStyle = "green";

        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(
            this.x + Math.cos(this.radian) * this.lineHeight * this.force,
            this.y + Math.sin(this.radian) * this.lineHeight * this.force
        );
        c.stroke();
    }
    final() {
        this.draw();
        c.strokeStyle = "green";

        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(
            this.x + Math.cos(this.radian) * this.lineHeight * this.force,
            this.y + Math.sin(this.radian) * this.lineHeight * this.force
        );
        c.stroke();
    }
}

const ball = new Ball(100, canvas.height - 10, 10, "red");
const line = new Line(ball.x, ball.y, 10, 100);

const gameloop = () => {
    setInterval(() => {
        c.fillStyle = "rgba(0,0,0,0.7)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        ball.update();

        if (showThrowLine) {
            if (!ball.isDirectionReady) {
                //set angle to move bar up and down by axis of ball
                line.directionAnimation();
            }
            if (ball.isDirectionReady && !ball.isForceReady) {
                //green bar up and down force
                line.ForceAnimation();
            }
            if (ball.isDirectionReady && ball.isForceReady) {
                ball.angle = line.angle;
                ball.force = line.force;
                //final position of line
                line.final();
                setTimeout(() => {
                    showThrowLine = false;
                    //line dissappear
                }, 1000);
            }
        }

        ball.draw();
    }, 1000 / FPS);
};

gameloop();

// addEventListener("mousemove", (e) => {
//     let rect = canvas.getBoundingClientRect();
//     let mouseX = Math.round(e.clientX - rect.left);
//     let mouseY = Math.round(e.clientY - rect.top);
//     mousePos = {
//         x: mouseX < 0 ? 0 : mouseX > canvas.width ? canvas.width : mouseX,
//         y: mouseY < 0 ? 0 : mouseY > canvas.height ? canvas.height : mouseY,
//     };
// });

canvas.addEventListener("mousedown", () => {
    if (ball.isDirectionReady && ball.isForceReady) {
        ball.isDirectionReady = false;
        ball.isForceReady = false;
        return;
    }
    if (!ball.isDirectionReady) {
        ball.isDirectionReady = true;
        return;
    }
    if (ball.isDirectionReady) {
        ball.isForceReady = true;
        console.log(ball);
        return;
    }
});
