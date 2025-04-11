import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUniversity, FaBook, FaUsers, FaChevronRight, FaSearch } from 'react-icons/fa';

function BangDieuKhienAdmin() {
  const navigate = useNavigate();
  const [khoaDuocChon, setKhoaDuocChon] = useState(null);
  const [monHocDuocChon, setMonHocDuocChon] = useState(null);
  const [lopDuocChon, setLopDuocChon] = useState(null);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  // Dữ liệu mẫu
  const danhSachKhoa = [
    {
      id: 1,
      ten: 'Công nghệ thông tin',
      monHoc: [
        {
          id: 1,
          ten: 'Lập trình Web',
          ma: 'IT001',
          lop: [
            {
              id: 1,
              ten: 'Lớp A',
              sinhVien: [
                { id: 1, hoTen: 'Nguyễn Văn A', maSinhVien: 'SV001', quaTrinh: 8.5, giuaKy: 7.5, cuoiKy: 8.0, tongKet: 8.0 },
                { id: 2, hoTen: 'Trần Thị B', maSinhVien: 'SV002', quaTrinh: 7.8, giuaKy: 8.2, cuoiKy: 7.5, tongKet: 7.8 }
              ]
            },
            {
              id: 2,
              ten: 'Lớp B',
              sinhVien: [
                { id: 3, hoTen: 'Lê Văn C', maSinhVien: 'SV003', quaTrinh: 9.0, giuaKy: 8.5, cuoiKy: 9.5, tongKet: 9.0 },
                { id: 4, hoTen: 'Phạm Thị D', maSinhVien: 'SV004', quaTrinh: 8.2, giuaKy: 8.0, cuoiKy: 8.5, tongKet: 8.2 }
              ]
            }
          ]
        },
        {
          id: 2,
          ten: 'Cơ sở dữ liệu',
          ma: 'IT002',
          lop: [
            {
              id: 1,
              ten: 'Lớp A',
              sinhVien: [
                { id: 1, hoTen: 'Nguyễn Văn A', maSinhVien: 'SV001', quaTrinh: 7.5, giuaKy: 8.0, cuoiKy: 7.8, tongKet: 7.8 },
                { id: 2, hoTen: 'Trần Thị B', maSinhVien: 'SV002', quaTrinh: 8.2, giuaKy: 7.5, cuoiKy: 8.0, tongKet: 8.0 }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      ten: 'Khoa học máy tính',
      monHoc: [
        {
          id: 1,
          ten: 'Trí tuệ nhân tạo',
          ma: 'CS001',
          lop: [
            {
              id: 1,
              ten: 'Lớp A',
              sinhVien: [
                { id: 1, hoTen: 'Nguyễn Văn A', maSinhVien: 'SV001', quaTrinh: 8.0, giuaKy: 8.5, cuoiKy: 8.2, tongKet: 8.2 },
                { id: 2, hoTen: 'Trần Thị B', maSinhVien: 'SV002', quaTrinh: 7.8, giuaKy: 8.0, cuoiKy: 7.5, tongKet: 7.8 }
              ]
            }
          ]
        }
      ]
    }
  ];

  const dangXuat = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const mauDiem = (diem) => {
    return diem >= 8.5 ? 'text-green-600' :
           diem >= 7.0 ? 'text-blue-600' :
           diem >= 5.5 ? 'text-yellow-600' :
           'text-red-600';
  };

  const ketQua = (diem) => {
    return diem >= 5 ? 'Đạt' : 'Không đạt';
  };

  const mauKetQua = (diem) => {
    return diem >= 5 ? 'text-green-600' : 'text-red-600';
  };

  const sinhVienDaLoc = lopDuocChon ? lopDuocChon.sinhVien.filter(sv => 
    sv.maSinhVien.toLowerCase().includes(tuKhoaTimKiem.toLowerCase()) ||
    sv.hoTen.toLowerCase().includes(tuKhoaTimKiem.toLowerCase())
  ) : [];

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
                  onClick={() => setKhoaDuocChon(khoa)}
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
                {khoaDuocChon.monHoc.map((mon) => (
                  <button
                    key={mon.id}
                    onClick={() => setMonHocDuocChon(mon)}
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
                {monHocDuocChon.lop.map((lop) => (
                  <button
                    key={lop.id}
                    onClick={() => setLopDuocChon(lop)}
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
                            <span className={`font-medium ${mauDiem(sv.quaTrinh)}`}>{sv.quaTrinh}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.giuaKy)}`}>{sv.giuaKy}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.cuoiKy)}`}>{sv.cuoiKy}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauDiem(sv.tongKet)}`}>{sv.tongKet}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${mauKetQua(sv.tongKet)}`}>{ketQua(sv.tongKet)}</span>
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
