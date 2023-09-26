import Swal from 'sweetalert2'
import { ValidationError } from '../errors/ValidationError'
import { type Command } from './command'
import { rejectMetamaskRequest } from '@/features/auth/utils/rejectMetamaskRequest'
export const createCommandStack = <State>(state: State) => {
  const commands: Command<any>[] = []

  return {
    add<T>(command: Command<T>) {
      commands.push(command)
      return this
    },
    async run() {
      try {
        for await (const command of commands) {
          state = await command(state)
        }
        return state
      } catch (error) {
        if (error instanceof ValidationError) {
          Swal.fire({
            title: 'Metamask',
            icon: 'warning',
            iconColor: '#FDD981',
            text: error.message,
            color: '#f2f2f2',
            background: '#192026',
            showConfirmButton: false
          })
        } else {
          rejectMetamaskRequest(error)
        }
        throw error
      }
    }
  }
}
