import {Profile, Comment} from "@prisma/client";

export type CommentWithOwner = Comment & {
    user: Profile
}


export type CommentWithOwnerWithState = CommentWithOwner & {
    upvoted:   boolean;
    downvoted: boolean;
}