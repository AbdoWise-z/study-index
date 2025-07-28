import {currentUserProfile} from "@/lib/user-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";


// Get post with details
export const GET = async (
    req: Request,
    context: { params: Promise<{ id: string }> }) => {
    try {
        const profile = await currentUserProfile(false);

        const { id } = await context.params;

        const post = await db.post.findUnique({
            where: { id },
            include: {
                owner: true,
                comments: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        votes: "desc",
                    },
                },
            },
        });

        if (!post) {
            return new NextResponse("Not Found", {
                status: 404,
                statusText: "Post not found",
            });
        }

        // Determine upvote/downvote status if user is logged in
        let upvoted = false;
        let downvoted = false;
        const commentVotes: Record<string, { upvoted: boolean; downvoted: boolean }> = {};

        if (profile) {
            const [postUp, postDown, commentUpvotes, commentDownvotes] = await Promise.all([
                db.upVote.findFirst({
                    where: { obj_id: id, user_id: profile.id },
                }),
                db.downVote.findFirst({
                    where: { obj_id: id, user_id: profile.id },
                }),
                db.upVote.findMany({
                    where: { user_id: profile.id, obj_id: { in: post.comments.map(c => c.id) } },
                }),
                db.downVote.findMany({
                    where: { user_id: profile.id, obj_id: { in: post.comments.map(c => c.id) } },
                }),
            ]);

            upvoted = !!postUp;
            downvoted = !!postDown;

            for (const comment of post.comments) {
                commentVotes[comment.id] = {
                    upvoted: commentUpvotes.some(v => v.obj_id === comment.id),
                    downvoted: commentDownvotes.some(v => v.obj_id === comment.id),
                };
            }
        }

        // Augment post with vote flags
        const enrichedPost = {
            ...post,
            upvoted,
            downvoted,
            comments: post.comments.map(comment => ({
                ...comment,
                upvoted: commentVotes[comment.id]?.upvoted || false,
                downvoted: commentVotes[comment.id]?.downvoted || false,
            })),
        };

        return NextResponse.json(enrichedPost);
    } catch (error) {
        console.error("GET [api/post/:id] error:", error);
        return new NextResponse("Internal Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};

// Comment on a post
export const POST = async (
    req: Request,
    context: { params: Promise<{ id: string }> }
) => {
    try {
        const profile = await currentUserProfile(false);
        const { id } = await context.params;
        const { content } = await req.json();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const post = await db.post.findUnique({
            where: { id },
        });

        if (!post) {
            return new NextResponse("Not Found", {
                status: 404,
                statusText: "Post not found",
            });
        }

        await db.post.update({
            where: { id: post.id },
            data: {
                commentsCount: {
                    increment: 1,
                }
            }
        });

        const comment = await db.comment.create({
            data: {
                user_id: profile.id,
                post_id: post.id,
                content,
                votes: 0,
            },
            include: {
                user: true, // Include the user (Profile) who made the comment
            },
        });

        return NextResponse.json({
            status: 200,
            data: {
                ...comment,
                upvoted:   false,
                downvoted: false,
            }
        });
    } catch (error) {
        console.error("POST [api/post/:id] error:", error);
        return new NextResponse("Internal Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};
