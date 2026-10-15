<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum VisitPurpose: string
{
    use HasOptions;

    case Occasion = 'occasion';
    case General = 'general';
    case Gift = 'gift';

    public function label(): string
    {
        return match ($this) {
            self::Occasion => 'Specific occasion / Event',
            self::General => 'General purchase / Browsing',
            self::Gift => 'Gift',
        };
    }
}
