import express from 'express';
import { json } from 'body-parser';
import { bouncer } from './middleware';
import cors from 'cors';
import helmet from 'helmet';
import { captureOrder, createOrder } from './paypalFunction';

const app = express();

app.use(cors());
app.use(helmet());
app.use(bouncer);

app.post('/createOrder', json(), async (req, res) => {
    if (req.body.paypalId && req.body.paypalSecret) {
        if (req.body.purchaseUnits && req.body.purchaseUnits.length > 0) {
            try {
                const order = await createOrder(
                    req.body.paypalId,
                    req.body.paypalSecret,
                    req.body.purchaseUnits
                );
                res.json({
                    order: order
                });
            } catch (e) {
                res.status(500).send(e);
            }
        } else {
            res.status(400).send('Purchase Units Missing');
        }
    } else {
        res.status(400).send('Required Credentials Missing');
    }
});

app.post('/captureOrder', json(), async (req, res) => {
    if (req.body.paypalId && req.body.paypalSecret) {
        if (req.body.orderId) {
            try {
                await captureOrder(req.body.paypalId, req.body.paypalSecret, req.body.orderId);
                res.send('Successfully captured Order!');
            } catch (e) {
                res.status(500).send(e);
            }
        } else {
            res.status(400).send('Order Id Missing');
        }
    } else {
        res.status(400).send('Required Credentials Missing');
    }
});

app.get('/', (_, res) => {
    res.send('Hello from my Paypal Service!');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
