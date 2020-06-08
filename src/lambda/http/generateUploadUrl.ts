import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { generateUploadUrl } from '../../businessLogic/Attachment'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    console.log('todoId', todoId)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = await generateUploadUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)
handler.use(cors())
