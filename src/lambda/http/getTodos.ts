import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyResult } from 'aws-lambda'

import { getAllTodoItems } from '../../businessLogic/Todo'

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const items = await getAllTodoItems('12345')

    return {
      statusCode: 200,
      body: JSON.stringify(items)
    }
  }
)

handler.use(cors())
