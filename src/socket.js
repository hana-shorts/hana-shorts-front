// socket.js
import io from "socket.io-client";

// 소켓 인스턴스를 전역으로 관리
const socket = io("http://localhost:5001");

export default socket;
