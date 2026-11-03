<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Products</title>
    <style>
        @page { margin: 32mm 14mm 14mm 14mm; }

        * { box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: #2b2926;
            font-size: 11px;
            line-height: 1.4;
        }

        header {
            position: fixed;
            top: -24mm;
            left: 0;
            right: 0;
            height: 20mm;
            text-align: center;
        }

        .logo { height: 18mm; }

        .product {
            page-break-inside: avoid;
            margin-bottom: 8mm;
        }

        h1 {
            font-family: 'DejaVu Serif', serif;
            font-size: 20px;
            font-weight: normal;
            text-align: center;
            margin: 0 0 5mm;
        }

        h2 {
            font-size: 10px;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            margin: 4mm 0 2mm;
        }

        .gallery {
            width: 100%;
            border-collapse: separate;
            border-spacing: 3mm;
            margin: 0 auto 2mm;
        }

        .gallery td {
            text-align: center;
            vertical-align: middle;
            border: 0.4px solid #e4ddd2;
            padding: 2mm;
        }

        .details {
            width: 100%;
            border-collapse: collapse;
        }

        .details td {
            border-top: 0.4px solid #e4ddd2;
            padding: 2.2mm 0;
            vertical-align: top;
        }

        .details .label {
            width: 38%;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .details .value {
            text-align: right;
            color: #5c564e;
        }
    </style>
</head>
<body>
    <header>
        @if ($logo)
            <img src="{{ $logo }}" class="logo" alt="Kothari 1937">
        @endif
    </header>

    @foreach ($products as $product)
        @php
            $imageHeight = match ($product['fit']) {
                'single' => '80mm',
                'pair' => '70mm',
                'triple' => '62mm',
                default => '54mm',
            };
        @endphp
        <div class="product">
            <h1>{{ $product['title'] }}</h1>

            @foreach ($product['image_rows'] as $row)
                <table class="gallery" align="center">
                    <tr>
                        @foreach ($row as $src)
                            <td>
                                <img src="{{ $src }}" alt="" style="height: {{ $imageHeight }};">
                            </td>
                        @endforeach
                    </tr>
                </table>
            @endforeach

            @if (count($product['details']) > 0)
                <h2>Product Details</h2>
                <table class="details">
                    @foreach ($product['details'] as $detail)
                        <tr>
                            <td class="label">{{ $detail['title'] }}</td>
                            <td class="value">{{ $detail['subtitle'] }}</td>
                        </tr>
                    @endforeach
                </table>
            @endif
        </div>
    @endforeach
</body>
</html>
