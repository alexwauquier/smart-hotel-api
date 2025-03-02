import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Smart Hotel RESTful API');
});

export default app;
