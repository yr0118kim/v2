import { Vector3 } from 'babylonjs';

export default class AnimateControl<T extends Vector3> {
  private target: T;
  private animateQueue: Array<animation<T>> = new Array();
  constructor(target: T) {
    this.target = target;
  }

  public addAnimate(on: T, duration: number) {
    this.animateQueue.push({
      onMs: on.clone().divide(new Vector3(duration, duration, duration)),
      time: duration,
    });
  }
  public setAnimate(on: T, duration: number) {
    this.animateQueue.push({
      onMs: on
        .clone()
        .subtract(this.target)
        .divide(new Vector3(duration, duration, duration)),
      time: duration,
    });
  }

  public update(deltaTime: number) {
    this.animateQueue.forEach(({ onMs, time }, idx, arr) => {
      const delta = deltaTime > time ? time : deltaTime;
      const { x, y, z } = onMs
        .clone()
        .multiply(new Vector3(delta, delta, delta));
      this.target.x += x;
      this.target.y += y;
      this.target.z += z;
      arr[idx].time -= delta;
      if (arr[idx].time <= 0) {
        arr.splice(idx);
      }
    });
  }
}

declare type animation<T> = {
  onMs: T;
  time: number;
};
