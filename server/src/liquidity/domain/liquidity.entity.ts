import { Pool } from '@/pools/domain/pool.entity'
import { User } from '@/users/domain/user.entity'
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('liquidity')
export class Liquidity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true
  })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Pool, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    cascade: true
  })
  @JoinColumn({ name: 'poolId' })
  pool: Pool

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamptz'
  })
  updatedAt: Date
}
