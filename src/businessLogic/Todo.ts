import * as uuid from 'uuid'

import TodoItem from '../models/TodoItem'

import TodoRepository from '../dataLayer/TodoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoRepo = new TodoRepository()

export const getAllTodoItems = async (
  jwtToken: string
): Promise<TodoItem[]> => {
  const userId = parseUserId(jwtToken)
  console.log('Todo business Login: ', userId)
  return todoRepo.getAllTodoItems(userId) || []
}

export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> => {
  const todoId = uuid.v4()
  console.log('Todo business Login: ', jwtToken)
  const userId = parseUserId(jwtToken)

  return await todoRepo.createTodoItem({
    todoId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export const updateTodo = async (
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<void> => {
  const userId = parseUserId(jwtToken)
  await todoRepo.updateTodoItem(
    {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    },
    todoId,
    userId
  )
}

export const deleteTodo = async (
  todoId: string,
  jwtToken: string
): Promise<void> => {
  const userId = parseUserId(jwtToken)
  await todoRepo.deleteTodoItem(todoId, userId)
}
