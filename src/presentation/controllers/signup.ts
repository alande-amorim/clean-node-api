import { InvalidParamError } from '../errors/invalid-param.error'
import { MissingParamError } from '../errors/missing-param.error'
import { badRequest, serverError, success } from '../helpers/http.helper'
import { type Controller } from '../protocols/controller'
import { type EmailValidator } from '../protocols/email-validator'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (req: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const key of requiredFields) {
        if (!req.body[key]) {
          return badRequest(new MissingParamError(key))
        }
      }

      const isValid = this.emailValidator.isValid(req.body.email as string)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return success()
    } catch (error) {
      return serverError()
    }
  }
}
