import type { Subject } from "rxjs";
import type { Packet } from "../packet";

export type TransportKind = 'Memory' | 'Storage' | 'SharedWorker';

export interface Transport<Payload> {
    init(): void;
    destroy(): void;
    put(pkt: Packet<Payload>): void;
    findPacket(packetId: string): Packet<Payload> | undefined;
    deletePacket(packetId: string): void;
    storeUpdated$: Subject<Packet<Payload>[]>;
}