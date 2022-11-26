import { SexoEnum } from 'src/utils/enum/sexoEnum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pessoa {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ length: 100 })
    nome: string;

    @Column({ length: 100 })
    sobrenome: string;

    @Column({
        unique: true,
        length: 14
    })
    cpfCnpj: string;

    @Column({ type: "enum", enum: SexoEnum, default: SexoEnum.MASCULINO })
    sexo: string;

    @Column({ default: true })
    isActive: boolean;
}