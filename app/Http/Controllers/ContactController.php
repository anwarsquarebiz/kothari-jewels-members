<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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

    /**
     * Handle contact form submission.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:20',
            'product' => 'nullable|string|max:255',
            'visitWeek' => 'nullable|string|max:50',
            'preferredTimes' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:50',
        ]);

        $formData = $request->only([
            'name', 'email', 'mobile', 'product', 
            'visitWeek', 'preferredTimes', 'source'
        ]);

        // Send email to the specified email address
        $recipientEmail = 'anwar.squarebiz@gmail.com'; // Change this to your desired email
        Mail::to($recipientEmail)->send(new ContactFormMail($formData));

        return redirect()->back()->with('success', 'Thank you for your inquiry! We will get back to you shortly.');
    }
}



