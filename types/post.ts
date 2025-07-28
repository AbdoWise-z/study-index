import { Post, Profile } from "@prisma/client";
import { CommentWithOwnerWithState } from "@/types/commnet";

export type PostWithState = Post & {
    upvoted:   boolean;
    downvoted: boolean;
}

export type PostWithOwner = PostWithState & {
    owner: Profile,
}

export type PostWithComments = PostWithState & {
    comments: Comment[]
}

export type PostWithOwnerAndComments = PostWithState & {
    owner: Profile,
    comments: Comment[]
}

export type PostWithOwnerAndCommentWithOwners = PostWithState & {
    owner: Profile,
    comments: CommentWithOwnerWithState[]
}



