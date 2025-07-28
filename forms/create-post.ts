import { z } from "zod"


export const fields = [
    "Computer Science",
    "Engineering",
    "Physics",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Medicine",
    "Psychology",
    "Economics",
    "Business",
    "Environmental Science",
    "Biomedical Sciences",
    "Artificial Intelligence",
    "Data Science",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Materials Science",
    "Neuroscience",
    "Biotechnology",
]

export const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Netherlands",
    "Switzerland",
    "Sweden",
    "Denmark",
    "Norway",
    "Finland",
    "Australia",
    "New Zealand",
    "Japan",
    "South Korea",
    "Singapore",
    "China",
    "India",
    "Brazil",
    "Mexico",
    "Argentina",
    "Chile",
    "Spain",
    "Italy",
    "Portugal",
    "Belgium",
    "Austria",
    "Ireland",
    "South Africa",
    "Egypt",
    "Turkey",
    "Russia",
    "Poland",
]

export const levels = ["Undergraduate", "Masters", "PhD", "Postdoc", "Research Position", "Internship", "Exchange Program"]

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    institutionName: z
        .string()
        .min(1, "Institution name is required")
        .max(100, "Institution name must be less than 100 characters"),
    institutionLink: z.string().min(1, "Institution link is required").url("Please enter a valid URL"),
    opportunityLink: z.string().min(1, "Opportunity link is required").url("Please enter a valid URL"),
    content: z.string().min(1, "Content is required").max(2000, "Content must be less than 2000 characters"),
    country: z.string().min(1, "Country is required"),
    field: z.string().min(1, "Field is required"),
    level: z.string().min(1, "Level is required"),
    tags: z.array(z.string()).default([]),
})

export type CreatePostForm = z.infer<typeof createPostSchema>