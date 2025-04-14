import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUniversity, FaBook, FaUsers, FaChevronRight, FaSearch } from 'react-icons/fa';
import axios from 'axios';

function BangDieuKhienAdmin() {
  const navigate = useNavigate();
  const [khoaDuocChon, setKhoaDuocChon] = useState(null);
  const [monHocDuocChon, setMonHocDuocChon] = useState(null);
  const [lopDuocChon, setLopDuocChon] = useState(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [danhSachKhoa, setDanhSachKhoa] = useState([]);
  const [monHoc, setMonHoc] = useState([]);
  const [lopHoc, setLopHoc] = useState([]);
  const [sinhVien, setSinhVien] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://apiwebsa.onrender.com/api';

  // Fetch departments on mount
  useEffect(() => {
    const fetchKhoa = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/khoa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDanhSachKhoa(
          response.data.map((khoa) => ({
            id: khoa.khoa_id,
            ten: khoa.tenkhoa,
          }))
        );
      } catch (err) {
        setError('Không thể tải danh sách khoa');
      } finally {
        setLoading(false);
      }
    };
    fetchKhoa();
  }, [token]);

  // Fetch subjects when a department is selected
  useEffect(() => {
    if (khoaDuocChon) {
      const fetchMonHoc = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/admin/khoa/${khoaDuocChon.id}/monhoc`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMonHoc(
            response.data.map((mon) => ({
              id: mon.monhoc_id,
              ten: mon.tenmon,
              ma: mon.mamon,
            }))
          );
        } catch (err) {
          setError('Không thể tải danh sách môn học');
        } finally {
          setLoading(false);
        }
      };
      fetchMonHoc();
    } else {
      setMonHoc([]);
      setMonHocDuocChon(null);
    }
  }, [khoaDuocChon, token]);

  // Fetch classes when a subject is selected
  useEffect(() => {
    if (monHocDuocChon) {
      const fetchLopHoc = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/admin/monhoc/${monHocDuocChon.id}/lophoc`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLopHoc(
            response.data.map((lop) => ({
              id: lop.lophoc_id,
              ten: `Lớp ${lop.lophoc_id}`, // Customize based on your naming convention
            }))
          );
        } catch (err) {
          setError('Không thể tải danh sách lớp học');
        } finally {
          setLoading(false);
        }
      };
      fetchLopHoc();
    } else {
      setLopHoc([]);
      setLopDuocChon(null);
    }
  }, [monHocDuocChon, token]);

  // Fetch students when a class is selected
  useEffect(() => {
    if (lopDuocChon) {
      const fetchSinhVien = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/admin/lophoc/${lopDuocChon.id}/sinhvien`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSinhVien(
            response.data.map((sv) => ({
              id: sv.sinhvien_id,
              hoTen: sv.hoten,
              maSinhVien: sv.masv,
              quaTrinh: sv.diem_qua_trinh || 0,
              giuaKy: sv.diem_giua_ky || 0,
              cuoiKy: sv.diem_cuoi_ky || 0,
              tongKet: sv.diem_tong_ket || calculateTongKet(sv),
            }))
          );
        } catch (err) {
          setError('Không thể tải danh sách sinh viên');
        } finally {
          setLoading(false);
        }
      };
      fetchSinhVien();
    } else {
      setSinhVien([]);
    }
  }, [lopDuocChon, token]);

  // Helper function to calculate tongKet (if not provided by backend)
  const calculateTongKet = (sv) => {
    const quaTrinh = sv.diem_qua_trinh || 0;
    const giuaKy = sv.diem_giua_ky || 0;
    const cuoiKy = sv.diem_cuoi_ky || 0;
    // Example formula: 20% quaTrinh + 30% giuaKy + 50% cuoiKy
    return ((quaTrinh * 0.2 + giuaKy * 0.3 + cuoiKy * 0.5) || 0).toFixed(1);
  };

  // Handle logout
  const dangXuat = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

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

  // Filter students based on search keyword
  const sinhVienDaLoc = sinhVien.filter(
    (sv) =>
      sv.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
      sv.hoTen.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-purple-700">Trang Quản Trị</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={dangXuat}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Danh sách khoa */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUniversity className="mr-2 text-purple-600" />
              Danh sách khoa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {danhSachKhoa.map((khoa) => (
                <button
                  key={khoa.id}
                  onClick={() => {
                    setKhoaDuocChon(khoa);
                    setMonHocDuocChon(null);
                    setLopDuocChon(null);
                    setTuKhoaTimKiem('');
                  }}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition duration-150 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{khoa.ten}</span>
                    <FaChevronRight className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách môn học của khoa được chọn */}
          {khoaDuocChon && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaBook className="mr-2 text-purple-600" />
                Môn học của khoa {khoaDuocChon.ten}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {monHoc.map((mon) => (
                  <button
                    key={mon.id}
                    onClick={() => {
                      setMonHocDuocChon(mon);
                      setLopDuocChon(null);
                      setTuKhoaTimKiem('');
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-800">{mon.ten}</span>
                        <p className="text-sm text-gray-500">{mon.ma}</p>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách lớp của môn học được chọn */}
          {monHocDuocChon && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-purple-600" />
                Lớp của môn {monHocDuocChon.ten}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lopHoc.map((lop) => (
                  <button
                    key={lop.id}
                    onClick={() => {
                      setLopDuocChon(lop);
                      setTuKhoaTimKiem('');
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{lop.ten}</span>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách sinh viên của lớp được chọn */}
          {lopDuocChon && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center">
                  <FaUsers className="mr-2 text-purple-600" />
                  Danh sách sinh viên lớp {lopDuocChon.ten}
                </h2>
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tuKhoaTimKiem}
                    onChange={(e) => setTuKhoaTimKiem(e.target.value)}
                    placeholder="Tìm kiếm sinh viên..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã SV</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quá trình</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giữa kỳ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuối kỳ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng kết</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kết quả</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sinhVienDaLoc.length > 0 ? (
                      sinhVienDaLoc.map((sv) => (
                        <tr key={sv.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sv.maSinhVien}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sv.hoTen}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.quaTrinh)}`}>{sv.quaTrinh || '-'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.giuaKy)}`}>{sv.giuaKy || '-'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.cuoiKy)}`}>{sv.cuoiKy || '-'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.tongKet)}`}>{sv.tongKet || '-'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauKetQua(sv.tongKet)}`}>
                              {sv.tongKet ? ketQua(sv.tongKet) : '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          {tuKhoaTimKiem ? 'Không tìm thấy sinh viên phù hợp' : 'Không có sinh viên nào trong lớp'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BangDieuKhienAdmin;