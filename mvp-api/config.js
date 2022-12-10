module.exports = {
    dev:{
        connectionString: 'postgres://postgres:postgrespw@localhost:49153/testmessages',
        port: '3001',
        secret: 'bob'
    },
    production:{
        connectionString: process.env.POSTGRES_CONNECTION_STRING + "?ssl=true",
        port: process.env.PORT,
        secret : process.env.ACCESS_TOKEN_SECRET
    }
}