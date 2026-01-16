<script setup>
import { ref, onMounted } from 'vue'
import { Announcement, Record } from '@/api/main';
import { SsoUser } from '@/api/sso';
import generateCSV from '@/utils/generateCSV';
import dateFormatter from '@/utils/dateFormatter';

defineProps({
  board: {
    type: String,
    default: 'note',
    required: true
  }
})

const emit = defineEmits(['update:board'])

const today = new Date();
const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const endDate = `${today.getFullYear() + 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const initialStartDate = ref(startDate);
const initialEndDate = ref(endDate);

const BORROW_HISTORY_CSV_COLUMNS = [
  { key: "id", label: "借用紀錄編號", get: r => r.id ?? "" },
  { key: "account", label: "借用者帳號", get: (_, u) => u?.account ?? "" },
  { key: "name", label: "借用者姓名", get: (_, u) => u?.name ?? "" },
  { label: "借用日期(起)", get: r => dateFormatter(r.start_date) ?? "" },
  { label: "借用日期(迄)", get: r => dateFormatter(r.end_date) ?? "" },
  { label: "借用類型", get: r => getBorrowType(r) },
  { label: "借用原因", get: r => r.reason ?? "" },
  { label: "借用系櫃編號", get: r => r.locker_id ?? "" },
  { label: "申請借用時間", get: r => timeFormatter(r.apply_date) ?? "" },
  {
    label: "系辦審核時間(借用)",
    get: r => getBorrowReviewTime(r)
  },
  {
    label: "系辦審核結果(借用)",
    get: r => getBorrowReviewResult(r)
  },
  { label: "系辦駁回原因", get: r => r.reject_reason ?? "" },
  {
    label: "申請歸還時間",
    get: r => getReturnAvailableTime(r)
  },
  {
    label: "系辦審核結果(歸還)",
    get: r => getReturnReviewResult(r)
  },
  {
    label: "系辦審核時間(歸還)",
    get: r => getReturnReviewTime(r)
  }
];

const timeFormatter = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

const getBorrowType = (r) => {
  if (r.temporary) return "臨時借用";
  return "學年借用";
}

const getBorrowReviewTime = (r) => {
  if (r.borrow_accepted === null) return "";
  return timeFormatter(r.review_date);
}

const getBorrowReviewResult = (r) => {
  if (r.borrow_accepted === true) return "通過";
  if (r.borrow_accepted === false) return "駁回";
  return "審核中";
}

const getReturnAvailableTime = (r) => {
  if (r.return_available) return timeFormatter(r.return_available_date);
  return "";
}

const getReturnReviewResult = (r) => {
  if (!r.return_available) return "";
  if (r.return_accepted === true) return "通過";
  return "未接受"
}

const getReturnReviewTime = (r) => {
  if (!r.return_available) return "";
  return timeFormatter(r.return_accepted_date);
}

const handleBorrowHistory = async () => {
  // 取得所有紀錄
  const recordData = await Record.getAll();

  // 取得所有 user 的資料
  const userIds = [...new Set(recordData.map(r => r.user_id))];
  const users = await Promise.all(userIds.map(id => SsoUser.getGet(id)));

  // 建立 user id 與資料的對應表
  const userMap = new Map(users.map(u => [u.id, u]));

  // 整合資料
  const records = recordData.map(record => ({
    record,
    user: userMap.get(record.user_id)
  }));

  // 按照申請日期排序
  records.sort((a, b) => new Date(a.record.apply_date) - new Date(b.record.apply_date));

  // 產生 CSV 檔案
  const csv = generateCSV({
    titleLines: [
      "UTaipei CS Locker Borrow System - 借用紀錄匯出",
      `匯出時間: ${new Date().toLocaleString()}`
    ],
    columns: BORROW_HISTORY_CSV_COLUMNS,
    records
  });

  // 下載
  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download =
    `UTaipei_CS_Locker_Borrow_System_History_Export_${new Date()
      .toLocaleString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
const updateSemesterInterval = async () => {
  const start = initialStartDate.value;
  const end = initialEndDate.value;
  if (end <= start) {
    alert("學年結束時間應晚於學年起始時間");
    return;
  }

  try {
    await Announcement.patchUpdate(2, {
      content: initialStartDate.value
    });
    await Announcement.patchUpdate(3, {
      content: initialEndDate.value
    });
    alert('更新成功');
  } catch (err) {
    console.error('更新公告失敗', err);
  }
};

const handleBorrowOverview = () => {
  console.log('handleBorrowOverview');
  // window.open('/export/overview', '_blank', 'noopener');
};

onMounted(async () => {
  try {
    const semesterStartResponse = await Announcement.getGet(2);
    initialStartDate.value = semesterStartResponse.content || startDate;
    const semesterEndResponse = await Announcement.getGet(3);
    initialEndDate.value = semesterEndResponse.content || endDate;
  } catch (err) {
    console.error('獲取公告失敗', err);
  }
})
</script>

<template>
  <div id="general-setting">
    <div>
      <div class="board-select">
        <select id="boardselect" :value="board" @change="emit('update:board', $event.target.value)">
          <option value="note">身分註記</option>
          <option value="announcement">公告與規則</option>
        </select>
      </div>
      <form class="semester-form" @submit.prevent="updateSemesterInterval">
        <label for="start">學年起：</label>
        <input type="date" class="input-field" id="start" name="start" v-model="initialStartDate">
        <label for="end">學年迄：</label>
        <input type="date" class="input-field" id="end" name="end" v-model="initialEndDate">
        <button type="submit">儲存</button>
      </form>
    </div>
    <div class="export-button">
      <button id="borrow-record" type="button" @click="handleBorrowHistory">借用紀錄</button>
      <button id="borrow-overview" type="button" @click="handleBorrowOverview">借用概況圖</button>
    </div>
  </div>
</template>

<style scoped>
#general-setting div {
  display: flex;
  flex-direction: row;
}

#boardselect {
  min-width: 160px;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0.5rem;
  margin-right: 1rem;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
  appearance: none;
  background-color: #FFF;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
}

.board-select,
.semester-form,
.export-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  font-size: 20px;
  margin-bottom: 1rem;
}

.semester-form .input-field {
  color: #000;
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  margin-right: 1rem;
  padding: 0.5rem;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
}

.semester-form button,
.export-button button {
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
}

.semester-form button {
  padding: 0.5rem;
}

.export-button button {
  padding: 0.5rem 1rem;
  margin: 0 1rem;
}

.semester-form button:hover,
.export-button button:hover {
  background-color: #DFE1E6;
}

select,
button {
  cursor: pointer;
  color: #000;
}

@media screen and (min-width: 426px) {

  #boardselect,
  .semester-form label,
  .semester-form .input-field,
  .semester-form button,
  .export-button button {
    font-size: 20px;
  }
}

@media screen and (max-width: 1439px) {
  #borrow-record {
    margin-left: 0;
  }
}

@media screen and (max-width: 1023px) {
  #general-setting div {
    display: block;
  }

  .semester-form {
    flex-direction: column;
    align-items: start;
  }

  .semester-form label,
  .semester-form button {
    margin-top: 0.5rem;
  }

  .semester-form .input-field,
  .semester-form button,
  .export-button button {
    width: 100%;
  }

  .export-button {
    flex-direction: column;
    align-items: start;
  }

  .export-button button {
    margin-top: 0.5rem;
    margin-left: 0;
  }
}

@media screen and (min-width: 1440px) {
  #general-setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }


  .semester-form {
    margin-right: 4rem;
  }

  .export-button button {
    margin: 0 0.5rem;
  }
}
</style>
