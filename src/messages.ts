import type { Packet } from './packet';

export class Messages<Payload> {
  private readonly _messages: Packet<Payload>[] = [];

  enqueue(pkt: Packet<Payload>): void {
    this._messages.unshift(pkt);
  }

  dequeue(): Packet<Payload> {
    return this._messages.shift() as Packet<Payload>;
  }
}
