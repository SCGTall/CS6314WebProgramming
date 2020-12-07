const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let hash = (password, callback) => {
    callback(bcrypt.hashSync(password, salt));
}
exports.hash = hash

let compare = (unhashed, hashed, callback) => {
    callback(bcrypt.compareSync(unhashed, hashed));
}
exports.compare = compare

