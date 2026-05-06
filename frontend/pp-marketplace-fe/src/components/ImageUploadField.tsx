import { useState } from 'react';
import { uploadAPI } from '../services/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.image(file);
      onChange(response.data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-white font-semibold">{label}</label>
      {value && (
        <img
          src={value}
          alt={label}
          className="h-32 w-full rounded-lg border border-dark-700 object-cover"
        />
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/images/example.png"
          className="w-full"
        />
        <label className="btn-secondary cursor-pointer text-center">
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
