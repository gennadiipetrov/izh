// import type { Strategy } from "../transport-factory";
/*
export class SharedWorkerStorage implements Strategy<Payload> {
    init(): void {
        globalThis.addEventListener('storage', event => {
            console.log(event);
        }); 
    }

    send(key: string, value: any): void {
        globalThis.localStorage.setItem(key, value);
    }

    destroy(): void {
        
    }

    enqueue(pkt: Packet<Payload>): void {
        this._messages.unshift(pkt);
    }

    dequeue(): Packet<Payload> {
        return this._messages.shift() as Packet<Payload>;
    }
}
*/