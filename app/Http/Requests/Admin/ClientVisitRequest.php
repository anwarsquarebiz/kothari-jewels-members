<?php

namespace App\Http\Requests\Admin;

use App\Enums\BuyingIntent;
use App\Enums\ProductPreference;
use App\Enums\VisitPurpose;
use App\Enums\VisitSource;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ClientVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user() !== null;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:50'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'visit_date' => ['required', 'date'],
            'attended_by' => ['required', 'string', 'max:255'],
            'source' => ['required', Rule::enum(VisitSource::class)],
            'source_details' => ['nullable', 'string', 'max:255'],
            'purpose' => ['required', Rule::enum(VisitPurpose::class)],
            'occasion_details' => ['nullable', 'string', 'max:255'],
            'buying_intent' => ['required', Rule::enum(BuyingIntent::class)],
            'product_preference' => ['required', Rule::enum(ProductPreference::class)],
            'budget' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:10000'],
            'next_steps' => ['nullable', 'string', 'max:10000'],
            'follow_up_date' => ['nullable', 'date'],
            'follow_up_by' => ['nullable', 'string', 'max:255'],
            'items' => ['nullable', 'array', 'max:100'],
            'items.*.product_id' => ['nullable', 'integer', 'exists:products,id'],
            'items.*.stock_code' => ['nullable', 'string', 'max:255'],
            'items.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                foreach ((array) $this->input('items', []) as $index => $item) {
                    if (empty($item['product_id']) && blank($item['stock_code'] ?? null)) {
                        $validator->errors()->add(
                            "items.{$index}.stock_code",
                            'Select a product or enter a stock code.',
                        );
                    }
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_name.required' => 'The client name is required.',
            'visit_date.required' => 'The date of visit is required.',
            'attended_by.required' => 'Please enter who attended the client.',
            'source.required' => 'Please select the source of visit.',
            'purpose.required' => 'Please select the purpose of visit.',
            'buying_intent.required' => 'Please assess the buying intent.',
            'product_preference.required' => 'Please select a product preference.',
        ];
    }
}
