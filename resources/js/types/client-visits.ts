export interface Option {
    value: string;
    label: string;
}

export interface ClientVisitOptions {
    sources: Option[];
    purposes: Option[];
    buying_intents: Option[];
    product_preferences: Option[];
}

export interface CatalogueProduct {
    id: number;
    sku: string;
    title: string;
    image: string | null;
    categories: Array<{ id: number; name: string }>;
    price: string | null;
}

export interface ClientVisitItem {
    id?: number;
    product_id: number | null;
    stock_code: string | null;
    notes: string | null;
    image?: string | null;
    image_file?: File | null;
    image_preview?: string | null;
    remove_image?: boolean;
    product: CatalogueProduct | null;
}

export interface ClientVisit {
    id: number;
    client_name: string;
    client_phone: string | null;
    client_email: string | null;
    visit_date: string;
    attended_by: string;
    source: string;
    source_label: string;
    source_details: string | null;
    purpose: string;
    purpose_label: string;
    occasion_details: string | null;
    buying_intent: string;
    buying_intent_label: string;
    product_preference: string;
    product_preference_label: string;
    budget: string | null;
    summary: string | null;
    next_steps: string | null;
    follow_up_date: string | null;
    follow_up_by: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    items: ClientVisitItem[];
}

export interface ClientVisitListItem {
    id: number;
    client_name: string;
    client_phone: string | null;
    visit_date: string;
    attended_by: string;
    source: string;
    source_label: string;
    buying_intent: string;
    buying_intent_label: string;
    budget: string | null;
    follow_up_date: string | null;
    follow_up_by: string | null;
    items_count: number;
}
