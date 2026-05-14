export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5098",
        changeOrigin: true,
        secure: false
      },
      "/auth": {
        target: "http://localhost:5098",
        changeOrigin: true,
        secure: false
      }
    }
  }
};
