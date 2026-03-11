import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';

export default function AdminBranches() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { showToast } = useToast();
    
    const [branches, setBranches] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch branches and all students (members)
            const [branchesRes, membersRes] = await Promise.all([
                fetch('http://localhost:5000/api/branches'),
                fetch('http://localhost:5000/api/admin/members', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (branchesRes.ok && membersRes.ok) {
                const branchesData = await branchesRes.json();
                const membersData = await membersRes.json();
                
                setBranches(branchesData);
                setStudents(membersData);

                if (branchesData.length > 0 && !selectedBranchId) {
                    setSelectedBranchId(branchesData[0].id);
                }
            } else {
                showToast('Failed to load data', 'error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Network error loading data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter students by the currently selected branch tab
    const filteredStudents = students.filter(student => student.branch_id === selectedBranchId && student.role !== 'admin');
    const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name || '';

    // Map database defaults to screenshot tab styles for closer visual matching
    const formatTabName = (name) => {
        if (name === 'Electrical and electronics') return 'Electrical & Electronics';
        if (name === 'Mechanical and engineering') return 'Mechanical';
        return name;
    }

    return (
        <div className={`p-8 rounded-2xl shadow-sm max-w-5xl mx-auto ${isDark ? 'bg-[#241a0f]' : 'bg-white'}`}>
            <div className="mb-8">
                <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#3e2f1c]'}`}>
                    Manage Students
                </h2>
            </div>

            {/* Branch Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
                {branches.map(branch => {
                    const isSelected = selectedBranchId === branch.id;
                    return (
                        <button
                            key={branch.id}
                            onClick={() => setSelectedBranchId(branch.id)}
                            className={`px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200
                                ${isSelected 
                                    ? 'bg-[#b8860b] text-white shadow-md transform scale-105' 
                                    : isDark 
                                        ? 'bg-[#3e2f1c] text-gray-300 hover:bg-[#4a3922]' 
                                        : 'bg-[#fff9f2] text-[#8e7a62] hover:bg-orange-50'
                                }`}
                        >
                            {formatTabName(branch.name)}
                        </button>
                    );
                })}
            </div>

            {/* Title for Data Table */}
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-gray-200' : 'text-[#3e2f1c]'}`}>
                Students from {formatTabName(selectedBranchName)}
            </h3>

            {/* Data Table */}
            {loading ? (
                <div className="text-center py-12">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
                <div className={`text-center py-12 rounded-xl text-lg ${isDark ? 'bg-[#1a1209] text-gray-500' : 'bg-gray-50 text-gray-500'}`}>
                    No students found for this branch.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-[#1a1209] text-gray-400' : 'bg-[#fff9f2] text-[#3e2f1c]'} rounded-xl`}>
                                <th className="py-4 px-6 font-semibold text-sm tracking-wider rounded-l-xl">REG. NUMBER</th>
                                <th className="py-4 px-6 font-semibold text-sm tracking-wider">IMAGE</th>
                                <th className="py-4 px-6 font-semibold text-sm tracking-wider">NAME</th>
                                <th className="py-4 px-6 font-semibold text-sm tracking-wider">EMAIL</th>
                                <th className="py-4 px-6 font-semibold text-sm tracking-wider rounded-r-xl">PHONE</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4 before:content-[''] before:block before:h-4">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className={`group ${isDark ? 'border-b border-orange-900/20' : 'border-b border-gray-100/80'}`}>
                                    <td className={`py-5 px-6 whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {student.reg_number || 'N/A'}
                                    </td>
                                    
                                    {/* Image Column */}
                                    <td className="py-5 px-6">
                                        {student.avatar_url ? (
                                            <img
                                                src={student.avatar_url.startsWith('http') ? student.avatar_url : `http://localhost:5000${student.avatar_url}`}
                                                alt={student.name}
                                                className="w-12 h-12 rounded-full object-cover outline outline-2 outline-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br from-gray-400 to-gray-500 shadow-sm">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>

                                    {/* Name Column */}
                                    <td className="py-5 px-6 font-medium flex items-center gap-4 h-full">
                                        {/* Name Initial Avatar Circle */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-[#b8860b] mt-1
                                            ${isDark ? 'bg-[#b8860b]/20 text-[#d4a83e]' : 'bg-[#fff3e0] shadow-inner'}`}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-[1.05rem] mt-1 ${isDark ? 'text-gray-200' : 'text-[#2d2d2d]'}`}>{student.name}</span>
                                    </td>

                                    {/* Email Column */}
                                    <td className={`py-5 px-6 font-medium ${isDark ? 'text-gray-300' : 'text-[#4a4a4a]'}`}>
                                        <a href={`mailto:${student.email}`} className="hover:text-[#b8860b] transition-colors">{student.email || 'N/A'}</a>
                                    </td>

                                    {/* Phone Column */}
                                    <td className={`py-5 px-6 font-medium whitespace-nowrap ${isDark ? 'text-gray-300' : 'text-[#4a4a4a]'}`}>
                                        {student.phone || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
