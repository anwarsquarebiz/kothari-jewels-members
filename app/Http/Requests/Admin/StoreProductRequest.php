<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'sku' => 'required|string|max:100|unique:products,sku',
            'currency' => 'required|string|size:3',
            'price' => 'required|numeric|min:0',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'user_access' => 'nullable|array',
            'user_access.*' => 'exists:users,id',
            'show_in_landing_rail' => 'nullable|boolean',
            'rail_position' => 'nullable|integer|min:0',
            'show_in_landing_jewellery' => 'nullable|boolean',
            'jewellery_position' => 'nullable|integer|min:0',
            'landing_stones' => 'nullable|array',
            'landing_stones.*' => 'string|in:emerald,ruby,pearl,diamond,onyx',
            'is_landing_feature' => 'nullable|boolean',
            'landing_feature_bg' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The product title is required.',
            'slug.unique' => 'A product with this slug already exists.',
            'sku.required' => 'The SKU is required.',
            'sku.unique' => 'A product with this SKU already exists.',
            'currency.required' => 'The currency is required.',
            'currency.size' => 'The currency must be exactly 3 characters.',
            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
            'categories.*.exists' => 'One or more selected categories do not exist.',
            'user_access.*.exists' => 'One or more selected users do not exist.',
        ];
    }
}
