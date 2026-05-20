const createApp = require('./app');
const { sequelize } = require('./models');
const { EmailService } = require('./services');

async function startServer() {

  try {
    await sequelize.authenticate();
    console.log('✅ Database authenticated');
  } catch (err) {
    console.log(err);
  }

  const app = await createApp();

  app.listen(5000, async () => {

    console.log('🚀 Server running');

    try {
      await EmailService.verifyConnection();
      console.log('📧 Email service ready');
    } catch (err) {
      console.log(err);
    }

  });
}

startServer();