const fs = require('fs');
const file = 'src/data/carts.json'

class CartManager{

    toReadFile(fileName){
        let data = fs.readFileSync(fileName, 'utf-8')
        let carts = JSON.parse(data)
        return carts
    } 

    toWriteFile(fileName,text){
        fs.promises.writeFile(fileName, JSON.stringify(text, null, 2))
    }

    //post para crear carrito
    save = async (cart) => {

        try{
            if(fs.existsSync(file)){ 
                let carts = this.toReadFile(file);

                //valido que haya carritos en el archivo, porque si está creado el archivo sin ítems coloco id = 1
                if(carts.length>0){

                let id= carts[carts.length-1].id    
                cart.id = id+1;
                cart.timestamp = new Date().toLocaleString();
                carts.push(cart);
                this.toWriteFile(file, carts)
                
                return{status: "Success", message:`Cart was successfully created with id ${cart.id}`}                

                } 
            } 
                
                cart.id=1
                cart.timestamp = new Date().toLocaleString();
                this.toWriteFile(file,[cart])

                return{status: "Success", message:`Cart was successfully created with id 1`}

        } catch(err){

            return{status: "Error", message: err.message}
        }
    }

    //eliminar carrito por id
    deleteCartById = async(id)=> {
        id = parseInt(id)

    try{ 
        if (fs.existsSync(file)) {
            
            let carts = this.toReadFile(file)
            let newCarts = carts.filter(item => item.id !== id)
            let cartToDelete = carts.find(item => item.id === id)

            if (!cartToDelete) return {status: "Success", message: "Cart was successfully deleted"}
            this.toWriteFile(file, newCarts)
        } else {
            return{status: "Error", message:"File doesn´t exist"}
        }
    }
     catch(err){
        return{status: "Error", message: err.message}
    } 
}

    //listar productos en un carrito

    getCartById = async(id) => {
        id = parseInt(id)
        try{    
            if(fs.existsSync(file)){
    
                let carts = this.toReadFile(file)  
                let cart = carts.find(item => item.id === id)
                console.log(cart)

                if(!cart) return{status: "Error", message:"Cart doesn´t exist"} 

                return {status:"Success", message: cart.productos}

            } else{
                return{status: "Error", message:"File doesn´t exist"}
            }
            } catch(err){
                return{status: "Error", message: err.message}
            } 
       
    }




    updateCartById = async(id, newProduct) =>{
        id= parseInt(id)
        try{    
            if(fs.existsSync(file)){

            let cartToUpdate = this.toReadFile(file).find(cart => cart.id ===id)
            let carts = this.toReadFile(file)

            if(!cartToUpdate) return {status:"Error", message: "Cart was not found"}

                let existingProduct = cartToUpdate.productos.find(product => product.id == newProduct.id)
                
                if(existingProduct) return {status:"Error", message: "Product is already included in the cart"}

                cartToUpdate.productos.push(newProduct)

                let notModifiedCarts = carts.filter(item => item.id !== id)
            
                let newCarts = [...notModifiedCarts, {...cartToUpdate}]
                
                this.toWriteFile(file, newCarts)

                return {status:"Success", message: "Cart has been successfully updated"}
        } else{
            return{status: "Error", message:"File doesn´t exist"}
        }
        } catch(err){
            return{status: "Error", message: err.message}
        } 

    }

 


     deleteProduct = async(cartId, productId) =>{

        cartId = parseInt(cartId)
        productId = parseInt(productId)
        let timestamp = new Date().toLocaleString();

        if (fs.existsSync(file)) {
            
            let carts = this.toReadFile(file)
            let cart = carts.find(item => item.id === cartId)
            if (!cart) return {status: "Error", message: "Cart not found"}

            let product = cart.productos.find(item => item.id === productId)

            if (!product) return {status: "Error", message: "Product was not found in cart"}

            let newProducts = cart.productos.filter(item => item.id !==productId)

            let newCart = {products: newProducts, id:cartId, timestamp: timestamp}
            let otherCarts = carts.filter(item => item.id !==cartId)
            let newCarts = [...otherCarts, {...newCart}]

            this.toWriteFile(file, newCarts)

        } else {
            return {error: 0, descripcion: 'No existe la BD'}
        }
    } 


}


module.exports = CartManager