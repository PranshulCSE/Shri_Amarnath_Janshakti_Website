import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { COLORS, SPACING } from '../../constants/theme';
import { validateFileSize, validateFileType, validatePhone, validateAmount } from '../../utils/validation';
import { MESSAGES } from '../../constants/messages';

/**
 * DonationForm Component
 * Handles UPI donation with QR code display and file upload
 * UPI ID: 9466132732@ibl
 */
const DonationForm = ({ onSuccess }) => {
    const UPI_ID = '9466132732@ibl';
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        amount: '',
        transactionId: '',
        screenshot: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (!validateFileSize(file, 2)) {
            setErrors((prev) => ({
                ...prev,
                screenshot: MESSAGES.ERROR.FILE_TOO_LARGE,
            }));
            return;
        }

        // Validate file type
        if (!validateFileType(file, ['image/jpeg', 'image/png'])) {
            setErrors((prev) => ({
                ...prev,
                screenshot: MESSAGES.ERROR.INVALID_FILE_TYPE,
            }));
            return;
        }

        // Set file and create preview
        setFormData((prev) => ({
            ...prev,
            screenshot: file,
        }));

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        // Clear any previous error
        if (errors.screenshot) {
            setErrors((prev) => ({
                ...prev,
                screenshot: undefined,
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = MESSAGES.VALIDATION.NAME_REQUIRED;
        } else if (formData.name.trim().length < 3) {
            newErrors.name = MESSAGES.VALIDATION.NAME_MIN_LENGTH;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = MESSAGES.VALIDATION.PHONE_INVALID;
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (!validateAmount(formData.amount)) {
            newErrors.amount = MESSAGES.VALIDATION.AMOUNT_INVALID;
        }

        if (!formData.transactionId.trim()) {
            newErrors.transactionId = 'Transaction ID is required';
        }

        if (!formData.screenshot) {
            newErrors.screenshot = 'Payment screenshot is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create FormData for multipart/form-data
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('phone', formData.phone);
            formDataToSubmit.append('amount', parseInt(formData.amount));
            formDataToSubmit.append('transactionId', formData.transactionId);
            formDataToSubmit.append('screenshot', formData.screenshot);

            // Make API call
            const response = await fetch('http://localhost:5000/api/donations', {
                method: 'POST',
                body: formDataToSubmit,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit donation');
            }

            // Success
            alert(MESSAGES.SUCCESS.CREATED);
            setFormData({
                name: '',
                phone: '',
                amount: '',
                transactionId: '',
                screenshot: null,
            });
            setPreviewUrl(null);
            onSuccess?.(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const generateUPILink = () => {
        const amount = formData.amount || '';
        return `upi://pay?pa=${UPI_ID}&pn=Yatra&tn=Donation&am=${amount}`;
    };

    return (
        <div
            style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: SPACING.lg,
                background: COLORS.white,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <h2
                style={{
                    color: COLORS.primary,
                    marginBottom: SPACING.md,
                    textAlign: 'center',
                }}
            >
                Support Our Yatra
            </h2>

            {/* UPI Display Section */}
            <div
                style={{
                    background: COLORS.lightBg,
                    padding: SPACING.md,
                    borderRadius: '8px',
                    marginBottom: SPACING.lg,
                    textAlign: 'center',
                }}
            >
                <p style={{ color: COLORS.textSecondary, marginBottom: SPACING.sm }}>
                    Scan the QR code or use UPI ID:
                </p>
                <p
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: COLORS.primary,
                        marginBottom: SPACING.md,
                    }}
                >
                    {UPI_ID}
                </p>

                {formData.amount && (
                    <div style={{ marginBottom: SPACING.md }}>
                        <QRCode
                            value={generateUPILink()}
                            size={200}
                            level="H"
                            includeMargin
                        />
                        <p style={{ marginTop: SPACING.sm, color: COLORS.textSecondary }}>
                            Amount: ₹{formData.amount}
                        </p>
                    </div>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: SPACING.md }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: SPACING.sm,
                            fontWeight: '500',
                            color: COLORS.textPrimary,
                        }}
                    >
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        style={{
                            width: '100%',
                            padding: SPACING.sm,
                            border: `1px solid ${errors.name ? COLORS.error : COLORS.borderColor}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.name && (
                        <p style={{ color: COLORS.error, marginTop: '4px', fontSize: '12px' }}>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Phone Field */}
                <div style={{ marginBottom: SPACING.md }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: SPACING.sm,
                            fontWeight: '500',
                            color: COLORS.textPrimary,
                        }}
                    >
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit phone number"
                        style={{
                            width: '100%',
                            padding: SPACING.sm,
                            border: `1px solid ${errors.phone ? COLORS.error : COLORS.borderColor}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.phone && (
                        <p style={{ color: COLORS.error, marginTop: '4px', fontSize: '12px' }}>
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Amount Field */}
                <div style={{ marginBottom: SPACING.md }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: SPACING.sm,
                            fontWeight: '500',
                            color: COLORS.textPrimary,
                        }}
                    >
                        Donation Amount (₹) *
                    </label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Minimum ₹100"
                        min="100"
                        style={{
                            width: '100%',
                            padding: SPACING.sm,
                            border: `1px solid ${errors.amount ? COLORS.error : COLORS.borderColor}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.amount && (
                        <p style={{ color: COLORS.error, marginTop: '4px', fontSize: '12px' }}>
                            {errors.amount}
                        </p>
                    )}
                </div>

                {/* Transaction ID Field */}
                <div style={{ marginBottom: SPACING.md }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: SPACING.sm,
                            fontWeight: '500',
                            color: COLORS.textPrimary,
                        }}
                    >
                        Transaction ID *
                    </label>
                    <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        placeholder="UPI transaction reference number"
                        style={{
                            width: '100%',
                            padding: SPACING.sm,
                            border: `1px solid ${errors.transactionId ? COLORS.error : COLORS.borderColor}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.transactionId && (
                        <p style={{ color: COLORS.error, marginTop: '4px', fontSize: '12px' }}>
                            {errors.transactionId}
                        </p>
                    )}
                </div>

                {/* Screenshot Upload */}
                <div style={{ marginBottom: SPACING.md }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: SPACING.sm,
                            fontWeight: '500',
                            color: COLORS.textPrimary,
                        }}
                    >
                        Payment Screenshot (JPG/PNG, Max 2MB) *
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png"
                        style={{
                            width: '100%',
                            padding: SPACING.sm,
                            border: `1px solid ${errors.screenshot ? COLORS.error : COLORS.borderColor}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {errors.screenshot && (
                        <p style={{ color: COLORS.error, marginTop: '4px', fontSize: '12px' }}>
                            {errors.screenshot}
                        </p>
                    )}
                </div>

                {/* Image Preview */}
                {previewUrl && (
                    <div style={{ marginBottom: SPACING.md }}>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '6px',
                                border: `2px solid ${COLORS.secondary}`,
                            }}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: SPACING.md,
                        background: COLORS.primary,
                        color: COLORS.white,
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        if (!loading) e.target.style.background = COLORS.secondary;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = COLORS.primary;
                    }}
                >
                    {loading ? 'Processing...' : 'Submit Donation'}
                </button>
            </form>

            {/* Info Box */}
            <div
                style={{
                    marginTop: SPACING.lg,
                    padding: SPACING.md,
                    background: COLORS.lightBg,
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                }}
            >
                <p>
                    <strong>Note:</strong> After completing payment on your UPI app, please take a screenshot
                    of the successful transaction and upload it above for verification.
                </p>
            </div>
        </div>
    );
};

export default DonationForm;
