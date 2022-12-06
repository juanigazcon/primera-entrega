const express = require('express')
const productRouter = require('./router/product.router.js')
const cartRouter = require('./router/cart.router.js')


const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, ()=> console.log(`Server up on port ${PORT}`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use('/api/productos', productRouter)
app.use('/api/carrito', cartRouter)

app.use((req,res) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
})