<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Products</title>
    <style>
        @page { margin: 14mm; }

        * { box-sizing: border-box; }

        @font-face {
            font-family: 'Bodoni Moda';
            font-style: normal;
            font-weight: normal;
            src: url('{{ $font }}') format('truetype');
        }

        body {
            font-family: 'Bodoni Moda', serif;
            color: #302c28;
            background: #f6f1e9;
            margin: 0;
            font-size: 11px;
        }

        .page {
            background: #f6f1e9;
            border: 0.8px solid #e0d5c6;
            padding: 6mm 8mm 8mm;
        }

        .logo-wrap { text-align: center; margin-bottom: 6mm; }
        .logo { height: 22mm; }

        h1 {
            font-family: 'Bodoni Moda', serif;
            font-weight: normal;
            font-size: 13px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2.6px;
            line-height: 1.5;
            margin: 0 6mm 2mm;
        }

        .underline {
            width: 22mm;
            margin: 0 auto 6mm;
            border-top: 0.8px solid #302c28;
        }

        .photos { width: 100%; border-collapse: collapse; margin-bottom: 8mm; }
        .photos td { vertical-align: middle; text-align: center; }
        .main { width: 64%; }
        .rule { width: 8%; border-left: 0.7px solid #cfc4b4; }
        .side { width: 28%; }
        .main img { width: 105mm; }
        .side img { width: 42mm; }
        .solo { text-align: center; margin-bottom: 8mm; }
        .solo img { width: 115mm; }

        .footer { width: 100%; border-collapse: collapse; }
        .footer td { vertical-align: middle; }
        .details-col { width: 64%; vertical-align: top; padding-right: 6mm; }
        .footer-rule { width: 6%; border-left: 0.7px solid #cfc4b4; }
        .price-col { width: 30%; text-align: center; }

        .section-label {
            font-size: 9px;
            letter-spacing: 1.8px;
            margin: 0 0 4mm;
        }

        .details { width: 100%; border-collapse: collapse; }
        .details td {
            font-size: 9.5px;
            padding: 1.8mm 0;
            border-bottom: 0.4px solid #e4d9cb;
            vertical-align: top;
        }
        .details .name {
            text-transform: uppercase;
            letter-spacing: 0.4px;
            width: 58%;
        }
        .details .spec { text-align: right; color: #5c564e; }

        .price-label {
            font-size: 9px;
            letter-spacing: 2px;
            margin: 0;
        }
        .price-amount {
            font-size: 15px;
            margin-top: 2mm;
        }
        .rupee {
            font-family: 'DejaVu Sans', sans-serif;
        }
    </style>
</head>
<body>
    @foreach ($products as $product)
        <div class="page" @if (! $loop->last) style="page-break-after: always;" @endif>
            @if ($logo)
                <div class="logo-wrap">
                    <img src="{{ $logo }}" class="logo" alt="Kothari 1937">
                </div>
            @endif

            <h1>{{ $product['title'] }}</h1>
            <div class="underline"></div>

            @if ($product['main'] && $product['secondary'])
                <table class="photos">
                    <tr>
                        <td class="main">
                            <img src="{{ $product['main'] }}" alt="">
                        </td>
                        <td class="rule"></td>
                        <td class="side">
                            <img src="{{ $product['secondary'] }}" alt="">
                        </td>
                    </tr>
                </table>
            @elseif ($product['main'])
                <div class="solo">
                    <img src="{{ $product['main'] }}" alt="">
                </div>
            @endif

            <table class="footer">
                <tr>
                    <td class="details-col">
                        @if (count($product['details']) > 0)
                            <div class="section-label">PRODUCT DETAILS</div>
                            <table class="details">
                                @foreach ($product['details'] as $detail)
                                    <tr>
                                        <td class="name">{{ $detail['title'] }}</td>
                                        <td class="spec">{{ $detail['subtitle'] }}</td>
                                    </tr>
                                @endforeach
                            </table>
                        @endif
                    </td>
                    @if ($product['price'])
                        <td class="footer-rule"></td>
                        <td class="price-col">
                            <div class="price-label">PRICE</div>
                            <div class="price-amount">
                                @if (str_starts_with($product['price'], '₹'))
                                    <span class="rupee">₹</span> {{ ltrim(substr($product['price'], strlen('₹'))) }}
                                @else
                                    {{ $product['price'] }}
                                @endif
                            </div>
                        </td>
                    @endif
                </tr>
            </table>
        </div>
    @endforeach
</body>
</html>
