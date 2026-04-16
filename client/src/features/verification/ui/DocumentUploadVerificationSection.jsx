import React, { useState } from 'react';
import { Camera, ShieldCheck, UploadCloud } from 'lucide-react';
import { sendVerificationOtp, verifyOtp, uploadDocument } from '../../../services/api';

const documentTypes = ['Aadhaar Card', 'PAN Card', 'Passport', 'Driver License', 'Other'];

export const DocumentUploadVerificationSection = ({ onVerified }) => {
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Upload a document linked to your email, then verify with OTP.');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setDocumentFile(file);
    setUploadedDocument(null);
    setOtpSent(false);
    setOtpVerified(false);
    setStatusMessage(file ? 'Ready to upload the selected document.' : 'Select a document to upload.');
    setErrorMessage('');
  };

  const handleUpload = async () => {
    if (!documentFile) {
      setErrorMessage('Please select a document before uploading.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setStatusMessage('Uploading document...');

    try {
      const response = await uploadDocument(documentFile, documentType);
      setUploadedDocument(response.document);
      setStatusMessage('Document uploaded successfully. Enter your email address to receive OTP.');
    } catch (error) {
      setErrorMessage(error.message || 'Document upload failed.');
      setStatusMessage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!uploadedDocument) {
      setErrorMessage('Upload a document before sending OTP.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter the email address linked to the document.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage('');
    setStatusMessage('Sending OTP...');

    try {
      await sendVerificationOtp(email.trim());
      setOtpSent(true);
      setStatusMessage('OTP sent. Enter the code to verify your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send OTP.');
      setStatusMessage('Unable to send OTP. Please check the email address and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrorMessage('Please enter the OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage('');
    setStatusMessage('Verifying OTP...');

    try {
      await verifyOtp(email.trim(), otp.trim());
      setOtpVerified(true);
      setStatusMessage('Email verified successfully. You can now continue to the next verification step.');
      onVerified?.({ document: uploadedDocument, email: email.trim() });
    } catch (error) {
      setErrorMessage(error.message || 'OTP verification failed.');
      setStatusMessage('OTP invalid or expired. Please retry.');
      setOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 lg:p-8 ambient-bloom">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-on-surface">1. Document & Email Verification</h3>
          <p className="text-sm text-on-surface-variant">Upload a document and verify the linked email address with OTP.</p>
        </div>
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <UploadCloud size={16} />
          Verification required
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Document type</label>
          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant/15 px-3 text-sm outline-none focus:border-primary/40"
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Upload document</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-on-surface rounded-xl border border-outline-variant/15 bg-surface-container-low px-3 py-3"
          />
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !documentFile}
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? 'Uploading…' : 'Upload Document'}
        </button>

        {uploadedDocument ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-high p-4 text-sm">
            <div className="font-semibold text-on-surface">Uploaded document</div>
            <div className="mt-2 text-on-surface-variant text-xs">{uploadedDocument.originalName}</div>
          </div>
        ) : null}

        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Email linked to document</label>
          <input
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant/15 px-3 text-sm outline-none focus:border-primary/40"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={isSendingOtp || !uploadedDocument || !email.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-on-primary-container hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending OTP…' : 'Send OTP'}
          </button>
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={!otpSent || isVerifyingOtp || otpVerified}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifyingOtp ? 'Verifying…' : otpVerified ? 'Verified' : 'Verify OTP'}
          </button>
        </div>

        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold">Enter OTP</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant/15 px-3 text-sm outline-none focus:border-primary/40"
          />
        </div>

        {statusMessage ? (
          <div className="text-sm text-on-surface-variant">{statusMessage}</div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-2xl bg-error/10 border border-error/20 px-4 py-3 text-xs text-error">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck size={18} className={otpVerified ? 'text-emerald-600' : 'text-amber-500'} />
          <span className={otpVerified ? 'text-emerald-600' : 'text-amber-500'}>
            {otpVerified ? 'Email verified' : 'Email verification required'}
          </span>
        </div>
      </div>
    </section>
  );
};
