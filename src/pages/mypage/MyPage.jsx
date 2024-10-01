// src/pages/mypage/MyPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MyPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/status');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>마이 페이지</h1>
      <p>
        <strong>아이디:</strong> {user.userId}
      </p>
      <p>
        <strong>이름:</strong> {user.name}
      </p>
      <p>
        <strong>이메일:</strong> {user.email}
      </p>
      <p>
        <strong>전화번호:</strong> {user.phoneNumber}
      </p>
      <p>
        <strong>가입일:</strong> {new Date(user.signupDate).toLocaleString()}
      </p>
      <p>
        <strong>마지막 로그인:</strong> {new Date(user.lastLogin).toLocaleString()}
      </p>
      {/* 추가적인 사용자 정보 및 기능 */}
    </div>
  );
};

export default MyPage;
