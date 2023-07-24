export const createErrorFactory = (name: string) =>
  class CustomizedError extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
    }
  }
