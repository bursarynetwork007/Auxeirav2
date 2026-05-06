import { readFileSync } from "fs";
import {
  IAMClient,
  CreatePolicyCommand,
  ListPoliciesCommand,
} from "@aws-sdk/client-iam";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => [l.split("=")[0].trim(), l.split("=").slice(1).join("=").trim()])
);

const iam = new IAMClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const policyDocument = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "DynamoDBLeadTables",
      Effect: "Allow",
      Action: [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      Resource: [
        "arn:aws:dynamodb:us-east-1:615608124862:table/auxeira-leads",
        "arn:aws:dynamodb:us-east-1:615608124862:table/auxeira-health-checks",
      ],
    },
  ],
};

try {
  const result = await iam.send(
    new CreatePolicyCommand({
      PolicyName: "AuxeiraWebsiteDynamoDB",
      Description: "Allows Amplify Lambda functions to write leads to DynamoDB",
      PolicyDocument: JSON.stringify(policyDocument),
    })
  );
  console.log("Policy created:", result.Policy.Arn);
  console.log("\nNext step: attach this policy to your Amplify service role.");
  console.log("In the AWS Console: IAM → Roles → search 'amplifyconsole' → Attach policy → AuxeiraWebsiteDynamoDB");
} catch (e) {
  if (e.name === "EntityAlreadyExistsException") {
    console.log("Policy 'AuxeiraWebsiteDynamoDB' already exists — no action needed.");
  } else {
    console.error("Failed:", e.message);
  }
}
