<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        return Inertia::render('Home', [
            'title' => 'Welcome to Kothari Jewels',
            'description' => 'Discover our exquisite collection of jewelry'
        ]);
    }
}


