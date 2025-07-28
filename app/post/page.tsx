"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search,
    MessageSquare,
    RefreshCw,
    Loader2,
    Bookmark,
    LogIn,
    ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {PostCard} from "@/components/posts/post-card";
import {Pagination} from "@/components/utility/pagination";
import { PostWithOwner } from "@/types/post";
import { countries, fields } from "@/forms/create-post";
import { allPosts } from "@/mock/posts";
import { Filters, SortOption } from "@/forms/psots-list";
import axios from "axios";


interface PaginatedResponse {
    posts: PostWithOwner[]
    totalPages: number
    currentPage: number
    totalCount: number
}

interface SavedPost {
    id: string
    postId: string
    title: string
    institutionName: string
    field: string
    level: string
    deadline: string
    votes: number
    commentsCount: number
    savedAt: Date
}

interface AppliedPost {
    id: string
    postId: string
    title: string
    institutionName: string
    field: string
    level: string
    deadline: string
    votes: number
    commentsCount: number
    appliedAt: Date
    status: "UNDER_REVIEW" | "ACCEPTED" | "REJECTED"
    applicationId: string
    coverLetter: string
}

const fetchPosts = async (filters: Filters, sortBy: SortOption, page = 1): Promise<PaginatedResponse> => {
    try {
        // Pagination

        const result = await axios.patch<{
            data: PostWithOwner[],
            totalPages: number,
            currentPage: number,
            totalCount: number,
        }>("/api/post", {
            "filter": filters,
            "sortBy": sortBy,
            "page": page
        });

        const { data, totalPages, currentPage, totalCount } = result.data;

        return {
            posts: data,
            totalPages,
            currentPage: currentPage,
            totalCount: totalCount
        }
    } catch (e) {
        console.error(e);
    }

    return  {
        posts: [],
        totalPages: 1,
        currentPage: 1,
        totalCount: 0,
    }

}

// Mock API function for saved posts
const fetchSavedPosts = async (): Promise<SavedPost[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return [
        {
            id: "saved1",
            postId: "1",
            title: "PhD Fellowship in AI and Machine Learning",
            institutionName: "Stanford University",
            field: "Computer Science",
            level: "PhD",
            deadline: "March 15, 2024",
            votes: 127,
            commentsCount: 15,
            savedAt: new Date("2024-01-20"),
        },
        {
            id: "saved2",
            postId: "3",
            title: "Research Internship in Biomedical Data Science",
            institutionName: "Harvard Medical School",
            field: "Biomedical Sciences",
            level: "Undergraduate",
            deadline: "February 28, 2024",
            votes: 156,
            commentsCount: 23,
            savedAt: new Date("2024-01-18"),
        },
        {
            id: "saved3",
            postId: "4",
            title: "Postdoc Position in Quantum Computing Research",
            institutionName: "Oxford University",
            field: "Physics",
            level: "Postdoc",
            deadline: "April 10, 2024",
            votes: 203,
            commentsCount: 31,
            savedAt: new Date("2024-01-16"),
        },
        {
            id: "saved4",
            postId: "9",
            title: "Research Fellowship in Climate Change Modeling",
            institutionName: "ETH Zurich",
            field: "Environmental Science",
            level: "Postdoc",
            deadline: "March 30, 2024",
            votes: 134,
            commentsCount: 21,
            savedAt: new Date("2024-01-14"),
        },
    ]
}

