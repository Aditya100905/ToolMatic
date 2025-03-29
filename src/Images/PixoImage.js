import React from 'react';

const { Pixo } = window;

const PixoImage = ({ src, onChange }) => {
  const pixo = new Pixo.Bridge({
    apikey: 'YOUR_API_KEY', // Replace with your actual API key
    onSave: (image) => {
      onChange(image.toDataURL());
    },
  });

  return (
    <img
      src={src}
      alt="Editable"
      style={{ cursor: 'pointer' }}
      onClick={() => pixo.edit(src)}
    />
  );
};

export default PixoImage;
