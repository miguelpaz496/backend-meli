const express = require('express')

const routerItems = express.Router()
const itemControllers = require('../controllers/items')

routerItems.get('/', itemControllers.getSearch)
routerItems.get('/:id', itemControllers.getItem)

module.exports = routerItems