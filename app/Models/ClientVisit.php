<?php

namespace App\Models;

use App\Enums\BuyingIntent;
use App\Enums\ProductPreference;
use App\Enums\VisitPurpose;
use App\Enums\VisitSource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientVisit extends Model
{
    use SoftDeletes;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'client_name',
        'client_phone',
        'client_email',
        'visit_date',
        'attended_by',
        'source',
        'source_details',
        'purpose',
        'occasion_details',
        'buying_intent',
        'product_preference',
        'budget',
        'summary',
        'next_steps',
        'follow_up_date',
        'follow_up_by',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'follow_up_date' => 'date',
            'source' => VisitSource::class,
            'purpose' => VisitPurpose::class,
            'buying_intent' => BuyingIntent::class,
            'product_preference' => ProductPreference::class,
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(ClientVisitItem::class)->orderBy('position');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeFollowUpDue(Builder $query): Builder
    {
        return $query->whereNotNull('follow_up_date')->whereDate('follow_up_date', '<=', now()->toDateString());
    }

    public function scopeFollowUpUpcoming(Builder $query, int $days = 7): Builder
    {
        return $query->whereNotNull('follow_up_date')
            ->whereDate('follow_up_date', '>=', now()->toDateString())
            ->whereDate('follow_up_date', '<=', now()->addDays($days)->toDateString());
    }
}
