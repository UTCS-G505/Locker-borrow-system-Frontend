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

  static errorNoteMessages = { 0: "取消註記失敗", 1: "住宿生註記失敗", 2: "違規註記失敗" };
  static postNote = async (userId, state, reason) => {
    try {
      const response = await apiMainV1.post(
        `/user/note/${ userId }`, null, { params: { state, reason } }
      );
      return response.data.data;
    } catch (err) {
      console.error(this.errorNoteMessages[state] || "未知錯誤");
      return null;
    }
  }
}

class Record {
  static getGet;

  static getList;

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
