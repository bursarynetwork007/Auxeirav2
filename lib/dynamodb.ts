import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// On Amplify, credentials come from the IAM service role automatically.
// Explicit credentials are used for local development via .env.local.
const clientConfig =
  process.env.AWS_ACCESS_KEY_ID
    ? {
        region: process.env.AWS_REGION ?? "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
        },
      }
    : { region: process.env.AWS_REGION ?? "us-east-1" };

const client = new DynamoDBClient(clientConfig);
export const dynamo = DynamoDBDocumentClient.from(client);
