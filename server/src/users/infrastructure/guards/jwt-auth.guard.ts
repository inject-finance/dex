import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { Reflector } from '@nestjs/core'
import { UnauthorizedException } from '@/common/exceptions/exceptionTypes'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true
    return super.canActivate(context)
  }

  handleRequest(err: any, payload: any) {
    if (err || !payload || !payload.address)
      throw err || new UnauthorizedException()
    return payload
  }
}
