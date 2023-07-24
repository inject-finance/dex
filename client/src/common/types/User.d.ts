export interface User {
  readonly id: string
  readonly address: string
  readonly lastName: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type UserId = readonly Pick<User, 'id'>
export type UserAddress = readonly Pick<User, 'address'>
export type UserLastName = readonly Pick<User, 'lastName'>
