import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment: '用户名',
  })
  username: string;

  @Column({
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '邮箱',
  })
  email: string;

  @Column({
    comment: '昵称',
  })
  nickname: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: '手机号',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    comment: '是否是管理员',
    default: false,
  })
  isAdmin: boolean;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrosen: boolean;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];

  @CreateDateColumn()
  createTime: string;

  @UpdateDateColumn()
  updateTime: string;
}
