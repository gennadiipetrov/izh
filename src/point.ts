import { nanoid } from 'nanoid';
import type { Hub } from './hub';
import { ReplaySubject, Subject } from 'rxjs';
import type { Packet } from './packet';

export abstract class Point<Payload> {
  protected readonly id: string = nanoid();

  abstract readonly key: string;

  readonly packets$: ReplaySubject<Packet<Payload>>;

  constructor(
    protected hub?: Hub,
    bufferSize: number = 1024,
  ) {
    this.packets$ = new ReplaySubject<Packet<Payload>>(bufferSize);
  }

  public setMediator(hub: Hub): void {
    this.hub = hub;
  }
}
