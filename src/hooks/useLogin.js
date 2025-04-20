import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      switch(role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'GiangVien':
          navigate('/giangvien');
          break;
        case 'SinhVien':
          navigate('/sinhvien');
          break;
        default:
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
      }
    }
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://apiwebsa.onrender.com/api/auth/login', credentials);
      
      if (response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('userId', response.data.user.user_id);
        setError('');

        switch(response.data.user.role) {
          case 'Admin':
            navigate('/admin');
            break;
          case 'GiangVien':
            navigate('/giangvien');
            break;
          case 'SinhVien':
            navigate('/sinhvien');
            break;
          default:
            throw new Error('Role không hợp lệ');
        }
      } else {
        throw new Error('Thông tin người dùng không hợp lệ');
      }
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredentials = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return {
    credentials,
    error,
    showPassword,
    isLoading,
    handleLogin,
    updateCredentials,
    togglePasswordVisibility
  };
}; 