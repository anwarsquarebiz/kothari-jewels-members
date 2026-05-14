<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesAssignableUserRoles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateAdminUserRequest extends FormRequest
{
    use ValidatesAssignableUserRoles;

    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['admin', 'manager']) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var User $user */
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['integer', Rule::in($this->assignableRoleIds())],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var User $target */
            $target = $this->route('user');
            if (! $this->boolean('is_active') && $target->id === $this->user()->id) {
                $validator->errors()->add('is_active', 'You cannot deactivate your own account.');
            }

            if ($target->id === $this->user()->id && $target->isAdmin()) {
                $roleIds = collect($this->input('role_ids', []))->map(fn ($id) => (int) $id);
                $stillAdmin = Role::query()
                    ->whereIn('id', $roleIds)
                    ->where('slug', 'admin')
                    ->exists();
                if (! $stillAdmin) {
                    $validator->errors()->add('role_ids', 'You cannot remove your own administrator role.');
                }
            }
        });
    }
}
