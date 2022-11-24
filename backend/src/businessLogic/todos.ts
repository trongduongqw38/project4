import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const todosAcess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId: string) {
  const result = await todosAcess.getAllTodos(userId)
  logger.info('result: ' + JSON.stringify(result))
  return result
}

export async function createTodo(
  todo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const id = uuid.v4()
  return await todosAcess.createTodo({
    todoId: id,
    userId: userId,
    done: false,
    createdAt: new Date().toISOString(),
    ...todo
  })
}

export async function updateTodo(
  todoId: string,
  todo: UpdateTodoRequest,
  userId: string
) {
  return await todosAcess.updateTodo(todoId, todo, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
  return await todosAcess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string) {
  const url = await attachmentUtils.createAttachmentPresignedUrl(todoId)
  return url.split('?')[0]
}