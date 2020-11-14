import { InputType, Field, Int } from "type-graphql";
@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
  @Field(() => [Int])
  videosId: number[];
}
