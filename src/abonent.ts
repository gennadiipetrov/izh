import type { Hub } from './hub';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import type { Packet } from './packet';
import { nanoid } from 'nanoid';

export abstract class Abonent<Payload> {
    readonly name: string = this.constructor.name;
    readonly id: string = `abonent-id-${nanoid()}`;
    readonly checkData$ = new Subject<Packet<Payload>[]>;
    protected readonly data$: ReplaySubject<Packet<Payload>> | null = null;
    abstract readonly channelName: string;

    readonly destroy$ = new Subject<void>;

    constructor(
        public readonly hub?: Hub<Payload> | null,
        private readonly bufferSize: number = 100
    ) {
        this.hub = hub;
        this.data$ = new ReplaySubject<Packet<Payload>>(this.bufferSize);
        this.bufferSize = bufferSize ?? this.bufferSize;
        this.checkData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (packets: Packet<Payload>[]) => {
                    for (const packet of packets) {
                        if (packet.abonentId === this.id 
                                && packet.channelName === this.channelName 
                                && packet.abonentName === this.name) {
                            this.data$?.next(packet);
                            this.hub?.deletePacket(packet.id);
                        }
                    }
                }
            );
    }

    protected sendPacket(pkt: Packet<Payload>) {
        if (this.hub == null) {
            console.error(`Abonent ${this.name} with out hub!`);
            return;
        }

        this.hub?.put(pkt);
    }

    protected destroy() {
        this.destroy$.next();
    }
}
