const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const config = require('./config')[process.env.NODE_ENV||'dev'];

const pool = new Pool({
    connectionString: config.connectionString
});
pool.connect();

const app = express();
const PORT = config.port;
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res, next)=>{
    pool.query("SELECT * FROM users")
    .then((results=>{
        res.send(JSON.stringify(results.rows))
    }))
    .catch((error)=>{
        next({status:500, message:"opps"});
    });
})

//Authenticates the user
app.post('/api/login', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(password === undefined || username === undefined){
        next({status:401, message:"No password or username"});
        return;
    }
    
    pool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then(results=>{
        //Checks if password matches
        if(results.rows[0].password === password){
            //Returns access token
            const user = {username:username, password:password};
            const accessToken = jwt.sign(user, config.secret);
            res.json({accessToken: accessToken});
        }else{
            next({status:401, message:"Incorrect Password"});
            return;
        }
    })
    .catch(error=>{
        next({status:404, message:"User Not Found"});
        return;
    });
});

//Register the user
app.post('/api/register', (req, res, next)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(password === undefined || username === undefined){
        next({status:401, message:"No password or username"});
        return;
    }

    pool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((results)=>{
        //Checks if username exists in database
        if(results.rows.length === 0){
            //Adds a new user
            pool.query(`INSERT INTO users(username, password) VALUES ('${username}','${password}') RETURNING *`)
            .then(info=>{
                const user = {username:username, password:password};
                const accessToken = jwt.sign(user, config.secret);
                res.json({accessToken: accessToken});
            })
            .catch(error=>{
                next({status:500, message:"Server Error 1"});
                return;
            });
        }else{
            next({status:400, message:"Username already exists"});
            return;
        }
    })
    .catch(error=>{
        next({status:500, message:"Server Error 2"});
        return;
    });
});

app.get('/api/messages', (req, res, next)=>{

});

//Error handler
app.use((err, req, res, next)=>{
    res.status(err.status).send(err.message);
})


//Middleware to authenticate tokens
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, config.secret, (err, user)=>{
        if(err) return res.sendStatus(403);
        req.user = user
        next()
    });
}

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});