import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaBuilding, FaClock, FaSearch, FaEdit, FaSave, FaTimes, FaUsers } from 'react-icons/fa';

function GiangVienDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [diemTamThoi, setDiemTamThoi] = useState({});
  const navigate = useNavigate();

  // Dữ liệu mẫu cho môn học và phòng học
  const sampleData = [
    {
      id: 1,
      name: 'Lập trình Web',
      code: 'WEB101',
      rooms: [
        {
          id: 'A101',
          name: 'Phòng A101',
          sessions: [
            { id: 1, time: 'Ca 1 (7:30 - 9:30)' },
            { id: 2, time: 'Ca 2 (9:45 - 11:45)' },
            { id: 3, time: 'Ca 3 (13:30 - 15:30)' }
          ]
        },
        {
          id: 'A102',
          name: 'Phòng A102',
          sessions: [
            { id: 1, time: 'Ca 1 (7:30 - 9:30)' },
            { id: 2, time: 'Ca 2 (9:45 - 11:45)' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Cơ sở dữ liệu',
      code: 'DBS101',
      rooms: [
        {
          id: 'B201',
          name: 'Phòng B201',
          sessions: [
            { id: 1, time: 'Ca 1 (7:30 - 9:30)' },
            { id: 3, time: 'Ca 3 (13:30 - 15:30)' }
          ]
        }
      ]
    }
  ];

  // Dữ liệu mẫu cho sinh viên theo ca học
  const sampleStudents = {
    'WEB101-A101-1': [
      { id: 1, mssv: '20001', hoten: 'Nguyễn Văn A', diemGK: 8.5, diemCK: 7.5 },
      { id: 2, mssv: '20002', hoten: 'Trần Thị B', diemGK: 7.0, diemCK: 8.0 }
    ],
    'WEB101-A101-2': [
      { id: 3, mssv: '20003', hoten: 'Lê Văn C', diemGK: 9.0, diemCK: 8.5 },
      { id: 4, mssv: '20004', hoten: 'Phạm Thị D', diemGK: 8.0, diemCK: 8.0 }
    ],
    'WEB101-A101-3': [
      { id: 5, mssv: '20005', hoten: 'Đặng Văn E', diemGK: 7.5, diemCK: 7.0 },
      { id: 6, mssv: '20006', hoten: 'Ngô Thị F', diemGK: 9.0, diemCK: 9.5 }
    ],
    'WEB101-A102-1': [
      { id: 7, mssv: '20007', hoten: 'Hoàng Văn G', diemGK: 6.5, diemCK: 7.5 },
      { id: 8, mssv: '20008', hoten: 'Phan Thị H', diemGK: 8.0, diemCK: 8.5 }
    ],
    'WEB101-A102-2': [
      { id: 9, mssv: '20009', hoten: 'Vũ Văn I', diemGK: 7.0, diemCK: 7.0 },
      { id: 10, mssv: '20010', hoten: 'Bùi Thị K', diemGK: 6.0, diemCK: 6.5 }
    ],
    'DBS101-B201-1': [
      { id: 11, mssv: '20011', hoten: 'Lý Văn L', diemGK: 8.5, diemCK: 8.0 },
      { id: 12, mssv: '20012', hoten: 'Nguyễn Thị M', diemGK: 7.5, diemCK: 7.5 }
    ],
    'DBS101-B201-3': [
      { id: 13, mssv: '20013', hoten: 'Đoàn Văn N', diemGK: 9.5, diemCK: 9.0 },
      { id: 14, mssv: '20014', hoten: 'Trịnh Thị O', diemGK: 8.0, diemCK: 8.5 }
    ]
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setSubjects(sampleData);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách môn học');
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedRoom(null);
    setSelectedSession(null);
    setStudents([]);
    setTuKhoaTimKiem('');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedSession(null);
    setStudents([]);
    setTuKhoaTimKiem('');
  };

  const handleSessionSelect = async (sessionId) => {
    try {
      setLoading(true);
      const studentKey = `${selectedSubject.code}-${selectedRoom.id}-${sessionId}`;
      setStudents(sampleStudents[studentKey] || []);
      setSelectedSession(sessionId);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách sinh viên');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const sinhVienDaLoc = students.filter(sv => 
    sv.mssv.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
    sv.hoten.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

  const batDauChinhSua = () => {
    setDangChinhSua(true);
    const diemMoi = {};
    students.forEach(sv => {
      diemMoi[sv.id] = {
        diemGK: sv.diemGK,
        diemCK: sv.diemCK
      };
    });
    setDiemTamThoi(diemMoi);
  };

  const luuDiem = () => {
    setDangChinhSua(false);
    // TODO: Gọi API lưu điểm
    console.log('Đã lưu điểm:', diemTamThoi);
  };

  const huyChinhSua = () => {
    setDangChinhSua(false);
    setDiemTamThoi({});
  };

  const capNhatDiem = (svId, loaiDiem, giaTri) => {
    setDiemTamThoi(prev => ({
      ...prev,
      [svId]: {
        ...prev[svId],
        [loaiDiem]: parseFloat(giaTri) || 0
      }
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      Lỗi: {error}
    </div>
  );

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
          {subjects.map(subject => (
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

        {/* Danh sách phòng học */}
        {selectedSubject && (
          <div className="mt-6 transition-all duration-300 ease-in-out transform">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FaBuilding className="text-green-600 mr-2" />
              Phòng học - {selectedSubject.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {selectedSubject.rooms.map(room => (
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
              {selectedRoom.sessions.map(session => (
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
                          Điểm GK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điểm CK
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sinhVienDaLoc.length > 0 ? (
                        sinhVienDaLoc.map((student, index) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.mssv}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.hoten}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {dangChinhSua ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={diemTamThoi[student.id]?.diemGK || student.diemGK}
                                  onChange={(e) => capNhatDiem(student.id, 'diemGK', e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                                />
                              ) : (
                                student.diemGK || '-'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {dangChinhSua ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={diemTamThoi[student.id]?.diemCK || student.diemCK}
                                  onChange={(e) => capNhatDiem(student.id, 'diemCK', e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                                />
                              ) : (
                                student.diemCK || '-'
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
