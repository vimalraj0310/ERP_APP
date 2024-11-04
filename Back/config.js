const config = {
    // server: 'localhost',
    server: '183.83.184.108',
    database: 'ERP_APP',
    //user: 'rspmsqluser',
    //password: 'Rspmadmin@7890',
     user:'rspmdevuser',
     password:'Dev#12345',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 100, // Adjust based on your load
        min: 10,
        idleTimeoutMillis: 30000
    } 
};

module.exports = config;
