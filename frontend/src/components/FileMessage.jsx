import React from 'react';
import { Download, Eye, File, Image, FileText, Video, Music } from 'lucide-react';


const FileMessage = ({ files, sender, timestamp, formatTime }) => {
  const getFileIcon = (file) => {
    const type = file.type?.toLowerCase() || '';
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.startsWith('video/')) return <Video size={16} />;
    if (type.startsWith('audio/')) return <Music size={16} />;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return <FileText size={16} />;
    return <File size={16} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (file) => {
    return file.type?.startsWith('image/');
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  return (
    <div className="file-message">
      {files.map((file, index) => (
        <div key={index} className="file-attachment">
          {isImage(file) && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(file)} 
                alt={file.name}
                className="preview-image"
              />
            </div>
          )}
          
          <div className="file-info">
            <div className="file-header">
              <div className="file-icon-name">
                {getFileIcon(file)}
                <span className="file-name">{file.name}</span>
              </div>
              <div className="file-actions">
                {isImage(file) && (
                  <button 
                    className="file-action-btn"
                    onClick={() => handlePreview(file)}
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                )}
                <button 
                  className="file-action-btn"
                  onClick={() => handleDownload(file)}
                  title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
        </div>
      ))}
      
      <div className="message-time">
        {formatTime(timestamp)}
      </div>
    </div>
  );
};

export default FileMessage;