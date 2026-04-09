import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Video, Music } from 'lucide-react';

const FileUpload = ({ onFileSelect, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return <Image size={20} />;
    if (type.startsWith('video/')) return <Video size={20} />;
    if (type.startsWith('audio/')) return <Music size={20} />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        <div className="file-upload-header">
          <h3>Upload Files</h3>
          <button className="close-upload-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div 
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} />
          <p className="drop-text">
            Drag and drop files here, or <span className="click-text">click to browse</span>
          </p>
          <p className="file-info">
            Supports images, documents, videos, and audio files (max 10MB each)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            style={{ display: 'none' }}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files ({selectedFiles.length})</h4>
            <div className="file-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">
                    {getFileIcon(file)}
                  </div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                  <button 
                    className="remove-file-btn"
                    onClick={() => removeFile(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="file-upload-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="upload-btn" 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;