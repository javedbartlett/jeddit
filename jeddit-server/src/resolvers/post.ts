import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post]) // set graphql type
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    //set graphql type then typescript type
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) //graphql type returns a post or null
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> { // typescript type also returns a post or null
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post) //graphql type returns a post or null
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> { // typescript type also returns a post or null
    const post = em.create(Post, {title})
    await em.persistAndFlush(post)
    return post;
  }

  @Mutation(() => Post, {nullable: true}) //graphql type returns a post or null
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, {nullable: true}) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> { // typescript type also returns a post or null
    const post = await em.findOne(Post, {id})
    if (!post){
      return null
    }
    if (typeof title !== 'undefined') {
      post.title = title
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean) //graphql type returns a post or null
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> { // typescript type also returns a post or null
    try {
      await em.nativeDelete(Post, {id})
      return true;
    } catch {
      return false;
    }
  }
}
