import { apiSsoV1 } from "@/api/base";

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

export { SsoUser }
