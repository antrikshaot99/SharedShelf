const UserService = require('../../services/UserService');
const { User } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn()
  }
}));

describe('UserService Login Unit Tests', () => {

  test('Admin login should succeed', async () => {
    const result = await UserService.login(
      'admin@gmail.com',
      'admin123'
    );

    expect(result.user.role).toBe('admin');
  });

  test('Invalid credentials should fail', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      UserService.login('wrong@gmail.com', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');
  });

});