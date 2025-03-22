import express from 'express';
import authRouter from './routes/auth.router.js';
import customerRouter from './routes/customer.router.js';
import employeeRouter from './routes/employee.router.js';
import productRouter from './routes/product.router.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Hotel RESTful API');
});

app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/products', productRouter);

export default app;
