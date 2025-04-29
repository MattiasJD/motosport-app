const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET = 'tanjyklicbruh';

exports.register = async (req,res) => {
  const {username, password} = req.body;

  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (user.length > 0) {
        return res.status(400).json({message: 'Username already exists'});
    }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'user']);

  res.status(201).json({message: 'User registered successfully'});

};

exports.login = async (req, res) => {
    const {username, password} = req.body;

    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length === 0 ){
            return res.status(401).json({message: 'Invalid username or password'});
        }
    const valid = await bcrypt.compare(password, user[0].password);
        if (!valid){
            return res.status(401).json({message: 'Invalid username or password'});
        }
    const token = jwt.sign({id: user[0].id, role: user[0].role}, SECRET, {expiresIn: '1h'});
    res.json({token});

}
