import React, { useState } from 'react';
import { User, UserStatus, PropertyContextType } from '../types';
import { INITIAL_USERS } from '../constants';
import { Shield, CheckCircle, XCircle, Clock, User as UserIcon, Building, Lock, LogIn, Key, Mail, Smartphone, ArrowLeft, Send, AlertTriangle, LayoutList, Trash2, MapPin } from 'lucide-react';

interface AdminProps {
  propertyContext: PropertyContextType;
}

const Admin: React.FC<AdminProps> = ({ propertyContext }) => {
  // Global State (In a real app, this would be on the server)
  const [currentAccessCode, setCurrentAccessCode] = useState('admin123');
  
  // View State
  type AdminView = 'LOGIN' | 'DASHBOARD' | 'VERIFY_METHOD' | 'VERIFY_OTP' | 'SET_NEW_CODE';
  const [view, setView] = useState<AdminView>('LOGIN');

  // Dashboard Tab State
  type DashboardTab = 'PUBLISHERS' | 'PROPERTIES';
  const [activeTab, setActiveTab] = useState<DashboardTab>('PUBLISHERS');

  // Auth/Reset State
  const [loginInput, setLoginInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [resetMethod, setResetMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [otpInput, setOtpInput] = useState('');
  const [newCodeInput, setNewCodeInput] = useState('');
  const [confirmCodeInput, setConfirmCodeInput] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const { properties, deleteProperty } = propertyContext;

  // --- Actions ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput === currentAccessCode) {
      setView('DASHBOARD');
      setAuthError('');
      setLoginInput('');
    } else {
      setAuthError('Invalid access code. Please try again.');
    }
  };

  const handleLogout = () => {
    setView('LOGIN');
    setLoginInput('');
  };

  const handleApprove = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: UserStatus.APPROVED } : user
    ));
  };

  const handleReject = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: UserStatus.REJECTED } : user
    ));
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property? This action implies the property has been sold or removed.")) {
      deleteProperty(id);
    }
  };

  // --- Reset Flow Actions ---

  const startResetFlow = () => {
    setView('VERIFY_METHOD');
    setResetError('');
    setResetSuccess('');
    setOtpInput('');
    setNewCodeInput('');
    setConfirmCodeInput('');
  };

  const handleSendVerification = () => {
    setIsSending(true);
    setResetError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setResetSuccess(`Verification code sent to ${resetMethod === 'EMAIL' ? 'neutechcoding@gmail.com' : '09062712610'}`);
      
      // Auto transition after showing success briefly
      setTimeout(() => {
        setView('VERIFY_OTP');
        setResetSuccess('');
        // Demo Hint
        alert('DEMO: Your verification code is 123456');
      }, 1500);
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456') {
      setView('SET_NEW_CODE');
      setResetError('');
    } else {
      setResetError('Invalid verification code. Try "123456".');
    }
  };

  const handleUpdateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCodeInput.length < 6) {
      setResetError('Access code must be at least 6 characters.');
      return;
    }
    if (newCodeInput !== confirmCodeInput) {
      setResetError('Codes do not match.');
      return;
    }

    setCurrentAccessCode(newCodeInput);
    setResetSuccess('Access code updated successfully!');
    
    setTimeout(() => {
      setView('LOGIN');
      setResetSuccess('');
      setLoginInput('');
    }, 2000);
  };

  // --- Derived State ---
  const pendingUsers = users.filter(u => u.status === UserStatus.PENDING);
  const approvedUsers = users.filter(u => u.status === UserStatus.APPROVED);
  const rejectedUsers = users.filter(u => u.status === UserStatus.REJECTED);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  // --- Renders ---

  // 1. Verify Method Selection
  if (view === 'VERIFY_METHOD') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 relative">
          <button onClick={() => setView('LOGIN')} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center mb-8 mt-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Security Check</h2>
            <p className="text-gray-500 mt-2">How do you want to verify your identity?</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setResetMethod('EMAIL')}
              className={`w-full p-4 border-2 rounded-xl flex items-center transition-all ${
                resetMethod === 'EMAIL' ? 'border-secondary bg-amber-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                resetMethod === 'EMAIL' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Email Verification</p>
                <p className="text-sm text-gray-500">Send code to neutechcoding@gmail.com</p>
              </div>
            </button>

            <button
              onClick={() => setResetMethod('PHONE')}
              className={`w-full p-4 border-2 rounded-xl flex items-center transition-all ${
                resetMethod === 'PHONE' ? 'border-secondary bg-amber-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                resetMethod === 'PHONE' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <Smartphone size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">SMS Verification</p>
                <p className="text-sm text-gray-500">Send code to 09062712610</p>
              </div>
            </button>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSendVerification}
              disabled={isSending}
              className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSending ? (
                <span className="flex items-center"><Clock size={18} className="animate-spin mr-2"/> Sending...</span>
              ) : (
                <span className="flex items-center">Send Verification Code <Send size={18} className="ml-2"/></span>
              )}
            </button>
          </div>
          
          {resetSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center justify-center">
              <CheckCircle size={16} className="mr-2" /> {resetSuccess}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Verify OTP
  if (view === 'VERIFY_OTP') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 relative">
          <button onClick={() => setView('VERIFY_METHOD')} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </button>

          <div className="text-center mb-8 mt-4">
            <div className="w-16 h-16 bg-amber-100 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Key size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Enter Code</h2>
            <p className="text-gray-500 mt-2">
              We sent a code to <br/>
              <span className="font-semibold text-gray-800">
                {resetMethod === 'EMAIL' ? 'neutechcoding@gmail.com' : '09062712610'}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="block w-full text-center text-3xl tracking-[1em] font-bold py-4 border-b-2 border-gray-300 focus:border-secondary focus:outline-none transition-colors"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            
            {resetError && (
              <p className="text-center text-sm text-red-600 flex items-center justify-center">
                <AlertTriangle size={14} className="mr-1"/> {resetError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-amber-600 text-primary font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
            >
              Verify Code
            </button>
          </form>

          <div className="mt-6 text-center">
             <button 
                onClick={handleSendVerification}
                className="text-sm text-primary hover:underline font-medium"
             >
               Didn't receive code? Resend
             </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Set New Code
  if (view === 'SET_NEW_CODE') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">New Access Code</h2>
            <p className="text-gray-500 mt-2">Create a new secure access code.</p>
          </div>

          <form onSubmit={handleUpdateCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Code</label>
              <input
                type="password"
                value={newCodeInput}
                onChange={(e) => setNewCodeInput(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                placeholder="Enter new code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Code</label>
              <input
                type="password"
                value={confirmCodeInput}
                onChange={(e) => setConfirmCodeInput(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                placeholder="Re-enter new code"
              />
            </div>

            {resetError && (
              <p className="text-sm text-red-600 flex items-center">
                <XCircle size={14} className="mr-1"/> {resetError}
              </p>
            )}

            {resetSuccess && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center justify-center font-medium">
                <CheckCircle size={16} className="mr-2" /> {resetSuccess}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
            >
              Update Access Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Login Screen (Default)
  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-secondary shadow-lg">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
            <p className="text-gray-500 mt-2">Enter your access code to manage publishers.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary transition-colors outline-none"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={18} className="text-gray-400" />
                </div>
              </div>
              {authError && <p className="mt-2 text-sm text-red-600 flex items-center"><XCircle size={14} className="mr-1"/> {authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-secondary hover:bg-amber-600 text-primary font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md transform hover:scale-[1.02] duration-200"
            >
              <LogIn size={18} className="mr-2" /> Login to Dashboard
            </button>
          </form>
           
           <div className="mt-6 flex flex-col items-center gap-4">
             <button 
                onClick={startResetFlow}
                className="text-sm text-primary hover:text-secondary font-medium transition-colors"
             >
                Forgot Access Code?
             </button>
             <p className="text-xs text-gray-400">Restricted area. Unauthorized access is prohibited.</p>
           </div>
        </div>
      </div>
    );
  }

  // 5. Main Dashboard
  return (
    <div className="min-h-screen">
      <div className="bg-primary/90 backdrop-blur text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="mr-3 text-secondary" /> Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage publisher approvals and platform users.</p>
          </div>
          <div className="flex gap-3">
             <button
              onClick={startResetFlow}
              className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/10"
             >
                <Key size={16} /> Change Access Code
             </button>
            <button 
                onClick={handleLogout}
                className="text-sm bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
                Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 rounded-xl bg-white/20 backdrop-blur-md p-1 mb-8 w-fit mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('PUBLISHERS')}
            className={`flex items-center rounded-lg py-2.5 px-6 text-sm font-medium leading-5 transition-all
              ${activeTab === 'PUBLISHERS'
                ? 'bg-white text-primary shadow'
                : 'text-white hover:bg-white/[0.12] hover:text-white'
              }`}
          >
            <UserIcon size={16} className="mr-2" /> Publisher Requests
          </button>
          <button
            onClick={() => setActiveTab('PROPERTIES')}
            className={`flex items-center rounded-lg py-2.5 px-6 text-sm font-medium leading-5 transition-all
              ${activeTab === 'PROPERTIES'
                ? 'bg-white text-primary shadow'
                : 'text-white hover:bg-white/[0.12] hover:text-white'
              }`}
          >
            <LayoutList size={16} className="mr-2" /> Manage Properties
          </button>
        </div>

        {activeTab === 'PUBLISHERS' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 border-secondary flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Pending Requests</p>
                  <h3 className="text-3xl font-bold text-gray-800">{pendingUsers.length}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full text-secondary">
                  <Clock size={24} />
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 border-green-500 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Active Publishers</p>
                  <h3 className="text-3xl font-bold text-gray-800">{approvedUsers.length}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 border-red-500 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">Rejected/Blocked</p>
                  <h3 className="text-3xl font-bold text-gray-800">{rejectedUsers.length}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <XCircle size={24} />
                </div>
              </div>
            </div>

            {/* Pending Approvals Section */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden mb-8 border border-white/20">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Pending Approval Requests</h2>
                <span className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded-full">
                  {pendingUsers.length} New
                </span>
              </div>

              {pendingUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No pending publisher requests.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Requested</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center gap-1">
                                <Building size={14} className="text-gray-400" />
                                {user.businessName}
                            </div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.dateRequested)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleApprove(user.id)}
                              className="text-green-600 hover:text-green-900 mr-4 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(user.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Previously Approved/Rejected (Simplified List) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Approved List */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={20} /> Approved Publishers
                    </h3>
                    <div className="space-y-4">
                        {approvedUsers.length === 0 && <p className="text-gray-500 text-sm">No approved users yet.</p>}
                        {approvedUsers.map(user => (
                            <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.businessName}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rejected List */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <XCircle className="text-red-500 mr-2" size={20} /> Rejected Publishers
                    </h3>
                    <div className="space-y-4">
                        {rejectedUsers.length === 0 && <p className="text-gray-500 text-sm">No rejected users.</p>}
                        {rejectedUsers.map(user => (
                            <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.businessName}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    Rejected
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </>
        )}

        {activeTab === 'PROPERTIES' && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl overflow-hidden mb-8 border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Manage Properties</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                {properties.length} Active Listings
              </span>
            </div>

            {properties.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Building className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No properties available to manage.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                              <img src={property.imageUrl} alt={property.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{property.title}</div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{property.description}</div>
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200">
                                {property.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <MapPin size={14} className="text-gray-400 mr-1" />
                            {property.location.state}
                          </div>
                          <div className="text-xs text-gray-500 ml-5">{property.location.lga}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{formatPrice(property.price)}</div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                            ${property.type === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors flex items-center ml-auto group"
                            title="Mark as Sold/Rented (Delete)"
                          >
                            <Trash2 size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;