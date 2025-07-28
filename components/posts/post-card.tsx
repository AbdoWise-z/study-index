"use client"

import { MessageSquare, Bookmark, ArrowUp, ArrowDown, ExternalLink, MapPin, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {PostWithOwner} from "@/types/post";
import {VerificationStatus} from "@prisma/client";

interface PostCardProps {
    post: PostWithOwner
    showTopBorder?: boolean
    onClick?: () => void
}

export function PostCard({ post, showTopBorder = false, onClick }: PostCardProps) {
    const getVerificationBadge = (status: VerificationStatus) => {
        switch (status) {
            case VerificationStatus.VERIFIED:
                return (
                    <Badge className="bg-green-100 text-green-800 font-semibold border border-green-400 rounded-none">
                        VERIFIED
                    </Badge>
                )
            case VerificationStatus.PENDING:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 font-semibold border border-yellow-400 rounded-none">
                        PENDING
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <Card
            className={`hover:shadow-lg transition-all duration-300 border border-gray-400 ${showTopBorder ? "border-t-2" : "border-t-0"} border-b-2 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer group rounded-none`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={post.owner.imageUrl || "/placeholder.svg"} alt={post.owner.name} />
                                <AvatarFallback className="bg-blue-600 text-white text-sm">
                                    {post.owner.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="text-sm font-medium text-gray-900">{post.owner.name}</span>
                                {post.owner.verification === VerificationStatus.VERIFIED && (
                                    <span className="ml-1 text-blue-600">✓</span>
                                )}
                            </div>
                            {getVerificationBadge(post.verification)}
                        </div>

                        <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 cursor-pointer mb-2 group-hover:text-blue-700 transition-colors duration-200">
                            {post.title}
                        </h3>

                        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{post.country}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{post.level}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ExternalLink className="w-4 h-4" />
                                <span className="font-medium">{post.institutionName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-green-100 rounded-none">
                            <ArrowUp className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </Button>
                        <span className="text-lg font-bold text-gray-900">{post.votes}</span>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-red-100 rounded-none">
                            <ArrowDown className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </Button>
                    </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {post.content.substring(0, 200)}...
                    <span className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200 font-medium">
            read more
          </span>
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                        variant="outline"
                        className="text-purple-600 border-purple-400 hover:bg-purple-50 transition-colors duration-200 cursor-pointer rounded-none"
                    >
                        {post.field}
                    </Badge>
                    {post.tags.slice(0, 4).map((tag, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-blue-600 border-blue-400 hover:bg-blue-50 transition-colors duration-200 cursor-pointer rounded-none"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {post.tags.length > 4 && (
                        <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-400 hover:bg-blue-50 transition-colors duration-200 cursor-pointer rounded-none"
                        >
                            +{post.tags.length - 4} more
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{post.commentsCount} comments</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
