import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User";
// import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class Video extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  key!: string;

  @Field()
  @Column()
  @Column({ type: "boolean", default: false })
  isConvertionPending!: boolean;

  @Field()
  @Column()
  @Column({ type: "boolean", default: false })
  isAlreadyConvert!: boolean;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field()
  @Column({ type: "int", default: 0 })
  size!: number;

  // @Field(() => Int, { nullable: true })
  // voteStatus: number | null; // 1 or -1 or null

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  // @OneToMany(() => Updoot, (updoot) => updoot.post)
  // updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
