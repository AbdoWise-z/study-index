import axios from "axios";



export async function UpVote(post_id: string){
    await axios.post(`/api/post/upvote`, {post_id});
}

export async function DownVote(post_id: string){
    await axios.post(`/api/post/downvote`, {post_id});
}

export async function UpVoteComment(post_id: string, comment_id: string){
    await axios.post(`/api/comment/upvote`, {comment_id});
}

export async function DownVoteComment(post_id: string, comment_id: string){
    await axios.post(`/api/comment/downvote`, {comment_id});
}