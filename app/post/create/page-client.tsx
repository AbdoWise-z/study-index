"use client"

import React, {Suspense} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import {ForwardRefEditor} from "@/components/md/ForwardRefEditor";
import {CreatePostForm, createPostSchema, countries, fields, levels} from "@/forms/create-post";
import axios from "axios";

// Zod schema for form validation


const initialForm: CreatePostForm = {
    title: "",
    institutionName: "",
    institutionLink: "",
    opportunityLink: "",
    content: "",
    country: "",
    field: "",
    level: "",
    tags: [],
}

export default function CreatePostPage() {
    const router = useRouter()
    const [form, setForm] = useState<CreatePostForm>(initialForm)
    const [newTag, setNewTag] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof CreatePostForm, string>>>({})

    const handleInputChange = (field: keyof CreatePostForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const validateForm = (): boolean => {
        try {
            createPostSchema.parse(form)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof CreatePostForm, string>> = {}

                // @ts-expect-error: make ts shut up
                for (const issue of error.errors) {
                    if (issue.path.length > 0) {
                        const field = issue.path[0] as keyof CreatePostForm
                        newErrors[field] = issue.message
                    }
                }

                setErrors(newErrors)
            } else {
                console.error('Unexpected error during form validation:', error)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Simulate API call
            const result = await axios.post("/api/post", form);
            router.push(`/post/${result.data.id}`)
        } catch (error) {
            console.error("Error creating post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && e.target === document.activeElement) {
            e.preventDefault()
            addTag()
        }
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
                        </div>
                        <h1 className="text-xl font-semibold">Create New Post</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <Card className="border border-gray-400 rounded-none">
                        <CardHeader className="border-b border-gray-400">
                            <CardTitle className="text-2xl font-bold text-gray-900">Create Academic Opportunity Post</CardTitle>
                            <p className="text-gray-600">
                                Share an academic opportunity with the community. All posts are subject to verification.
                            </p>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                                        Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="e.g., PhD Fellowship in Machine Learning - Stanford University"
                                        className={`border-2 rounded-none ${
                                            errors.title ? "border-red-400 focus:border-red-500" : "border-gray-400 focus:border-blue-500"
                                        }`}
                                    />
                                    {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                </div>

                                {/* Institution Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="institutionName" className="text-sm font-medium text-gray-900">
                                            Institution Name *
                                        </Label>
                                        <Input
                                            id="institutionName"
                                            value={form.institutionName}
                                            onChange={(e) => handleInputChange("institutionName", e.target.value)}
                                            placeholder="e.g., Stanford University"
                                            className={`border-2 rounded-none ${
                                                errors.institutionName
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-400 focus:border-blue-500"
                                            }`}
                                        />
                                        {errors.institutionName && <p className="text-sm text-red-600">{errors.institutionName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="institutionLink" className="text-sm font-medium text-gray-900">
                                            Institution Website *
                                        </Label>
                                        <Input
                                            id="institutionLink"
                                            value={form.institutionLink}
                                            onChange={(e) => handleInputChange("institutionLink", e.target.value)}
                                            placeholder="https://stanford.edu"
                                            className={`border-2 rounded-none ${
                                                errors.institutionLink
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-gray-400 focus:border-blue-500"
                                            }`}
                                        />
                                        {errors.institutionLink && <p className="text-sm text-red-600">{errors.institutionLink}</p>}
                                    </div>
                                </div>

                                {/* Opportunity Link */}
                                <div className="space-y-2">
                                    <Label htmlFor="opportunityLink" className="text-sm font-medium text-gray-900">
                                        Opportunity Application Link *
                                    </Label>
                                    <Input
                                        id="opportunityLink"
                                        value={form.opportunityLink}
                                        onChange={(e) => handleInputChange("opportunityLink", e.target.value)}
                                        placeholder="https://stanford.edu/apply/phd-fellowship"
                                        className={`border-2 rounded-none ${
                                            errors.opportunityLink
                                                ? "border-red-400 focus:border-red-500"
                                                : "border-gray-400 focus:border-blue-500"
                                        }`}
                                    />
                                    {errors.opportunityLink && <p className="text-sm text-red-600">{errors.opportunityLink}</p>}
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm font-medium text-gray-900">
                                            Country *
                                        </Label>
                                        <Select value={form.country} onValueChange={(value) => handleInputChange("country", value)}>
                                            <SelectTrigger
                                                className={`border-2 rounded-none ${errors.country ? "border-red-400" : "border-gray-400"}`}
                                            >
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((country) => (
                                                    <SelectItem key={country} value={country}>
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="field" className="text-sm font-medium text-gray-900">
                                            Field of Study *
                                        </Label>
                                        <Select value={form.field} onValueChange={(value) => handleInputChange("field", value)}>
                                            <SelectTrigger
                                                className={`border-2 rounded-none ${errors.field ? "border-red-400" : "border-gray-400"}`}
                                            >
                                                <SelectValue placeholder="Select field" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fields.map((field) => (
                                                    <SelectItem key={field} value={field}>
                                                        {field}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.field && <p className="text-sm text-red-600">{errors.field}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="level" className="text-sm font-medium text-gray-900">
                                            Academic Level *
                                        </Label>
                                        <Select value={form.level} onValueChange={(value) => handleInputChange("level", value)}>
                                            <SelectTrigger
                                                className={`border-2 rounded-none ${errors.level ? "border-red-400" : "border-gray-400"}`}
                                            >
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.level && <p className="text-sm text-red-600">{errors.level}</p>}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-900">Tags</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add a tag (press Enter)"
                                            className="flex-1 border-2 border-gray-400 focus:border-blue-500 rounded-none"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addTag}
                                            variant="outline"
                                            size="sm"
                                            className="border-2 border-gray-400 hover:bg-gray-50 rounded-none bg-transparent"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {form.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {form.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="text-blue-600 border-blue-400 rounded-none flex items-center space-x-1"
                                                >
                                                    <span>{tag}</span>
                                                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="content" className="text-sm font-medium text-gray-900">
                                        Opportunity Description *
                                    </Label>

                                    <Suspense fallback={null}>
                                        <div className={`prose-no-margin prose max-w-none min-h-[200px] border-2 rounded-none resize-none w-full p-0 ${
                                            errors.content ? "border-red-400 focus:border-red-500" : "border-gray-400 focus:border-blue-500"
                                        }`}>
                                            <ForwardRefEditor
                                                markdown={form.content}
                                                onChange={(e) => handleInputChange("content", e)}
                                                className={"p-0"}
                                            />
                                        </div>
                                    </Suspense>

                                    {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                                    <p className="text-sm text-gray-500">
                                        {form.content.length}/4000 characters. Be detailed and include all relevant information.
                                    </p>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-400">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="border-2 border-gray-400 hover:bg-gray-50 rounded-none"
                                    >
                                        Cancel
                                    </Button>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setForm(initialForm)}
                                            className="border-2 border-gray-400 hover:bg-gray-50 rounded-none"
                                        >
                                            Clear Form
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-none"
                                        >
                                            {isSubmitting ? "Creating Post..." : "Create Post"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Guidelines */}
                    <Card className="border border-gray-400 rounded-none mt-6">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Posting Guidelines</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>All posts are subject to verification by our moderation team</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Provide accurate and up-to-date information about the opportunity</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Include clear application deadlines and requirements</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Use relevant tags to help users find your opportunity</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Posts that violate our community guidelines will be removed</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
