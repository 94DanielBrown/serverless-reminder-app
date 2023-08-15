import {formatJSONResponse} from "@libs/api-gateway";
import {APIGatewayProxyEvent} from "aws-lambda";
import {v4 as uuid} from "uuid";
import {dynamo} from "@libs/dynamo";

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const body = JSON.parse(event.body);
        const tableName = process.env.REMINDER_TABLE;
        const {email, phoneNumber, reminder, reminderDate} = body;

        const validationErrors = validateInputs({
            email, phoneNumber, reminder, reminderDate
        })
        if (validationErrors) {
            return validationErrors
        }

        const userId = email || phoneNumber;

        const data = {
            ...body,
            id: uuid(),
            TTL: reminderDate / 1000,
            pk: userId,
            sk: reminderDate.toString(),
        };

        console.log(data)
        console.log(tableName)
        console.log("Starting dynamo write")

        const result: any = await dynamo.write(data, tableName);
        console.log("DynamoDB write operation completed:", result)

        return formatJSONResponse({
            data: {
                message: `reminder is set for ${new Date(reminderDate).toDateString()}`,
                id: data.id
            },
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


const validateInputs = ({
                            email,
                            phoneNumber,
                            reminder,
                            reminderDate,
                        }:
                            {
                                reminder: string,
                                reminderDate: number,
                                email?: string,
                                phoneNumber?: string,
                            }) => {
    if (!email && !phoneNumber) {
        return formatJSONResponse({
            statusCode: 400,
            data: {
                message: "email or phone number required to create a reminder"
            }
        })
    }

    if (!reminder) {
        return formatJSONResponse({
            statusCode: 400,
            data: {
                message: "reminder is required"
            }
        })
    }

    if (!reminderDate) {
        return formatJSONResponse({
            statusCode: 400,
            data: {
                message: "reminder date is required"
            }
        })
    }

    return
}