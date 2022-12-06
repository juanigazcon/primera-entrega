const express = require('express')
const router = express.Router()
const CartManager = require('../manager/cart.manager.js')
const manager = new CartManager()

//Middlewares

const chosenCartValidation = (req, res, next) =>{
    let parametro = req.params.id
    if(isNaN(parametro)) return res.status(400).send({err: "Please provide a numeric id"})
    next()
}

const requiredInfo = (req, res, next) =>{
    let cart = req.body
    if (!cart.productos) return res.status(400).send({err:'Mandatory data missing, field: Productos'})

    next()
}



router.post('/', (req, res)=>{

manager.save(req.body)
    .then(result => res.send(result))
    .catch(err => res.send({status:'Error', description: err}))
})

router.delete('/:id', chosenCartValidation,  (req, res)=>{

manager.deleteCartById(req.params.id)
    .then(result => res.send(result))
    .catch(err => res.send({status:'Error', description: err}))
})

router.get('/:id/productos', chosenCartValidation, (req,res)=>{
    
manager.getCartById(req.params.id)
    .then(result => res.send(result))
    .catch(err => res.send({status:'Error', description: err}))
})

router.post('/:id/productos', chosenCartValidation, (req,res) =>{
    //validacion de todos los datos completos
    manager.updateCartById(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(err => res.send({status:'Error', description: err})) 
})


router.delete('/:cartId/productos/:productId',(req, res) => {
    if((isNaN(req.params.cartId))||(isNaN(req.params.productId))) return res.status(400).send({err: "Please provide a numeric id"})
    manager.deleteProduct(req.params.cartId, req.params.productId)
        .then(result => res.send(result))
        .catch(err => res.send({status: "Error", descripcion: err}))  
} )
 

module.exports = router