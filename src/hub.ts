import { Messages } from './messages';
import type { Packet } from './packet';
import type { Point } from './point';

export interface IHub {
  put(sender: object, pkt: Packet<any>): void;
  notifyAll(key: string): void;
}

export class Hub implements IHub {
  private readonly queueMap = new Map<string, Messages<any>>();

  constructor(private readonly points: Point<any>[]) {
    for (const point of points) {
      point?.setMediator(this);
    }
  }

  public put(sender: object, pkt: Packet<any>): void {
    if (this.queueMap.has(pkt.key)) {
      this.queueMap.get(pkt.key)?.enqueue(pkt);
    } else {
      this.queueMap.set(pkt.key, new Messages<any>());
      this.queueMap.get(pkt.key)?.enqueue(pkt);
    }

    this.notifyAll(pkt.key);
  }

  public notifyAll(key: string): void {
    if (this.queueMap.has(key)) {
      const pkt = this.queueMap.get(key)?.dequeue();
      if (pkt) {
        const pointsByKey = this.points.filter((v) => v.key === key);
        for (const point of pointsByKey) {
          point.packets$.next(pkt);
        }
      }
    }
  }
}
