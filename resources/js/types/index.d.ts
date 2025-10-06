import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions?: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    short_description?: string;
    long_description?: string;
    sku: string;
    currency: string;
    price: string;
    formatted_price: string;
    primary_image_url?: string;
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
    categories?: Category[];
    details?: ProductDetail[];
    active_details?: ProductDetail[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    src: string;
    is_primary: boolean;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface ProductDetail {
    id: number;
    product_id: number;
    title: string;
    subtitle?: string;
    image?: string;
    position: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent_id?: number;
    position: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    children?: Category[];
    parent?: Category;
}
