<?php

namespace App\Http\Requests\Admin\Concerns;

use App\Models\Role;

trait ValidatesAssignableUserRoles
{
    /**
     * @return list<int>
     */
    protected function assignableRoleIds(): array
    {
        $actor = $this->user();
        $query = Role::query()->where('is_active', true);

        if ($actor && $actor->isManager() && ! $actor->isAdmin()) {
            $query->where('slug', 'user');
        }

        return $query->orderBy('name')->pluck('id')->map(fn ($id) => (int) $id)->all();
    }
}
