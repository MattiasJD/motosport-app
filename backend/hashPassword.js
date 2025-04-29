const bcrypt = require('bcryptjs');

const password = "admin";

bcrypt.hash(password, 10, (err, hash) => {
    if(err) console.error(err);
    else console.log('hash hesla:', hash);
});

'$2b$10$WSximxTf5OF0r.RSNpmxU.xiJMsA6mQyJCujSULkLtOlVr1zVUlnK'