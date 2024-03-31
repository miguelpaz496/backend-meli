const axios = require('axios')
const apiMeli = process.env.API_MELI

const getSearch = async () => {
    let items = {}
    let itemList = []
    let categoriesList = []
    
    let result = await axios.get(apiMeli+'sites/MLA/search?q=query')

    itemList = result.data.results.map(item => {
        return createItem(item)
    })

    categoriesList = result.data.available_filters.filter(filter => {
        if(filter.id == 'category'){
            return filter
        }
    }) 

    categoriesNames = categoriesList[0].values.map(category => {
        return  category.name
    })


    return items = {
        author: signResponse(),
        categories: categoriesNames,
        items: itemList
    }

}

const getItem = async (id) => {

    const result = await axios.get(apiMeli+`items/${id}`)
    const resultAllItems = await axios.get(apiMeli+'sites/MLA/search?q=query')
    const resultDescription = await axios.get(apiMeli+`items/${id}/description`)
    const availableQuantity = getAvailableQuantity(id,resultAllItems.data.results)
    let description = resultDescription.data.plain_text
    let newItem = createItem(result.data)
    newItem.sold_quantity = result.data.initial_quantity - availableQuantity
    newItem.description = description

    return items = {
        author: signResponse(),
        item: newItem
    }
}

const getAvailableQuantity = (id, items) => {
    const value = items.filter(item => item.id === id ? item : null)
    return value[0].available_quantity;
}




const createItem = (item) => {
    let newItem = {}
    if(item){
        let newPrice = separatePrice(item.price)
        newItem = {
            id: item.id,
            title: item.title,
            price: {
                currency: item.currency_id,
                amount: newPrice.amount,
                decimals: newPrice.decimals
            }, 
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping
        }
    }
    return newItem
}

const signResponse = () => {
    return {
        name: "Luis Miguel",
        lastname: "Paz"
    }
}

const separatePrice = (price) => {
    let priceText = price.toString().split(".");
    return {
        amount: priceText[0] ? Number(priceText[0]): 0,
        decimals: priceText[1] ? Number(priceText[1]): 0
    }
}


module.exports = {
    getSearch,
    getItem
}