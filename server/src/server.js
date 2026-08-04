require('dotenv').config();

const app = require('./app');
const databasePool = require('./config/database');
const { startScheduledNotifications } = require('./services/scheduledNotificationService');

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    const connection = await databasePool.getConnection();
    console.log('MySQL connected successfully.');
    connection.release();

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      startScheduledNotifications();
    });
  } catch (error) {
    console.error('Could not connect to MySQL:', error.message);
    process.exit(1);
  }
}

startServer();
