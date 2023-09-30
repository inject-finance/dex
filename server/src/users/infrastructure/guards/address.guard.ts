/* eslint-disable security/detect-object-injection */
import { UnauthorizedException } from '@/common/exceptions/exceptionTypes'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AddressGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Validates that the address corresponds to the one being attached into the jwt payload
   * @param context execution context object
   * @returns true if it corresponds to the same address, UnauthorizedException if it does not
   */
  // eslint-disable-next-line max-statements
  canActivate(context: ExecutionContext): boolean {
    const addressField = this.reflector.get<string>(
      'addressField',
      context.getHandler()
    )
    const request = context.switchToHttp().getRequest()

    if (!addressField) return true

    const query = request.query[addressField]?.toLowerCase()
    const body = request.body[addressField]?.toLowerCase()
    const param = request.params[addressField]?.toLowerCase()
    const address = request?.user?.address?.toLowerCase()

    let isAddressValid = true

    if (!address) isAddressValid = false

    if (isAddressValid && body && body !== address) isAddressValid = false

    if (isAddressValid && param && param !== address) isAddressValid = false

    if (isAddressValid && query && query !== address) isAddressValid = false

    if (!isAddressValid) throw new UnauthorizedException()

    return isAddressValid
  }
}
