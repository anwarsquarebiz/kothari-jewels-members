import DatePicker from '@/components/client-visits/DatePicker';
import ProductPicker from '@/components/client-visits/ProductPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type ClientVisitItem, type ClientVisitOptions, type Option } from '@/types/client-visits';
import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

export interface ClientVisitFormData {
    client_name: string;
    client_phone: string;
    client_email: string;
    visit_date: string;
    attended_by: string;
    source: string;
    source_details: string;
    purpose: string;
    occasion_details: string;
    buying_intent: string;
    product_preference: string;
    budget: string;
    summary: string;
    next_steps: string;
    follow_up_date: string;
    follow_up_by: string;
    items: ClientVisitItem[];
}

interface Props {
    options: ClientVisitOptions;
    initialData: ClientVisitFormData;
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
}

function Section({ number, title, description, children }: { number: string; title: string; description?: string; children: ReactNode }) {
    return (
        <Card className="gap-4">
            <CardHeader>
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                    <span className="text-foreground">{number}</span> — {title}
                </CardTitle>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </CardHeader>
            <CardContent className="space-y-5">{children}</CardContent>
        </Card>
    );
}

function Field({ label, htmlFor, error, required, className, children }: { label: string; htmlFor?: string; error?: string; required?: boolean; className?: string; children: ReactNode }) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={htmlFor} className="text-muted-foreground">
                {label}
                {required && <span className="text-red-600"> *</span>}
            </Label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

function ChoiceGroup({ name, options, value, onChange, error }: { name: string; options: Option[]; value: string; onChange: (value: string) => void; error?: string }) {
    return (
        <RadioGroup value={value} onValueChange={onChange} className="grid gap-2 sm:grid-cols-2" aria-invalid={!!error}>
            {options.map((option) => {
                const id = `${name}-${option.value}`;
                return (
                    <Label
                        key={option.value}
                        htmlFor={id}
                        className={cn(
                            'hover:bg-accent/50 flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 font-normal transition-colors',
                            value === option.value && 'border-foreground bg-accent/40',
                        )}
                    >
                        <RadioGroupItem id={id} value={option.value} />
                        {option.label}
                    </Label>
                );
            })}
        </RadioGroup>
    );
}

