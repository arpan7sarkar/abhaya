import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { reportRoad } from '../../services/api';
import { useAvayaStore } from '../../store/useAvayaStore';
import { useToastStore } from '../../store/useToastStore';

export default function ReportModal() {
  const reportRoadId = useAvayaStore((s) => s.reportRoadId);
  const reportModalOpen = useAvayaStore((s) => s.reportModalOpen);
  const closeReportModal = useAvayaStore((s) => s.closeReportModal);
  const addToast = useToastStore((s) => s.addToast);

  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  if (!reportModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      setError('Please describe the issue (min 10 characters).');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await reportRoad(reportRoadId, description.trim());
      setSuccess(true);
      setDescription('');
      addToast('Report submitted successfully', 'success');
      timerRef.current = setTimeout(() => {
        setSuccess(false);
        closeReportModal();
      }, 1500);
    } catch {
      setError('Failed to submit report. Please try again.');
      addToast('Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setDescription('');
    setError('');
    setSuccess(false);
    closeReportModal();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <div
        className="panel-card animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          borderRadius: '20px 20px 0 0',
          marginBottom: 0,
        }}
        role="dialog"
        aria-labelledby="report-modal-title"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 id="report-modal-title" style={{ fontWeight: 600, fontSize: '16px', color: '#141414' }}>
            Report Unsafe Road
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: '#f7f6f2',
              border: 'none',
              borderRadius: '8px',
              color: '#6b6b6b',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>
            ✓ Report submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the safety issue (e.g. poor lighting, recent incident)…"
              rows={4}
              minLength={10}
              required
              style={{
                width: '100%',
                background: '#f7f6f2',
                border: '1px solid #e8e6e0',
                borderRadius: '10px',
                color: '#141414',
                fontSize: '14px',
                padding: '12px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: '8px',
              }}
              aria-label="Safety issue description"
            />
            {error && <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '10px' }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                background: submitting ? 'rgba(232,160,32,0.4)' : '#e8a020',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
