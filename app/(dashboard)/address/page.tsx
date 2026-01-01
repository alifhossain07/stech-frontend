"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

type DistrictOption = { id: number; name: string; code: string; status: number };
type StateOption = { id: number; country_id: number; name: string };

type ShippingAddress = {
  id: number;
  user_id: number;
  address: string;
  country_id: number;
  state_id: number;
  city_id: number | null;
  area_id: number | null;
  country_name: string;
  state_name: string;
  city_name: string | null;
  area_name: string | null;
  postal_code: string | null;
  phone: string;
  set_default: number;
  location_available: boolean;
  lat: number | null;
  lang: number | null;
  valid: boolean;
};

export default function AddressPage() {
  const { accessToken } = useAuth();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  // Form state for Add modal
  const [addFormData, setAddFormData] = useState({
    phone: '',
    address: '',
    districtId: null as number | null,
    districtName: '',
    stateId: null as number | null,
    stateName: '',
  });

  // Form state for Update modal
  const [updateFormData, setUpdateFormData] = useState({
    id: null as number | null,
    phone: '',
    address: '',
    districtId: null as number | null,
    districtName: '',
    stateId: null as number | null,
    stateName: '',
  });

  // Districts state
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [districtQuery, setDistrictQuery] = useState<string>('');
  const [districtsLoading, setDistrictsLoading] = useState<boolean>(false);
  const [districtOpen, setDistrictOpen] = useState<boolean>(false);
  const [districtModalType, setDistrictModalType] = useState<'add' | 'update' | null>(null);

  // States/Upazilas state
  const [states, setStates] = useState<StateOption[]>([]);
  const [stateQuery, setStateQuery] = useState<string>('');
  const [statesLoading, setStatesLoading] = useState<boolean>(false);
  const [stateOpen, setStateOpen] = useState<boolean>(false);
  const [stateModalType, setStateModalType] = useState<'add' | 'update' | null>(null);
  const stateDebounceRef = useRef<number | undefined>(undefined);

  // Get selected district ID based on modal type
  const selectedDistrictId = districtModalType === 'add' 
    ? addFormData.districtId 
    : districtModalType === 'update' 
    ? updateFormData.districtId 
    : null;

  // Filter districts locally
  const filteredDistricts = useMemo(() => {
    const q = districtQuery.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter((d) => d.name.toLowerCase().includes(q));
  }, [districtQuery, districts]);

  // Filter states locally
  const filteredStates = useMemo(() => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return states;
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [stateQuery, states]);

  // Fetch shipping addresses
  const fetchAddresses = React.useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/shipping/address', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Load districts on mount
  useEffect(() => {
    let cancelled = false;
    const loadDistricts = async () => {
      try {
        setDistrictsLoading(true);
        const res = await fetch('/api/countries', { cache: 'no-store' });
        if (!res.ok) {
          console.error('Failed to fetch districts:', res.status, res.statusText);
          if (!cancelled) setDistricts([]);
          return;
        }
        const json = await res.json();
        const list: DistrictOption[] = Array.isArray(json?.data) 
          ? json.data 
          : Array.isArray(json) 
          ? json 
          : [];
        if (!cancelled) setDistricts(list);
      } catch (error) {
        console.error('Error loading districts:', error);
        if (!cancelled) setDistricts([]);
      } finally {
        if (!cancelled) setDistrictsLoading(false);
      }
    };
    loadDistricts();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch addresses on mount
  useEffect(() => {
    if (accessToken) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [accessToken, fetchAddresses]);

  // Load states when district is selected
  useEffect(() => {
    if (!selectedDistrictId) {
      setStates([]);
      if (districtModalType === 'add') {
        setAddFormData(prev => ({ ...prev, stateId: null, stateName: '' }));
      } else if (districtModalType === 'update') {
        setUpdateFormData(prev => ({ ...prev, stateId: null, stateName: '' }));
      }
      setStateQuery('');
      return;
    }

    let cancelled = false;
    const loadStates = async () => {
      try {
        setStatesLoading(true);
        const res = await fetch(`/api/states-by-country/${selectedDistrictId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const list: StateOption[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setStates(list);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    };
    loadStates();
    return () => {
      cancelled = true;
    };
  }, [selectedDistrictId, districtModalType]);

  // Fetch state suggestions with debounce
  const fetchStateSuggestions = async (districtId: number, q: string) => {
    if (!q || !districtId) return;
    try {
      setStatesLoading(true);
      const res = await fetch(`/api/states-by-country/${districtId}?name=${encodeURIComponent(q)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      const list: StateOption[] = Array.isArray(json?.data) ? json.data : [];
      setStates(list);
    } catch {
      // ignore
    } finally {
      setStatesLoading(false);
    }
  };

  const handleDistrictInputChange = (val: string, modalType: 'add' | 'update') => {
    setDistrictQuery(val);
    setDistrictOpen(true);
    setDistrictModalType(modalType);
  };

  const handleDistrictFocus = (modalType: 'add' | 'update') => {
    setDistrictOpen(true);
    setDistrictModalType(modalType);
    const currentDistrictId = modalType === 'add' ? addFormData.districtId : updateFormData.districtId;
    if (!currentDistrictId) {
      setDistrictQuery('');
    }
  };

  const handleSelectDistrict = (district: DistrictOption, modalType: 'add' | 'update') => {
    setDistrictQuery('');
    if (modalType === 'add') {
      setAddFormData(prev => ({
        ...prev,
        districtId: district.id,
        districtName: district.name,
        stateId: null,
        stateName: '',
      }));
    } else {
      setUpdateFormData(prev => ({
        ...prev,
        districtId: district.id,
        districtName: district.name,
        stateId: null,
        stateName: '',
      }));
    }
    setStateQuery('');
    setDistrictOpen(false);
  };

  const handleStateInputChange = (val: string, modalType: 'add' | 'update') => {
    setStateQuery(val);
    setStateOpen(true);
    setStateModalType(modalType);
    const currentDistrictId = modalType === 'add' ? addFormData.districtId : updateFormData.districtId;
    if (stateDebounceRef.current) window.clearTimeout(stateDebounceRef.current);
    if (currentDistrictId) {
      stateDebounceRef.current = window.setTimeout(() => fetchStateSuggestions(currentDistrictId, val.trim()), 250);
    }
  };

  const handleSelectState = (state: StateOption, modalType: 'add' | 'update') => {
    setStateQuery('');
    if (modalType === 'add') {
      setAddFormData(prev => ({
        ...prev,
        stateId: state.id,
        stateName: state.name,
      }));
    } else {
      setUpdateFormData(prev => ({
        ...prev,
        stateId: state.id,
        stateName: state.name,
      }));
    }
    setStateOpen(false);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !addFormData.address || !addFormData.districtId || !addFormData.stateId || !addFormData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/shipping/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          address: addFormData.address,
          country_id: addFormData.districtId,
          state_id: addFormData.stateId,
          phone: addFormData.phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Address created successfully! 🎉');
        await fetchAddresses();
        setIsAddModalOpen(false);
        setAddFormData({
          phone: '',
          address: '',
          districtId: null,
          districtName: '',
          stateId: null,
          stateName: '',
        });
        setDistrictQuery('');
        setStateQuery('');
      } else {
        toast.error(data.message || 'Failed to create address');
      }
    } catch (error) {
      console.error('Error creating address:', error);
      toast.error('Failed to create address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !updateFormData.id || !updateFormData.address || !updateFormData.districtId || !updateFormData.stateId || !updateFormData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/shipping/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: updateFormData.id,
          address: updateFormData.address,
          country_id: updateFormData.districtId,
          state_id: updateFormData.stateId,
          phone: updateFormData.phone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Address updated successfully! ✅');
        await fetchAddresses();
        setIsUpdateModalOpen(false);
        setUpdateFormData({
          id: null,
          phone: '',
          address: '',
          districtId: null,
          districtName: '',
          stateId: null,
          stateName: '',
        });
        setDistrictQuery('');
        setStateQuery('');
      } else {
        toast.error(data.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accessToken || !addressToDelete) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/shipping/delete/${addressToDelete}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Address deleted successfully! 🗑️');
        await fetchAddresses();
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
      } else {
        toast.error(data.message || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleEdit = (address: ShippingAddress) => {
    setUpdateFormData({
      id: address.id,
      phone: address.phone,
      address: address.address,
      districtId: address.country_id,
      districtName: address.country_name,
      stateId: address.state_id,
      stateName: address.state_name,
    });
    setIsUpdateModalOpen(true);
    setDistrictModalType('update');
  };

  const handleMakeDefault = async (id: number) => {
    if (!accessToken) return;

    try {
      const res = await fetch('/api/shipping/make_default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Default address updated successfully! ⭐');
        await fetchAddresses();
      } else {
        toast.error(data.message || 'Failed to set default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      phone: '',
      address: '',
      districtId: null,
      districtName: '',
      stateId: null,
      stateName: '',
    });
    setDistrictQuery('');
    setStateQuery('');
    setDistrictModalType(null);
    setStateModalType(null);
    setDistrictOpen(false);
    setStateOpen(false);
  };

  const resetUpdateForm = () => {
    setUpdateFormData({
      id: null,
      phone: '',
      address: '',
      districtId: null,
      districtName: '',
      stateId: null,
      stateName: '',
    });
    setDistrictQuery('');
    setStateQuery('');
    setDistrictModalType(null);
    setStateModalType(null);
    setDistrictOpen(false);
    setStateOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Address Book</h1>
        <p className="text-gray-600">Please log in to view your addresses</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px] relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
        <button 
          onClick={() => {
            resetAddForm();
            setIsAddModalOpen(true);
          }}
          className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Add New
        </button>
      </div>

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No addresses found</p>
          <button 
            onClick={() => {
              resetAddForm();
              setIsAddModalOpen(true);
            }}
            className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100 relative">
              {/* Action Icons */}
              <div className="absolute top-6 right-6 flex gap-4 text-gray-600">
                <button 
                  onClick={() => handleEdit(address)}
                  className="hover:text-orange-600 transition-colors"
                  title="Edit"
                >
                  <FiEdit size={20} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(address.id)}
                  className="hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              {/* Address Details */}
              <div className="space-y-3 pr-24">
                <p className="text-gray-700">
                  <span className="font-medium">Phone number :</span> {address.phone}
                </p>
                <p className="text-gray-700 leading-relaxed max-w-2xl">
                  <span className="font-medium">Address :</span> {address.address}
                </p>
                {(address.country_name || address.state_name) && (
                  <p className="text-gray-700">
                    <span className="font-medium">Location :</span> {[address.state_name, address.country_name].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {/* Default Badge and Actions */}
              <div className="absolute bottom-6 right-6 flex items-center gap-4">
                {address.set_default === 1 && (
                  <span className="bg-[#FFEDE4] text-[#FF8A5C] px-4 py-1.5 rounded-lg text-sm font-semibold border border-[#FFD8C7]">
                    Default
                  </span>
                )}
                {address.set_default === 0 && (
                  <button
                    onClick={() => handleMakeDefault(address.id)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD MODAL OVERLAY --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetAddForm();
                }}
                className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Go back
              </button>
            </div>

            {/* Modal Form */}
            <form className="p-6 space-y-5" onSubmit={handleAddSubmit}>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone number *</label>
                <input 
                  type="text" 
                  placeholder="Enter phone number (e.g., +1234567890)"
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              {/* District & Upazila Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">District *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Select or search district"
                      value={districtModalType === 'add' && districtOpen ? districtQuery : (addFormData.districtName || '')}
                      onChange={(e) => handleDistrictInputChange(e.target.value, 'add')}
                      onFocus={() => handleDistrictFocus('add')}
                      onBlur={() => setTimeout(() => setDistrictOpen(false), 150)}
                      className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                      required
                    />
                    {districtOpen && districtModalType === 'add' && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {districtsLoading ? (
                          <div className="p-2 text-sm text-gray-500">Loading districts...</div>
                        ) : districts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">No districts available</div>
                        ) : filteredDistricts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No districts found matching &quot;{districtQuery}&quot;
                          </div>
                        ) : (
                          filteredDistricts.map((district) => (
                            <button
                              type="button"
                              key={district.id}
                              className="w-full text-left px-3 py-2 hover:bg-orange-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectDistrict(district, 'add')}
                            >
                              <span className="font-medium text-gray-800">{district.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <input type="hidden" value={addFormData.districtId || ''} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Upazila / Thana *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={addFormData.districtId ? "Select or search upazila/thana" : "Select district first"}
                      value={stateModalType === 'add' && stateOpen ? stateQuery : (addFormData.stateName || '')}
                      onChange={(e) => handleStateInputChange(e.target.value, 'add')}
                      onFocus={() => {
                        if (addFormData.districtId) {
                          setStateOpen(true);
                          setStateModalType('add');
                        }
                      }}
                      onBlur={() => setTimeout(() => setStateOpen(false), 150)}
                      disabled={!addFormData.districtId}
                      className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                    />
                    {stateOpen && stateModalType === 'add' && addFormData.districtId && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {statesLoading && (
                          <div className="p-2 text-sm text-gray-500">Loading...</div>
                        )}
                        {!statesLoading && filteredStates.length === 0 && (
                          <div className="p-2 text-sm text-gray-500">No upazilas/thanas found</div>
                        )}
                        {!statesLoading && filteredStates.map((state) => (
                          <button
                            type="button"
                            key={state.id}
                            className="w-full text-left px-3 py-2 hover:bg-orange-50"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectState(state, 'add')}
                          >
                            <span className="font-medium text-gray-800">{state.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="hidden" value={addFormData.stateId || ''} required />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Address line *</label>
                <input 
                  type="text" 
                  placeholder="road/ home number"
                  value={addFormData.address}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-10 py-2.5 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UPDATE MODAL OVERLAY --- */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Update address</h2>
              <button 
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  resetUpdateForm();
                }}
                className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Go back
              </button>
            </div>

            {/* Modal Form */}
            <form className="p-6 space-y-5" onSubmit={handleUpdateSubmit}>
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone number *</label>
                <input 
                  type="text" 
                  placeholder="Enter phone number (e.g., +1234567890)"
                  value={updateFormData.phone}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              {/* District & Upazila Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">District *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Select or search district"
                      value={districtModalType === 'update' && districtOpen ? districtQuery : (updateFormData.districtName || '')}
                      onChange={(e) => handleDistrictInputChange(e.target.value, 'update')}
                      onFocus={() => handleDistrictFocus('update')}
                      onBlur={() => setTimeout(() => setDistrictOpen(false), 150)}
                      className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                      required
                    />
                    {districtOpen && districtModalType === 'update' && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {districtsLoading ? (
                          <div className="p-2 text-sm text-gray-500">Loading districts...</div>
                        ) : districts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">No districts available</div>
                        ) : filteredDistricts.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            No districts found matching &quot;{districtQuery}&quot;
                          </div>
                        ) : (
                          filteredDistricts.map((district) => (
                            <button
                              type="button"
                              key={district.id}
                              className="w-full text-left px-3 py-2 hover:bg-orange-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSelectDistrict(district, 'update')}
                            >
                              <span className="font-medium text-gray-800">{district.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <input type="hidden" value={updateFormData.districtId || ''} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Upazila / Thana *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder={updateFormData.districtId ? "Select or search upazila/thana" : "Select district first"}
                      value={stateModalType === 'update' && stateOpen ? stateQuery : (updateFormData.stateName || '')}
                      onChange={(e) => handleStateInputChange(e.target.value, 'update')}
                      onFocus={() => {
                        if (updateFormData.districtId) {
                          setStateOpen(true);
                          setStateModalType('update');
                        }
                      }}
                      onBlur={() => setTimeout(() => setStateOpen(false), 150)}
                      disabled={!updateFormData.districtId}
                      className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                    />
                    {stateOpen && stateModalType === 'update' && updateFormData.districtId && (
                      <div className="absolute z-20 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                        {statesLoading && (
                          <div className="p-2 text-sm text-gray-500">Loading...</div>
                        )}
                        {!statesLoading && filteredStates.length === 0 && (
                          <div className="p-2 text-sm text-gray-500">No upazilas/thanas found</div>
                        )}
                        {!statesLoading && filteredStates.map((state) => (
                          <button
                            type="button"
                            key={state.id}
                            className="w-full text-left px-3 py-2 hover:bg-orange-50"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectState(state, 'update')}
                          >
                            <span className="font-medium text-gray-800">{state.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="hidden" value={updateFormData.stateId || ''} required />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Address line *</label>
                <input 
                  type="text" 
                  placeholder="road/ home number"
                  value={updateFormData.address}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-10 py-2.5 rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Updating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Delete Address</h2>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}