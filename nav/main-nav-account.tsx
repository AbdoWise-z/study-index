"use client";

import React from 'react';
import {Bell, MessageSquare} from "lucide-react";
import {Avatar, AvatarFallback} from "@radix-ui/react-avatar";
import {AvatarImage} from "@/components/ui/avatar";
import {Profile} from "@prisma/client";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const MainNavAccount = (
    {
        user
    }: {
        user: Profile | null
    }
) => {

    const router = useRouter();
    return (
        <div className="flex items-center space-x-4">

            <Bell className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200" />
            <div className="relative">
                <MessageSquare className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors duration-200" />
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center font-semibold">39</span>
            </div>

            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    onClick={() => router.push("/post/create")}
                    disabled={!user}
            >
                Create Post
            </Button>

            <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-blue-400 transition-all duration-200 cursor-pointer">
                    <AvatarFallback className={`${user ? "bg-purple-600" : "bg-gray-600"} text-white`}>
                        {user ? user.name : "?"}
                    </AvatarFallback>
                    <AvatarImage src={`${user ? user.imageUrl : ""}`}/>
                </Avatar>
                <div className="text-sm">
                    <div className="text-gray-300">{user ? user.name : "Guest"}</div>
                    <div className="text-gray-400">{user ? user.level : ""}</div>
                </div>
            </div>
        </div>
    );
};

export default MainNavAccount;