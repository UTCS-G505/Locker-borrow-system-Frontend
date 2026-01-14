<script setup>
// 加入 nextTick
import { ref, nextTick, onMounted} from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import { SsoUser } from '@/api/sso';
import { apiSsoV1 } from "@/api/base";


// 彈窗相關變數
const record = ref([]);
const detailModalRef = ref(null);
const modalData = ref([]);

//判斷狀態
const getStatusString = (item) => {
  // 如果有駁回原因，或是明確被拒絕 -> 駁回
  if (item.reject_reason || item.borrow_accepted === false) {
    return '駁回';
  }

  // 如果系辦已經確認歸還 -> 已歸還
  if (item.return_accepted === true) {
    return '已歸還';
  }

  // 如果申請歸還中 (還沒確認) -> 歸還中
  if (item.return_available === true) {
    return '歸還中';
  }

  // 如果同意借用 (且前面沒歸還) -> 借用中
  if (item.borrow_accepted === true) {
    return '借用中';
  }

  // 如果以上都不是，預設為審核中 (borrow_accepted 為 null 時)
  return '審核中';
};

// 按鈕邏輯 (這裡只改前端狀態，實際應該要呼叫 API)
function handleCancel(id) {
  const item = record.value.find(r => r.id === id)
  if (item && item.state === '審核中') item.state = '取消申請';
}

function handleReturn(id) {
  const item = record.value.find(r => r.id === id)
  // 這邊只是前端切換顯示，之後記得要接「申請歸還」的 API
  if (item.state === '借用中') item.state = '歸還中';
}

// 時間格式轉換工具
const formatDate = (dateString) => {
if (!dateString) return ''; // 如果是空值 (例如還沒審核的時間)，就回傳空
const date = new Date(dateString);
// 轉成 YYYY/MM/DD  
const yyyy = date.getFullYear();
const mm = String(date.getMonth() + 1).padStart(2, '0');
const dd = String(date.getDate()).padStart(2,'0');

return `${yyyy}/${mm}/${dd}`;
};

onMounted(async () => {
  try {
    const currentUserId = localStorage.getItem('userId'); 
    
    if (!currentUserId) {
      console.error("尚未登入");
      return;
    }

    // 取得使用者名字
    let userName = '未知使用者';
    try {
      const userInfo = await SsoUser.getGet(currentUserId);
      if (userInfo) userName = userInfo.name;
    } catch (e) {
      console.log("無法取得使用者名字");
    }

    // 直接串接後端 API
    let apiData = [];
    try {
        console.log("正在抓取借用紀錄...");
        const response = await apiSsoV1.get(`/record/list/U11316022`);
        
        if(response.data && Array.isArray(response.data.data)) {
          apiData = response.data.data;
          console.log("成功從後端取得資料！");
        } else {
            throw new Error("API 回傳格式不正確或非陣列");
        }

    } catch (e) {
        console.error("抓取紀錄失敗 (可能是網址錯誤或後端沒開)", e);
        // 若失敗，為了不讓畫面全白，我們暫時保持空陣列或用假資料測試
    }

    //資料對應: 把後端欄位 -> 轉成前端欄位
    record.value = apiData.map(item => ({
      // --- 基本欄位 ---
      id: item.id,
      name: userName, // 前端顯示名字
      
      // --- 類型轉換: temporary (bool) -> 文字 ---
      type: item.temporary ? '臨時借用' : '學年借用',

      // --- 時間欄位 ---
      startTime: formatDate(item.start_date),
      endTime: formatDate(item.end_date),
      
      // --- 系櫃與狀態 ---
      num: item.locker_id,
      state: getStatusString(item), // 呼叫上面的判斷函式

      // --- 詳細資訊彈窗會用到的原始資料 ---
      applyTime: formatDate(item.apply_date),
      reason: item.reason,
      
      // 審核資訊
      directorTime: formatDate(item.review_date), // 假設這是系辦審核日
      rejectReason: item.reject_reason,

      // 歸還資訊
      returnApplyTime: formatDate(item.return_available_date),
      returnApproveTime: formatDate(item.return_accepted_date)
    }));

  } catch (err) {
    console.error("載入流程錯誤", err);
  }
});

function handleShowDetails(id) { 
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  modalData.value = [
    { label: '姓名', value: item.name },
    { label: '借用類型', value: item.type },
    { label: '借用時間(起)', value: item.startTime },
    { label: '借用時間(迄)', value: item.endTime },
    { label: '借用系櫃編號', value: item.num },
    { label: '申請借用時間', value: item.applyTime || '無資料' }, 
    { label: '借用理由', value: item.reason || '無理由', isFullRow: true, isBox: true },
    
    // 審核顯示邏輯
    { label: '系辦審核時間', value: item.directorTime || '審核中' }, 
    { label: '系辦審核結果', value: item.state },

    // 駁回顯示
    ...(item.state === '駁回' ? [
        { label: '駁回理由', value: item.rejectReason || '無', isFullRow: true, isBox: true }
    ] : []),

    // 歸還顯示
    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { label: '申請歸還時間', value: item.returnApplyTime },
        { label: '系辦審核時間', value: item.returnApproveTime || '待審核' }, 
    ] : [])
  ];

  nextTick(() => {
    if (detailModalRef.value) detailModalRef.value.open();
  });
}

</script>

<template>
<div class="recordWrapper">
<h1 class="record">申請紀錄</h1>
<RecordTable
:records="record"
@cancel="handleCancel"
@return="handleReturn"
@show-details="handleShowDetails"
/>

<InfoPopup
ref="detailModalRef"
title="詳細資訊"
:fields="modalData"
/>
</div>
</template>

<style scoped>
.recordWrapper {
padding-top: 10px; /* 給點空間跟 navbar 分開 */
}

.record {
font-size: 30px;
color: #1a1a1a;
margin-left: 15px;
margin-bottom: 0;
}

/* 手機版 */
@media (max-width: 640px) {
.recordWrapper {
padding-top: 30px; /* 給點空間跟導航列分開 */
}

.record {
font-size: 24px;
margin-left: 12px;
}
}
</style>