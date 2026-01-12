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

  static getList;

  static getAll;

  static postBorrow;

  static postCancel;

  static postReviewBorrow;

  static postReturn;

  static postReviewReturn = async (recordId, params) => {
    try {
      const response = await apiMainV1.post(
        `/record/reviewr/${recordId}`,  
        null,
        { params }
      );
      return response.data;
    } catch (err) {
      console.error("審核歸還 API 發送失敗", err);
      throw err;
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
