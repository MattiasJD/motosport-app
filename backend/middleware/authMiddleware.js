const jwt = require('jsonwebtoken');
const e = require("express");
const SECRET = 'tanjyklicbruh';

exports.verifyToken = (req, res, next) => {
    console.log('📛 Spouštím verifyToken');

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Chybí token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Neplatný token' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token není platný' });

        req.user = user; // uložíme dekódované info do requestu
        console.log('✅ Ověřený token:', user);

        next(); // ➡️ TADY MUSÍ BÝT next() jinak request zůstane viset
    });
};

exports.verifyAdmin = (req, res, next) => {
    console.log('🔐 Spouštím verifyAdmin');

    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.status(401).json({message: 'No token provided'});

    const token = authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: 'Invalid token'});

    jwt.verify(token, SECRET, (err,user) => {
        if (err) return res.status(403).json({message: 'Invalid token'});

        if(user.role !== 'admin') return res.status(403).json({message: 'Admin authorized only'});


        req.user = user;
        next();
    })
}