import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Image } from './image.entity'
import { Liquidity } from '@/liquidity/domain/liquidity.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false })
  address: string

  @Column({ unique: true, nullable: true })
  username: string

  @OneToOne(() => Image, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true
  })
  @JoinColumn({ name: 'pictureId' })
  picture: Image

  @OneToMany(() => Liquidity, (e) => e.id)
  liquidity: Liquidity[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamptz'
  })
  updatedAt: Date

  constructor(id: string) {
    this.id = id
  }
}
