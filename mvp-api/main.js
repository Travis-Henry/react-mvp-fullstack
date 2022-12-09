const express = require('express');
const {Pool} = require('pg');
const cors = require('cors');

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
    res.send("success");

})

//Error handler
app.use((err, req, res, next)=>{
    res.status(err.status).send(err.message);
})

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});