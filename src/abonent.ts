import type { Hub } from './hub';
import { ReplaySubject, Subject } from 'rxjs';
import type { Packet } from './packet';
import { nanoid } from 'nanoid';

export abstract class Abonent<Payload> {
    readonly name: string = this.constructor.name;
    readonly id: string = nanoid();
    readonly checkData$ = new Subject<Packet<Payload>[]>;
    protected readonly data$: ReplaySubject<Packet<Payload>> | null = null;
    abstract readonly channelName: string;

    constructor(
        public readonly hub?: Hub<Payload> | null,
        private readonly bufferSize: number = 100
    ) {
        this.hub = hub;
        this.data$ = new ReplaySubject<Packet<Payload>>(this.bufferSize);
        this.bufferSize = bufferSize ?? this.bufferSize;
        this.checkData$.subscribe(
            (packets: Packet<Payload>[]) => {
                for (const packet of packets) {
                    if (packet.abonementId === this.id 
                            && packet.channelName === this.channelName 
                            && packet.abonementName === this.name) {
                        this.data$?.next(packet);
                        this.hub?.deletePacket(packet.id);
                    }
                }
            }
        );
    }

    sendPacket(pkt: Packet<Payload>) {
        this.hub?.put(pkt);
    }
}
