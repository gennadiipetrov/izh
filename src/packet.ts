import { nanoid } from 'nanoid';
import type { Abonent } from './abonent';

export enum SpecificAbonent {
    ALL
}

export class Packet<Payload extends any> {
    readonly id: string = `packet-id-${nanoid()}`;
    readonly abonentName: string | SpecificAbonent;
    readonly abonentId: string;
    readonly channelName: string | SpecificAbonent;

    raw() {
        return {
            id: this.id, 
            abonentName: this.abonentName, 
            abonentId: this.abonentId, 
            channelName: this.channelName,
            data: this.data
        }
    }

    constructor(
        readonly data: Payload | null,
        readonly abonent: Abonent<Payload>,
    ) {
        this.abonentName = this.abonent.name;
        this.abonentId = this.abonent.id;
        this.channelName = this.abonent.channelName;
    }
}
