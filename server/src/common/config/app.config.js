"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
var constants_1 = require("../constants");
var typeorm_1 = require("typeorm");
var appConfig = function () {
    var _a;
    return (_a = {},
        _a[constants_1.constants.database] = {
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: (0, typeorm_1.getMetadataArgsStorage)().tables.map(function (tbl) { return tbl.target; }),
            synchronize: process.env.POSTGRES_SYNC === 'true',
            timezone: 'Z'
        },
        _a.nonceTimeExpirationInMilliseconds = 120000,
        _a);
};
exports.appConfig = appConfig;
