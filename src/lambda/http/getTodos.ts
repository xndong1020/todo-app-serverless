import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllTodoItems } from '../../businessLogic/Todo'

import { parseToken } from '../../auth/utils'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const token = parseToken(event.headers.Authorization)
    const items = await getAllTodoItems(token)

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
  }
)

handler.use(cors())
