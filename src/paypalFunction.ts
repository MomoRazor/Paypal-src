import { NODE_ENV } from './enviornment';

const paypal = require('@paypal/checkout-server-sdk');

const getPaypalClient = (id: string, secret: string) => {
    const Environment =
        NODE_ENV === 'production'
            ? new paypal.core.LiveEnvironment(id, secret)
            : new paypal.core.SandboxEnvironment(id, secret);

    return new paypal.core.PayPalHttpClient(Environment);
};

export const createOrder = async (paypalId: string, paypalSecret: string, purchaseUnits: any[]) => {
    const client = getPaypalClient(paypalId, paypalSecret);
    const request = new paypal.orders.OrderCreateRequest();

    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: purchaseUnits
    });

    return await client.execute(request);
};

export const captureOrder = async (paypalId: string, paypalSecret: string, orderId: string) => {
    const client = getPaypalClient(paypalId, paypalSecret);
    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    request.requestBody({});

    return await client.execute(request);
};
