const jwt = require('jsonwebtoken');
const configData = require('../config/DB');

class JwtTokenGenerator {
    static createToken(_id, email, login_type) {
        var secreteKey = configData.CONFIG_DATA.JWTSecret;
        return (
            'JWT ' +
            jwt.sign(
                {
                    _id: _id,
                    email: email,
                    login_type: login_type,
                },
                secreteKey
            )
        );
    }
}
module.exports = JwtTokenGenerator;
