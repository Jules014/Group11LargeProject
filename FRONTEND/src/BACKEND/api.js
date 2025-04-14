require('express');
require('mongodb');
require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.setApp = function(app, client) {

    app.post('/api/resetpassword', async (req, res, next) =>
        {
        // incoming: email
        // outgoing: valid, error
        var error = '';
        var valid = '';
        const {email} = req.body;
        const db = client.db("largeproject");
        var results = await db.collection('Users').find({Email:email}).toArray();
        if( results.length > 0 ) {
            valid = 1;
            var random = Math.floor(Math.random() * 899999) + 100000;
            var newPassword = 'A' + random + 'z';
            await db.collection('Users').updateOne({ Email: email}, {$set: {Password:newPassword}});
            const messageData = {
                to: email,
                from: 'abraham.ng@ucf.edu',
                subject: 'New Password for CatAI-logue',
                text: 'Here is your new password: ' + newPassword,
            }
            try {
                await sendgrid.send(messageData);
            }
            catch (e) {
                error = e.toString();
            }
        }
        var ret = {valid:valid, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/resendemail', async (req, res, next) =>
        {
        // incoming: userToken
        // outgoing: valid, error
        var error = '';
        var code = 0;
        var valid = '';
        const {userToken} = req.body;
        var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;

        const db = client.db("largeproject");
        const results = await db.collection('Users').find({Login:login}).toArray();
        if( results.length > 0 ) {
            valid = 1;
            code = results[0].Code;
	    email = results[0].Email;
            const messageData = {
                to: email,
                from: 'abraham.ng@ucf.edu',
                subject: 'Verification Code for CatAI-logue',
                text: 'Here is your verification code: ' + code,
            }
            try {
                await sendgrid.send(messageData);
            }
            catch (e) {
                error = e.toString();
            }
        }
        var ret = {valid:valid, error:error};
        res.status(200).json(ret);
    });



    app.post('/api/sendemail', async (req, res, next) =>
        {
        // incoming: login, password, email
        // outgoing: valid, error
        var error = '';
        var code = 0;
        var valid = '';
        const {login, password, email} = req.body;
        const db = client.db("largeproject");
        var results = await db.collection('Users').find({Login:login,Password:password}).toArray();
        if( results.length > 0 ) {
            valid = 1;
            code = results[0].Code;
            const messageData = {
                to: email,
                from: 'abraham.ng@ucf.edu',
                subject: 'Verification Code for CatAI-logue',
                text: 'Here is your verification code: ' + code,
            }
            try {
                await sendgrid.send(messageData);
            }
            catch (e) {
                error = e.toString();
            }
        }
        var ret = {valid:valid, error:error};
        res.status(200).json(ret);
    });
    


    app.post('/api/verifyemail', async (req, res, next) =>
        {
        // incoming: userToken, code
        // outgoing: valid, error
        var error = '';
        const {userToken, code} = req.body;
        var valid = -1;

        var token = require('./createJWT.js');        
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes'};
                res.status(200).json(ret);
                return;
            }

            var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;

            const db = client.db("largeproject");
            const results = await db.collection('Users').find({Login:login}).toArray();

            if (results.length > 0) {
                var actualCode = results[0].Code;
                if (actualCode.valueOf() == code.valueOf()) {
                    await db.collection('Users').updateOne({ Login: login}, {$set: {Verified:'yes'}});
                    valid = 1;
                }
            }
        }
        catch(e)
        {
            userToken = {error:e.message};
        }
        var ret = { valid:valid, error:error};
        res.status(200).json(ret);
    });



    
    app.post('/api/login', async (req, res, next) =>
        {
        // incoming: login, password
        // outgoing: valid, verified, firstName, lastName, email, login, error, userToken
        var error = '';
        const { login, password } = req.body;
        const db = client.db("largeproject");
        const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
        var valid = -1;
        var fn = '';
        var ln = '';
        var verified = '';
        var email = '';
        if( results.length > 0 ) {
            valid = 1;
            verified = results[0].Verified;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            email = results[0].Email;
            try
                {
                    const token = require("./createJWT.js");
                    userToken = token.createToken( fn, ln, login);
                }
                catch(e)
                {
                    userToken = {error:e.message};
                }
        }
        else {
            error = 'Invalid user name/password';
        }
        var ret = { valid:valid, verified:verified, firstName:fn, lastName:ln, email:email, login:login, error:error, userToken:userToken};
        res.status(200).json(ret);
    });



    app.post('/api/verifytoken', async (req, res, next) =>
        {
        // incoming: userToken
        // outgoing: expired, error, userToken
        const {userToken} = req.body;
        var error = '';
        var token = require('./createJWT.js');
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes', userToken:''};
                res.status(200).json(ret);
                return;
            }
        }
        catch(e) {
            error = e.toString();
        }
        var refreshedToken = token.refresh(userToken);
        var ret = {error:error, expired:'no', userToken:refreshedToken};
        res.status(200).json(ret);
    });




app.post('/api/checkusername', async (req, res, next) =>
    {
    // incoming: login
    // outgoing: valid, error
    var error = '';
    var valid = '';
    const { login } = req.body;
    const db = client.db("largeproject");
    const results = await db.collection('Users').find({Login:login}).toArray();
    if( results.length > 0 ) {
        error = 'Username already exists'
        valid = 'invalid';
    }
    else {
        error = '';
        valid = 'valid';
    }
    var ret = { valid:valid, error:error};
    res.status(200).json(ret);
});