export default function ClientVisitForm({ options, initialData, action, method, submitLabel, cancelHref }: Props) {
    const { data, setData, post, put, processing, errors, transform } = useForm<ClientVisitFormData>(initialData);
    const fieldErrors = errors as Record<string, string>;

    transform((form) => ({
        ...form,
        items: form.items.map((item) => {
            const payload: Record<string, unknown> = {
                product_id: item.product_id,
                stock_code: item.product_id ? null : item.stock_code,
                notes: item.notes,
            };

            if (!item.product_id) {
                payload.remove_image = item.remove_image ? 1 : 0;
                if (!item.remove_image && item.image) {
                    payload.existing_image = item.image;
                }
                if (item.image_file instanceof File) {
                    payload.image = item.image_file;
                }
            }

            return payload;
        }),
    }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const options = { forceFormData: true };
        if (method === 'put') {
            put(action, options);
        } else {
            post(action, options);
        }
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {hasErrors && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    Please fix the highlighted fields below.
                </div>
            )}

            <Section number="01" title="Visit Details">
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Client Name" htmlFor="client_name" error={errors.client_name} required>
                        <Input
                            id="client_name"
                            value={data.client_name}
                            onChange={(e) => setData('client_name', e.target.value)}
                            placeholder="Full name"
                            className={cn(errors.client_name && 'border-red-500')}
                        />
                    </Field>
                    <Field label="Date of Visit" htmlFor="visit_date" error={errors.visit_date} required>
                        <DatePicker id="visit_date" value={data.visit_date} onChange={(value) => setData('visit_date', value)} invalid={!!errors.visit_date} />
                    </Field>
                    <Field label="Phone" htmlFor="client_phone" error={errors.client_phone}>
                        <Input
                            id="client_phone"
                            type="tel"
                            value={data.client_phone}
                            onChange={(e) => setData('client_phone', e.target.value)}
                            placeholder="+91 98xxx xxxxx"
                        />
                    </Field>
                    <Field label="Email" htmlFor="client_email" error={errors.client_email}>
                        <Input
                            id="client_email"
                            type="email"
                            value={data.client_email}
                            onChange={(e) => setData('client_email', e.target.value)}
                            placeholder="client@example.com"
                            className={cn(errors.client_email && 'border-red-500')}
                        />
                    </Field>
                    <Field label="Attended By" htmlFor="attended_by" error={errors.attended_by} required>
                        <Input
                            id="attended_by"
                            value={data.attended_by}
                            onChange={(e) => setData('attended_by', e.target.value)}
                            placeholder="Staff member name"
                            className={cn(errors.attended_by && 'border-red-500')}
                        />
                    </Field>
                    <Field label="Source of Visit" htmlFor="source" error={errors.source} required>
                        <Select value={data.source} onValueChange={(value) => setData('source', value)}>
                            <SelectTrigger id="source" className={cn('w-full', errors.source && 'border-red-500')}>
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.sources.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Referred By / Source Details (if applicable)" htmlFor="source_details" error={errors.source_details} className="md:col-span-2">
                        <Input
                            id="source_details"
                            value={data.source_details}
                            onChange={(e) => setData('source_details', e.target.value)}
                            placeholder="e.g. Referred by Mrs. Shah, Instagram ad campaign"
                        />
                    </Field>
                </div>
            </Section>

            <Section number="02" title="Customer Profile & Buying Intent">
                <Field label="Purpose of Visit" error={errors.purpose} required>
                    <ChoiceGroup name="purpose" options={options.purposes} value={data.purpose} onChange={(value) => setData('purpose', value)} error={errors.purpose} />
                </Field>
                <Field label="Occasion & Date (if applicable)" htmlFor="occasion_details" error={errors.occasion_details}>
                    <Input
                        id="occasion_details"
                        value={data.occasion_details}
                        onChange={(e) => setData('occasion_details', e.target.value)}
                        placeholder="e.g. Daughter's wedding, Feb 2027"
                    />
                </Field>
                <Field label="Assessment of Buying Intent" error={errors.buying_intent} required>
                    <ChoiceGroup
                        name="buying_intent"
                        options={options.buying_intents}
                        value={data.buying_intent}
                        onChange={(value) => setData('buying_intent', value)}
                        error={errors.buying_intent}
                    />
                </Field>
                <Field label="Product Preference" error={errors.product_preference} required>
                    <ChoiceGroup
                        name="product_preference"
                        options={options.product_preferences}
                        value={data.product_preference}
                        onChange={(value) => setData('product_preference', value)}
                        error={errors.product_preference}
                    />
                </Field>
                <Field label="Budget / Price Range Discussed (₹)" htmlFor="budget" error={errors.budget}>
                    <Input id="budget" value={data.budget} onChange={(e) => setData('budget', e.target.value)} placeholder="e.g. ₹10–20 lakh" />
                </Field>
            </Section>

            <Section number="03" title="Pieces of Interest" description="Record the pieces the client expressed interest in. Search the catalogue, or add a stock code and photo manually.">
                <ProductPicker items={data.items} onChange={(items) => setData('items', items)} errors={fieldErrors} />
            </Section>

            <Section number="04" title="Outcome & Follow-up">
                <Field label="Visit Summary / Important Observations" htmlFor="summary" error={errors.summary}>
                    <Textarea
                        id="summary"
                        rows={4}
                        value={data.summary}
                        onChange={(e) => setData('summary', e.target.value)}
                        placeholder="Client preferences, reactions, concerns, decision makers, etc."
                    />
                </Field>
                <Field label="Next Steps / Action Required" htmlFor="next_steps" error={errors.next_steps}>
                    <Textarea
                        id="next_steps"
                        rows={4}
                        value={data.next_steps}
                        onChange={(e) => setData('next_steps', e.target.value)}
                        placeholder="Share photographs, send estimate, source stones, prepare design, arrange second visit..."
                    />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Follow-up Date" htmlFor="follow_up_date" error={errors.follow_up_date}>
                        <DatePicker
                            id="follow_up_date"
                            value={data.follow_up_date}
                            onChange={(value) => setData('follow_up_date', value)}
                            invalid={!!errors.follow_up_date}
                            clearable
                        />
                    </Field>
                    <Field label="Follow-up By" htmlFor="follow_up_by" error={errors.follow_up_by}>
                        <Input id="follow_up_by" value={data.follow_up_by} onChange={(e) => setData('follow_up_by', e.target.value)} placeholder="Responsible person" />
                    </Field>
                </div>
            </Section>

            <div className="flex justify-end gap-3">
                <Link href={cancelHref}>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
