import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaBook, FaBuilding, FaClock, FaSearch, FaEdit, FaSave, FaTimes, FaUsers } from 'react-icons/fa';

function GiangVienDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [diemTamThoi, setDiemTamThoi] = useState({});
  const [loiDiem, setLoiDiem] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://apiwebsa.onrender.com/api';

  // Fetch subjects taught by the lecturer
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/giangvien/lophoc`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Group by subject (monhoc) to avoid duplicates
        const uniqueSubjects = Array.from(
          new Map(response.data.map((item) => [item.monhoc_id, {
            id: item.monhoc_id,
            name: item.tenmon,
            code: item.monhoc_id, // Using monhoc_id as code
          }])).values()
        );
        setSubjects(uniqueSubjects);
      } catch (err) {
        setError('Không thể tải danh sách môn học');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [token]);

  // Handle subject selection
  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setSelectedRoom(null);
    setSelectedSession(null);
    setStudents([]);
    setTuKhoaTimKiem('');
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/giangvien/lophoc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredRooms = response.data
        .filter((item) => item.monhoc_id === subject.id)
        .map((item) => ({
          id: item.lophoc_id,
          name: `Lớp ${item.lophoc_id}`, // Customize as needed
        }));
      setRooms(filteredRooms);
    } catch (err) {
      setError('Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  // Handle room (class) selection
  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setSelectedSession(null);
    setStudents([]);
    setTuKhoaTimKiem('');
    try {
      setLoading(true);
      // For simplicity, sessions can be fetched from the same endpoint
      // Assuming sessions are tied to hocky or namhoc, or static for demo
      const response = await axios.get(`${API_BASE_URL}/giangvien/lophoc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const classData = response.data.find((item) => item.lophoc_id === room.id);
      const sessions = [
        { id: 1, time: `Học kỳ ${classData.hocky} - ${classData.namhoc}` },
      ];
      setSessions(sessions);
    } catch (err) {
      setError('Không thể tải danh sách ca học');
    } finally {
      setLoading(false);
    }
  };

  // Handle session selection and fetch students
  const handleSessionSelect = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/giangvien/lophoc/${selectedRoom.id}/sinhvien`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.map((sv) => ({
        id: sv.sinhvien_id,
        mssv: sv.masv,
        hoten: sv.hoten,
        diemQT: sv.diem_qua_trinh || 0,
        diemGK: sv.diem_giua_ky || 0,
        diemCK: sv.diem_cuoi_ky || 0,
      })));
      setSelectedSession(sessionId);
    } catch (err) {
      setError('Không thể tải danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Filter students based on search keyword
  const sinhVienDaLoc = students.filter(
    (sv) =>
      sv.mssv.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      sv.hoten.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

  // Start editing grades
  const batDauChinhSua = () => {
    setDangChinhSua(true);
    const diemMoi = {};
    students.forEach((sv) => {
      diemMoi[sv.id] = {
        diemQT: sv.diemQT,
        diemGK: sv.diemGK,
        diemCK: sv.diemCK,
      };
    });
    setDiemTamThoi(diemMoi);
  };

  // Save grades
  const luuDiem = async () => {
    // Kiểm tra xem có lỗi điểm nào không
    const coLoi = Object.values(loiDiem).some(loi => loi !== null);
    if (coLoi) {
      setError('Vui lòng kiểm tra lại các điểm không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const danhSachDiem = Object.entries(diemTamThoi).map(([sinhvien_id, diem]) => ({
        sinhvien_id,
        diem_qua_trinh: diem.diemQT === '' ? null : diem.diemQT,
        diem_giua_ky: diem.diemGK === '' ? null : diem.diemGK,
        diem_cuoi_ky: diem.diemCK === '' ? null : diem.diemCK,
        ghi_chu: '',
      }));
      await axios.post(
        `${API_BASE_URL}/giangvien/diem`,
        { lophoc_id: selectedRoom.id, danh_sach_diem: danhSachDiem },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        prev.map((sv) => ({
          ...sv,
          diemQT: diemTamThoi[sv.id]?.diemQT === '' ? null : diemTamThoi[sv.id]?.diemQT,
          diemGK: diemTamThoi[sv.id]?.diemGK === '' ? null : diemTamThoi[sv.id]?.diemGK,
          diemCK: diemTamThoi[sv.id]?.diemCK === '' ? null : diemTamThoi[sv.id]?.diemCK,
        }))
      );
      setDangChinhSua(false);
      setDiemTamThoi({});
    } catch (err) {
      setError('Không thể lưu điểm');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const huyChinhSua = () => {
    setDangChinhSua(false);
    setDiemTamThoi({});
  };

  // Update temporary grades
  const capNhatDiem = (svId, loaiDiem, giaTri) => {
    // Xóa lỗi cũ
    setLoiDiem((prev) => ({
      ...prev,
      [`${svId}-${loaiDiem}`]: null
    }));

    // Kiểm tra giá trị hợp lệ
    if (giaTri !== '') {
      const diem = parseFloat(giaTri);
      if (isNaN(diem) || diem < 0 || diem > 10) {
        setLoiDiem((prev) => ({
          ...prev,
          [`${svId}-${loaiDiem}`]: 'Điểm phải từ 0 đến 10'
        }));
        return;
      }
    }

    setDiemTamThoi((prev) => ({
      ...prev,
      [svId]: {
        ...prev[svId],
        [loaiDiem]: giaTri === '' ? '' : parseFloat(giaTri),
      },
    }));
  };

  // Delete grade
  const xoaDiem = (svId, loaiDiem) => {
    setDiemTamThoi((prev) => ({
      ...prev,
      [svId]: {
        ...prev[svId],
        [loaiDiem]: '',
      },
    }));
  };

  // Helper function to calculate tongKet
  const calculateTongKet = (diemQT, diemGK, diemCK) => {
    // Example formula: 20% quaTrinh + 30% giuaKy + 50% cuoiKy
    return ((diemQT * 0.2 + diemGK * 0.3 + diemCK * 0.5) || 0).toFixed(1);
  };

  // Helper function to determine result
  const ketQua = (diem) => {
    return diem >= 5 ? 'Đạt' : 'Không đạt';
  };

  // Helper function to determine result color
  const mauKetQua = (diem) => {
    return diem >= 5 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Lỗi: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-700">Giảng Viên</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Danh sách môn học */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 transition-all duration-300 ease-in-out">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectSelect(subject)}
              className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                selectedSubject?.id === subject.id
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-white hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <FaBook className="text-green-600 mr-2" />
                <div>
                  <h3 className="font-bold text-lg">{subject.name}</h3>
                  <p className="text-sm text-gray-600">Mã môn: {subject.code}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Danh sách lớp học */}
        {selectedSubject && (
          <div className="mt-6 transition-all duration-300 ease-in-out transform">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FaBuilding className="text-green-600 mr-2" />
              Lớp học - {selectedSubject.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    selectedRoom?.id === room.id
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-white hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <h4 className="font-bold">{room.name}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danh sách ca học */}
        {selectedRoom && (
          <div className="mt-6 transition-all duration-300 ease-in-out transform">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FaClock className="text-green-600 mr-2" />
              Ca học - {selectedRoom.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    selectedSession === session.id
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'bg-white hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {session.time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danh sách sinh viên */}
        {selectedSession && (
          <div className="mt-6 transition-all duration-300 ease-in-out transform">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 md:mb-0">
                  Danh sách sinh viên - {selectedSubject.name} - {selectedRoom.name} - Ca {selectedSession}
                </h3>
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={tuKhoaTimKiem}
                      onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                      placeholder="Tìm kiếm sinh viên..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                    />
                  </div>
                  {!dangChinhSua ? (
                    <button
                      onClick={batDauChinhSua}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 ease-in-out flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Chỉnh sửa điểm
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={luuDiem}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 ease-in-out flex items-center"
                      >
                        <FaSave className="mr-2" />
                        Lưu điểm
                      </button>
                      <button
                        onClick={huyChinhSua}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out flex items-center"
                      >
                        <FaTimes className="mr-2" />
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-200">
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sinh viên</h3>
                    <p className="mt-1 text-sm text-gray-500">Không có sinh viên nào trong ca học này.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STT
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MSSV
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Họ và tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quá trình
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giữa kỳ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cuối kỳ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng kết
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kết quả
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sinhVienDaLoc.length > 0 ? (
                        sinhVienDaLoc.map((student, index) => {
                          const tongKet = calculateTongKet(
                            dangChinhSua ? diemTamThoi[student.id]?.diemQT : student.diemQT,
                            dangChinhSua ? diemTamThoi[student.id]?.diemGK : student.diemGK,
                            dangChinhSua ? diemTamThoi[student.id]?.diemCK : student.diemCK
                          );
                          return (
                            <tr key={student.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mssv}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.hoten}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {dangChinhSua ? (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={diemTamThoi[student.id]?.diemQT ?? ''}
                                        onChange={(e) => capNhatDiem(student.id, 'diemQT', e.target.value)}
                                        className={`w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 transition duration-150 ease-in-out ${
                                          loiDiem[`${student.id}-diemQT`] 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                        }`}
                                      />
                                      <button
                                        onClick={() => xoaDiem(student.id, 'diemQT')}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150 ease-in-out"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                    {loiDiem[`${student.id}-diemQT`] && (
                                      <span className="text-xs text-red-500">{loiDiem[`${student.id}-diemQT`]}</span>
                                    )}
                                  </div>
                                ) : (
                                  student.diemQT || '-'
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {dangChinhSua ? (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={diemTamThoi[student.id]?.diemGK ?? ''}
                                        onChange={(e) => capNhatDiem(student.id, 'diemGK', e.target.value)}
                                        className={`w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 transition duration-150 ease-in-out ${
                                          loiDiem[`${student.id}-diemGK`] 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                        }`}
                                      />
                                      <button
                                        onClick={() => xoaDiem(student.id, 'diemGK')}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150 ease-in-out"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                    {loiDiem[`${student.id}-diemGK`] && (
                                      <span className="text-xs text-red-500">{loiDiem[`${student.id}-diemGK`]}</span>
                                    )}
                                  </div>
                                ) : (
                                  student.diemGK || '-'
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {dangChinhSua ? (
                                  <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={diemTamThoi[student.id]?.diemCK ?? ''}
                                        onChange={(e) => capNhatDiem(student.id, 'diemCK', e.target.value)}
                                        className={`w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 transition duration-150 ease-in-out ${
                                          loiDiem[`${student.id}-diemCK`] 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                        }`}
                                      />
                                      <button
                                        onClick={() => xoaDiem(student.id, 'diemCK')}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150 ease-in-out"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                    {loiDiem[`${student.id}-diemCK`] && (
                                      <span className="text-xs text-red-500">{loiDiem[`${student.id}-diemCK`]}</span>
                                    )}
                                  </div>
                                ) : (
                                  student.diemCK || '-'
                                )}
                              </td>
                               <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-medium ${mauKetQua(tongKet)}`}>{tongKet || '-'}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-medium ${mauKetQua(tongKet)}`}>
                                  {tongKet ? ketQua(tongKet) : '-'}
                                </span>
                              </td>
                             
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                            {tuKhoaTimKiem ? 'Không tìm thấy sinh viên phù hợp' : 'Không có sinh viên nào trong lớp'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiangVienDashboard;