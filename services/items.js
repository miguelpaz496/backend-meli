const axios = require('axios')
const apiMeli = process.env.API_MELI

const getSearch = async (searchText) => {
    let items = {}
    let itemList = []
    let categoriesList = []
    let categoriesNames = []

    if(searchText){
        let result = await getSearchApiMeli(searchText, 4)
    

        itemList = result.results.map(item => {
            return createItem(item)
        })

        categoriesList = getCategoryFilter(result.filters)

        if(categoriesList){
            categoriesNames = categoriesList.values.map(category => {
                return  category.name
            })
        }
                
    }

    return items = {
        author: signResponse(),
        categories: categoriesNames.length ? categoriesNames : ["Sin categorias"],
        items: itemList
    }

}

const getItem = async (id) => {

    const result = await getItemDescription(id,"")
    const resultAllItems = await getSearchApiMeli(result.title, 4)
    const resultDescription = await getItemDescription(id,"description")
    const availableQuantity = getAvailableQuantity(id,resultAllItems.results)
    
    const categoriesList = getCategoryFilter(resultAllItems.filters)
    let category = getCategoryName(categoriesList,result.category_id)

    if(!category){
        const categoriesList = getCategoryFilter(resultAllItems.available_filters)
        category = getCategoryName(categoriesList,result.category_id)
    }
    let description = resultDescription.plain_text
    let newItem = createItem(result)
    newItem.sold_quantity = result.initial_quantity - availableQuantity
    newItem.description = description
    newItem.category = category?.name ? category.name : "Sin catergoria"

    return items = {
        author: signResponse(),
        item: newItem
    }
}

const getAvailableQuantity = (id, items) => {
    let quantity = ""
    const value = items.filter(item => item.id === id ? item : null)
    if(value.length){
        quantity = value[0].available_quantity
    }

    return quantity;
}

const getCategoryFilter = (filters) => {
    let categoriesList = filters.filter(filter => {
        if(filter.id == 'category'){
            return filter
        }
    })

    return categoriesList[0]
}

const getCategoryName = (categories, id) => {

    let categoryName = ''

    if(categories?.values){
        categoryName = categories.values.filter(category => {
            if(category.id == id){
                return category
            }
        })
        categoryName = categoryName[0]
    }

    return categoryName
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

const getSearchApiMeli = async (search,limit) => {
    let response = {}
    response = await axios.get(apiMeli+`sites/MLA/search?q=${search}&limit=${limit}`)
    return response.data
}

const getItemDescription = async (id,description) => {
    let response = {}
    if(description.length){
        description = '/' + description
    }
    response = await axios.get(apiMeli+`items/${id}`+description)
    return response.data
}


module.exports = {
    getSearch,
    getItem
}