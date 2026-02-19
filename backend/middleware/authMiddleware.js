const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader)
        return res.status(401).json({ message: "Token requerido" });

    const token = authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "Token inválido" });

    jwt.verify(token, SECRET, (err, decoded) => {

        if (err)
            return res.status(403).json({ message: "Token inválido o expirado" });

        req.usuario = decoded;
        next();
    });
}

module.exports = verificarToken;
