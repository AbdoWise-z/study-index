"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    MapPin,
    GraduationCap,
    Bookmark,
    Share2,
    Loader2, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentSection } from "@/components/posts/comment-section"
import {AccessLevel, Profile, VerificationStatus} from "@prisma/client"
import { PostWithOwnerAndCommentWithOwners } from "@/types/post";
import { ForwardRefEditor } from "@/components/md/ForwardRefEditor";
import {
    frontmatterPlugin,
    headingsPlugin, linkDialogPlugin, linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin, tablePlugin,
    thematicBreakPlugin
} from "@mdxeditor/editor";
import {cn} from "@/lib/utils";
import {DownVote, DownVoteComment, UpVote, UpVoteComment} from "@/lib/posts-interactions";
import axios from "axios";
import {CommentWithOwnerWithState} from "@/types/commnet";

export default function PostDetailPage(
    {
        id,
        user,
    }: {
        id: string,
        user: Profile | null
    }
) {
    const router = useRouter()
    const [post, setPost] = useState<PostWithOwnerAndCommentWithOwners>({} as PostWithOwnerAndCommentWithOwners)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPost = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const result = (await axios.get(`/api/post/${id}`)).data;
            // console.log(result);
            setPost(result);
            setIsLoading(false)
        } catch (err) {
            setError("Failed to load posts. Please try again.")
            console.error("Error loading posts:", err)
        } finally {
            setIsLoading(false);
        }
    }

    const handlePostUpvote = async () => {
        try {
            const diff1 = post.upvoted   ? 0 : 1;
            const diff2 = post.downvoted ? 1 : 0;
            setPost({
                ...post,
                upvoted: true,
                downvoted: false,
                votes: diff1 + diff2 + post.votes,
            });

            await UpVote(post.id);
        } catch (err) {
            console.error("Error upvoting post:", err);
        }
    }

    const handlePostDownvote = async () => {
        try {
            const diff1 = post.upvoted   ? 1 : 0;
            const diff2 = post.downvoted ? 0 : 1;
            setPost({
                ...post,
                upvoted: false,
                downvoted: true,
                votes: - diff1 - diff2 + post.votes,
            });

            await DownVote(post.id);
        } catch (err) {
            console.error("Error downvoting post:", err);
        }
    }

    const handleCommentUpvote = async (id: string) => {
        const comment = post.comments.find((c) => c.id == id);
        if (comment) {
            try {
                const diff1 = comment.upvoted   ? 0 : 1;
                const diff2 = comment.downvoted ? 1 : 0;
                setPost({
                    ...post,
                    comments: post.comments.map((c) => (c.id == id ? {
                        ...comment,
                        upvoted: true,
                        downvoted: false,
                        votes: diff1 + diff2 + comment.votes,
                    } : c))
                });

                await UpVoteComment(post.id, comment.id);
            } catch (err) {
                console.error("Error upvoting post:", err);
            }
        }
    }

    const handleCommentDownvote = async (id: string) => {
        const comment = post.comments.find((c) => c.id == id);
        if (comment) {
            try {
                const diff1 = comment.upvoted   ? 1 : 0;
                const diff2 = comment.downvoted ? 0 : 1;
                setPost({
                    ...post,
                    comments: post.comments.map((c) => (c.id == id ? {
                        ...comment,
                        upvoted: false,
                        downvoted: true,
                        votes: - diff1 - diff2 + comment.votes,
                    } : c))
                });

                await DownVoteComment(post.id, comment.id);
            } catch (err) {
                console.error("Error upvoting post:", err);
            }
        }
    }

    const handleAddComment = async (content: string) => {
        if (!user) return;

        const tempId = `temp-${Date.now()}`;

        const newComment: CommentWithOwnerWithState = {
            id: tempId,
            post_id: post.id,
            user_id: user.id,
            user: user,
            content,
            votes: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            upvoted: true,
            downvoted: false,
        };

        // Add temp comment optimistically
        setPost(prev => ({
            ...prev,
            comments: [...prev.comments, newComment],
            commentsCount: prev.commentsCount + 1,
        }));

        try {
            const res = await fetch(`/api/post/${post.id}`, {
                method: "POST",
                body: JSON.stringify({ content }),
            });

            if (!res.ok) {
                throw new Error("Failed to post comment");
            }

            const createdComment: CommentWithOwnerWithState = (await res.json()).data;

            // Replace temp comment with actual comment
            setPost(prev => ({
                ...prev,
                comments: prev.comments.map(comment =>
                    comment.id === tempId ? createdComment : comment
                ),
            }));
        } catch (error) {
            console.error("Failed to post comment:", error);

            // Remove temp comment on failure
            setPost(prev => ({
                ...prev,
                comments: prev.comments.filter(comment => comment.id !== tempId),
                commentsCount: prev.commentsCount - 1,
            }));
        }
    };


    useEffect(() => {
        loadPost();
    }, []);

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

    const renderContent = () => {
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Post Details</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => loadPost()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none">
                        Try Again
                    </Button>
                </div>
            )
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Post Details</h3>
                    <p className="text-gray-600">let me cook ...</p>
                </div>
            );
        }

        return (
            <div className="max-w-6xl mx-auto">
                <Card className="border border-gray-400 rounded-none">
                    <CardContent className="p-8">
                        {/* Post Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={post.owner.imageUrl || "/placeholder.svg"} alt={post.owner.name} />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {post.owner.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-gray-900">{post.owner.name}</span>
                                            {post.owner.verification === VerificationStatus.VERIFIED && (
                                                <span className="text-blue-600">✓</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">{getVerificationBadge(post.verification)}</div>
                                    </div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

                                <div className="flex items-center space-x-6 mb-6 text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-medium">{post.country}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <GraduationCap className="w-5 h-5" />
                                        <span className="font-medium">{post.level}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ExternalLink className="w-5 h-5" />
                                        <a
                                            href={post.institutionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                        >
                                            {post.institutionName}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-2 ml-6">
                                <Button onClick={handlePostUpvote} variant="ghost" size="sm" className={
                                    cn(
                                        "p-2 h-10 w-10 hover:bg-green-100 rounded-none",
                                        post.upvoted && "bg-green-200",
                                    )
                                }>
                                    <ArrowUp className="w-5 h-5 text-gray-600 hover:text-green-600" />
                                </Button>
                                <span className="text-2xl font-bold text-gray-900">{post.votes}</span>
                                <Button onClick={handlePostDownvote} variant="ghost" size="sm" className={
                                    cn(
                                        "p-2 h-10 w-10 hover:bg-red-100 rounded-none",
                                        post.downvoted && "bg-red-200",
                                    )
                                }>
                                    <ArrowDown className={cn(
                                        "w-5 h-5 text-gray-600 hover:text-red-600",
                                    )} />
                                </Button>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-0">
                            <Badge
                                variant="outline"
                                className="text-purple-600 border-purple-400 hover:bg-purple-50 transition-colors duration-200 rounded-none"
                            >
                                {post.field}
                            </Badge>
                            {post.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-blue-600 border-blue-400 hover:bg-blue-50 transition-colors duration-200 rounded-none"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none mb-8 p-0">
                            <ForwardRefEditor
                                markdown={post.content}
                                className={"p-0 m-0"}
                                readOnly={true}
                                plugins={[
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    markdownShortcutPlugin(),
                                    linkPlugin(),
                                    linkDialogPlugin({}),
                                    tablePlugin(),
                                    frontmatterPlugin(),
                                ]}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-400">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="outline"
                                    className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-none bg-transparent"
                                    asChild
                                >
                                    <a href={post.opportunityLink} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Apply Now
                                    </a>
                                </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 rounded-none">
                                    <Bookmark className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 rounded-none">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments Section */}
                <div className="mt-8">
                    <CommentSection
                        comments={post.comments}
                        onAddComment={handleAddComment}
                        onCommentDownvote={handleCommentDownvote}
                        onCommentUpvote={handleCommentUpvote}
                    />
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="text-white hover:bg-gray-400 rounded-none"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SI</span>
                                </div>
                                <span className="text-xl font-semibold">Study Index</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {renderContent()}
            </div>
        </div>
    )
}
