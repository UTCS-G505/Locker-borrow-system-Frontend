import apiMainV1 from "@/api/base";

class Announcement {
  static getGet = async (announcementId) => {
    try {
      const response = await apiMainV1.get(
        `/announcement/get/${announcementId}`
      );
      return response.data.data;
    } catch (err) {
      console.error("獲取公告失敗", err);
      return null;
    }
  };

  static getAll = async (params) => {
    try {
      const response = await apiMainV1.get(
        "/announcement/all",
        { params }
      );
      return response.data.data;
    } catch (err) {
      console.error("獲取公告失敗", err);
      return null;
    }
  };

  static postCreate = async (data) => {
    try {
      const response = await apiMainV1.post(
        "/announcement/create",
        data
      );
      return response.data.data;
    } catch (err) {
      console.error("新增公告失敗", err);
      return null;
    }
  }

  static patchUpdate = async (announcementId, data) => {
    try {
      const response = await apiMainV1.patch(
        `/announcement/update/${announcementId}`,
        data
      );
      return response.data.data;
    } catch (err) {
      console.error("更新公告失敗", err);
      return null;
    }
  }

  static deleteDelete = async (announcementId) => {
    try {
      const response = await apiMainV1.delete(
        `/announcement/delete/${announcementId}`
      );
      return response.data.data;
    } catch (err) {
      console.error("刪除公告失敗", err);
      return null;
    }
  }
}

class User {
  static getGet;

  static getAll = async () => {
    try {
      // 猜測後端路徑為 /user/all (若不同請依後端文件調整)
      const response = await apiMainV1.get("/user/all");
      return response.data.data;
    } catch (err) {
      console.error("獲取使用者列表失敗", err);
      return []; // 列表類失敗建議回傳空陣列，避免前端炸開
    }
  };

  static postNote;
}

class Record {
  static getGet;

  static getList = async(userId) =>{
    try{
      const response = await apiMainV1.get(`/record/list/${userId}`);
      return response.data.data;
    } catch (err){
      console.error("獲取申請紀錄列表失敗",err);
      return null;
    }
  };

  static getAll;

  static postBorrow;

  static postCancel;

  static postReviewBorrow;

  static postReturn;

  static postReviewReturn;
}

class Locker {
  static getAll;
}

export { 
  Announcement,
  User,
  Record,
  Locker
}