// Mock API function for applied posts
const fetchAppliedPosts = async (): Promise<AppliedPost[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return [
        {
            id: "applied1",
            postId: "1",
            title: "PhD Fellowship in AI and Machine Learning",
            institutionName: "Stanford University",
            field: "Computer Science",
            level: "PhD",
            deadline: "March 15, 2024",
            votes: 127,
            commentsCount: 15,
            appliedAt: new Date("2024-01-12"),
            status: "UNDER_REVIEW",
            applicationId: "APP-2024-001",
            coverLetter: "I am passionate about AI research and have published 3 papers in machine learning conferences...",
        },
        {
            id: "applied2",
            postId: "6",
            title: "Summer Research Fellowship in Neuroscience",
            institutionName: "Caltech",
            field: "Biology",
            level: "Masters",
            deadline: "February 1, 2024",
            votes: 92,
            commentsCount: 18,
            appliedAt: new Date("2024-01-05"),
            status: "ACCEPTED",
            applicationId: "APP-2024-002",
            coverLetter:
                "Excited to contribute to neuroscience research with my background in computational biology and data analysis...",
        },
        {
            id: "applied3",
            postId: "7",
            title: "PhD Position in Renewable Energy Systems",
            institutionName: "Technical University of Munich",
            field: "Engineering",
            level: "PhD",
            deadline: "January 15, 2024",
            votes: 145,
            commentsCount: 27,
            appliedAt: new Date("2023-12-20"),
            status: "REJECTED",
            applicationId: "APP-2024-003",
            coverLetter:
                "My research interests align with the renewable energy group's current projects on solar panel efficiency...",
        },
        {
            id: "applied4",
            postId: "2",
            title: "Master's Scholarship in Renewable Energy Engineering",
            institutionName: "MIT",
            field: "Engineering",
            level: "Masters",
            deadline: "February 20, 2024",
            votes: 89,
            commentsCount: 8,
            appliedAt: new Date("2024-01-08"),
            status: "UNDER_REVIEW",
            applicationId: "APP-2024-004",
            coverLetter: "My passion for sustainable energy solutions drives my interest in this program...",
        },
        {
            id: "applied5",
            postId: "10",
            title: "Masters Program in Cybersecurity",
            institutionName: "University of Edinburgh",
            field: "Computer Science",
            level: "Masters",
            deadline: "March 1, 2024",
            votes: 98,
            commentsCount: 16,
            appliedAt: new Date("2024-01-15"),
            status: "ACCEPTED",
            applicationId: "APP-2024-005",
            coverLetter: "With my background in computer science and interest in security, I believe...",
        },
    ]
}

