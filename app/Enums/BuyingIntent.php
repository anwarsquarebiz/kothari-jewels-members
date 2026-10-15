<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum BuyingIntent: string
{
    use HasOptions;

    case Serious = 'serious';
    case Interested = 'interested';
    case Exploring = 'exploring';

    public function label(): string
    {
        return match ($this) {
            self::Serious => 'Serious / Ready to purchase',
            self::Interested => 'Interested / Considering',
            self::Exploring => 'Exploring / Browsing',
        };
    }
}
