import { nanoid } from 'nanoid';

export class Packet<Payload extends any> {
  private readonly id: string = nanoid();

  constructor(
    readonly data: Payload | null,
    readonly key: string,
  ) {}
}
