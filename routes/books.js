'use strict'

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

//get

router.get('/', (req, res, next) => {
    knex('books')
        .orderBy('title', 'asc')
        .then((allbooks) => {
            res.send(humps.camelizeKeys(allbooks));
        })
    .catch((err) => {
       next(err);
     });
});

//get by id

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    knex('books')
        .where('id', id)
        .then((book) => {
            res.send(humps.camelizeKeys(book[0]));
        })
    .catch((err) => {
         next(err);
    });
});

//POST

router.post('/', (req, res, next) => {
  knex('books')
    .returning(['id', 'title', 'genre', 'description', 'author', 'cover_url'])
    .insert({
       title: req.body.title,
       author: req.body.author,
       genre: req.body.genre,
       description: req.body.description,
       cover_url: req.body.coverUrl
     })
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    })
    .catch((err) => {
         next(err);
    });
});

//patch

router.patch('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .returning(['id', 'title', 'genre', 'description', 'author', 'cover_url'])
    .update(humps.decamelizeKeys(req.body))
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    })
    .catch((err) => {
         next(err);
    });
});

//delete

router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .returning(['title', 'genre', 'description', 'author', 'cover_url'])
    .del()
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    })
    .catch((err) => {
         next(err);
    });
});

module.exports = router;
