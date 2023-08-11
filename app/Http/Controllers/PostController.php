<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Upvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(User $user)
    {
        if (Auth::id() !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $posts = Post::with('user', 'comments.user')->get();
        return response()->json($posts, 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $post = new Post();
        $post->title = $request->title;
        $post->content = $request->content;
        $post->user_id = Auth::id();
        $post->upvotes = 0;
        $post->save();

        return response()->json($post);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json($post, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, Post $post)
    {

        if (Auth::id() !== $post->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json($post);
    }

    public function upvote(Post $post)
    {
        // Increment the upvotes count for the post
        $post->increment('upvotes');

        return response()->json(['message' => 'Post upvoted successfully']);

        // $user = Auth::user();

        // // Check if the user has already upvoted this post
        // if ($post->upvotes()->where('user_id', $user->id)->exists()) {
        //     return response()->json(['error' => 'You have already upvoted this post'], 422);
        // }

        // // Increment the upvotes count for the post
        // $post->increment('upvotes');

        // // Create a new Upvote record for the user and the post
        // $user->upvotes()->create(['post_id' => $post->id]);

        // return response()->json(['message' => 'Upvoted successfully']);
    }
}
