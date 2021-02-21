const express = require('express');
require('dotenv').config();
const api = express();
const cors = require('cors');
const bodyparser = require('body-parser');

const PORT = process.env.PORT | 4000;

// route
const convert = require('./Route/convert');

api.use(cors());
api.use(bodyparser.urlencoded({ extended: true }));
api.use(bodyparser.json());

api.use('/convert', convert);

api.listen(PORT, () => {
  console.log('App start on PORT', PORT);
});
