<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function index()
    {
        return Inertia::render('Contact', [
            'title' => 'Contact Us',
            'description' => 'Get in touch with us'
        ]);
    }
}


