import React, { useState, useMemo } from 'react';
import { PropertyContextType, PropertyType, PropertyCategory, Property } from '../types';
import { NIGERIAN_STATES } from '../constants';
import { generatePropertyDescription } from '../services/geminiService';
import { Sparkles, Upload as UploadIcon, CheckCircle, AlertCircle, Loader2, XCircle, Lock } from 'lucide-react';

interface UploadProps {
  propertyContext: PropertyContextType;
  onNavigate: (view: any) => void;
}

const Upload: React.FC<UploadProps> = ({ propertyContext, onNavigate }) => {
  const { addProperty } = propertyContext;

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    state: '',
    lga: '',
    address: '',
    type: PropertyType.SALE,
    category: PropertyCategory.HOUSE,
    description: '',
    featuresString: '', // Comma separated
    contactPhone: '09062712610'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get LGAs for selected state
  const availableLgas = useMemo(() => {
    const state = NIGERIAN_STATES.find(s => s.name === formData.state);
    return state ? state.lgas : [];
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.state || !formData.featuresString) {
        setError("Please fill in Title, State, and Features before generating a description.");
        return;
    }
    setError('');
    setIsGenerating(true);
    
    const desc = await generatePropertyDescription(
        formData.title,
        formData.type,
        `${formData.lga}, ${formData.state}`,
        formData.featuresString
    );
    
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.price || !formData.state || !formData.lga || !previewUrl) {
      setError('Please fill in all required fields and upload an image.');
      return;
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || 'No description provided.',
      price: Number(formData.price),
      location: {
        state: formData.state,
        lga: formData.lga,
        address: formData.address
      },
      features: formData.featuresString.split(',').map(f => f.trim()).filter(f => f !== ''),
      type: formData.type,
      category: formData.category,
      imageUrl: previewUrl, // In a real app, this would be a cloud URL
      dateAdded: Date.now(),
      contactPhone: formData.contactPhone
    };

    addProperty(newProperty);
    setSuccess('Property uploaded successfully!');
    
    // Reset form
    setTimeout(() => {
        onNavigate('LISTINGS');
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-primary/90 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <UploadIcon className="mr-3" /> Upload New Property
            </h1>
            <p className="text-gray-400 mt-1">Add a new land or house to the marketplace.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-center">
                <AlertCircle className="mr-2" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 flex items-center">
                <CheckCircle className="mr-2" /> {success}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury 4-Bedroom Duplex"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price (NGN) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 50000000"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                >
                  <option value={PropertyCategory.HOUSE}>House</option>
                  <option value={PropertyCategory.LAND}>Land</option>
                  <option value={PropertyCategory.COMMERCIAL}>Commercial</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                >
                  <option value={PropertyType.SALE}>For Sale</option>
                  <option value={PropertyType.RENT}>For Rent</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    readOnly
                    className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2 border bg-gray-100 text-gray-500 cursor-not-allowed pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50/50 p-4 rounded-lg space-y-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">State *</label>
                        <select
                        name="state"
                        value={formData.state}
                        onChange={(e) => {
                             setFormData(prev => ({...prev, state: e.target.value, lga: ''}));
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                        >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">L.G.A *</label>
                        <select
                        name="lga"
                        value={formData.lga}
                        onChange={handleChange}
                        disabled={!formData.state}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border disabled:bg-gray-100 bg-white/80"
                        >
                        <option value="">Select LGA</option>
                        {availableLgas.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address/Landmark</label>
                        <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. Opposite Okpokpo Market"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                        />
                    </div>
                </div>
            </div>

            {/* Features & Description */}
            <div>
               <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                <input
                  type="text"
                  name="featuresString"
                  value={formData.featuresString}
                  onChange={handleChange}
                  placeholder="e.g. Swimming Pool, Fenced, C of O, Tarred Road"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
                />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Description</span>
                <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-semibold disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    Generate with AI
                </button>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm p-2 border bg-white/80"
              />
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Property Image *</label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50/50 transition-colors bg-white/50">
                    <div className="space-y-1 text-center">
                    {previewUrl ? (
                        <div className="relative">
                            <img src={previewUrl} alt="Preview" className="h-48 object-cover rounded-md mx-auto shadow-md" />
                            <button 
                                type="button"
                                onClick={() => {setPreviewUrl(''); setImageFile(null);}}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 shadow-md hover:bg-red-600"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white/0 rounded-md font-medium text-secondary hover:text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary"
                                >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                    )}
                    </div>
                </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-secondary hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
              >
                Publish Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;