import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import TodoItem from '../models/TodoItem'
import TodoUpdate from '../models/TodoUpdate'

export default class TodoRepository {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  getAllTodoItems = async (userId: string): Promise<TodoItem[]> => {
    console.log('Getting all todo items')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  createTodoItem = async (todoItem: TodoItem): Promise<TodoItem> => {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem
  }

  updateTodoItem = async (
    todoItem: TodoUpdate,
    todoId: string
  ): Promise<void> => {
    const expression = generateUpdateQuery(todoItem)

    const params = {
      // Key, Table, etc..
      TableName: this.todosTable,
      Key: {
        userId: '12345',
        todoId: todoId
      },
      ...expression
    }

    await this.docClient.update(params).promise()
  }

  deleteTodoItem = async (todoId: string): Promise<void> => {
    const params = {
      // Key, Table, etc..
      TableName: this.todosTable,
      Key: {
        userId: '12345',
        todoId: todoId
      },
      ConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }

    await this.docClient.delete(params).promise()
  }
}

const generateUpdateQuery = (fields: any) => {
  let exp = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {}
  }
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`
    exp.ExpressionAttributeNames[`#${key}`] = key
    exp.ExpressionAttributeValues[`:${key}`] = item
  })
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1)
  return exp
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
