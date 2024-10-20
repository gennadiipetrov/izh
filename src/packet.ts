import { nanoid } from 'nanoid';

export enum SpecificAbonement {
    ALL
}

export class Packet<Payload extends any> {
    readonly id: string = nanoid();

    constructor(
        readonly data: Payload | null,
        readonly channelName: string | SpecificAbonement,
        readonly abonementName: string | SpecificAbonement,
        readonly abonementId: string,
    ) {}
}