app.post('/api/checkemail', async (req, res, next) =>
    {
    // incoming: email
    // outgoing: valid, error
    var error = '';
    var valid = '';
    const { email } = req.body;
    const db = client.db("largeproject");
    const results = await db.collection('Users').find({Email:email}).toArray();
    if( results.length > 0 ) {
        error = 'Email already in use'
        valid = 'invalid';
    }
    else {
        error = '';
        valid = 'valid';
    }
    var ret = { valid:valid, error:error};
    res.status(200).json(ret);
});



    app.post('/api/signup', async (req, res, next) =>
        {
        // incoming: lots of stuff
        // outgoing: error
        const {firstName, lastName, email, login, password} = req.body;
        var random = Math.floor(Math.random() * 899999) + 100000;
        var verificationCode = 'm' + random;
        const newUser = {FirstName:firstName, LastName:lastName, Email:email, Login:login, Password:password, Verified:'no', Code:verificationCode};
        var error = '';
        try {
            const db = client.db("largeproject");
            const result = await db.collection('Users').insertOne(newUser);
        }
        catch(e) {
            error = e.toString();
        }
        var ret = {error: error };
        res.status(200).json(ret);
    });



    app.post('/api/edituser', async (req, res, next) =>
        {
        // incoming: firstName, lastName, email, userToken
        // outgoing: firstName, lastName, email, userToken, error, expired
        const {firstName, lastName, email, userToken} = req.body;
        var error = '';
        var token = require('./createJWT.js');
        
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes'};
                res.status(200).json(ret);
                return;
            }
            
            var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;
            
            const db = client.db("largeproject");
            const result1 = await db.collection('Users').updateOne({ Login: login}, {$set: {FirstName:firstName}});
            const result2 = await db.collection('Users').updateOne({ Login: login}, {$set: {LastName:lastName}});
            const result3 = await db.collection('Users').updateOne({ Login: login}, {$set: {Email:email}});

            var refreshedToken = token.refresh(userToken);

        }
        catch(e) {
            error = e.toString();
        }

        var ret = {firstName:firstName, lastName:lastName, email:email, userToken:refreshedToken, error:error, expired:'no'};
        res.status(200).json(ret);
    });



app.post('/api/verifypassword', async (req, res, next) =>
    {
    // incoming: login, password
    var error = '';
    const { login, password } = req.body;
    const db = client.db("largeproject");
    const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    var valid = -1;
    var fn = '';
    var ln = '';
    if( results.length > 0 ) {
        valid = 1;
    }
    else {
        error = 'Invalid user name/password';
    }
    var ret = { valid:valid, error:error};
    res.status(200).json(ret);
});



    app.post('/api/editpassword', async (req, res, next) =>
        {
        // incoming: password, userToken
        // outgoing: error
        const {password, userToken} = req.body;
        var error = '';
        var token = require('./createJWT.js');
        var expired = '';
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes'};
                res.status(200).json(ret);
                return;
            }
            
            var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;

            const db = client.db("largeproject");
            const result = await db.collection('Users').updateOne({ Login: login}, {$set: {Password:password}});

            var refreshedToken = token.refresh(userToken);
        }
        catch(e) {
            error = e.toString();
        }
        var ret = {userToken:refreshedToken, error:error, expired:'no'};
        res.status(200).json(ret);
    });
    


        app.post('/api/addhistory', async (req, res, next) =>
        {
        // incoming: date, breed, confidence, userToken
        // outgoing: userToken, error, expired
        const {date, breed, confidence, userToken} = req.body;
        var error = '';
        var token = require('./createJWT.js');
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes'};
                res.status(200).json(ret);
                return;
            }
            
            var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;
            var newSearchResult = {date:date, breed:breed, confidence:confidence, login:login};

            const db = client.db("largeproject");
            const result = await db.collection('History').insertOne(newSearchResult);

            var refreshedToken = token.refresh(userToken);
        }
        catch(e) {
            error = e.toString();
        }
        var ret = {userToken:refreshedToken, error:error, expired:'no'};
        res.status(200).json(ret);
    });


    
    
    app.post('/api/gethistory', async (req, res, next) =>
        {
        // incoming: userToken
        // outgoing: valid, error
        var error = '';
        var valid = '';
        var token = require('./createJWT.js');
        const { userToken } = req.body;
        try {
            if (token.isExpired(userToken)) {
                var ret = {error:'Token is expired.', expired:'yes'};
                res.status(200).json(ret);
                return;
            }
            
            var login = require('jsonwebtoken').decode(userToken,{complete:true}).payload.login;

            const db = client.db("largeproject");
            results = await db.collection('History').find({login:login}).toArray();

            if( results.length > 0 ) {
                valid = 'valid';
            }
            else {
                error = '';
                valid = 'invalid';
            }

            var refreshedToken = token.refresh(userToken);
        }
        catch(e) {
            error = e.toString();
        }
        var ret = {results:results, valid:valid, error:error, userToken:refreshedToken};
        res.status(200).json(ret);
    });
    
    

app.get('/api/catbreeds', async (req, res, next) => {
    // incoming: none
    // outgoing: lots of stuff
    var error = '';
    var cats = [];
    
    try {
        const db = client.db("largeproject");
        cats = await db.collection('Cats').find({}, {
            projection: {
                _id: 0,
                breed: 1,
                size: 1,
                weight: 1,
                coat: 1,
                color: 1,
                link: 1
            }
        }).toArray();
    } catch (e) {
        error = e.toString();
    }

    var ret = { 
        cats: cats,
        error: error
    };
    
    res.status(200).json(ret);
});


app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});



app.listen(5000); // start Node + Express server on port 5000
}
