<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportProductsRequest;
use App\Services\ProductImport\ProductImportService;
use App\Services\ProductImport\SpreadsheetWorkbook;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminProductImportController extends Controller
{
    public function __construct(
        private ProductImportService $imports,
        private SpreadsheetWorkbook $workbooks,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Import', [
            'result' => session('import_result'),
            'flashSuccess' => session('success'),
            'flashError' => session('error'),
        ]);
    }

    public function store(ImportProductsRequest $request): RedirectResponse
    {
        $spreadsheetPath = $this->storeUpload($request->file('file'));
        $imagesZipPath = $request->file('images_zip')
            ? $this->storeUpload($request->file('images_zip'))
            : null;

        try {
            $result = $this->imports->import($spreadsheetPath, $imagesZipPath);
        } catch (RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to import products: '.$e->getMessage());
        } finally {
            @unlink($spreadsheetPath);
            if ($imagesZipPath) {
                @unlink($imagesZipPath);
            }
        }

        $message = sprintf(
            'Import finished: %d created, %d updated, %d errors, %d warnings.',
            $result->created,
            $result->updated,
            count($result->errors),
            count($result->warnings)
        );

        return redirect()
            ->route('admin.products.import')
            ->with('success', $message)
            ->with('import_result', $result->toArray());
    }

    public function template(): BinaryFileResponse
    {
        $path = $this->workbooks->templatePath();

        return response()
            ->download($path, 'product-import-template.xlsx')
            ->deleteFileAfterSend(true);
    }

    public function export(): BinaryFileResponse
    {
        $path = $this->workbooks->exportPath();

        return response()
            ->download($path, 'products-export.xlsx')
            ->deleteFileAfterSend(true);
    }

    private function storeUpload(UploadedFile $file): string
    {
        $directory = storage_path('app/product-imports');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = uniqid('upload_', true).'.'.strtolower($file->getClientOriginalExtension());
        $file->move($directory, $filename);

        return $directory.DIRECTORY_SEPARATOR.$filename;
    }
}
