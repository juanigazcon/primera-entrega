const fs = require('fs');
const file = 'src/data/products.json'

class ProductManager{

    toReadFile(fileName){
        let data = fs.readFileSync(fileName, 'utf-8');
        let products = JSON.parse(data)
        return products
    } 

    toWriteFile(fileName,text){
        fs.promises.writeFile(fileName, JSON.stringify(text, null, 2))
    }

     getById = async(id) => {

        try{    
            if(fs.existsSync(file)){
    
                let products = this.toReadFile(file)  
                let product = products.find(item => item.id == id)
                console.log(product)

                if(!product) return{status: "Error", message:"Product doesn´t exist"} 

                return {status:"Success", message: product}

            } else{
                return{status: "Error", message:"File doesn´t exist"}
            }
            } catch(err){
                return{status: "Error", message: err.message}
            } 
       
    }


    getAll = async () => {

        try{    
        if(fs.existsSync(file)){

            let itemList = this.toReadFile(file)

            return {status:"Success", message: itemList}
        } else{
            return{status: "Error", message:"File doesn´t exist"}
        }
        } catch(err){
            return{status: "Error", message: err.message}
        } 
    }

    save = async (product) => {
        
        try{
            if(fs.existsSync(file)){ 
                let products = this.toReadFile(file);

                //valido que haya items en el archivo, porque si está creado el archivo sin ítems coloco id = 1
                if(products.length>0){

                let id= products[products.length-1].id    
                product.id = id+1;
                product.timestamp = new Date().toLocaleString();
                products.push(product);
                this.toWriteFile(file, products)
                
                return{status: "Success", message:"Product was created"}                

                } 
            } 
                
                product.id=1
                product.timestamp = new Date().toLocaleString();
                this.toWriteFile(file,[product])

                return{status: "Success", message:"Product was created"}
            

        } catch(err){

            return{status: "Error", message: err.message}
        }
    }



     updateById = async (id, productUpdated) =>{

        id = parseInt(id)
        
    try{
        if (fs.existsSync(file)) {

            let products = this.toReadFile(file)

            let productToUpdate = products.find(item => item.id === id)
            if (!productToUpdate) return{status: "Error", message:"Product doesn´t exist"}

            let notUpdatedProducts = products.filter(item => item.id !== id)

            let newProduct = {...productUpdated, id }
            
            let newProducts = [{...notUpdatedProducts, ...newProduct}]
           
            this.toWriteFile(file, newProducts)
        
            return {status: "Success", message:"Product has been successfully updated"}
        } else {
            return{status: "Error", message:"File doesn´t exist"}
        }
    } catch(err){
        return{status: "Error", message: err.message}
    } 

    }

    
    deleteById = async(id)=> {
        id = parseInt(id)

    try{ 
        if (fs.existsSync(file)) {
            
            let products = this.toReadFile(file)
            let newProducts = products.filter(item => item.id !== id)
            let productToDelete = products.find(item => item.id === id)

            if (!productToDelete) return {status: "Error", message: "Product doesn't exist"}
            this.toWriteFile(file, newProducts)
            return {status: "Success", message: "Product was successfully deleted"}
        } else {
            return{status: "Error", message:"File doesn´t exist"}
        }
    }
     catch(err){
        return{status: "Error", message: err.message}
    } 
}


}

module.exports = ProductManager