import { of } from "rxjs";
import { Abonent, Packet, Hub } from "../../../src";

export interface PacketData {
    name: string;
}

export const ChannelName = 'test';

export class Consumer<Payload> extends Abonent<Payload> {
    override channelName: string = ChannelName;

    constructor(hub: Hub<Payload> | null) {
        super(hub);
    }

    override sendPacket(pkt: Packet<Payload>) {
        this.sendPacket(pkt);
    }

    getData$() {
        return this.data$ ?? of(null);
    }
}

export class Producer<Payload> extends Abonent<Payload> {
    override channelName: string = ChannelName;

    constructor(hub: Hub<Payload> | null) {
        super(hub);
    }

    override sendPacket(pkt: Packet<Payload>) {
        super.sendPacket(pkt);
    }
}

export function createData(): [
    consumer: Consumer<PacketData>,
    producer: Producer<PacketData>,
    packetForConsumer: Packet<PacketData>
] {
    let hub: Hub<PacketData> | null = null;

    let consumer: Consumer<PacketData>;
    let producer: Producer<PacketData>;

    hub = new Hub(
        () => ([
            consumer,
            producer
        ]),
        'Storage',
        ChannelName
    );

    consumer = new Consumer<PacketData>(hub), 
    producer = new Producer<PacketData>(hub)

    const packetForConsumer = new Packet<PacketData>({ name: 'Ann' }, consumer);

    return [
        consumer,
        producer,
        packetForConsumer,
    ];
}
