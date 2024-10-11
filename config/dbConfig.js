const dbConfig = {
    user: 'sa',
    password: '@R45aT4mc8nsuZb',
    server: '8.222.157.173', // Địa chỉ máy chủ SQL Server
    database: 'QLDKMHHP2', // Tên cơ sở dữ liệu
    port: 1433, // Cổng mặc định cho SQL Server
    options: {
      encrypt: false, // Sử dụng true nếu bạn đang kết nối với Azure
      trustServerCertificate: true // Sử dụng true cho phát triển cục bộ hoặc chứng chỉ tự ký
    }
  };
  
  module.exports = dbConfig;