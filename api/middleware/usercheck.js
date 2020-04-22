module.exports = (req, res, next) => {
    const uid = req.headers["authorization"].split(" ")[1];
    req.body.uid = uid;
    next();
};