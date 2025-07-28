"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, ArrowUp, ArrowDown, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {CommentWithOwner, CommentWithOwnerWithState} from "@/types/commnet";
import {cn} from "@/lib/utils";



interface CommentSectionProps {
    comments: CommentWithOwnerWithState[],
    onAddComment: (message: string) => void | Promise<void>,
    onCommentUpvote: (id: string) => void | Promise<void>,
    onCommentDownvote: (id: string) => void | Promise<void>,
}

export function CommentSection({ comments, onAddComment, onCommentDownvote, onCommentUpvote }: CommentSectionProps) {
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        await onAddComment(newComment.trim())
        setNewComment("")
        setIsSubmitting(false)
    }

    const formatDate = (date: Date) => {
        // yeah, it be like that sometimes :)
        if (typeof date === "string") date = new Date(date)

        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
            Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            "day",
        )
    }

    return (
        <div className="space-y-6">
            <div className="border-t border-gray-400 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>
                </div>

                {/* Add Comment Form */}
                <Card className="border border-gray-400 rounded-none mb-6">
                    <CardContent className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px] border-2 border-gray-400 focus:border-blue-500 rounded-none resize-none"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {isSubmitting ? "Posting..." : "Post Comment"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-0">
                    {comments.map((comment, index) => (
                        <Card
                            key={comment.id}
                            className={`border border-gray-400 ${index === 0 ? "border-t-2" : "border-t-0"} border-b-2 rounded-none hover:bg-gray-50/50 transition-colors duration-200`}
                        >
                            <CardContent className="p-4">
                                <div className="flex space-x-3">
                                    <div className="flex flex-col items-center space-y-1">
                                        <Button onClick={() => onCommentUpvote(comment.id)} variant="ghost" size="sm" className={
                                            cn(
                                                "p-1 h-6 w-6 hover:bg-green-100 rounded-none",
                                                comment.upvoted && "bg-green-200",
                                            )
                                        }>
                                            <ArrowUp className="w-3 h-3 text-gray-600 hover:text-green-600" />
                                        </Button>
                                        <span className="text-sm font-bold text-gray-900">{comment.votes}</span>
                                        <Button onClick={() => onCommentDownvote(comment.id)} variant="ghost" size="sm" className={
                                            cn(
                                                "p-1 h-6 w-6 hover:bg-red-100 rounded-none",
                                                comment.downvoted && "bg-red-200",
                                            )
                                        }>
                                            <ArrowDown className="w-3 h-3 text-gray-600 hover:text-red-600" />
                                        </Button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage src={comment.user.imageUrl || "/placeholder.svg"} alt={comment.user.name} />
                                                <AvatarFallback className="bg-gray-600 text-white text-xs">
                                                    {comment.user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {comments.length === 0 && (
                    <Card className="border border-gray-400 rounded-none">
                        <CardContent className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h4>
                            <p className="text-gray-600">Be the first to share your thoughts on this opportunity!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
