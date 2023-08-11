<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Upvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpvoteController extends Controller
{
    // public function upvote(Post $post, User $user, Upvote $upvote)
    // {
    //     // Get the authenticated user
    //     $user = Auth::user();

    //     // Check if the user has already upvoted this post
    //     if ($post->upvotes()->where('user_id', $user->id)->exists()) {
    //         return response()->json(['error' => 'You have already upvoted this post'], 422);
    //     }

    //     // Increment the upvotes count for the post
    //     $post->increment('upvotes');

    //     // Create a new Upvote record for the user and the post
    //     $user->upvotes()->create(['post_id' => $post->id]);

    //     return response()->json(['message' => 'Upvoted successfully']);
    // }
}
