import React from 'react';
import CreatePostPage from "@/app/post/create/page-client";
import {currentUserProfile} from "@/lib/user-profile";

const Page = async () => {
    const user = await currentUserProfile(true);
    if (!user) {
        return "You will be redirected to sign in ..";
    }

    return (
        <CreatePostPage />
    );
};

export default Page;