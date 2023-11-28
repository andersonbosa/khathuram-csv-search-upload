
export default class StoredFile {
  refId: string
  content: string
  createdAt: Date

  constructor(refId: string, content: string) {
    this.refId = refId
    this.content = content
    this.createdAt = new Date()
  }
}
