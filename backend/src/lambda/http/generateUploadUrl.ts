import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { AttachmentUtils } from '../../helpers/attachmentUtils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
	const userId = getUserId(event)
    if(!userId) {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
	const attachmentPresignedUrl = await createAttachmentPresignedUrl(todoId)
	await new AttachmentUtils().updateAttachmentUrl(
      todoId,
      attachmentPresignedUrl,
      userId
    )
	
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: attachmentPresignedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
