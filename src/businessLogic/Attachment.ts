import AttachmentRepository from '../dataLayer/AttachmentRepository'

const attachmentRepo = new AttachmentRepository()

export const generateUploadUrl = async (todoId: string): Promise<string> => {
  return attachmentRepo.generateUploadUrl(todoId)
}
