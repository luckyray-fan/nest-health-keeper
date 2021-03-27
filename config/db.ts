const productConfig = {
  mysql: {
    port: '',
    host: '',
    user: '',
    password: '',
    database: 'health', // 库名
    connectionLimit: 10, // 连接限制
  },
};

const localConfig = {
  mysql: {
    port: '3306',
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'health', // 库名
    connectionLimit: 10, // 连接限制
  },
};

const config = process.env.NODE_ENV ? productConfig : localConfig;

export default config;