import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, success } from '../../helpers/http.helper'
import { type AddAccount, type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from './signup.protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return success(account)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
