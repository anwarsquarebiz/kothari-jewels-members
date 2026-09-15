<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

class ImportProductsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:51200',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $value instanceof UploadedFile) {
                        return;
                    }

                    $extension = strtolower($value->getClientOriginalExtension());
                    if (! in_array($extension, ['xlsx', 'csv', 'zip'], true)) {
                        $fail('The file must be an .xlsx, .csv, or .zip upload.');
                    }
                },
            ],
            'images_zip' => [
                'nullable',
                'file',
                'max:51200',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $value instanceof UploadedFile) {
                        return;
                    }

                    if (strtolower($value->getClientOriginalExtension()) !== 'zip') {
                        $fail('The images file must be a .zip upload.');
                    }
                },
            ],
        ];
    }
}
