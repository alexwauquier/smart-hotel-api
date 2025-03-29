import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

const verifyRole = (roles) => {  
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

const verifyType = (types) => {
  return (req, res, next) => {
    if (!types.includes(req.user.type_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

export { verifyToken, verifyRole, verifyType };
