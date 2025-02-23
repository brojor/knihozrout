import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import BookAlreadyExistsException from '#exceptions/book_already_exists_exception'
export interface ValidationError {
  message: string
  rule: string
  field: string
  meta?: Record<string, unknown>
}
interface ResponseBody {
  status: number
  code: string
  errors?: ValidationError[]
  data?: Record<string, unknown>
}

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    const status = error.status || 500
    const responseBody: ResponseBody = {
      status,
      code: error.code || 'E_INTERNAL_SERVER_ERROR',
    }

    if (error instanceof errors.E_VALIDATION_ERROR) {
      responseBody.errors = error.messages
    }

    if (error instanceof BookAlreadyExistsException) {
      responseBody.data = error.data
    }

    return ctx.response.status(status).send(responseBody)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
