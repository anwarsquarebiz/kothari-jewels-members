<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    /**
     * Display the about page.
     */
    public function index()
    {
        return Inertia::render('About', [
            'title' => 'About Kothari Jewels',
            'description' => 'Learn more about our heritage and craftsmanship'
        ]);
    }
}


