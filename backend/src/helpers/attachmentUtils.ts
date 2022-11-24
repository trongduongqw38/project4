import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class AttachmentUtils {

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
  
}