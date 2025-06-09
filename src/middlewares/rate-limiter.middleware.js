import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = req.ip;
    const ua = req.headers['user-agent'] || 'unknown';
    return ip + '-' + ua;
  },
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Too many requests, please try again later.'
    }
  }
});

export default limiter;
