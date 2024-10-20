import { test, expect, type TestOptions, describe } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { createData } from './data';

describe('memory tests', () => {
    test('should recieve packets by memory', async () => {
        const [
            consumer,
            producer,
            packetForConsumer
        ] = createData();

        producer?.sendPacket(packetForConsumer);

        const customerData = await firstValueFrom(consumer.getData$());

        expect(customerData?.data?.name).toBe('Ann');
    });
})
