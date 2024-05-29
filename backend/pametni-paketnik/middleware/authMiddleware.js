const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    } else {
      return res.status(401).send({ error: 'Unauthorized' });
    }
  };
  
  export default isAuthenticated;
  