const axios = require('axios')

async function getRoutes() {
  return []
  return await axios.get(`${baseURL}/settings/get-products`).then(res => res.data.products.map(product => {
    if(product.subcategoryURL) {
            return `${product.categoryURL}/${product.subcategoryURL}/${product.URL}`
        } else {
            return `${product.categoryURL}/${product.URL}`
        }
         
    }))
}
// https://www.npmjs.com/package/@nuxtjs/sitemap
export default {
  hostname: process.env.HOSTNAME,
  cacheTime: 1000 * 60 * 15,
  trailingSlash: true,
  gzip: true,
  routes() {
    return getRoutes();
  },
}