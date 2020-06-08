import AttachmentRepository from '../dataLayer/AttachmentRepository'

const attachmentRepo = new AttachmentRepository()

export const generateUploadUrl = async (imageId: string): Promise<string> => {
  return attachmentRepo.generateUploadUrl(imageId)
}
