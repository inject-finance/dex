import Swal from 'sweetalert2'
import { ValidationError } from '../errors/ValidationError'
import { type Command } from './command'
import { rejectMetamaskRequest } from '@/features/auth/utils/rejectMetamaskRequest'

export const createCommandStack = <State>(state: State) => {
  const comandos: Command<any>[] = []

  return {
    add<T>(command: Command<T>) {
      comandos.push(command)
      return this
    },
    async run() {
      try {
        for await (const command of comandos) {
          state = await command(state)
        }
        return state
      } catch (err) {
        const error = err as Error
        if (err instanceof ValidationError) {
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
