import { test, expect } from 'vitest';
import { Point } from './point.js';
import { Packet } from './packet.js';
import { Hub } from './hub.js';
import { firstValueFrom, lastValueFrom } from 'rxjs';

interface PacketData {
  name: string;
}

const payload: PacketData = { name: 'Ann' };

const packet = new Packet<PacketData>(payload, 'test');

class Consumer<Payload> extends Point<Payload> {
  override key: string = 'test';

  constructor() {
    super();
    this.recievePacket();
  }

  public recievePacket(): void {
    this.packets$.subscribe((value) => console.log(value));
  }
}

class Producer<Payload> extends Point<Payload> {
  override key: string = 'test';

  public sendPacket(): void {
    this.hub?.put(this, packet);
  }
}

test('send packet', async () => {
  const consumer1 = new Consumer<PacketData>();
  const consumer2 = new Consumer<PacketData>();
  const producer = new Producer<PacketData>();

  new Hub([consumer1, consumer2, producer]);
  producer.sendPacket();
  const packet1 = await firstValueFrom(consumer1.packets$);
  const packet2 = await firstValueFrom(consumer2.packets$);

  expect(packet1?.data?.name).toBe('Ann');
  expect(packet2?.data?.name).toBe('Ann');
});
