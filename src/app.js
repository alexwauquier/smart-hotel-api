import express from 'express';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Hotel RESTful API');
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

export default app;
