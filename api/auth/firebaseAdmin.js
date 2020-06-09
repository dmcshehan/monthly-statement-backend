const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.js');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://monthly-statement.firebaseio.com',
});

module.exports = admin;
