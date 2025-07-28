import React from 'react';
import PostDetailPage from "@/app/post/[id]/page-client";
import {currentUserProfile} from "@/lib/user-profile";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const user = await currentUserProfile();

    return (
        <PostDetailPage id={(await params).id} user={user} />
    );
};

export default Page;