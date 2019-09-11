const express = require('express');
const cors = require('cors');

const { PORT } = require('./src/environment');

const app = express();

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'OPTIONS']
}));

require('./src/router/routerConfig')(app);

app.listen(PORT);
console.log(`Server is listening on port ${PORT}`)