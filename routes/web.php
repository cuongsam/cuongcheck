<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\LevelController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\Logout;
use App\Http\Controllers\Client\AuthController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\Client\PracticeController;
use App\Http\Controllers\Client\SocialPostController;
use App\Http\Controllers\Admin\CheckPracticeController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;


Route::get('/admin/login', [LoginController::class, 'loginPage'])->name('admin.login-page');
Route::post('/admin/login', [LoginController::class, 'login'])->name('admin.submit-login');
Route::get('/admin/logout', Logout::class)->name('admin.logout');

Route::prefix('admin')->name('admin.')->middleware(AdminMiddleware::class)->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard.index');
    });

    

    Route::prefix('dashboard')->name('dashboard.')->controller(DashboardController::class)->group(function () {
        Route::get('index', 'index')->name('index');
    });
    Route::prefix('post')->name('post.')->controller(CheckPracticeController::class)->group(function () {
        Route::get('index', 'showPost')->name('index');
        Route::post('approve/{postId}', 'approvePost')->name('approve');
        Route::delete('reject/{postId}', 'rejectPost')->name('reject');
    });

    Route::prefix('user')->name('user.')->controller(UserController::class)->group(function () {
        Route::get('index', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{id}', 'edit')->name('edit');
        Route::post('update/{id}', 'update')->name('update');
        Route::get('block-user/{id}', 'blockUser')->name('block-user');
        Route::get('unblock-user/{id}', 'unblockUser')->name('unblock-user');
    });

    Route::prefix('category')->name('category.')->controller(CategoryController::class)->group(function () {
        Route::get('index', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{id}', 'edit')->name('edit');
        Route::post('update/{id}', 'update')->name('update');
        Route::get('hide-category/{id}', 'hideCategory')->name('hide-category');
        Route::get('show-category/{id}', 'showCategory')->name('show-category');
    });

    Route::prefix('lesson')->name('lesson.')->controller(LessonController::class)->group(function () {
        Route::get('index', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{id}', 'edit')->name('edit');
        Route::post('update/{id}', 'update')->name('update');
        Route::get('destroy/{id}', 'destroy')->name('destroy');
    });

    Route::prefix('level')->name('level.')->controller(LevelController::class)->group(function () {
        Route::get('index', 'index')->name('index');
        Route::get('create', 'create')->name('create');
        Route::post('store', 'store')->name('store');
        Route::get('edit/{id}', 'edit')->name('edit');
        Route::post('update/{id}', 'update')->name('update');
    });

    Route::post('/upload-image', [ImageController::class, 'upload'])->name('image.upload');
});

Route::prefix('api')->group(function () {
    Route::get('/get-categories', [HomeController::class, 'getCategories']);
    Route::get('/get-nationals', [HomeController::class, 'getNationals']);
    Route::get('/get-levels', [HomeController::class, 'getLevels']);
    Route::get('/get-lesson/{slug}', [HomeController::class, 'getLessonData']);
    Route::get('/get-lessons', [HomeController::class, 'getLessons']);

    Route::post('/user/login', [AuthController::class, 'login'])->name('user.login');
    Route::post('/user/logout', [AuthController::class, 'logout'])->name('user.logout');
    Route::post('/user/register', [AuthController::class, 'register'])->name('user.register');

    Route::prefix('user')->name('user.')->middleware('auth:sanctum')->group(function() {
        Route::get('/user-info', [AuthController::class, 'getUserInfo'])->name('userInfo');
        Route::post('/update', [AuthController::class, 'update'])->name('update');

        Route::get('/practice-histories', [PracticeController::class, 'getPracticeHistories'])->name('getPracticeHistories');
        Route::post('/save-practice', [PracticeController::class, 'savePractice'])->name('savePractice');
        Route::post('/remove-practice-history', [PracticeController::class, 'removePracticeHistory'])->name('removePracticeHistory');
        Route::post('/share-practice', [PracticeController::class, 'sharePractice'])->name('sharePractice');
        


        Route::get('/social-post', [SocialPostController::class, 'getSocialPost'])->name('getSocialPost');
        Route::post('/like-post', [SocialPostController::class, 'likePost'])->name('likePost');
        Route::get('/get-post-comments', [SocialPostController::class, 'getSocialPostComments'])->name('getSocialPostComments');
        Route::post('/post-comment', [SocialPostController::class, 'addSocialPostComment'])->name('postComment');
    });
});

Route::get('/pusher',function (){
    return view('pusher');
});


Route::get('/{any}', function(){
    return view('frontend.app');
})->where('any', '.*');
