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

  static postReviewBorrow = async (record_id, borrow_accepted, reject_reason = null) => {
    try {
      const payload = { borrow_accepted };
      if (reject_reason) payload.reject_reason = reject_reason;

      const response = await apiMainV1.post(
        `/record/reviewb/${record_id}`,
        payload
      );
      return response.data.data;
    } catch (err) {
      console.error("審核申請失敗", err);
      return null;
    }
  };

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
