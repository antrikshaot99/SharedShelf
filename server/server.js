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

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, async () => {

    console.log(`🚀 Server running on port ${PORT}`);

    try {
      await EmailService.verifyConnection();
      console.log('📧 Email service ready');
    } catch (err) {
      console.log(err);
    }

  });
}

startServer();