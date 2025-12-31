'use client';

import React, { useState } from 'react';
import { Tag, X, Check, AlertCircle } from 'lucide-react';
import { useCart, AppliedCoupon } from '@/context/CartContext';
import { Promotion } from '@/types/promotion';

interface CouponSectionProps {
    promotions: Promotion[];
    subtotal: number;
}

const CouponSection: React.FC<CouponSectionProps> = ({ promotions, subtotal }) => {
    const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const [couponInput, setCouponInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Filter to only show public coupons (showOnSite = true)
    const publicCoupons = promotions.filter(p => p.showOnSite && p.isActive);

    // Handle applying a coupon (from input or click)
    const handleApplyCoupon = (couponName: string) => {
        setError(null);
        setSuccess(null);

        // Find the coupon (case-insensitive) from ALL active promotions (including secret ones)
        const promotion = promotions.find(
            p => p.isActive && p.couponName.toLowerCase() === couponName.toLowerCase().trim()
        );

        if (!promotion) {
            setError('Invalid coupon code');
            return;
        }

        // Check minimum order value
        if (promotion.minOrderValue > 0 && subtotal < promotion.minOrderValue) {
            setError(`Minimum order of ₹${promotion.minOrderValue} required for this coupon`);
            return;
        }

        const coupon: AppliedCoupon = {
            name: promotion.couponName,
            discount: promotion.discount,
            discountType: promotion.discountType,
            minOrderValue: promotion.minOrderValue,
        };

        applyCoupon(coupon);
        setSuccess(`Coupon "${promotion.couponName}" applied!`);
        setCouponInput('');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleInputApply = () => {
        if (couponInput.trim()) {
            handleApplyCoupon(couponInput);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setSuccess(null);
        setError(null);
    };

    // Calculate discount amount for display
    const calculateDiscount = (coupon: AppliedCoupon) => {
        if (coupon.discountType === 'Percentage') {
            return subtotal * (coupon.discount / 100);
        }
        return coupon.discount;
    };

    // Check if a promotion can be applied (meets min order)
    const canApply = (promotion: Promotion) => {
        return promotion.minOrderValue === 0 || subtotal >= promotion.minOrderValue;
    };

    return (
        <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Coupons & Offers
            </h3>

            {/* Applied Coupon Display */}
            {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <div>
                            <span className="font-semibold text-green-800">{appliedCoupon.name}</span>
                            <span className="text-green-600 ml-2">
                                {appliedCoupon.discountType === 'Percentage'
                                    ? `${appliedCoupon.discount}% OFF`
                                    : `₹${appliedCoupon.discount} OFF`}
                            </span>
                            <p className="text-sm text-green-700">
                                You save ₹{calculateDiscount(appliedCoupon).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Remove coupon"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Coupon Input */}
            {!appliedCoupon && (
                <div className="mb-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setError(null);
                            }}
                            placeholder="Enter coupon code"
                            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                        />
                        <button
                            onClick={handleInputApply}
                            disabled={!couponInput.trim()}
                            className="w-full sm:w-auto bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Apply
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                            <Check className="w-4 h-4" />
                            {success}
                        </div>
                    )}
                </div>
            )}

            {/* Available Coupons List */}
            {!appliedCoupon && publicCoupons.length > 0 && (
                <div>
                    <p className="text-sm text-stone-600 mb-2">Available Coupons:</p>
                    <div className="space-y-2">
                        {publicCoupons.map((promotion) => {
                            const isEligible = canApply(promotion);
                            return (
                                <div
                                    key={promotion.id}
                                    className={`border rounded-lg p-3 ${isEligible
                                        ? 'border-amber-200 bg-white'
                                        : 'border-stone-200 bg-stone-50 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono font-semibold text-amber-900 text-sm">
                                                    {promotion.couponName}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${promotion.discountType === 'Percentage'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {promotion.discountType === 'Percentage'
                                                        ? `${promotion.discount}% OFF`
                                                        : `₹${promotion.discount} OFF`}
                                                </span>
                                            </div>
                                            {promotion.description && (
                                                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{promotion.description}</p>
                                            )}
                                            {promotion.minOrderValue > 0 && (
                                                <p className={`text-xs mt-1 ${isEligible ? 'text-green-600' : 'text-red-500'
                                                    }`}>
                                                    {isEligible
                                                        ? `✓ Min ₹${promotion.minOrderValue}`
                                                        : `Add ₹${(promotion.minOrderValue - subtotal).toFixed(0)} more`}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleApplyCoupon(promotion.couponName)}
                                            disabled={!isEligible}
                                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex-shrink-0 ${isEligible
                                                ? 'bg-amber-900 text-white hover:bg-amber-800'
                                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* No coupons available message */}
            {!appliedCoupon && publicCoupons.length === 0 && (
                <p className="text-sm text-stone-500 italic">
                    No coupons available at the moment. Try entering a code if you have one!
                </p>
            )}
        </div>
    );
};

export default CouponSection;
