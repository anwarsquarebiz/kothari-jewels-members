<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum ProductPreference: string
{
    use HasOptions;

    case Ready = 'ready';
    case Custom = 'custom';
    case Both = 'both';
    case Undecided = 'undecided';

    public function label(): string
    {
        return match ($this) {
            self::Ready => 'Ready pieces',
            self::Custom => 'Custom order / Bespoke',
            self::Both => 'Both',
            self::Undecided => 'Undecided',
        };
    }
}
