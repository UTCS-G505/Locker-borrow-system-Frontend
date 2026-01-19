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
  static getGet = async (userId) => {
    try {
      const response = await apiMainV1.get(`/user/get/${userId}`);
      return response.data.data;

    } catch (err) {
      console.error("取得使用者資料失敗", err);
      return null; 
    }
  };

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

  static errorNoteMessages = { 0: "取消註記失敗", 1: "住宿生註記失敗", 2: "違規註記失敗" };
  static postNote = async (userId, state, reason) => {
    try {
      const response = await apiMainV1.post(
        `/user/note/${ userId }`, null, { params: { state, reason } }
      );
      return response.data.data;
    } catch (err) {
      console.error(User.errorNoteMessages[state], err);
      throw err;
    }
  }
}

class Record {
  static getGet = async (record_id) => {
    try {
      const response = await apiMainV1.get(
        `/record/get/${record_id}`
      );
      return response.data.data;
    } catch (err) {
      console.error("獲取借用紀錄失敗", err);
      return null;
    }
  };

  static getList = async(userId) =>{
    try{
      const response = await apiMainV1.get(`/record/list/${userId}`);
      return response.data.data;
    } catch (err){
      console.error("獲取申請紀錄列表失敗",err);
      return null;
    }
  };

  static getAll = async () => {
    try {
      const response = await apiMainV1.get("/record/all");
      return response.data.data; // 回傳陣列
    } catch (err) {
      console.error("獲取所有申請紀錄失敗", err);
      return [];
    }
  };
  
  static postBorrow = async (data) => {
    try{
      const response = await apiMainV1.post('/record/borrow', data);
      return response.data;
    }catch (err){
      console.error("錯誤: ", err);
      throw err;
    }
  }

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

  static postReturn = async (recordId, returnAvailable) => {
    try {
      const response = await apiMainV1.post(
        `/record/return/${recordId}`,
        null,
        {
          params: { return_available: returnAvailable }
        }
      );
      return response.data;
    } catch (err) {
      console.error("歸還請求失敗", err);
      console.error("錯誤詳情:", err.response?.data); // 加這行看詳細錯誤
      return err.response?.data || {
        code: -1,
        message: "無法連接伺服器",
        data: null
      };
    }
  };

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
  static getAll = async () => {
    try {
      const response = await apiMainV1.get("/locker/all");
      return response.data.data;

    } catch (err) {
      console.error("獲取櫃子狀態列表失敗", err);
      throw err; // 丟出錯誤訊息，讓父程式ApplyView.cue的函式loadLockersFromAPI可以成功接收錯誤訊息
    }
  };
}

export {
  Announcement,
  User,
  Record,
  Locker
}
