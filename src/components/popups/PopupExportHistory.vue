<template>
  <PopupModal @close="emit('close')">
    <template #header>
      <h2>匯出歷史紀錄</h2>
    </template>

    <template #content>
      <div class="semester-select-container">
        <label for="semester-select" class="semester-select">請選擇要匯出的學期: </label>
        <select v-model="selectedSemester" class="semester-select" id="semester-select">
          <option value="all" selected>全部</option>
          <option v-for="s in semesters" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="exportBorrowHistoryXlsx">下載</button>
    </template>
  </PopupModal>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as XLSX from "xlsx";
import { SsoUser } from '@/api/sso';
import { Record } from '@/api/main';
import PopupModal from '@/components/popups/PopupModal.vue';
import dateFormatter from '@/utils/dateFormatter';

const emit = defineEmits(['close']);
const semesters = ref([]);
const selectedSemester = ref("all");
const allRecords = ref([]);

const BORROW_HISTORY_XLSX_COLUMNS = [
  { key: "id", label: "借用紀錄編號", get: r => r.id ?? "" },
  { label: "學年/學期", get: r => getAcademicYearAndSemester(r) },
  { key: "account", label: "借用者帳號", get: (_, u) => u?.account ?? "" },
  { key: "name", label: "借用者姓名", get: (_, u) => u?.name ?? "" },
  { key: "position", label: "年級/職稱", get: (_, u) => u?.position ?? "" },
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

const BORROW_HISTORY_XLSX_COLUMNS_LABELS = BORROW_HISTORY_XLSX_COLUMNS.map(c => c.label);

const timeFormatter = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

const getAcademicYearAndSemester = (r) => {
  if (r.start_date === null) return "";
  const startDate = new Date(r.start_date);
  const year = startDate.getFullYear() - 1911; // 轉民國年
  const month = startDate.getMonth() + 1;
  if (month >= 2 && month <= 7) return `${year - 1}-2` // 2~7 月為第二學期
  if (month == 1) return `${year - 1}-1`; // 1 月為第一學期, 但要年度要減一年
  return `${year}-1`; // 其餘 (8~12 月) 為第一學期
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

const handleExport = async () => {
  // 取得所有紀錄
  const recordData = await Record.getAll();

  // 取得所有 user 的資料
  const userIds = [...new Set(recordData.map(r => r.user_id))];
  const users = await Promise.all(userIds.map(id => SsoUser.getGet(id)));

  // 建立 user id 與資料的對應表
  const userMap = new Map(users.map(u => [u.id, u]));

  // 取得所有學年/學期
  semesters.value = [
    ...new Set(recordData.map((r) => getAcademicYearAndSemester(r)))
  ].sort((a, b) => {
    const [year1, semester1] = a.split("-");
    const [year2, semester2] = b.split("-");
    if (year1 === year2) {
      return Number.parseInt(semester2) - Number.parseInt(semester1);
    }
    return Number.parseInt(year2) - Number.parseInt(year1);
  });

  // 整合資料, 並依照學年/學期分類
  const semesterMap = new Map();

  for (const record of recordData) {
    const user = userMap.get(record.user_id);
    const semester = getAcademicYearAndSemester(record);

    if (!semesterMap.has(semester)) {
      semesterMap.set(semester, []);
    }

    semesterMap.get(semester).push({
      record,
      user
    });
  }

  // 按照申請日期排序
  for (const records of semesterMap.values()) {
    records.sort(
      (a, b) =>
        new Date(a.record.apply_date) -
        new Date(b.record.apply_date)
    );
  }

  allRecords.value = semesterMap;
}

const buildSheetData = ({ titleLines, headerRow, rows }) => {
  return [
    ...titleLines.map(t => [t]),
    headerRow,
    ...rows
  ];
}

const getDisplayWidth = (value) => {
  if (value == null) return 0;

  const str = String(value);

  // 中文字或全形字算 2 字元，其它算 1 字元
  return [...str].reduce((width, char) => {
    return width + (char.codePointAt(0) > 255 ? 2 : 1);
  }, 0);
}

const buildRowsWithMeta = ({ columns, records }) => {
  const rows = [];
  const maxWidths = columns.map(c => getDisplayWidth(c.label));

  for (const { record, user } of records) {
    const row = [];

    columns.forEach((col, i) => {
      const value = col.get(record, user);
      row.push(value);

      maxWidths[i] = Math.max(
        maxWidths[i],
        getDisplayWidth(value)
      );
    });

    rows.push(row);
  }

  // 回傳欄位及最大欄位寬度
  return { rows, maxWidths };
}

const buildColumnWidths = (maxWidths) => {
  // 該欄寬度為最大欄位寬度加上 2 個字元的 padding
  // 最小為 10, 最大為 40
  return maxWidths.map(w => ({
    wch: Math.min(Math.max(w + 2, 10), 40)
  }));
}

const exportBorrowHistoryXlsx = () => {
  const wb = XLSX.utils.book_new();
  const exportSemesters = selectedSemester.value == "all"
    ? semesters.value
    : [selectedSemester.value];

  for (const academicYearAndSemester of exportSemesters) {
    const filteredRecords = allRecords.value.get(academicYearAndSemester) || [];

    const { rows, maxWidths } = buildRowsWithMeta({
      columns: BORROW_HISTORY_XLSX_COLUMNS,
      records: filteredRecords
    });

    const sheetData = buildSheetData({
      titleLines: [
        `UTaipei CS Locker Borrow System - 借用紀錄匯出 (${academicYearAndSemester})`,
        `匯出時間: ${new Date().toLocaleString()}`
      ],
      headerRow: BORROW_HISTORY_XLSX_COLUMNS_LABELS,
      rows
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = buildColumnWidths(maxWidths);
    // 標題行要合併所有欄位
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: BORROW_HISTORY_XLSX_COLUMNS.length - 1 }
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: BORROW_HISTORY_XLSX_COLUMNS.length - 1 }
      }
    ];

    XLSX.utils.book_append_sheet(wb, ws, academicYearAndSemester);
  }

  const exportTime = new Date();
  const exportYear = exportTime.getFullYear();
  const exportMonth = String(exportTime.getMonth() + 1).padStart(2, '0');
  const exportDay = String(exportTime.getDate()).padStart(2, '0');
  const exportHour = String(exportTime.getHours()).padStart(2, '0');
  const exportMinute = String(exportTime.getMinutes()).padStart(2, '0');
  const exportSecond = String(exportTime.getSeconds()).padStart(2, '0');
  const exportFileName = `UTaipei_CS_Locker_Borrow_System_History_Export_${exportYear}${exportMonth}${exportDay}_${exportHour}${exportMinute}${exportSecond}.xlsx`
  XLSX.writeFile(wb, exportFileName);
}

onMounted(async () => {
  await nextTick();
  setTimeout(handleExport, 0);
});
</script>

<style scoped>
.semester-select-container {
  padding: 0.75rem 0;
}

.semester-select {
  font-size: 1.15rem;
}

#semester-select {
  border-radius: 5px;
  padding: 0 5px;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.confirm-button {
  width: 100px;
  height: 30px;
  color: black;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.confirm-button:hover {
  background-color: #DFE1E6;
}
</style>
