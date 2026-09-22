import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { Base } from "./base";

@Entity('bid')
export class Bid extends Base{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({type:'int'})
    bidPrice : number;

    
    @ManyToOne(()=>User , (user)=>user.id)
    user : User
    
    @ManyToOne(() => Product, (product) => product.bids, { onDelete: 'CASCADE' })
    product: Product;

}

////PENDING FROM FEEDING THE DATA OF PRODUCT MATCHING STARTING TIME AND 
//ENDING TIME