import { AppDataSource } from "../config/data-source"
import { Role, User } from "../entities/User"
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
const userReposetory = AppDataSource.getRepository(User);

//working
export async function signup(username :string , email  :string, password : string , role : Role){
    const existingUser = await userReposetory.findOneBy({
            email : email
    })
    if(existingUser){
        return {
            status : 409,
            message : 'User with entered email id already exists.',
            user: null
        }
    }


    const hashed = await bcryptjs.hash(password ,  10);
    const newUser = userReposetory.create({
        name : username,
        email : email,
        password: hashed,
        role : role
    })

    const user = await userReposetory.save(newUser);
    if(!user){
        return {
            status : 500,
            message : 'Something went wrong while creating the user',
            user : null
        }
    }

    return {
        status  : 201,
        message : "User created Successfully",
        user : user
    }
}

export async function login(email : string , password: string){
    const existingUser = await userReposetory.findOneBy({
            email : email
    })
    const JWT_SECRET = process.env.JWT_SECRET!;

    if(!existingUser){
        return {
            status : 401,
            success : false,
            message : 'User with this email does not exist.',
        }
    }
    //as per now before the oauth is implemented.
    if(!existingUser.password){
        
        return {
            status: 401,
            success : false,
            message : 'The password field is empty.'
        };
    }
    const matchingPassword = await bcryptjs.compare(password , existingUser.password);

    if(!matchingPassword){
        return {
            status : 401,
            success: false,
            message : 'Entered email or password is wrong.',
        }
    }


    const {role , id} = existingUser;

    const token =  jwt.sign({
        id: id.toString(),
        role : role.toString()
    },JWT_SECRET , {
        expiresIn : '50h'
    } )
    return {
        success : true,
        status : 200 ,
        message : 'User logged in successfully!!',
        token : token
    }

}