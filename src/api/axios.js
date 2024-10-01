// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
  withCredentials: true, // 쿠키 전송을 위해 설정
});

export default instance;
