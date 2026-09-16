import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role, User } from "./User";
import { Bid } from "./Bid";


export enum Status {
    PENDING = 'pending',
    LISTED = 'listed',
    SOLD = 'sold'
}

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id : string;


    @Column({type : 'varchar'})
    title  : string;
    
    @Column({type : 'varchar'})
    description : string;
    
    
    @Column({type : 'varchar'})
    imageUrls : string;

    @Column({type : 'int'})
    startingPrice : number

    @Column({type : 'int'})
    current_highest : number

    @Column({type : 'enum' , enum : Status , default : Status.PENDING  })
    status : Status

    @Column({type: 'timestamp'})
    startTime : Date;

    @ManyToOne(()=>User, (user)=>user.product)
    userId : User;

    @ManyToOne(()=>User , (user)=>user.product,{nullable:true})
    approvedBy : User | null

    @OneToMany(()=>Bid , (bid)=>bid.product)
    bids : Bid[]

    @Column({type : 'timestamp'})
    endTime : Date;

    @CreateDateColumn()
    createdAt : Date;
}