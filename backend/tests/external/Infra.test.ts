import { join } from 'path'
import request from 'supertest'

import { createServerWithConfig } from '../../src'
import { UploadDirPath } from '../../src/config'
import { ApiEndpoints } from '../../src/utils'
import { AppConfig } from '../../types'

const csvMockFilepath = join(__dirname, '../mocks/data.csv')
const pdfMockFilepath = join(__dirname, '../mocks/data.pdf')

const config: AppConfig = {
  port: 3001,
  server: 'express',
  uploadDir: UploadDirPath
}

describe('When uploading a file', () => {
  const app = createServerWithConfig(config)

  it("should run in port 3001", async () => {
    expect(config.port).toBe(3001)
  })

  it('should return 200 if successful', async () => {
    const response = await request(app)
      .post(ApiEndpoints.upload)
      .attach('file', csvMockFilepath)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', 'The file was uploaded successfully.')
  })

  it('should return 500 if fail uploading a file with wrong parameter', async () => {
    await request(app)
      .post(ApiEndpoints.upload)
      .attach('fileasd', csvMockFilepath)
      .expect(500)
  })

  it('should return 500 i fail uploading a file with wrong mime-type', async () => {
    await request(app)
      .post(ApiEndpoints.upload)
      .attach('file', pdfMockFilepath)
      .expect(500)
  })
})

describe.skip('When searching in a file', () => {
  const app = createServerWithConfig(config)

  it('should return 200 if successful', async () => {
    const response = await request(app)
      .get(ApiEndpoints.search)
      .query({ q: 'should work but without results' })

    expect(response.status).toBe(200)
    expect(response.body).toBe({ data: [] })
  })

  // it('should return 500 if wrong param', async () => {
  //   const response = await request(app)
  //     .get(ApiEndpoints.search)
  //     .query({ randomparam: 'lorem ipsum' })

  //   expect(response.status).toBe(500)
  // })
})