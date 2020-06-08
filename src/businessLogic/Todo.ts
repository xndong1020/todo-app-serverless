import * as uuid from 'uuid'

import TodoItem from '../models/TodoItem'
import TodoRepository from '../dataLayer/TodoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoRepo = new TodoRepository()

export async function getAllTodoItems(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  console.log('Todo business Login: ', userId)
  return todoRepo.getAllTodoItems()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  console.log('Todo business Login: ', jwtToken)
  // const userId = parseUserId(jwtToken)
  const userId = '12345'

  return await todoRepo.createTodoItem({
    todoId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}