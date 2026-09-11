import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
    id! : string

    @Column({type :'varchar'})
    name : string = ''
    

}