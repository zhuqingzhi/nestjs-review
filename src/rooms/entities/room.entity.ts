import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  location: string;

  @Column()
  equipment: string;

  @Column({
    default: '默认的会议室描述',
  })
  description: string;

  @Column({
    default: false,
  })
  isBooked: boolean;

  @CreateDateColumn()
  createTime: string;

  @UpdateDateColumn()
  updateTime: string;
}
