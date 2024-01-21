import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError, success } from '../helpers/http.helper'
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (req: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const key of requiredFields) {
        if (!req.body[key]) {
          return badRequest(new MissingParamError(key))
        }
      }

      if (req.body.passwordConfirmation !== req.body.password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
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
