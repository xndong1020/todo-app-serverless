import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export default class AttachmentRepository {
  constructor(
    private readonly s3Client = createS3Client(),
    private readonly s3Bucket = process.env.ATTACHMENTS_S3_BUCKET
  ) {}

  generateUploadUrl = (todoId: string): string => {
    const singedUrlExpiration = process.env.IMAGES_SIGNED_URL_EXPIRATION
    // To generate S3 signed url
    const presignedUrl = this.s3Client.getSignedUrl('putObject', {
      // The URL will allow to perform the PUT operation
      Bucket: this.s3Bucket, // Name of an S3 bucket
      Key: todoId, // id of an object this URL allows access to
      Expires: parseInt(singedUrlExpiration) // A URL is only valid for 5 minutes
    })

    console.log('presignedUrl', presignedUrl)
    return presignedUrl
  }
}

const createS3Client = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.S3({
      signatureVersion: 'v4', // Use Sigv4 algorithm
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.S3({
    signatureVersion: 'v4' // Use Sigv4 algorithm
  })
}
