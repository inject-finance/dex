import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Token } from '../../tokens/domain/tokens.entity'

@Entity('pairs')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  address: string

  @ManyToOne(() => Token, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true
  })
  @JoinColumn({ name: 'tokenAId' })
  tokenA: Token

  @ManyToOne(() => Token, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true
  })
  @JoinColumn({ name: 'tokenBId' })
  tokenB: Token

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
