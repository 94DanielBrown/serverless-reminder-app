import type { AWS } from "@serverless/typescript";

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
        handler: "src/functions/get-url/index.handler",
        events: [
            {
                httpApi: {
                    path: "/{code}",
                    method: "GET"
                }
            }
        ]
    }
}

export default functions;