import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./Product";
import { Bid } from "./Bid";
import { Base } from "./base";

export enum Role {
    SUPERADMIN = 'SUPERADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER'
}

@Entity('user')
export class User extends Base {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({type :'varchar'})
    name : string

    @Column({type:'varchar'})
    email : string

    @Column({type:'varchar' , nullable:true})
    password : string | null
    
    @Column({type : 'enum' , enum:Role , default:Role.USER})
    role : Role
    
    @OneToMany(()=>Product , (product) => product.userId)
    product : Product[]
    
    @OneToMany(()=>Bid , (bid)=>bid.user)
    bid : Bid[]
    
    
    @Column({type : 'varchar' , nullable: true , unique: true})
    googleId!: string | null;



}