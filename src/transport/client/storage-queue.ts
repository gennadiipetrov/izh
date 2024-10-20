import type { Transport } from './../transport';
import type { Packet } from "../../packet";
import { Subject } from 'rxjs';
import {difference} from 'lodash-es'

export class WebStorage<Payload> implements Transport<Payload> {
    storeUpdated$: Subject<Packet<Payload>[]> = new Subject<Packet<Payload>[]>();

    private readonly handler = (event: any) => {
        let {key, newValue, oldValue} = event;
        newValue = JSON.parse(newValue ?? '');
        oldValue = JSON.parse(oldValue ?? '');

        const packets = difference(newValue, oldValue, 'id');

        if (this.key === key && packets.length > 0) this.storeUpdated$.next(packets as unknown as Packet<Payload>[]);
    }

    constructor(private readonly key: string) {}

    findPacket(packetId: string): Packet<Payload> | undefined {
        throw new Error('Method not implemented.');
    }

    deletePacket(packetId: string): void {
        let messages = JSON.parse(globalThis.localStorage.getItem(this.key) ?? '');
        messages = messages.filter((m: { id: string; }) => m.id !== packetId);
        globalThis.localStorage.setItem(this.key, JSON.stringify(messages));
    }

    init(): void {
        globalThis.addEventListener('storage', this.handler); 
    }

    destroy(): void {
        globalThis.removeEventListener("storage", this.handler);
    }

    put(pkt: Packet<Payload>): void {
        const messages = JSON.parse(globalThis.localStorage.getItem(this.key) ?? '');
        messages.unshift(pkt);
        globalThis.localStorage.setItem(this.key, JSON.stringify(messages));
    }


}

