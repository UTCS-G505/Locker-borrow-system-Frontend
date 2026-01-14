import { apiSsoV1 } from "@/api/base";

class SsoAuth {
  static postLogin = async (credentials) => {
    try {
      const response = await apiSsoV1.post(
        `/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.data;
    } catch (err) {
      console.error("登入失敗", err);
      return null;
    }
  }

  static postLogout = async () => {
    try {
      const response = await apiSsoV1.post(`/auth/logout`);
      return response.data.data;
    } catch (err) {
      console.error("登出失敗", err);
      return null;
    }
  }
}

class SsoUser {
  static getGet = async (userId) => {
    try {
      const response = await apiSsoV1.get(`/user/get/${userId}`);
      return response.data.data;
    } catch (err) {
      console.error("獲取使用者失敗", err);
      return null;
    }
  }
}

export {
  SsoAuth,
  SsoUser
}
