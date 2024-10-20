import { WebStorage } from "./client/storage";
import type { TransportKind } from "./transport";
import { TransportContext } from "./transport-context";
import { MemoryQueue } from './client/memory';

export function createTransport<Payload>(
    transport: TransportKind,
    channelName: string,
): TransportContext<Payload> {

    let context = new TransportContext<Payload>(new MemoryQueue<Payload>());
    
    if(transport === 'Memory') {
        context.setStrategy(new MemoryQueue<Payload>());
    }

    if(transport === 'Storage') {
        context.setStrategy(new WebStorage<Payload>(channelName));
    }

    if(transport === 'SharedWorker') {
        // context.setStrategy(new SharedWorkerStorage<Payload>());
    }

    return context
}

