/*
 * File : config/auth.js
 */
'use strict';

// Expose our auth directly to our application using module.exports
module.exports = {

    //resetPasswordUrl: 'https://gigupdev.mobileprogramming.net/#/auth/resetPassword?token=',

    // Auth to set password 
    auth: {
        user: 'qa.a1tech@gmail.com',
        pass: 'welcomeqa',
    },

    // An email address from that reset password link is used to send.
    defaultFromAddress: 'GigUp qa.a1tech@gmail.com',

    // Subject for mail to set password 
    subject: 'Password Reset from GigUp',

    // Secret key for making JWT token
    secret: 'thisismysecretkey',

    // Jwt token expiry time in days.
    tokenExpiresIn: '1d',// Expiry time is one day.

    token_Expires_For_Rest_Password: 5000,// Expiry time is 5 mins.


    // facebook login authentication
    'facebookAuth': {
        'clientID': 677629629096400,//'your-secret-clientID-here', // your App ID
        'clientSecret': '4f4656d0201754755400baac762e05ba',//'your-client-secret-here', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'gender', 'emails', 'name', 'photos'] //This
    },

    // google login authentication
    'googleAuth': {
        'clientID': '563101676521-9qp0vduaqlcpog1s0orinb2n7mb3s4md.apps.googleusercontent.com', //'your-secret-clientID-here',
        'clientSecret': 'KrVsNMO8-5N0qlgd3ly_che2', //'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/google/callback',
        'profileFields': ['id', 'displayName', 'gender', 'emails', 'name', 'photos']
    }
}
