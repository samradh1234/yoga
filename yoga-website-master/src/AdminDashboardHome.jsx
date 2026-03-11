import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

export default function AdminDashboardHome() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 1. All State Hooks
    const [allMembers, setAllMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    // Modals State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addError, setAddError] = useState('');
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editUserForm, setEditUserForm] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState('');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // 2. All Ref Hooks

    // 3. Helper Functions
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return 'fa-sort text-gray-400 opacity-30';
        return sortConfig.direction === 'asc' ? 'fa-sort-up text-[#b8860b]' : 'fa-sort-down text-[#b8860b]';
    };

    // 4. All Effect Hooks
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/admin/members', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllMembers(data);
                    setMembers(data);
                } else {
                    setError('Failed to load members');
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching members');
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        let filtered = [...allMembers];

        // Search
        if (searchQuery.trim()) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(m => m.name.toLowerCase().includes(lowerQ) || m.email.toLowerCase().includes(lowerQ));
        }

        // Sort
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key] || '';
                let bValue = b[sortConfig.key] || '';
                if (sortConfig.key === 'created_at') {
                    aValue = new Date(aValue.includes('T') ? aValue : aValue.replace(' ', 'T') + 'Z').getTime();
                    bValue = new Date(bValue.includes('T') ? bValue : bValue.replace(' ', 'T') + 'Z').getTime();
                } else {
                    aValue = aValue.toString().toLowerCase();
                    bValue = bValue.toString().toLowerCase();
                }
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setMembers(filtered);
        setCurrentPage(1);
    }, [searchQuery, sortConfig, allMembers]);

    useEffect(() => {
        const handleClickOutside = (event) => {
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 5. Action Handlers
    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddError('');
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newUserForm)
            });
            const data = await response.json();
            if (response.ok) {
                setAllMembers([data.user, ...allMembers]);
                setIsAddUserOpen(false);
                setNewUserForm({ name: '', email: '', password: '' });
            } else {
                setAddError(data.error || 'Failed to add user');
            }
        } catch (err) {
            setAddError('A network error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        setEditError('');
        setIsEditing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${editUserForm.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editUserForm)
            });
            const data = await response.json();
            if (response.ok) {
                setAllMembers(allMembers.map(m => m.id === data.user.id ? data.user : m));
                setIsEditUserOpen(false);
                setEditUserForm(null);
            } else {
                setEditError(data.error || 'Failed to edit user');
            }
        } catch (err) {
            setEditError('A network error occurred');
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteUser = async () => {
        setDeleteError('');
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAllMembers(allMembers.filter(m => m.id !== userToDelete.id));
                setIsDeleteOpen(false);
                setUserToDelete(null);
            } else {
                const data = await response.json();
                setDeleteError(data.error || 'Failed to delete user');
            }
        } catch (err) {
            setDeleteError('A network error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    // 6. Template Logic
    const totalPages = Math.ceil(members.length / rowsPerPage);
    const paginatedMembers = members.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="flex-1 overflow-y-auto w-full h-full flex flex-col pt-2">
            <div className="w-full h-full flex flex-col">
                <div className={`flex-1 rounded-xl shadow-sm border flex flex-col ${isDark ? 'bg-[#241a0f] border-orange-900/30' : 'bg-white border-orange-100'}`}>
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b dark:border-gray-700">
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <div className={`relative flex items-center border rounded-full px-3 py-1.5 ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} w-64`}>
                                <i className="fas fa-search text-gray-400 text-sm"></i>
                                <input type="text" placeholder="Search" className="ml-2 w-full bg-transparent outline-none text-sm dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>



                            <button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2 bg-[#b8860b] hover:bg-[#9a7009] text-white rounded-full px-4 py-1.5 text-sm font-semibold transition shadow-sm">
                                <i className="fas fa-plus"></i> Add User
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {error ? (<p className="text-red-500 text-sm p-6">{error}</p>) : members.length === 0 ? (<p className="text-gray-400 text-sm italic p-6 border-t dark:border-gray-700">No members match current filters.</p>) : (
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className={`text-xs uppercase bg-[#3e2f1c] sticky top-0 z-10 ${isDark ? 'text-gray-200' : 'text-white'}`}>
                                    <tr>
                                        <th className="w-12 px-6 py-3">Selection</th>
                                        <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('name')}>
                                            Full Name <i className={`fas ${getSortIcon('name')} ml-1`}></i>
                                        </th>
                                        <th className="px-6 py-3 cursor-pointer" onClick={() => requestSort('email')}>
                                            Email <i className={`fas ${getSortIcon('email')} ml-1`}></i>
                                        </th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedMembers.map((member) => (
                                        <tr key={member.id} className={`border-b ${isDark ? 'border-gray-700/50 hover:bg-gray-800' : 'border-gray-100 hover:bg-[#f6f9fc]'} transition-colors group cursor-pointer`}>
                                            <td className="px-6 py-4">
                                                <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 group-hover:border-[#5cbdba] transition-colors"></div>
                                            </td>
                                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[#b8860b]/30 text-[#b8860b] flex items-center justify-center font-bold text-xs uppercase border border-[#b8860b]/20">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span className={`${isDark ? 'text-gray-200' : 'text-[#3e2f1c] font-semibold'}`}>{member.name}</span>
                                            </td>
                                            <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-[#5b738b]'}`}>{member.email}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditError('');
                                                        setEditUserForm(member);
                                                        setIsEditUserOpen(true);
                                                    }}
                                                    className="text-gray-400 hover:text-[#b8860b] transition"
                                                >
                                                    <i className="fas fa-pencil-alt text-sm"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteError('');
                                                        setUserToDelete(member);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                    className="text-[#ff998f] hover:text-red-500 transition"
                                                >
                                                    <i className="far fa-trash-alt text-sm"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className={`border-t sticky bottom-0 z-10 ${isDark ? 'border-orange-900/40 bg-[#241a0f]' : 'border-orange-100 bg-white'}`}>
                                    <tr>
                                        <td colSpan="7" className="px-6 py-3">
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <span>Rows per page</span>
                                                    <div className="border border-gray-300 rounded px-2 py-0.5 flex items-center gap-2">
                                                        10 <i className="fas fa-chevron-down text-[10px]"></i>
                                                    </div>
                                                    <span className="ml-2">of {members.length} rows</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className={`w-7 h-7 flex items-center justify-center rounded-full ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                    ><i className="fas fa-chevron-left text-[10px]"></i></button>

                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setCurrentPage(i + 1)}
                                                            className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#3e2f1c] text-white' : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}

                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages || totalPages === 0}
                                                        className={`w-7 h-7 flex items-center justify-center rounded-full ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                    ><i className="fas fa-chevron-right text-[10px]"></i></button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {
                isAddUserOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add New User</h3>
                                <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            {addError && (
                                <div className="mb-4 p-3 bg-red-100/50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {addError}
                                </div>
                            )}

                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-[#5cbdba]/50'}`}
                                        value={newUserForm.name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-[#5cbdba]/50'}`}
                                        value={newUserForm.email}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Temporary Password *</label>
                                        <input
                                            type="password"
                                            required
                                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-[#5cbdba]/50'}`}
                                            value={newUserForm.password}
                                            onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => !isSubmitting && setIsAddUserOpen(false)}
                                        className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 bg-[#b8860b] hover:bg-[#9a7009] text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                                    >
                                        {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Edit User Modal */}
            {
                isEditUserOpen && editUserForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Edit User</h3>
                                <button onClick={() => !isEditing && setIsEditUserOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            {editError && (
                                <div className="mb-4 p-3 bg-red-100/50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {editError}
                                </div>
                            )}

                            <form onSubmit={handleEditUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-[#5cbdba]/50'}`}
                                        value={editUserForm.name}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all ${isDark ? 'bg-gray-700 border-gray-600 focus:ring-blue-500/50' : 'bg-gray-50 border-gray-200 focus:ring-[#5cbdba]/50'}`}
                                        value={editUserForm.email}
                                        onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => !isEditing && setIsEditUserOpen(false)}
                                        className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                        disabled={isEditing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditing}
                                        className="px-5 py-2.5 bg-[#b8860b] hover:bg-[#9a7009] text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                                    >
                                        {isEditing ? <i className="fas fa-circle-notch fa-spin"></i> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                isDeleteOpen && userToDelete && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-sm p-6 rounded-2xl shadow-xl text-center ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-exclamation-triangle text-2xl text-red-500 dark:text-red-400"></i>
                            </div>

                            <h3 className="text-xl font-bold mb-2">Delete User?</h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-200">{userToDelete.name}</span>? This action cannot be undone.
                            </p>

                            {deleteError && (
                                <div className="mb-4 p-3 bg-red-100/50 border border-red-200 text-red-600 rounded-lg text-sm text-left">
                                    {deleteError}
                                </div>
                            )}

                            <div className="flex gap-3 justify-center w-full">
                                <button
                                    type="button"
                                    onClick={() => !isDeleting && setIsDeleteOpen(false)}
                                    className={`flex-1 px-5 py-2.5 rounded-xl font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteUser}
                                    disabled={isDeleting}
                                    className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center"
                                >
                                    {isDeleting ? <i className="fas fa-circle-notch fa-spin"></i> : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <style>{`
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
