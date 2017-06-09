'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps').camelizeKeys;

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
//POST

router.post('/', (req, res, next) => {
  knex('users')
    .insert({
       first_name: req.body.firstName,
       last_name: req.body.lastName,
       email: req.body.email,
       hashed_password: req.body.password
     })
     .returning(['id', 'first_name', 'last_name', 'email'])
    .then((book) => {
      res.json(humps(book[0]));
    })
    .catch((err) => {
         next(err);
    });
});

module.exports = router;
