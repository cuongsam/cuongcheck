<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Models\Lesson;
use App\Models\SocialPost;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('q')) {
            return redirect()->route('admin.user.index', ['q' => $request->get('q')]);
        }

        $totalUsers = User::count();
        $totalCategories = Category::count();
        $totalLessons = Lesson::count();
        $totalStudents = User::where(['type' => User::TYPE_STUDENT])->count();
        $totalSocialPosts = SocialPost::where(['status'  => SocialPost::TYPE_APPROVED])->count();
      

        return view('admin.dashboard.index', compact('totalUsers', 'totalCategories', 'totalLessons', 'totalStudents', 'totalSocialPosts'));
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
