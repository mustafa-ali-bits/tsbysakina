export interface Promotion {
    id: number;
    description: string;
    imageUrl: string;           // Column B - optional, empty string if not provided
    couponName: string;         // Column C
    discount: number;           // Column D
    discountType: 'Fixed' | 'Percentage';  // Column G
    isActive: boolean;          // Column E - Y/N
    minOrderValue: number;      // Column H - 0 means no minimum
    showOnSite: boolean;        // Column I - false for secret coupons
}
