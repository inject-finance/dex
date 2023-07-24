export const authServiceMock = {
  authenticateLocalToken: jest.fn(),
  getNonce: jest.fn(),
  signIn: jest.fn(),
  getSignature: jest.fn()
}
