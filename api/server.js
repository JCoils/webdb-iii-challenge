const express = require('express');
const helmet = require('helmet');

const cohortRouter = require('../cohort/cohort-router.js');

const server = express();

server.use(express.json());
server.use(helmet());

server.use('/api/cohort', cohortRouter);


//check
// server.get('/', (req, res) => {
//     res.send('Cohorts: Hello World!')
// });


module.exports = server;