import { Subject } from "rxjs";
import type { Packet } from "../packet";
import type { Transport } from "./transport";

export class TransportContext<Payload> {
    private transport: Transport<Payload> | null = null;
    private readonly _storeUpdated$: Subject<Packet<Payload>[]> = new Subject<Packet<Payload>[]>();
    readonly storeUpdated$ = this._storeUpdated$.asObservable();

    constructor(strategy: Transport<Payload>) {
        this.transport = strategy;
        this._storeUpdated$ = this.transport.storeUpdated$;
    }

    put(pkt: Packet<Payload>): void {
        if(this.transport == null) throw new Error('Transport null');

        this.transport.put(pkt);
    }
    
    findPacket(packetId: string): Packet<Payload> | undefined {
        if(this.transport == null) throw new Error('Transport null');

        return this.transport.findPacket(packetId);
    }

    deletePacket(packetId: string): void {
        if(this.transport == null) throw new Error('Transport null');

         this.transport.deletePacket(packetId);
    }

    public setStrategy(strategy: Transport<Payload>) {
        if (this.transport) this.transport.destroy();
        
        this.transport = strategy;
        this.transport.init();
    }
}