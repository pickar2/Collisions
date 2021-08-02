import {Vector} from "./utils";

export class Body {
	public radius: number;
	public position = new Vector(0, 0);
	public velocity = new Vector(0, 0);

	public constructor(radius: number) {
		this.radius = radius;
	}

	public setVelocity(x: number, y: number) {
		this.velocity.set(x, y);
	}

	public setPosition(x: number, y: number) {
		this.position.set(x, y);
	}

	public getMass() {
		return Math.PI * this.radius * this.radius;
	}

	public getInvMass() {
		return 1;
	}
}

export abstract class Physics {
	abstract simulate(bodies: Body[]): void;
}

export class SimplePhysics extends Physics {
	public readonly WIDTH = 1280;
	public readonly HEIGHT = 720;

	public simulate(bodies: Body[]): void {
		for (let body of bodies) {
			body.setPosition(body.position.x + body.velocity.x, body.position.y + body.velocity.y);
			this.fixOutsideOfWorld(body);
		}

		const collisions = this.findCollisions(bodies);
		for (let collision of collisions) {
			const rVel = collision.body2.velocity.copy().subVec(collision.body1.velocity);
			const nSpd = rVel.dot(collision.normal);

			if (nSpd > 0) continue;

			const invMass1 = collision.body1.getInvMass();
			const invMass2 = collision.body2.getInvMass();

			const j = 1;//-nSpd / (invMass1 + invMass2);

			const impulse = collision.normal.copy().mul(j);

			collision.body1.velocity.subVec(impulse);
			collision.body2.velocity.addVec(impulse);
		}
	}

	public fixOutsideOfWorld(body: Body) {
		if (body.position.x < 0) {
			body.position.x = this.WIDTH + body.position.x;
		} else if (body.position.x > this.WIDTH) {
			body.position.x = body.position.x - this.WIDTH;
		}

		if (body.position.y < 0) {
			body.position.y = this.HEIGHT + body.position.y;
		} else if (body.position.y > this.HEIGHT) {
			body.position.y = body.position.y - this.HEIGHT;
		}
	}

	public findCollisions(bodies: Body[]): CollisionResult[] {
		const collisions = [] as CollisionResult[];

		let b1: Body, b2: Body;
		let cr: CollisionResult;
		for (let i = 0; i < bodies.length; i++) {
			b1 = bodies[i];
			for (let j = i+1; j < bodies.length; j++) {
				b2 = bodies[j];
				cr = this.checkCollision(b1, b2);
				if (cr.collided) {
					collisions.push(cr);
				}
			}
		}

		return collisions;
	}

	public checkCollision(body1: Body, body2: Body): CollisionResult {
		const b1tob2: Vector = body2.position.copy().subVec(body1.position);
		const radiusSum = body1.radius + body2.radius;
		if (b1tob2.length() <= radiusSum) {
			const b2tob1: Vector = body1.position.copy().subVec(body2.position);
			const vec: Vector = b1tob2.normalize().mul(body1.radius).subVec(b2tob1.normalize().mul(body2.radius));

			return new CollisionResult(body1, body2, vec.copy().normalize(), vec.length(), true);
		}

		return new CollisionResult(body1, body2);
	}
}

export class CollisionResult {
	public body1: Body;
	public body2: Body;
	public normal: Vector;
	public length: number;
	public collided: boolean;

	public constructor(body1: Body, body2: Body, normal: Vector = Vector.zero, length: number = 0, collided: boolean = false) {
		this.body1 = body1;
		this.body2 = body2;
		this.normal = normal;
		this.length = length;
		this.collided = collided;
	}
}