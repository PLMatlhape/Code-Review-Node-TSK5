"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.pool = new pg_1.Pool({
    host: env_1.config.database.host,
    port: env_1.config.database.port,
    database: env_1.config.database.name,
    user: env_1.config.database.user,
    password: env_1.config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
exports.pool.on('error', (err) => {
    console.error('⚠️  Unexpected database error on idle client:', err.message);
    // Don't exit - let the application handle the error gracefully
});
const query = (text, params) => {
    return exports.pool.query(text, params);
};
exports.query = query;
//# sourceMappingURL=database.js.map