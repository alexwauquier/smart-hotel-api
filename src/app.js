import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.router.js';
import customerRouter from './routes/customer.router.js';
import employeeRouter from './routes/employee.router.js';
import measurementRouter from './routes/measurement.router.js';
import orderRouter from './routes/order.router.js';
import productRouter from './routes/product.router.js';
import sensorsRouter from './routes/sensor.router.js';
import spaceRouter from './routes/space.router.js';
import { verifyToken, verifyRole } from './middlewares/auth.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Hotel RESTful API');
});

app.use('/api/auth', authRouter);
app.use('/api/customers', verifyToken, verifyRole(['customer', 'employee']), customerRouter);
app.use('/api/employees', verifyToken, verifyRole(['employee']), employeeRouter);
app.use('/api/measurements', verifyToken, verifyRole(['customer', 'employee']), measurementRouter);
app.use('/api/orders', verifyToken, verifyRole(['customer', 'employee']), orderRouter);
app.use('/api/products', verifyToken, verifyRole(['customer', 'employee']), productRouter);
app.use('/api/sensors', verifyToken, verifyRole(['employee']), sensorsRouter);
app.use('/api/spaces', verifyToken, verifyRole(['employee']), spaceRouter);

export default app;
