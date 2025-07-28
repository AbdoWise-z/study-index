import {InfoIcon, Search} from 'lucide-react';
import React from 'react';
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { currentUserProfile } from "@/lib/user-profile";
import MainNavAccount from "@/nav/main-nav-account";

const MainNav = async () => {
    const user = await currentUserProfile();

    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SI</span>
                            </div>
                            <span className="text-xl font-semibold">Study Index</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-6">
                            <div className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/40 p-2 group cursor-pointer transition-colors duration-200">
                                <Search className="w-4 h-4 group-hover:text-green-500"/>
                                <span>Posts</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/40 p-2 group cursor-pointer transition-colors duration-200">
                                <QuestionMarkIcon className="w-4 h-4 group-hover:text-green-500"/>
                                <span>Questions</span>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/40 p-2 group cursor-pointer transition-colors duration-200">
                                <InfoIcon className="w-4 h-4 group-hover:text-green-500"/>
                                <span>About</span>
                            </div>

                        </nav>
                    </div>

                    {/* Right side */}
                    <MainNavAccount user={user}/>
                </div>
            </div>
        </header>
    );
};

export default MainNav;