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

  static getAll;

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

  static postCancel = async (recordId) => {
    try {
      const response = await apiMainV1.post(
        `/record/cancel/${recordId}`
      );
      // 成功時後端回傳 data: null
      // 為了在元件端判斷成功，我們回傳 response.data.data (即 null)
      return response.data.data;
    } catch (err) {
      console.error("取消借用失敗", err);
      // 回傳一個特定字串或 Error 物件來區分「失敗」與「成功的 null」
      return false;
    }
  };

  static postReviewBorrow;

  static postReturn;

  static postReviewReturn = async (recordId, params) => {
    try {
      const response = await apiMainV1.post(
        `/record/reviewr/${recordId}`,
        null,
        { params }
      );
      return response.data.data;
    } catch (err) {
      console.error("審核歸還失敗", err);
      return null;
    }
  };
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
