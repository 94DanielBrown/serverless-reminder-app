import {APIGatewayProxyEvent} from "aws-lambda";
import {dynamo} from "@libs/dynamo";
import {formatJSONResponse} from "@libs/api-gateway";

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const tableName = process.env.REMINDER_TABLE;

        const {userId} = event.pathParameters || {};

        if (!userId) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: "no userId specified in parameters"
                }
            })
        }

        const data = await dynamo.query({
            tableName,
            index: "index1",
            pkValue: userId
        })

        return formatJSONResponse({
            data
        });
    } catch (error) {
        console.log("error", error);
        return formatJSONResponse({
            statusCode: 502,
            data: {
                message: error.message
            }
        });
    }
};