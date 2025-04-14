import React, { useState, useEffect } from 'react';
import { FaUser, FaBook, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BangDieuKhienSinhVien() {
  const navigate = useNavigate();
  const [thongTinSinhVien, setThongTinSinhVien] = useState({});
  const [monHoc, setMonHoc] = useState([]);
  const [tuKhoa, setTuKhoa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://apiwebsa.onrender.com/api';

  // Fetch student information and enrolled subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student profile
        const profileResponse = await axios.get(`${API_BASE_URL}/sinhvien/thongtin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = profileResponse.data[0];
        setThongTinSinhVien({
          hoTen: data.hoten,
          maSinhVien: data.masv,
          lop: data.lophoc_id || 'N/A',
          nganh: data.tenkhoa || 'N/A',
          email: data.email || 'N/A',
          soDienThoai: data.sdt || 'N/A',
        });

        // Fetch enrolled subjects and grades
        const subjectsResponse = await axios.get(`${API_BASE_URL}/sinhvien/lophoc`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonHoc(
          subjectsResponse.data.map((item, index) => ({
            id: index + 1,
            ten: item.tenmon,
            ma: item.monhoc_id,
            tinChi: item.tinchi || 3, // Default to 3 if not provided
            quaTrinh: item.diem_qua_trinh || 0,
            giuaKy: item.diem_giua_ky || 0,
            cuoiKy: item.diem_cuoi_ky || 0,
            tongKet: item.diem_tong_ket || calculateTongKet(item), // Calculate if not provided
          }))
        );
      } catch (err) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Helper function to calculate tongKet (if not provided by backend)
  const calculateTongKet = (item) => {
    const quaTrinh = item.diem_qua_trinh || 0;
    const giuaKy = item.diem_giua_ky || 0;
    const cuoiKy = item.diem_cuoi_ky || 0;
    // Example formula: 20% quaTrinh + 30% giuaKy + 50% cuoiKy
    return ((quaTrinh * 0.2 + giuaKy * 0.3 + cuoiKy * 0.5) || 0).toFixed(1);
  };

  // Handle logout
  const dangXuat = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Filter subjects based on search keyword
  const monHocLoc = monHoc.filter(
    (mh) =>
      mh.ten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      mh.ma.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  // Color coding for grades
  const mauDiem = (diem) => {
    return diem >= 8.5
      ? 'text-green-600'
      : diem >= 7.0
      ? 'text-blue-600'
      : diem >= 5.5
      ? 'text-yellow-600'
      : 'text-red-600';
  };

  // Result status
  const ketQua = (diem) => {
    return diem >= 5 ? 'Đạt' : 'Không đạt';
  };

  // Color coding for result
  const mauKetQua = (diem) => {
    return diem >= 5 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Lỗi: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Thanh điều hướng */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-700">Trang Sinh Viên</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={dangXuat}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Thông tin sinh viên */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2 text-purple-600" />
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Họ tên:</span> {thongTinSinhVien.hoTen || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Mã sinh viên:</span> {thongTinSinhVien.maSinhVien || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Lớp:</span> {thongTinSinhVien.lop || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Ngành:</span> {thongTinSinhVien.nganh || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {thongTinSinhVien.email || 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">SĐT:</span> {thongTinSinhVien.soDienThoai || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Danh sách môn học */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center">
                <FaBook className="mr-2 text-purple-600" />
                Môn học đã đăng ký
              </h2>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  placeholder="Tìm môn học..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã môn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên môn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tín chỉ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quá trình</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giữa kỳ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuối kỳ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng kết</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monHocLoc.length > 0 ? (
                    monHocLoc.map((mh) => (
                      <tr key={mh.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mh.ma}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mh.ten}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mh.tinChi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${mauDiem(mh.quaTrinh)}`}>
                            {mh.quaTrinh || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${mauDiem(mh.giuaKy)}`}>{mh.giuaKy || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${mauDiem(mh.cuoiKy)}`}>{mh.cuoiKy || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${mauDiem(mh.tongKet)}`}>
                            {mh.tongKet || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${mauKetQua(mh.tongKet)}`}>
                            {mh.tongKet ? ketQua(mh.tongKet) : '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        Không tìm thấy môn học phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BangDieuKhienSinhVien;