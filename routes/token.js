'use strict'

const express = require('express');
const knex = require('../knex')
const jwt = require('jsonwebtoken');
const router = express.Router();
const Boom = require('boom')
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config()


router.get('/', (req, res, _next) => {
  if (req.cookies.token) {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('true')
  } else {
    res.status(200)
      .set('Content-Type', 'application/json')
      .send('false')
  }
})

router.post('/', (req, res, next) => {
  knex('users')
    .where('email', `${req.body.email}`)
    .then(compareUserInfo => {
      if (compareUserInfo.length > 0) {
        const hash = compareUserInfo[0].hashed_password
        const email = compareUserInfo[0].email
        const firstName = compareUserInfo[0].first_name
        const lastName = compareUserInfo[0].last_name
        const id = compareUserInfo[0].id
        const passes = bcrypt.compareSync(req.body.password, hash)

        if (passes) {
          const jwtToken = jwt.sign({
            email: email,
            id: id,
            firstName: firstName,
            lastName: lastName
          }, 'Sandstorm')

          res.cookie('token', jwtToken, {httpOnly: true})
          res.send({id: id, firstName: firstName, lastName: lastName, email:email})
        }
        else {
          return next(Boom.badRequest('Bad email or password'))
        }
      }
      else {
        return next(Boom.badRequest('Bad email or password'))
      }
    })
})

router.delete('/', (req, res, next) => {
  res.clearCookie('token')
  res.send(true)
})

module.exports = router;
