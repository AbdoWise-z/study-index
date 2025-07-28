import {NextResponse} from "next/server";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";


export const POST = async (req: Request) => {
    try {
        const profile = await currentUserProfile(false);

        if (!profile) {
            return new NextResponse("Unauthorized" , {status: 401});
        }

        try {
            const { comment_id } = await req.json();

            const exists = await db.upVote.findFirst({
                where: {
                    obj_id: comment_id,
                    user_id: profile.id
                }
            });

            if (exists) {
                return NextResponse.json({
                    status: 200,
                });
            }

            const { count } = await db.downVote.deleteMany({
                where: {
                    obj_id: comment_id,
                    user_id: profile.id
                }
            });

            await db.comment.update({
                where: {
                    id: comment_id,
                },

                data: {
                    votes: {
                        increment: (count + 1),
                    }
                }
            });

            await db.upVote.create({
                data: {
                    obj_id: comment_id,
                    user_id: profile.id,
                }
            });

            return NextResponse.json({
                status: 200
            });
        } catch (error) {
            console.log(error);
            return new NextResponse("Param error" , {status: 400, statusText: "bad request"});
        }

    } catch (error) {
        console.log("POST [api/comment/upvote]" , error);
        return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
    }
}