export default {
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7176",
        changeOrigin: true,
        secure: false
      },
      "/auth": {
        target: "https://localhost:7176",
        changeOrigin: true,
        secure: false
      }
    }
  }
};
