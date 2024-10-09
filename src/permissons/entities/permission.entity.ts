import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment: '权限码',
  })
  code: string;

  @Column({
    comment: '描述',
  })
  desc: string;
}
