// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '256686107995678',
        'clientSecret'  : 'e5235b91618793e84e13d0c6f34f9683',
        'callbackURL'   : 'https://127.0.0.1:5001/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '331742396374-jga6e9jn8ac88eosoico3u09ue26ofrd.apps.googleusercontent.com',
        'clientSecret'  : 'vTCrJ-udhyDPQUKR_vHlisYM',
        'callbackURL'   : 'https://localhost:5001/auth/google/callback'
    }

};
