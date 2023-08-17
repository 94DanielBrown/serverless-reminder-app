import type {AWS} from "@serverless/typescript";

const functions: AWS["functions"] = {
    setReminder: {
        handler: "src/functions/set-reminder/index.handler",
        events: [
            {
                httpApi: {
                    path: "/",
                    method: "POST"
                }
            }
        ],
    },
    getReminder: {
        handler: "src/functions/get-reminder/index.handler",
        events: [
            {
                stream: {
                    type: "dynamodb",
                    arn: {
                        "Fn::GetAtt": ["reminderTable", "StreamArn"],
                    },
                    filterPatterns: [{eventName: ["REMOVE"]}],
                },
            }
        ],
        //@ts-expect-error
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["ses:SendEmail", "sns:Publish"],
                Resource: "*"
            }
        ]
    },
    getReminders: {
        handler: "src/functions/get-reminders/index.handler",
        events: [
            {
                httpApi: {
                    path: "/{userId}",
                    method: "GET"
                }
            }
        ],
    },
};

export default functions;