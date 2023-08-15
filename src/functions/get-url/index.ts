import {APIGatewayProxyEvent} from "aws-lambda";
import {dynamo} from "@libs/dynamo";
import {formatJSONResponse} from "@libs/api-gateway";

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const tableName = process.env.URL_TABLE;
        const {code} = event.pathParameters || {};
        console.log({
            tableName,
            environmentVars: process.env
        });
        if (!code) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: "missing code in path"
                }
            })
        }

        const record = await dynamo.get(code, tableName);

        const originalUrl = record.originalUrl;

        return formatJSONResponse(({data: {originalUrl}}))
    } catch (error) {
        console.log("error", error);
        return formatJSONResponse({
            statusCode: 502,
            data: {
                message: error.message
            }
        })
    }


}
