import Logger from './common/logger';
import { format } from 'util';
import { Context, Callback, SQSEvent } from 'aws-lambda';
import * as QuickBase from 'quickbase';

export async function handler(
    event: SQSEvent, // any,
    context: Context, // any,
    callback: Callback, // callback: (err: Error, data: LambdaResponse) => void,
): Promise<void> {
    const logger = new Logger('qbpoc.receiveEvent()');

    try {

        //Loop through each message in SQS
        for (const record of event.Records) {

            // Extract required data points from SQS event message body
            const {body, messageId} = record;

            try {

                // Log body of SQS event
                logger.info(`Lambda received SQS event message:::: ${JSON.stringify(format(body))}`);

                // start parsing events
                if (!!body && !!messageId) {

                    // Extract body from SQS event
                    const parsedBody = JSON.parse(body);


                    logger.info(`Successfully parsed the content for ${messageId}; [parsed message body] ===> ${parsedBody}`);
                    const {orderhubId} = parsedBody;
                    logger.info(`orderhubid is ${orderhubId}` );
                    callback(null);


                    const quickbase = new QuickBase({
                        realm:'tempus-2539',
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
                       logger.info(`Successfully added Order ${orderhubId}`)
                    }).catch((err) => {
                        logger.error(err.message);
                        callback(err);
                    });

                }
            } catch(err)
                {
                    logger.error(`${err} for SQS-event message : ${format(record)}`);
                    logger.error(`${err.trace} for SQS-event message : ${format(record)}`);
                    callback(`${err} for SQS-event message : ${format(record)}`);
                }
            }
        } catch(err) {
            logger.error(err.message);
            callback(err);
        }
    }
