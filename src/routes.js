const express = require('express');
const axios = require('axios');
const api = require('./services/api');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await api.getAllCharacters('https://rickandmortyapi.com/api/character/?species=Human');
    return res.json(response);
  } catch (error) {
    console.log('erro')
  }

});

module.exports = router;