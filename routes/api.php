<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
Route::get('users/{user_id}/posts', [PostController::class,'index']);
// Route::apiResource('users.posts', PostController::class);
// Route::apiResource('comments', CommentController::class);
// Route::get('users.posts', [PostController::class, 'index']);
// Route::get('/', [CommentController::class, 'index']);

// Route::get('/posts/{id}/comments', [CommentController::class, 'index']);

Route::post('/posts/{post}/upvote', [UpvoteController::class, 'upvote'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    // Route::apiResource('posts', PostController::class);
    Route::apiResource('users.posts', PostController::class);
    // Route::post('posts/{post_id}/comments', [CommentController::class, 'store']);
    // Route::post('/users/{user}/posts/{post}/comments', [CommentController::class, 'store']);
    
    // Route::get('/posts/{id}/comments', [CommentController::class, 'index']);
    // Route::apiResource('posts.comments', CommentController::class);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::post('/posts/{post}/upvote', [PostController::class, 'upvote']);

    // Route::get('users/{id}/posts', 'App\Http\Controllers\PostController@index');
    // Route::post('users/{id}/posts', 'App\Http\Controllers\PostController@store');
    // Route::put('users/{id}/posts/{post}', 'App\Http\Controllers\PostController@update');
    // Route::delete('users/{id}/posts/{post}', 'App\Http\Controllers\PostController@destroy');

    // // Routes for comments
    // Route::get('users/{id}/posts/{post}/comments', 'App\Http\Controllers\CommentController@index');
    // Route::post('users/{id}/posts/{post}/comments', 'App\Http\Controllers\CommentController@store');
});