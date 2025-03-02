import express from 'express';
import productsRouter from './routes/products.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Smart Hotel RESTful API');
});

app.use('/api/products', productsRouter);

export default app;