export default function FreelancerInterface() {
    const [activeTab, setActiveTab] = useState<"explore" | "saved" | "applied">("explore")
    const [posts, setPosts] = useState<PostWithOwner[]>([])
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
    const [appliedPosts, setAppliedPosts] = useState<AppliedPost[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<SortOption>("most-votes")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(true) // Testing switch for login state
    const [filters, setFilters] = useState<Filters>({
        levels: [],
        fields: [],
        countries: [],
    })

    // Search states for filters
    const [fieldSearch, setFieldSearch] = useState("")
    const [countrySearch, setCountrySearch] = useState("")

    // Collapsible states
    const [levelCollapsed, setLevelCollapsed] = useState(false)
    const [fieldCollapsed, setFieldCollapsed] = useState(false)
    const [countryCollapsed, setCountryCollapsed] = useState(false)

    const router = useRouter()

    // Filtered lists based on search
    const filteredFields = useMemo(() => {
        return fields.filter((field) => field.toLowerCase().includes(fieldSearch.toLowerCase()))
    }, [fieldSearch])

    const filteredCountries = useMemo(() => {
        return countries.filter((country) => country.toLowerCase().includes(countrySearch.toLowerCase()))
    }, [countrySearch])

    const loadPosts = async (isRefresh = false, page = 1) => {
        try {
            if (isRefresh) {
                setIsRefreshing(true)
            } else {
                setIsLoading(true)
            }
            setError(null)

            const response = await fetchPosts(filters, sortBy, page)
            setPosts(response.posts)
            setTotalPages(response.totalPages)
            setCurrentPage(response.currentPage)
            setTotalCount(response.totalCount)
        } catch (err) {
            setError("Failed to load posts. Please try again.")
            console.error("Error loading posts:", err)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    const loadSavedPosts = async () => {
        if (!isLoggedIn) return

        try {
            setIsLoading(true)
            setError(null)
            const saved = await fetchSavedPosts()
            setSavedPosts(saved)
        } catch (err) {
            setError("Failed to load saved posts. Please try again.")
            console.error("Error loading saved posts:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const loadAppliedPosts = async () => {
        if (!isLoggedIn) return

        try {
            setIsLoading(true)
            setError(null)
            const applied = await fetchAppliedPosts()
            setAppliedPosts(applied)
        } catch (err) {
            setError("Failed to load applied posts. Please try again.")
            console.error("Error loading applied posts:", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === "explore") {
            loadPosts(false, 1)
            setCurrentPage(1)
        } else if (activeTab === "saved") {
            if (isLoggedIn) {
                loadSavedPosts()
            } else {
                setIsLoading(false)
            }
        } else if (activeTab === "applied") {
            if (isLoggedIn) {
                loadAppliedPosts()
            } else {
                setIsLoading(false)
            }
        }
    }, [activeTab, isLoggedIn])

    // Load posts when filters, sorting, or page changes (only for explore tab)
    useEffect(() => {
        if (activeTab === "explore") {
            loadPosts(false, currentPage)
        }
    }, [filters, sortBy, currentPage])

    const handlePostClick = (postId: string) => {
        router.push(`/post/${postId}`)
    }

    const handleRefresh = () => {
        if (activeTab === "explore") {
            loadPosts(true, currentPage)
        } else if (activeTab === "saved" && isLoggedIn) {
            loadSavedPosts()
        } else if (activeTab === "applied" && isLoggedIn) {
            loadAppliedPosts()
        }
    }

    const handleSortChange = (value: SortOption) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleFilterChange = (filterType: keyof Filters, value: string, checked: boolean) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: checked ? [...prev[filterType], value] : prev[filterType].filter((item) => item !== value),
        }))
        setCurrentPage(1)
    }

    const clearFilter = (filterType: keyof Filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: [],
        }))
        setCurrentPage(1)
    }

    const clearAllFilters = () => {
        setFilters({
            levels: [],
            fields: [],
            countries: [],
        })
        setCurrentPage(1)
    }

    const hasActiveFilters = filters.levels.length > 0 || filters.fields.length > 0 || filters.countries.length > 0

    const getStatusBadge = (status: AppliedPost["status"]) => {
        switch (status) {
            case "UNDER_REVIEW":
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300 rounded-none">
            UNDER REVIEW
          </span>
                )
            case "ACCEPTED":
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold border border-green-300 rounded-none">
            ACCEPTED
          </span>
                )
            case "REJECTED":
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold border border-red-300 rounded-none">
            REJECTED
          </span>
                )
        }
    }

    const renderLoginRequiredMessage = (tabName: string, description: string) => (
        <Card className="border border-gray-400 rounded-none">
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-4">
                    You need to be logged in to access your {tabName.toLowerCase()} {description}.
                </p>
                <Button
                    onClick={() => setIsLoggedIn(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none"
                >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Continue
                </Button>
            </CardContent>
        </Card>
    )

    const renderExploreContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Opportunities</h3>
                    <p className="text-gray-600">Fetching the latest academic opportunities...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Posts</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => loadPosts()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none">
                        Try Again
                    </Button>
                </div>
            )
        }

        return (
            <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold">Academic Opportunities</h2>
                        <span className="text-gray-600">
              {totalCount > 0
                  ? `${(currentPage - 1) * 5 + 1}-${Math.min(currentPage * 5, totalCount)} of ${totalCount}`
                  : "0"}{" "}
                            results
                            {hasActiveFilters && " (filtered)"}
            </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-400 hover:bg-gray-50 rounded-none bg-transparent"
                        >
                            {isRefreshing ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </Button>
                        <span className="text-sm">Sort by</span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-40 border-2 border-gray-400 rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="most-votes">Most Votes</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="deadline">Deadline</SelectItem>
                                <SelectItem value="level">Academic Level</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Post Cards */}
                <div className="space-y-0">
                    {posts.map((post, index) => (
                        <PostCard key={post.id} post={post} showTopBorder={index === 0} onClick={() => handlePostClick(post.id)} />
                    ))}
                </div>

                {posts.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {hasActiveFilters ? "No Opportunities Match Your Filters" : "No Opportunities Found"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {hasActiveFilters
                                ? "Try adjusting your filter criteria to see more results."
                                : "Try adjusting your search criteria or check back later."}
                        </p>
                        {hasActiveFilters && (
                            <Button
                                onClick={clearAllFilters}
                                variant="outline"
                                className="border-2 border-gray-400 hover:bg-gray-50 rounded-none bg-transparent"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={isLoading || isRefreshing}
                />
            </>
        )
    }

    const renderSavedContent = () => {
        if (!isLoggedIn) {
            return renderLoginRequiredMessage("Saved", "opportunities")
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Saved Opportunities</h3>
                    <p className="text-gray-600">Fetching your bookmarked opportunities...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                        <Bookmark className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Saved Posts</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={loadSavedPosts} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none">
                        Try Again
                    </Button>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Saved Opportunities</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{savedPosts.length} saved opportunities</span>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-400 hover:bg-gray-50 rounded-none bg-transparent"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {savedPosts.length === 0 ? (
                    <Card className="border border-gray-400 rounded-none">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                                <Bookmark className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Opportunities</h3>
                            <p className="text-gray-600 mb-4">
                                Academic opportunities you bookmark will appear here for easy access.
                            </p>
                            <Button
                                onClick={() => setActiveTab("explore")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none"
                            >
                                Explore Opportunities
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {savedPosts.map((saved, index) => (
                            <Card
                                key={saved.id}
                                className="border border-gray-400 border-t-2 border-b-2 rounded-none hover:bg-blue-50/30 cursor-pointer transition-all duration-200 hover:border-blue-500 group"
                                onClick={() => handlePostClick(saved.postId)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                                                {saved.title}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="font-medium">{saved.institutionName}</span>
                                                <span>•</span>
                                                <span>{saved.field}</span>
                                                <span>•</span>
                                                <span>{saved.level}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Deadline: {saved.deadline}</div>
                                            <div className="text-xs text-gray-500 mt-1">Saved {saved.savedAt.toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>{saved.votes} votes</span>
                                            <span>•</span>
                                            <span>{saved.commentsCount} comments</span>
                                        </div>
                                        <Bookmark className="w-4 h-4 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const renderAppliedContent = () => {
        if (!isLoggedIn) {
            return renderLoginRequiredMessage("Applied", "applications")
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Applications</h3>
                    <p className="text-gray-600">Fetching your application history...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Applications</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={loadAppliedPosts} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none">
                        Try Again
                    </Button>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Applied Opportunities</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{appliedPosts.length} applications</span>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-400 hover:bg-gray-50 rounded-none bg-transparent"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {appliedPosts.length === 0 ? (
                    <Card className="border border-gray-400 rounded-none">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-none mx-auto mb-4 flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                            <p className="text-gray-600 mb-4">Your application history will appear here once you start applying.</p>
                            <Button
                                onClick={() => setActiveTab("explore")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-none"
                            >
                                Find Opportunities
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {appliedPosts.map((applied) => (
                            <Card
                                key={applied.id}
                                className="border border-gray-400 border-t-2 border-b-2 rounded-none hover:bg-blue-50/30 cursor-pointer transition-all duration-200 hover:border-blue-500 group"
                                onClick={() => handlePostClick(applied.postId)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                                                {applied.title}
                                            </h3>
                                            <div className="flex items-center space-x-4 mb-2">
                                                <span className="text-sm text-gray-600">Applied {applied.appliedAt.toLocaleDateString()}</span>
                                                {getStatusBadge(applied.status)}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span className="font-medium">{applied.institutionName}</span>
                                                <span>•</span>
                                                <span>{applied.field}</span>
                                                <span>•</span>
                                                <span>{applied.level}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Deadline: {applied.deadline}</div>
                                            <div className="text-xs text-gray-500 mt-1">ID: {applied.applicationId}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">&#34;{applied.coverLetter.substring(0, 100)}...&#34;</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <span>{applied.votes} votes</span>
                                            <span>•</span>
                                            <span>{applied.commentsCount} comments</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {applied.status === "ACCEPTED" && "🎉 Congratulations!"}
                                            {applied.status === "UNDER_REVIEW" && "⏳ In Progress"}
                                            {applied.status === "REJECTED" && "❌ Not Selected"}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}


            {/* Browse Section */}
            {/*<div className="bg-gray-900 text-white py-8">*/}
            {/*    <div className="container mx-auto px-4">*/}
            {/*        <h1 className="text-4xl font-bold mb-6">Browse</h1>*/}
            {/*        <div className="flex items-center space-x-4">*/}
            {/*            <div className="flex-1 relative">*/}
            {/*                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />*/}
            {/*                <Input*/}
            {/*                    placeholder="Search for opportunities"*/}
            {/*                    className="pl-10 bg-white text-gray-900 border-0 h-12 text-lg rounded-none"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8 transition-all duration-200 hover:shadow-lg transform hover:scale-105 font-semibold">*/}
            {/*                Save*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*        <div className="flex justify-end mt-4">*/}
            {/*            <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline hover:no-underline">*/}
            {/*                Show advanced options*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Navigation Tabs */}
            <div className="bg-gray-800 border-b border-gray-600">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("explore")}
                            className={`py-4 border-b-2 transition-all duration-200 ${
                                activeTab === "explore"
                                    ? "text-white border-blue-500 font-semibold"
                                    : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                            }`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`py-4 border-b-2 transition-all duration-200 ${
                                activeTab === "saved"
                                    ? "text-white border-blue-500 font-semibold"
                                    : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                            }`}
                        >
                            Saved
                            {!isLoggedIn && <span className="ml-1 text-xs text-red-400">*</span>}
                        </button>
                        <button
                            onClick={() => setActiveTab("applied")}
                            className={`py-4 border-b-2 transition-all duration-200 ${
                                activeTab === "applied"
                                    ? "text-white border-blue-500 font-semibold"
                                    : "text-gray-400 border-transparent hover:text-white hover:border-gray-600"
                            }`}
                        >
                            Applied
                            {!isLoggedIn && <span className="ml-1 text-xs text-red-400">*</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className="w-80 space-y-6">
                        <Card className="border border-gray-400 shadow-sm rounded-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Opportunity Level */}
                                <Collapsible open={!levelCollapsed} onOpenChange={(open) => setLevelCollapsed(!open)}>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <CollapsibleTrigger asChild>
                                                <button className="flex items-center justify-between w-full text-left hover:text-blue-600 transition-colors duration-200">
                                                    <h4 className="font-medium text-gray-900">Level</h4>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-200 ${levelCollapsed ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            </CollapsibleTrigger>
                                            {filters.levels.length > 0 && (
                                                <button
                                                    onClick={() => clearFilter("levels")}
                                                    className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        <CollapsibleContent className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="undergraduate"
                                                    className="border-2"
                                                    checked={filters.levels.includes("Undergraduate")}
                                                    onCheckedChange={(checked) =>
                                                        handleFilterChange("levels", "Undergraduate", checked as boolean)
                                                    }
                                                />
                                                <label htmlFor="undergraduate" className="text-sm text-gray-700 cursor-pointer">
                                                    Undergraduate
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="masters"
                                                    className="border-2"
                                                    checked={filters.levels.includes("Masters")}
                                                    onCheckedChange={(checked) => handleFilterChange("levels", "Masters", checked as boolean)}
                                                />
                                                <label htmlFor="masters" className="text-sm text-gray-700 cursor-pointer">
                                                    Masters
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="phd"
                                                    className="border-2"
                                                    checked={filters.levels.includes("PhD")}
                                                    onCheckedChange={(checked) => handleFilterChange("levels", "PhD", checked as boolean)}
                                                />
                                                <label htmlFor="phd" className="text-sm text-gray-700 cursor-pointer">
                                                    PhD
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="postdoc"
                                                    className="border-2"
                                                    checked={filters.levels.includes("Postdoc")}
                                                    onCheckedChange={(checked) => handleFilterChange("levels", "Postdoc", checked as boolean)}
                                                />
                                                <label htmlFor="postdoc" className="text-sm text-gray-700 cursor-pointer">
                                                    Postdoc
                                                </label>
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>

                                {/* Field */}
                                <Collapsible open={!fieldCollapsed} onOpenChange={(open) => setFieldCollapsed(!open)}>
                                    <div className="space-y-4 mt-6 pt-6 border-t border-gray-400">
                                        <div className="flex items-center justify-between">
                                            <CollapsibleTrigger asChild>
                                                <button className="flex items-center justify-between w-full text-left hover:text-blue-600 transition-colors duration-200">
                                                    <h4 className="font-medium text-gray-900">Field</h4>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-200 ${fieldCollapsed ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            </CollapsibleTrigger>
                                            {filters.fields.length > 0 && (
                                                <button
                                                    onClick={() => clearFilter("fields")}
                                                    className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        <CollapsibleContent className="space-y-3">
                                            {/* Search box for fields */}
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    placeholder="Search fields..."
                                                    value={fieldSearch}
                                                    onChange={(e) => setFieldSearch(e.target.value)}
                                                    className="pl-8 h-8 text-sm border-2 border-gray-400 focus:border-blue-500 rounded-none"
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                {filteredFields.length > 0 ? (
                                                    filteredFields.map((field) => (
                                                        <div key={field} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`field-${field}`}
                                                                className="border-2"
                                                                checked={filters.fields.includes(field)}
                                                                onCheckedChange={(checked) => handleFilterChange("fields", field, checked as boolean)}
                                                            />
                                                            <label htmlFor={`field-${field}`} className="text-sm text-gray-700 cursor-pointer">
                                                                {field}
                                                            </label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-gray-500 py-2">No fields match your search</div>
                                                )}
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>

                                {/* Country */}
                                <Collapsible open={!countryCollapsed} onOpenChange={(open) => setCountryCollapsed(!open)}>
                                    <div className="space-y-4 mt-6 pt-6 border-t border-gray-400">
                                        <div className="flex items-center justify-between">
                                            <CollapsibleTrigger asChild>
                                                <button className="flex items-center justify-between w-full text-left hover:text-blue-600 transition-colors duration-200">
                                                    <h4 className="font-medium text-gray-900">Country</h4>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform duration-200 ${countryCollapsed ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                            </CollapsibleTrigger>
                                            {filters.countries.length > 0 && (
                                                <button
                                                    onClick={() => clearFilter("countries")}
                                                    className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        <CollapsibleContent className="space-y-3">
                                            {/* Search box for countries */}
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    placeholder="Search countries..."
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    className="pl-8 h-8 text-sm border-2 border-gray-400 focus:border-blue-500 rounded-none"
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto space-y-2">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map((country) => (
                                                        <div key={country} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`country-${country}`}
                                                                className="border-2"
                                                                checked={filters.countries.includes(country)}
                                                                onCheckedChange={(checked) =>
                                                                    handleFilterChange("countries", country, checked as boolean)
                                                                }
                                                            />
                                                            <label htmlFor={`country-${country}`} className="text-sm text-gray-700 cursor-pointer">
                                                                {country}
                                                            </label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-gray-500 py-2">No countries match your search</div>
                                                )}
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {activeTab === "explore" && renderExploreContent()}
                        {activeTab === "saved" && renderSavedContent()}
                        {activeTab === "applied" && renderAppliedContent()}
                    </div>
                </div>
            </div>

            {/* Messages Button */}
            <div className="fixed bottom-6 right-6">
                <Button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Messages
                </Button>
            </div>
        </div>
    )
}
