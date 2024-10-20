import { Subject } from "rxjs";
import type { Packet } from "../../packet";
import type { Transport } from "../transport";

export class MemoryQueue<Payload> implements Transport<Payload> {
    storeUpdated$: Subject<Packet<Payload>[]> = new Subject<Packet<Payload>[]>();

    messages: Packet<Payload>[] = [];

    init(): void {}
    destroy(): void {}

    put(pkt: Packet<Payload>): void {
        this.messages.push(pkt);

        this.storeUpdated$.next([pkt]);
    }

    findPacket(packetId: string): Packet<Payload> | undefined {
        return this.messages.find(p => p.id === packetId)
    }

    deletePacket(packetId: string): void {
        this.messages = this.messages.filter(p => p.id !== packetId);
    }
}

