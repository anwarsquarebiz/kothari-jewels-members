<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Client Visit Summary - {{ $visit->client_name }}</title>
    <style>
        @page { margin: 28mm 16mm 20mm 16mm; }

        * { box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #2b2926;
            line-height: 1.45;
        }

        header {
            position: fixed;
            top: -22mm;
            left: 0;
            right: 0;
            height: 18mm;
            border-bottom: 0.6px solid #b9a789;
        }

        footer {
            position: fixed;
            bottom: -14mm;
            left: 0;
            right: 0;
            height: 10mm;
            border-top: 0.6px solid #d9d2c5;
            font-size: 8px;
            color: #8a8378;
            padding-top: 2mm;
        }

        footer .page-number:after { content: counter(page) " / " counter(pages); }

        .header-table, .footer-table { width: 100%; border-collapse: collapse; }
        .header-table td, .footer-table td { vertical-align: middle; padding: 0; }

        .logo { height: 15mm; }

        .doc-title {
            font-family: 'DejaVu Serif', serif;
            font-size: 15px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #2b2926;
            text-align: right;
        }

        .doc-subtitle {
            font-size: 7.5px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #8a8378;
            text-align: right;
            margin-top: 1mm;
        }

        .meta {
            width: 100%;
            margin-bottom: 5mm;
            font-size: 8.5px;
            color: #6e675d;
        }

        .section { margin-bottom: 6mm; page-break-inside: avoid; }

        .section-title {
            font-size: 9px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #2b2926;
            font-weight: bold;
            padding-bottom: 1.5mm;
            margin-bottom: 3mm;
            border-bottom: 0.6px solid #b9a789;
        }

        .section-title .num { color: #b9a789; }

        .grid { width: 100%; border-collapse: separate; border-spacing: 0 2.5mm; margin-top: -2.5mm; }
        .grid td { vertical-align: top; width: 50%; padding-right: 4mm; }

        .label {
            font-size: 7px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #8a8378;
            margin-bottom: 1mm;
        }

        .value {
            border: 0.6px solid #d9d2c5;
            background: #faf8f4;
            padding: 2mm 3mm;
            min-height: 6mm;
            border-radius: 1.5mm;
        }

        .value.multiline { min-height: 16mm; white-space: pre-line; }

        .empty { color: #b3ada3; }

        .choices { margin: 0; padding: 0; }
        .choice { display: inline-block; margin: 0 4mm 1mm 0; color: #9b958b; }
        .choice.selected { color: #2b2926; font-weight: bold; }
        .dot {
            display: inline-block;
            width: 2.6mm;
            height: 2.6mm;
            border-radius: 1.3mm;
            border: 0.6px solid #9b958b;
            margin-right: 1mm;
            vertical-align: -0.8mm;
        }
        .choice.selected .dot { background: #2b2926; border-color: #2b2926; }

        .pieces { width: 100%; border-collapse: collapse; }
        .pieces th {
            font-size: 7px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #8a8378;
            font-weight: normal;
            text-align: left;
            padding: 1.5mm 2mm;
            border-bottom: 0.6px solid #d9d2c5;
        }
        .pieces td {
            padding: 2mm;
            border-bottom: 0.6px solid #ece7de;
            vertical-align: middle;
        }
        .pieces tr { page-break-inside: avoid; }
        .pieces .idx { width: 8mm; color: #b9a789; font-weight: bold; }
        .pieces .thumb-cell { width: 18mm; }
        .thumb {
            width: 15mm;
            height: 15mm;
            border: 0.6px solid #ece7de;
            border-radius: 1mm;
        }
        .thumb-placeholder {
            width: 15mm;
            height: 15mm;
            border: 0.6px dashed #d9d2c5;
            border-radius: 1mm;
        }
        .sku { font-family: 'DejaVu Sans Mono', monospace; font-size: 9px; }
        .muted { color: #8a8378; font-size: 8px; }
        .manual-tag {
            font-size: 6.5px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #8a8378;
            border: 0.6px solid #d9d2c5;
            padding: 0.3mm 1.2mm;
            border-radius: 1mm;
        }
    </style>
</head>
<body>
    @php
        $field = fn ($value) => filled($value) ? e($value) : '<span class="empty">&mdash;</span>';
        $date = fn ($value) => $value ? $value->format('d / m / Y') : null;
        $choices = function (array $options, $selected) {
            $html = '<div class="choices">';
            foreach ($options as $option) {
                $isSelected = $selected && $selected->value === $option['value'];
                $html .= '<span class="choice'.($isSelected ? ' selected' : '').'"><span class="dot"></span>'.e($option['label']).'</span>';
            }

            return $html.'</div>';
        };
    @endphp

    <header>
        <table class="header-table">
            <tr>
                <td style="width: 40%;">
                    @if ($logo)
                        <img src="{{ $logo }}" class="logo" alt="Kothari 1937">
                    @else
                        <span class="doc-title" style="text-align: left;">Kothari</span>
                    @endif
                </td>
                <td>
                    <div class="doc-title">Client Visit Summary</div>
                    <div class="doc-subtitle">Post-appointment / Internal management report</div>
                </td>
            </tr>
        </table>
    </header>

    <footer>
        <table class="footer-table">
            <tr>
                <td>Kothari 1937 &middot; Confidential &middot; Internal use only</td>
                <td style="text-align: center;">Generated {{ now()->format('d M Y, h:i A') }}</td>
                <td style="text-align: right;">Page <span class="page-number"></span></td>
            </tr>
        </table>
    </footer>

    <main>
        <table class="meta">
            <tr>
                <td>Record #{{ str_pad((string) $visit->id, 5, '0', STR_PAD_LEFT) }}</td>
                <td style="text-align: right;">
                    @if ($visit->creator)
                        Recorded by {{ $visit->creator->name }} on {{ $visit->created_at?->format('d M Y') }}
                    @endif
                </td>
            </tr>
        </table>

        <div class="section">
            <div class="section-title"><span class="num">01</span> / Visit Details</div>
            <table class="grid">
                <tr>
                    <td>
                        <div class="label">Client Name</div>
                        <div class="value">{!! $field($visit->client_name) !!}</div>
                    </td>
                    <td>
                        <div class="label">Date of Visit</div>
                        <div class="value">{!! $field($date($visit->visit_date)) !!}</div>
                    </td>
                </tr>
                @if ($visit->client_phone || $visit->client_email)
                    <tr>
                        <td>
                            <div class="label">Phone</div>
                            <div class="value">{!! $field($visit->client_phone) !!}</div>
                        </td>
                        <td>
                            <div class="label">Email</div>
                            <div class="value">{!! $field($visit->client_email) !!}</div>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td>
                        <div class="label">Attended By</div>
                        <div class="value">{!! $field($visit->attended_by) !!}</div>
                    </td>
                    <td>
                        <div class="label">Source of Visit</div>
                        <div class="value">{!! $field($visit->source?->label()) !!}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Referred By / Source Details</div>
                        <div class="value">{!! $field($visit->source_details) !!}</div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title"><span class="num">02</span> / Customer Profile &amp; Buying Intent</div>
            <table class="grid">
                <tr>
                    <td colspan="2">
                        <div class="label">Purpose of Visit</div>
                        {!! $choices($options['purposes'], $visit->purpose) !!}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Occasion &amp; Date</div>
                        <div class="value">{!! $field($visit->occasion_details) !!}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Assessment of Buying Intent</div>
                        {!! $choices($options['buying_intents'], $visit->buying_intent) !!}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Product Preference</div>
                        {!! $choices($options['product_preferences'], $visit->product_preference) !!}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Budget / Price Range Discussed (INR)</div>
                        <div class="value">{!! $field($visit->budget) !!}</div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section" style="page-break-inside: auto;">
            <div class="section-title"><span class="num">03</span> / Pieces of Interest</div>
            @if ($items->isEmpty())
                <div class="value"><span class="empty">No pieces recorded.</span></div>
            @else
                <table class="pieces">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th>Stock Code / SKU</th>
                            <th>Piece</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($items as $index => $item)
                            <tr>
                                <td class="idx">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</td>
                                <td class="thumb-cell">
                                    @if ($item['image'])
                                        <img src="{{ $item['image'] }}" class="thumb" alt="">
                                    @else
                                        <div class="thumb-placeholder"></div>
                                    @endif
                                </td>
                                <td class="sku">{{ $item['sku'] }}</td>
                                <td>
                                    @if ($item['title'])
                                        <div>{{ $item['title'] }}</div>
                                        @if ($item['categories'])
                                            <div class="muted">{{ $item['categories'] }}</div>
                                        @endif
                                    @else
                                        <span class="manual-tag">Manual entry</span>
                                    @endif
                                    @if ($item['notes'])
                                        <div class="muted" style="margin-top: 0.8mm;">Note: {{ $item['notes'] }}</div>
                                    @endif
                                </td>
                                <td style="text-align: right;">{{ $item['price'] ?? '' }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        <div class="section">
            <div class="section-title"><span class="num">04</span> / Outcome &amp; Follow-up</div>
            <table class="grid">
                <tr>
                    <td colspan="2">
                        <div class="label">Visit Summary / Important Observations</div>
                        <div class="value multiline">{!! $field($visit->summary) !!}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="label">Next Steps / Action Required</div>
                        <div class="value multiline">{!! $field($visit->next_steps) !!}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="label">Follow-up Date</div>
                        <div class="value">{!! $field($date($visit->follow_up_date)) !!}</div>
                    </td>
                    <td>
                        <div class="label">Follow-up By</div>
                        <div class="value">{!! $field($visit->follow_up_by) !!}</div>
                    </td>
                </tr>
            </table>
        </div>
    </main>
</body>
</html>
