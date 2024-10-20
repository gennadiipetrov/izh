import { test, expect } from 'vitest';
import { Abonent } from './abonent.js';
import { Packet } from './packet.js';
import { Hub } from './hub.js';
import { firstValueFrom, take } from 'rxjs';

interface PacketData {
    name: string;
}

export const ChannelName = 'test';

class Consumer<Payload> extends Abonent<Payload> {
  override channelName: string = ChannelName;

  constructor(hub: Hub<Payload> | null) {
      super(hub);
  }
}

class Producer<Payload> extends Abonent<Payload> {
    override channelName: string = ChannelName;

    constructor(hub: Hub<Payload> | null) {
        super(hub);
    }
}

test('should recieve packets by memory', async () => {
    let hub: Hub<PacketData> | null = null;
    const consumer1 = new Consumer<PacketData>(hub);
    const consumer2 = new Consumer<PacketData>(hub);
    const producer = new Producer<PacketData>(hub);

    const payload1: PacketData = { name: 'Ann' };
    const packet1 = new Packet<PacketData>(payload1, ChannelName, consumer1.name, consumer1.id);
    const payload2: PacketData = { name: 'Mike' };
    const packet2 = new Packet<PacketData>(payload2, ChannelName, consumer2.name, consumer2.id);

    hub = new Hub([consumer1, consumer2, producer], 'Memory', ChannelName);

    producer.sendData(packet1);
    producer.sendData(packet2);

    const c1 = await firstValueFrom(consumer1.data$);
    const c2 = await firstValueFrom(consumer2.data$);

    expect(c1?.data?.name).toBe('Ann');
    expect(c2?.data?.name).toBe('Mike');
});
