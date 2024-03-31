const itemService = require('../services/items')

const getSearch = async (req, res) => {
    let items = {}
    try {
        items = await itemService.getSearch()
        res.json(items)
    } catch (error) {
        res.status(500).send(error)
    }
    
}

const getItem = async (req, res) => {
    let item = {}
    try {
        const id = req.params.id
        item = await itemService.getItem(id)
        res.json(item)
    } catch (error) {
        res.status(500).send(error)
    }   
}


module.exports = {
    getSearch,
    getItem
}
