import { type AddAccount } from '../../domain/useCases/addAccount'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError, success } from '../helpers/http.helper'
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (req: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const key of requiredFields) {
        if (!req.body[key]) {
          return badRequest(new MissingParamError(key))
        }
      }

      const { name, email, password } = req.body

      if (req.body.passwordConfirmation !== req.body.password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(req.body.email as string)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      return success()
    } catch (error) {
      return serverError()
    }
  }
}
