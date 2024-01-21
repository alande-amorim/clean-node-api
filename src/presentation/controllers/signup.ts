import { MissingParamError } from '../errors/missing-param.error'
import { badRequest } from '../helpers/http.helper'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const key of requiredFields) {
      if (!req.body[key]) {
        return badRequest(new MissingParamError(key))
      }
    }

    return {
      statusCode: 200
    }
  }
}
