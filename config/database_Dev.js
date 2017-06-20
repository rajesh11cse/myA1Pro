/*
 * File : config/database_Dev.js
 */
'use strict';

// Expose our database directly to our application using module.exports
module.exports = {
    // Mongodb database name 
    db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/GigUp_Dev',

    // app name
    app: {
        name: 'GigUp'
    }
}
