#### Resources Required:

1. Dynamodb Table `TodoApp-Todos-{Stage}`.

Schema:

```js
{
  "todoId": "123",
  "userId": "some user id",
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "Buy milk",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

2. S3 bucket for storing attachment `todo-app-attachments-{Stage}`

and a bucket policy to allow public get

3. GatewayResponseDefault4XX

```yml
GatewayResponseDefault4XX:
  Type: AWS::ApiGateway::GatewayResponse
  Properties:
    ResponseParameters:
      gatewayresponse.header.Access-Control-Allow-Origin: "'*'"
      gatewayresponse.header.Access-Control-Allow-Headers: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
      gatewayresponse.header.Access-Control-Allow-Methods: "'GET,OPTIONS,POST'"
    ResponseType: DEFAULT_4XX
    RestApiId:
      Ref: ApiGatewayRestApi
```

#### IAM policies required:

1. Get Todos: Scan Dynamodb, secretsmanager:GetSecretValue, kms:Decrypt
2. Get Todo: Query Dynamodb, s3:GetObject, secretsmanager:GetSecretValue, kms:Decrypt
3. Create Todo: PutItem Dynamodb, s3:PutObject, secretsmanager:GetSecretValue, kms:Decrypt
4. Update Todo: UpdateItem Dynamodb, s3:PutObject, secretsmanager:GetSecretValue, kms:Decrypt
5. Delete Todo: DeleteItem Dynamodb, s3:PutObject, secretsmanager:GetSecretValue, kms:Decrypt

#### Environment Variables required:

1. Dynamodb Table name: `TodoApp-Todos-${self:provider.stage}`
2. Attachment Bucket name: `TodoApp-Attachments-${self:provider.stage}`
3. USER_ID_INDEX: `UserIdIndex`
4. AUTH0_SECRET_ID: `TodoAppAuth0Secret-\${self:provider.stage}`
5. AUTH0_SECRET_FIELD: `TodoAppAuth0Secret`
