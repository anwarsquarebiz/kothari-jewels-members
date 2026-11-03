<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductShare;
use Illuminate\Http\Request;

class ProductShareExportController extends Controller
{
    public function __invoke(Request $request, ProductShare $share)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:15'],
            'ids.*' => ['integer', 'distinct', 'exists:products,id'],
            'format' => ['required', 'in:pdf,image'],
        ]);

        $ids = array_map(intval(...), $validated['ids']);

        if ($validated['format'] === 'pdf') {
            return $share->pdf($ids)->download('products-share.pdf');
        }

        return response($share->jpeg($ids), 200, [
            'Content-Type' => 'image/jpeg',
            'Content-Disposition' => 'attachment; filename="products-share.jpg"',
        ]);
    }
}
