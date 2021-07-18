import app from './server.js';
import databaseConnection from './database/index.js';

const port = process.env.PORT || 5000;


databaseConnection.getConnect()



app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});