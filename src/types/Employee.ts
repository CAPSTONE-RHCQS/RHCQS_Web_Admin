export interface Employee {
  avatar: string;
  name: string;
  roles: string[]; // Thay đổi từ role thành roles
  address: string;
  phone: string;
}

export const quoteEmployees: Employee[] = [
  {
    avatar: '',
    name: 'Nguyễn Văn A',
    roles: ['Nhân viên báo giá'],
    address: '123 Đường ABC, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Trần Thị B',
    roles: ['Nhân viên báo giá'],
    address: '456 Đường DEF, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Lê Thị C',
    roles: ['Nhân viên báo giá'],
    address: '456 Đường DEF, TP.HCM',
    phone: '0987654321',
  },
  // Thêm nhiều dữ liệu hơn
  {
    avatar: '',
    name: 'Phạm Văn D',
    roles: ['Nhân viên báo giá'],
    address: '789 Đường GHI, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Nguyễn Thị E',
    roles: ['Nhân viên báo giá'],
    address: '101 Đường JKL, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Trần Văn F',
    roles: ['Nhân viên báo giá'],
    address: '112 Đường MNO, TP.HCM',
    phone: '0123456789',
  },
];

export const designEmployees: Employee[] = [
  {
    avatar: '',
    name: 'Lê Văn C',
    roles: ['Thiết kế phối cảnh'],
    address: '789 Đường GHI, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Nguyễn Thị G',
    roles: ['Thiết kế phối cảnh'],
    address: '456 Đường XYZ, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Phạm Thị D',
    roles: ['Thiết kế kiến trúc'],
    address: '101 Đường JKL, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Trần Văn H',
    roles: ['Thiết kế kiến trúc'],
    address: '789 Đường GHI, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Ngô Văn E',
    roles: ['Thiết kế kết cấu'],
    address: '112 Đường MNO, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Lê Thị I',
    roles: ['Thiết kế kết cấu'],
    address: '456 Đường XYZ, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Đỗ Thị F',
    roles: ['Thiết kế điện & nước'],
    address: '131 Đường PQR, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Phạm Văn J',
    roles: ['Thiết kế điện & nước'],
    address: '789 Đường GHI, TP.HCM',
    phone: '0123456789',
  },
  // Thêm nhiều dữ liệu hơn với nhiều vai trò
  {
    avatar: '',
    name: 'Nguyễn Văn K',
    roles: ['Thiết kế điện & nước', 'Thiết kế kết cấu'],
    address: '123 Đường ABC, TP.HCM',
    phone: '0123456789',
  },
  {
    avatar: '',
    name: 'Trần Thị L',
    roles: ['Thiết kế điện & nước', 'Thiết kế kiến trúc'],
    address: '456 Đường DEF, TP.HCM',
    phone: '0987654321',
  },
  {
    avatar: '',
    name: 'Lê Thị M',
    roles: ['Thiết kế điện & nước', 'Thiết kế phối cảnh'],
    address: '789 Đường GHI, TP.HCM',
    phone: '0123456789',
  },
];
