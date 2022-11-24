import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

const XAWS = AWSXRay.captureAWS(AWS)
export class TodosAccess {
  constructor(
    private dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private todo_table = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string) {
    logger.info('getAllTodos: ' + userId)
    const result = await this.dynamoDBClient
      .query({
        TableName: this.todo_table,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    const todos = result.Items
    logger.info('Todos: ' + JSON.stringify(todos as TodoItem[]))
    return todos as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('createTodo: ' + todo)
    await this.dynamoDBClient
      .put({
        TableName: this.todo_table,
        Item: todo
      })
      .promise()
    return todo
  }

  async deleteTodo(todoId: string, userId: string) {
    logger.info('deleteTodo: ' + todoId)
    try {
      await this.dynamoDBClient
        .delete({
          TableName: this.todo_table,
          Key: {
            todoId: todoId,
            userId: userId
          }
        })
        .promise()
    } catch (error) {
      logger.error('Could not delete todo: ', error.message)
    }
  }
  
  async updateTodo(todoId: string, todo: TodoUpdate, userId: string) {
    logger.info('updateTodo: ' + JSON.stringify(todo))
    const getTodo = await this.dynamoDBClient
      .query({
        TableName: this.todo_table,
        KeyConditionExpression: 'todoId = :todoId AND userId = :userId',
        ExpressionAttributeValues: {
          ':todoId': todoId,
          ':userId': userId
        }
      })
      .promise()

    if (getTodo.Count !== 0) {
      const result = await this.dynamoDBClient
        .update({
          TableName: this.todo_table,
          Key: {
            todoId: todoId,
            userId: userId
          },
          UpdateExpression:
            'SET #name = :name, dueDate = :dueDate, done = :done',
          ExpressionAttributeNames: {
            '#name': 'name'
          },
          ExpressionAttributeValues: {
            ':name': todo.name,
            ':done': todo.done,
            ':dueDate': todo.dueDate
          }
        })
        .promise()
      const updatedTodo = result.Attributes
      if (updatedTodo != null) {
        logger.info('Updated todo: ', updatedTodo)
        return updatedTodo as TodoItem
      }
    }
    logger.info('Could not update TODO')
    return undefined
  }
  
  async createAttachmentPresignedUrl(todoId: string) {
    logger.info('createAttachmentPresignedUrl: ', todoId)
	return await new XAWS.S3().getSignedUrl('getObject', {
		Bucket: process.env.ATTACHMENT_S3_BUCKET,
		Key: todoId,
		Expires: process.env.SIGNED_URL_EXPIRATION
	})  
  }
}