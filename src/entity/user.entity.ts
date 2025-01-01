import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ schema: "public" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "email", nullable: false })
  email!: string;

  @Column({ name: "passwords", nullable: false })
  password!: string;

  @Column({ name: "first_name", nullable: true })
  firstName!: string;

  @Column({ name: "last_name", nullable: true })
  lastName!: string;

  @Column({ name: "image", nullable: true })
  image!: string;

  @Column({ name: "color", nullable: true })
  color!: string;

  @Column({ name: "profile_setup", type: "boolean", default: false })
  profileSetup!: boolean;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;
}
