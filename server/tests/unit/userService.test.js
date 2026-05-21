const UserService = require('../../services/UserService');
const { User } = require('../../models');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn()
  }
}));

describe('UserService Login Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Admin login should succeed', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@gmail.com',
      role: 'admin',
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(mockUser);

    const result = await UserService.login(
      'admin@gmail.com',
      'admin123'
    );

    expect(result.user.role).toBe('admin');
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'admin@gmail.com' } });
  });

  test('Invalid credentials should fail', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      UserService.login('wrong@gmail.com', 'wrongpass')
    ).rejects.toThrow('Invalid credentials');
  });

});