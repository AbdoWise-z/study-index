import {NextResponse} from "next/server";
import {CreatePostForm, createPostSchema} from "@/forms/create-post";
import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";

export const POST = async (req: Request) => {
    try {
        const profile = await currentUserProfile(false);

        if (!profile) {
            return new NextResponse("Unauthorized" , {status: 401});
        }

        try {
            const form: CreatePostForm = await req.json();
            createPostSchema.parse(form);

            const post = await db.post.create({
                data: {
                    title: form.title,
                    institutionName: form.institutionName,
                    institutionLink: form.institutionLink,
                    opportunityLink: form.opportunityLink,
                    content: form.content,
                    country: form.country,
                    field: form.field,
                    tags: form.tags,
                    level: form.level,

                    votes: 0,
                    commentsCount: 0,
                    owner_id: profile.id,
                }
            });

           return NextResponse.json(post);
        } catch (error) {
            console.log(error);
            return new NextResponse("Param error" , {status: 400, statusText: "bad request"});
        }

    } catch (error) {
        console.log("POST [api/post/]" , error);
        return new NextResponse("Internal Error" , {status: 500, statusText: "Internal Server Error"});
    }
}

import { Filters, SortOption } from "@/forms/psots-list";

export const PATCH = async (req: Request) => {
    try {

        const {
            filter,
            sortBy,
            page,
        }: {
            filter: Filters;
            sortBy: SortOption;
            page: number;
        } = await req.json();

        const level_filter    = filter.levels.length > 0    ? { level: { in: filter.levels } } : {};
        const field_filter     = filter.fields.length > 0    ? { field: { in: filter.fields } } : {};
        const country_filter = filter.countries.length > 0 ? { country: { in: filter.countries } } : {};

        const filters = {
            ...level_filter,
            ...field_filter,
            ...country_filter,
        };

        const pageSize = 10;
        const currentPage = (page ?? 1) - 1;

        // Count total number of filtered posts
        const totalCount = await db.post.count({
            where: filters,
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalCount / pageSize);

        const result = await db.post.findMany({
            where: filters,
            orderBy:
                sortBy === "most-votes"
                    ? { votes: "desc" }
                    : sortBy === "newest"
                        ? { createdAt: "desc" }
                        : sortBy === "level"
                            ? { level: "asc" }
                            : undefined,

            take: pageSize,
            skip: currentPage * pageSize,
            include: {
                owner: true,
            }
        });

        return NextResponse.json({
            data: result,
            totalPages,
            currentPage: currentPage + 1,
            totalCount
        });
    } catch (error) {
        console.log("GET [api/post/]", error);
        return new NextResponse("Internal Error", {
            status: 500,
            statusText: "Internal Server Error",
        });
    }
};
