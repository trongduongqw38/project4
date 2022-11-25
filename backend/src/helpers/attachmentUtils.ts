import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class AttachmentUtils {
	constructor(
      private dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private todo_table = process.env.TODOS_TABLE
    ) {}

  async createAttachmentPresignedUrl(todoId: string) {
    logger.info('createAttachmentPresignedUrl: ', todoId)
    try {
      return await new XAWS.S3().getSignedUrl('putObject', {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: todoId,
        Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
      })
    } catch (error) {
      logger.error('Error createAttachmentPresignedUrl: ' + error)
    }
  }
  
  async updateAttachmentUrl(
    todoId: string,
    attachmentUrl: string,
    userId: string
  ) {
    await this.dynamoDBClient
      .update({
        TableName: this.todo_table,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
  
}