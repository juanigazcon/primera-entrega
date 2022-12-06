const express = require('express')
const router = express.Router()
const ProductManager = require('../manager/product.manager.js')
const manager = new ProductManager()

let isAdmin = true

//Middlewares

const chosenProductValidation = (req, res, next) =>{
    let parametro = req.params.id
    if(isNaN(parametro)) return res.status(400).send({err: "Please provide a numeric id"})
    next()
}

const adminUserValidation = (req, res, next) =>{
    if (!isAdmin) return res.status(500).send({err: "User is not allowed to execute command"})
    next()
}

const infoValidation = (req, res, next) =>{
    let product = req.body
    if (!product.nombre || !product.descripcion || !product.codigo || !product.foto || !product.precio || !product.stock) return res.status(400).send({err:'Mandatory data missing'})
    next()
}

//Router

router.put('/:id', chosenProductValidation, adminUserValidation, infoValidation, (req,res)=>{
    manager.updateById(req.params.id, req.body)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({status:'Error', description: err}))

})

router.delete('/:id', chosenProductValidation, adminUserValidation, (req, res)=>{
    manager.deleteById(req.params.id)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({status:'Error', description: err}))
})

router.get('/',  (req,res)=>{
    
    manager.getAll()
        .then(result => res.send(result))
        .catch(err => res.status(500).send({status:'Error', description: err}))
})

router.post('/', adminUserValidation, infoValidation, (req,res) =>{
    manager.save(req.body)
        .then(result => res.send(result))
        .catch(err => res.status(500).send({status:'Error', description: err})) 
})

router.get('/:id', chosenProductValidation, (req,res)=>{
    console.log(req.params.id)
    manager.getById(req.params.id)
        .then(result=> res.send(result))
        .catch(err => res.status(500).send({status:'Error', description: err}))
})

module.exports = router