<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum VisitSource: string
{
    use HasOptions;

    case WalkIn = 'walk_in';
    case Referral = 'referral';
    case ExistingClient = 'existing_client';
    case SocialMedia = 'social_media';
    case Website = 'website';
    case Advertisement = 'advertisement';
    case Event = 'event';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::WalkIn => 'Walk-in',
            self::Referral => 'Referral',
            self::ExistingClient => 'Existing client',
            self::SocialMedia => 'Instagram / Social media',
            self::Website => 'Website',
            self::Advertisement => 'Advertisement',
            self::Event => 'Event / Exhibition',
            self::Other => 'Other',
        };
    }
}
