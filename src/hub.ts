import type { Packet } from './packet';
import type { Abonent } from './abonent';
import { createTransport } from './transport/transport-factory';
import type { TransportKind } from './transport/transport';
import type { TransportContext } from './transport/transport-context';

export class Hub<Payload> {
    private readonly transportContext?: TransportContext<Payload>;

    constructor(
        private readonly abonents: Abonent<Payload>[],
        transport: TransportKind,
        channelName: string
    ) {
        this.transportContext = createTransport(transport, channelName);

        this.transportContext.storeUpdated$
            .subscribe(
                (pkts: Packet<Payload>[]) => this.abonents.forEach(abonent => abonent.checkData$.next(pkts))
            );
    }

    deletePacket(packetId: string) {
        this.transportContext?.deletePacket(packetId);
    }

    put(
        packet: Packet<Payload>
    ) {
        this.transportContext?.put(packet);
    }
}
