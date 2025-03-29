import React, { useState, useRef } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const BgRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  // Remove background using remove.bg API (you'll need to replace with your actual API)
  const removeBackground = async () => {
    if (!originalImage) {
      message.warning('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      // Note: This is a placeholder. You'll need to implement actual background removal
      // Either through a cloud service API or a local ML model
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', {
        image_base64: originalImage.split(',')[1],
        size: 'auto',
      }, {
        headers: {
          'X-Api-Key': 'YOUR_REMOVE_BG_API_KEY',
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      setProcessedImage(URL.createObjectURL(blob));
      message.success('Background removed successfully!');
    } catch (error) {
      message.error('Failed to remove background');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Save processed image
  const saveImage = () => {
    if (!processedImage) {
      message.warning('No processed image to save');
      return;
    }

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background_removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset/Clear images
  const clearImages = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-remover-container p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Background Remover</h1>
      
      <div className="upload-section mb-4">
        <Upload 
          beforeUpload={handleFileUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>
            Select Image
          </Button>
        </Upload>
      </div>

      {originalImage && (
        <div className="image-preview-section grid grid-cols-2 gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Original Image</h2>
            <img 
              src={originalImage} 
              alt="Original" 
              className="max-w-full h-auto border rounded"
            />
          </div>
          
          {processedImage ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Processed Image</h2>
              <img 
                src={processedImage} 
                alt="Processed" 
                className="max-w-full h-auto border rounded"
              />
            </div>
          ) : null}
        </div>
      )}

      <div className="action-buttons flex justify-center space-x-4">
        {originalImage && !processedImage && (
          <Button 
            type="primary" 
            onClick={removeBackground} 
            loading={loading}
          >
            Remove Background
          </Button>
        )}
        
        {processedImage && (
          <>
            <Button 
              icon={<SaveOutlined />} 
              onClick={saveImage}
            >
              Save Image
            </Button>
            <Button 
              icon={<DeleteOutlined />} 
              onClick={clearImages}
              danger
            >
              Clear
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BgRemover;