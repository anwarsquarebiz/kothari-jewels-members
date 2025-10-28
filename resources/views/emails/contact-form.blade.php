<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .field {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
            margin-bottom: 5px;
        }
        .field-value {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Submission</h2>
        <p>You have received a new contact form submission from the Kothari Jewels website.</p>
    </div>

    <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">{{ $formData['name'] }}</div>
    </div>

    <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value">{{ $formData['email'] }}</div>
    </div>

    <div class="field">
        <div class="field-label">Mobile Number:</div>
        <div class="field-value">{{ $formData['mobile'] }}</div>
    </div>

    @if($formData['product'])
    <div class="field">
        <div class="field-label">Product Interested In:</div>
        <div class="field-value">{{ $formData['product'] }}</div>
    </div>
    @endif

    @if($formData['visitWeek'])
    <div class="field">
        <div class="field-label">Desired Day of Visit:</div>
        <div class="field-value">{{ ucfirst($formData['visitWeek']) }}</div>
    </div>
    @endif

    @if($formData['preferredTimes'])
    <div class="field">
        <div class="field-label">Preferred Time of Visit:</div>
        <div class="field-value">{{ strtoupper($formData['preferredTimes']) }}</div>
    </div>
    @endif

    @if($formData['source'])
    <div class="field">
        <div class="field-label">How did they hear about us:</div>
        <div class="field-value">{{ ucfirst(str_replace('_', ' ', $formData['source'])) }}</div>
    </div>
    @endif

    <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 4px;">
        <p><strong>Submitted on:</strong> {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>

