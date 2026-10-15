<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientVisitItem extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'client_visit_id',
        'product_id',
        'stock_code',
        'notes',
        'position',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'position' => 'integer',
        ];
    }

    public function clientVisit(): BelongsTo
    {
        return $this->belongsTo(ClientVisit::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
