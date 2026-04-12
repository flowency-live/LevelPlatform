import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const clientConfig: ConstructorParameters<typeof DynamoDBClient>[0] = {
  region: process.env.AWS_REGION ?? 'eu-west-2',
};

if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const client = new DynamoDBClient(clientConfig);

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const tableName = process.env.DYNAMODB_TABLE_NAME ?? 'elevate-dev';

export function createDocClient(
  config?: ConstructorParameters<typeof DynamoDBClient>[0]
): DynamoDBDocumentClient {
  const customClient = new DynamoDBClient({
    region: process.env.AWS_REGION ?? 'eu-west-2',
    ...config,
  });

  return DynamoDBDocumentClient.from(customClient, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });
}
