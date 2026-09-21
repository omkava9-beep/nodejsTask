import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./Product";
import { Bid } from "./Bid";

export enum Role {
    SUPERADMIN = 'SUPERADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER'
}
// @Entity('users')
// export class User {

// }
@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({type :'varchar'})
    name : string

    // @Column({type:'varchar'})
    // email : string = ''
    @Column({type:'varchar' , unique:true})
    email : string

    @Column({type:'varchar' , nullable:true})
    password : string | null
    
    @Column({type : 'enum' , enum:Role , default:Role.USER})
    role : Role

    @CreateDateColumn()
    createdAt : Date;
    
    @OneToMany(()=>Product , (product) => product.userId)
    product : Product[]
    
    @OneToMany(()=>Bid , (bid)=>bid.user)
    bid : Bid[]
    
    @UpdateDateColumn()
    updatedAt : Date;
    
    @Column({type : 'varchar' , unique:true , nullable: true})
    googleId!: string | null;



}