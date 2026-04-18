import React, { useState } from 'react';
import { uploadResume, analyzeResume } from '../services/api';
import { toast } from 'react-toastify';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a PDF file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !file) {
      setError('Please provide email and upload a resume');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('resume', file);

      const uploadResponse = await uploadResume(formData);
      setSuccess('Resume uploaded successfully! Analyzing...');
      toast.success('Resume uploaded successfully');

      // Automatically analyze the resume
      const analysisResponse = await analyzeResume(email);
      toast.info('Analysis complete');

      // Call parent callback with results
      if (onUploadSuccess) {
        onUploadSuccess(email, analysisResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume. Please try again.');
      console.error('Upload error:', err);
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="card">
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Upload Your Resume</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px', display: 'block' }}>
              We'll use this to store your analysis results
            </small>
          </div>

          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !loading && document.getElementById('fileInput').click()}
            style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            <div className="drop-zone-icon">📄</div>
            <h3>Drag & Drop your resume here</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>or click to browse</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>PDF files only (Max 5MB)</p>
            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {file && (
            <div className="file-info">
              <strong>✓ Selected File:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file || !email}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? '🔄 Analyzing Resume...' : '🚀 Upload & Analyze Resume'}
          </button>
        </form>

        <p style={{
          marginTop: '20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '13px'
        }}>
          Your data is secure and will only be used for resume analysis
        </p>
      </div>
    </div>
  );
};

export default ResumeUpload;
