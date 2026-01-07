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

// 修正後的 Stashed 版本 (假設 ID 要放在 URL 裡)
  static postBorrow = async (announcementId, borrow) => {
    try {
      const response = await apiMainV1.patch(
        `/announcement/record/borrow/${announcementId}`, // <--- 這裡可能需要加上 ID？
        borrow
      );
      return response;
    } catch (err) {
      console.error("借用申請失敗", err);
      return null;
    }
  };

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
