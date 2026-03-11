import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

export default function AdminMembersGallery() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const fetchImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/images', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            } else {
                setError('Failed to fetch images');
            }
        } catch (err) {
            console.error('Fetch images error:', err);
            setError('Error loading images');
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/images', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                fetchImages(); // Refresh the list
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                const data = await response.json();
                setUploadError(data.error || 'Failed to upload image');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setUploadError('Network error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (filename) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/images/${filename}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchImages(); // Refresh the list
            } else {
                alert('Failed to delete image');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting image');
        }
    };

    return (
        <div className="flex-1 w-full h-full flex flex-col">
            <div className={`p-6 mb-6 rounded-xl shadow-sm border ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'} flex justify-between items-center`}>
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>Upload Images</h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Upload and manage images for public gallery and member accounts.</p>
                </div>

                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`flex items-center gap-2 bg-[#b8860b] hover:bg-[#9a7009] text-white rounded-full px-5 py-2.5 text-sm font-semibold transition shadow-sm ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-upload"></i>}
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    {uploadError && <p className="text-red-500 text-xs mt-2 text-right">{uploadError}</p>}
                </div>
            </div>

            <div className={`flex-1 rounded-xl shadow-sm border p-6 ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                {error && <div className="p-4 bg-red-100 text-red-600 rounded-lg mb-4">{error}</div>}

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <i className="far fa-images text-6xl text-orange-200 dark:text-orange-900/30 mb-4"></i>
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No images uploaded yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Click the top right button to add your first image.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.filename} className={`group relative rounded-xl overflow-hidden shadow-sm border ${isDark ? 'border-orange-900/30' : 'border-orange-100'}`}>
                                <img
                                    src={`http://localhost:5000${img.url}`}
                                    alt={img.filename}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(img.filename)}
                                        className="w-10 h-10 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition hover:scale-110 shadow-lg"
                                        title="Delete Image"
                                    >
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
