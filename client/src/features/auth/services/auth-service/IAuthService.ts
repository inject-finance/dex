import { User } from '@/common/types/User'

export default interface IAuthService {
  getNonce: (address: string) => Promise<string>
  signIn: (signature: string, nonce: string) => Promise<User>
}
