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

  static postReviewBorrow = async (recordID, status) => {
    try {
      const response = await apiMainV1.post(
        "/record/reviewborrow",
        { recordID, status }
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

//通過按鈕事件
export const approveMobile = async (recordID) => {
  await apiMainV1.post("/record/reviewborrow", {
    recordID,
    status: "approved"
  });
};

//駁回按鈕事件
export const rejectMobile = async (recordID, rejectReason) => {
  await apiMainV1.post("/record/reviewborrow", {
    recordID,
    status: "rejected",
    reason: rejectReason
  });
}
