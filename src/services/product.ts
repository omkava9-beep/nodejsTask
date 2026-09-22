import { product, userRepo } from "../controllers";
import { Status } from "../entities/Product";

export async function approveProductService(user : {id:string, role :string} , prodId : string){

    const FoundUser = await userRepo.findOneBy({id:user.id});
    if(!FoundUser){
        throw new Error('User not found please login again!');
    }
    const prod = await product.findOneBy({id:prodId});
    
    if(!prod){
        return {
            message : 'Product not fount for id' + prodId,
            savedProduct : null
        }
    }


    prod.approvedBy =  FoundUser;
    prod.status = Status.LISTED;

    const savedProduct = await product.save(prod);
    if(!savedProduct){
        return{
            message : 'Something went wrong while approving the product.',
            savedProduct : null
        }
    }
    console.log("delay start ", savedProduct.startTime.getTime() - Date.now(), savedProduct.startTime.toISOString(), new Date().toISOString())
    console.log("delay end", savedProduct.endTime.getTime() - Date.now())
    return {
        savedProduct : savedProduct,
        message : 'Product Approved SuccessFullly..'
        
    };
}


export async function createProductService(user : {
    id : string ,
    role : string
} , data : any){
    const {title , description , imageUrls ,startingPrice , current_highest , startTime , endTime } = data;
    const newUser = await userRepo.findOneBy({
        id : user.id
    })
    if(!newUser){
        return {

            message : 'Could not find the User. Try to login again!',
            newProduct : null

        }
    }

    const prod  = product.create({
        title : title , 
        description  : description, 
        imageUrls  : imageUrls, 
        startingPrice  : startingPrice, 
        current_highest : current_highest , 
        status : Status.PENDING, 
        startTime  : startTime, 
        endTime  : endTime, 
        userId : newUser
    })
    const newProduct = await product.save(prod);
    return {
        message : 'The product created Successfuly!',
        newProduct : newProduct
    }
}