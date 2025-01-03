const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const preferencesRouter = require('./preferences');

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.use('/', preferencesRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
