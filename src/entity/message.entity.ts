import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum MessageType {
  Text = "text",
  File = "file",
}

@Entity({ schema: "public" })
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "content", type: "text", nullable: true })
  content!: string;

  @Column({ name: "file_url", type: "text", nullable: true })
  fileUrl!: string;

  @Column({ name: "message_type", enum: MessageType })
  messageType!: MessageType;

  @BeforeInsert()
  @BeforeUpdate()
  validateFields() {
    if (this.messageType === "text" && !this.content) {
      throw new Error("Content cannot be null for text messages.");
    }
    if (this.messageType === "file" && !this.fileUrl) {
      throw new Error("File URL cannot be null for file messages.");
    }
  }

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "recipient_id" })
  recipient!: User;

  @Column({
    name: "timestamp",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  timestamp!: Date;
}
