import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity({ schema: "public" })
export class ChannelSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "channel_name" })
  channelName!: string;

  @ManyToMany(() => User, (user) => user.channels)
  @JoinTable({
    name: "channel_members",
    joinColumn: { name: "channel", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user", referencedColumnName: "id" },
  })
  members!: User[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "admin_id", referencedColumnName: "id" })
  admin!: User;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
