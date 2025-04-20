import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSinhVien = () => {
  const [thongTinSinhVien, setThongTinSinhVien] = useState({});
  const [monHoc, setMonHoc] = useState([]);
  const [tuKhoa, setTuKhoa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://apiwebsa.onrender.com/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileResponse = await axios.get(`${API_BASE_URL}/sinhvien/thongtin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = profileResponse.data[0];
        setThongTinSinhVien({
          hoTen: data.hoten,
          maSinhVien: data.masv,
          lop: data.lophoc_id || 'N/A',
          nganh: data.tenkhoa || 'N/A',
          email: data.email || '',
          soDienThoai: data.sdt || '',
        });

        const subjectsResponse = await axios.get(`${API_BASE_URL}/sinhvien/lophoc`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonHoc(
          subjectsResponse.data.map((item, index) => ({
            id: index + 1,
            ten: item.tenmon,
            ma: item.monhoc_id,
            tinChi: item.tinchi || 3,
            quaTrinh: item.diem_qua_trinh || 0,
            giuaKy: item.diem_giua_ky || 0,
            cuoiKy: item.diem_cuoi_ky || 0,
            tongKet: item.diem_tong_ket || calculateTongKet(item),
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

  // Helper functions
  const calculateTongKet = (item) => {
    const quaTrinh = item.diem_qua_trinh || 0;
    const giuaKy = item.diem_giua_ky || 0;
    const cuoiKy = item.diem_cuoi_ky || 0;
    return ((quaTrinh * 0.2 + giuaKy * 0.3 + cuoiKy * 0.5) || 0).toFixed(1);
  };

  const monHocLoc = monHoc.filter(
    (mh) =>
      mh.ten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      mh.ma.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  const mauDiem = (diem) => {
    return diem >= 8.5
      ? 'text-green-600'
      : diem >= 7.0
      ? 'text-blue-600'
      : diem >= 5.5
      ? 'text-yellow-600'
      : 'text-red-600';
  };

  const ketQua = (diem) => {
    return diem >= 5 ? 'Đạt' : 'Không đạt';
  };

  const mauKetQua = (diem) => {
    return diem >= 5 ? 'text-green-600' : 'text-red-600';
  };

  return {
    thongTinSinhVien,
    monHoc,
    tuKhoa,
    setTuKhoa,
    loading,
    error,
    monHocLoc,
    mauDiem,
    ketQua,
    mauKetQua
  };
};