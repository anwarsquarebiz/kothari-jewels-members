<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_visits', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('client_phone', 50)->nullable();
            $table->string('client_email')->nullable();
            $table->date('visit_date');
            $table->string('attended_by');
            $table->string('source', 50);
            $table->string('source_details')->nullable();
            $table->string('purpose', 50);
            $table->string('occasion_details')->nullable();
            $table->string('buying_intent', 50);
            $table->string('product_preference', 50);
            $table->string('budget')->nullable();
            $table->text('summary')->nullable();
            $table->text('next_steps')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->string('follow_up_by')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('visit_date');
            $table->index('follow_up_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_visits');
    }
};
