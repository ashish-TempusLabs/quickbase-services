"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./common/logger");
const util_1 = require("util");
const QuickBase = require("quickbase");
async function handler(event, context, callback) {
    const logger = new logger_1.default('qbpoc.receiveEvent()');
    try {
        for (const record of event.Records) {
            const { body, messageId } = record;
            try {
                logger.info(`Lambda received SQS event message:::: ${JSON.stringify(util_1.format(body))}`);
                if (!!body && !!messageId) {
                    const parsedBody = JSON.parse(body);
                    logger.info(`Successfully parsed the content for ${messageId}; [parsed message body] ===> ${parsedBody}`);
                    const { orderhubId } = parsedBody;
                    logger.info(`orderhubid is ${orderhubId}`);
                    callback(null);
                    const quickbase = new QuickBase({
                        realm: 'tempus-2539',
                        domain: 'quickbase.com',
                        userToken: 'b4sjd7_j6x6_ca6f95pjumj8ydyjhbnabrpamhj'
                    });
                    quickbase.api('API_AddRecord', {
                        dbid: 'bp5g9h94g',
                        fields: [
                            { fid: 6, value: orderhubId },
                            { fid: 7, value: `Ashish ${orderhubId}` },
                            { fid: 8, value: `Buddha ${orderhubId}` }
                        ]
                    }).then((results) => {
                        logger.info(`Successfully added Order ${orderhubId}`);
                    }).catch((err) => {
                        logger.error(err.message);
                        callback(err);
                    });
                }
            }
            catch (err) {
                logger.error(`${err} for SQS-event message : ${util_1.format(record)}`);
                logger.error(`${err.trace} for SQS-event message : ${util_1.format(record)}`);
                callback(`${err} for SQS-event message : ${util_1.format(record)}`);
            }
        }
    }
    catch (err) {
        logger.error(err.message);
        callback(err);
    }
}
exports.handler = handler;
//# sourceMappingURL=index.js.map