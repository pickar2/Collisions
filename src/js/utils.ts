export class Timer {
    private lastLoopTime: number;

    public constructor() {
        this.lastLoopTime = Date.now();
    }

    public reset() {
        this.lastLoopTime = Date.now();
    }

    public getElapsedTime() {
        const time = Date.now();
        const elapsedTime = time - this.lastLoopTime;
        this.lastLoopTime = time;

        return elapsedTime;
    }
}

export class Vector {
    static zero = new Vector(0, 0);

    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public distance(other: Vector) {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y))
    }

    public add(x: number, y: number) {
        this.x += x;
        this.y += y;

        return this;
    }

    public addVec(vector: Vector) {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    public sub(x: number, y: number) {
        this.x -= x;
        this.y -= y;

        return this;
    }

    public subVec(vector: Vector) {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    public invert() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    public normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;

        return this;
    }

    public mulComponent(x: number, y: number) {
        this.x *= x;
        this.y *= y;

        return this;
    }

    public mulVec(vector: Vector) {
        this.x *= vector.x;
        this.y *= vector.y;

        return this;
    }

    public mul(value: number) {
        this.x *= value;
        this.y *= value;

        return this;
    }

    public dot(vector: Vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    public copy() {
        return new Vector(this.x, this.y);
    }
}