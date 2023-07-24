import { Pool } from '@/pools/domain/pool.entity'
import { User } from '@/users/domain/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('position')
export class Position {
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

  @Column({ type: 'timestamptz' })
  start: Date

  @Column({
    type: 'timestamptz'
  })
  end: Date
}
