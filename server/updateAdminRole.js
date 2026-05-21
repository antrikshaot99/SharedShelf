require('dotenv').config();
const { sequelize, User } = require('./models');

async function updateAdminRole() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    const adminUser = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@gmail.com' }
    });

    if (!adminUser) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    console.log('📝 Current admin user:', adminUser.toJSON());

    // Update role to 'admin'
    adminUser.role = 'admin';
    await adminUser.save();

    console.log('✅ Admin user role updated to "admin"');
    console.log('📝 Updated admin user:', adminUser.toJSON());

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
    process.exit(1);
  }
}

updateAdminRole();
