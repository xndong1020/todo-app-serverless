import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { deleteTodo } from '../../businessLogic/Todo'
import { parseToken } from '../../auth/utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const token = parseToken(event.headers.Authorization)

    // TODO: Remove a TODO item by id
    await deleteTodo(todoId, token)

    return {
      statusCode: 204,
      body: undefined
    }
  }
)

handler.use(cors())
