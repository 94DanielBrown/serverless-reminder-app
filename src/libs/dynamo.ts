import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {GetCommand, GetCommandInput, PutCommand, PutCommandInput} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});

export const dynamo = {
    write: async (data: Record<string, any>, tableName: string) => {

        const params: PutCommandInput = {
            TableName: tableName,
            Item: data,
        };

        const command = new PutCommand(params)

        const res = await dynamoClient.send(command);
        if (res !== null) {
            return data;
        } else console.log(res)
    },

    get: async (id: string, tableName: string) => {
        const params: GetCommandInput = {TableName: tableName,
        Key: {
            id: id
        }};
        const command = new GetCommand(params);
        const response = await dynamoClient.send(command);

        return response.Item;
    },
}