<script setup>
import { ref, watch } from 'vue';
import ModalAnnouncement from '@/components/ModalAnnouncement.vue';

// 為方便展示，在此data使用10筆寫死的模擬公告。未來將改為透過axios載入動態資料
const data = [
  {
    "id": 1,
    "title": "系櫃系統維護通知",
    "date": "2025/02/25",
    "content": "本系統將於 7 月 21 日（週日）凌晨 1 點至 3 點進行例行維護，期間暫停所有借用操作。"
  },
  {
    "id": 2,
    "title": "112-1 學期系櫃申請開放",
    "date": "2025/02/25",
    "content": "系櫃申請將於 7 月 22 日早上 9 點開放，請同學至系統填寫表單並完成抽籤程序。"
  },
  {
    "id": 3,
    "title": "遺失物通知",
    "date": "2025/02/25",
    "content": "7 月 17 日在 B1 區櫃位發現未上鎖之櫃子，內有私人物品，請失主盡快聯繫系辦認領。"
  },
  {
    "id": 4,
    "title": "未繳系櫃保證金名單公告",
    "date": "2025/02/25",
    "content": "部分同學尚未繳交保證金，請於 7 月 25 日前完成繳費，否則將取消借用資格。"
  },
  {
    "id": 5,
    "title": "系櫃借用資格公告",
    "date": "2025/02/25",
    "content": "限本系大二以上學生申請，每人限申請一格，請勿重複登記或冒名申請。"
  },
  {
    "id": 6,
    "title": "抽籤結果公布",
    "date": "2025/02/25",
    "content": "本學期系櫃抽籤結果已公布，請至系統首頁查詢並於期限內完成領櫃。"
  },
  {
    "id": 7,
    "title": "系櫃使用規範提醒",
    "date": "2025/02/25",
    "content": "請勿在櫃內存放食物或違禁品，違者將停權並列入紀錄。"
  },
  {
    "id": 8,
    "title": "暑假系櫃暫停使用公告",
    "date": "2025/02/25",
    "content": "暑假期間（7/30~9/5）全系櫃將進行消毒與整理，請提前清空櫃內物品。"
  },
  {
    "id": 9,
    "title": "系櫃重設密碼功能開放",
    "date": "2025/02/25",
    "content": "忘記密碼的同學可透過系統首頁「重設密碼」功能進行驗證並修改。"
  },
  {
    "id": 10,
    "title": "新生系櫃申請說明會",
    "date": "2025/02/25",
    "content": "歡迎新生參加 7 月 23 日中午 12:10 在 D201 教室舉辦的系櫃使用說明會。"
  }
];

// 此為boolean，true表示顯示全部、false表示只顯示部分(目前設定為4個)
const showAllAnnouncement = ref(false); 

// 目前被點擊的公告(物件)
const selectedAnnouncement = ref(null) 

// 此為供使用者切換「公告」顯示模式的funciton
const toggleShowAll = () => { 
  showAllAnnouncement.value = !showAllAnnouncement.value;
}

// **監聽 Modal 開啟/關閉，鎖住背景滾動**
watch(selectedAnnouncement, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
</script>

<template>
  <h1>This is HomeView</h1>
  <ModalAnnouncement :announcement="selectedAnnouncement" v-if="selectedAnnouncement!=null" @close="selectedAnnouncement = null"/>
  <div class="container">
    <section class="announcement-section">
      <h1 class="section-title">公告</h1>
      <div class="announcement-box">
        <div
          v-for="item in data.slice(0, showAllAnnouncement ? data.length : 4)"
          :key="item.id"
          class="announcement-item"
        >
          <div class="announcement-header">
            <p class="announcement-date">{{ item.date }}</p>
            <span class="divider"></span>
            <h3 class="announcement-title" @click="selectedAnnouncement = item">{{ item.title }}</h3>
          </div>
        </div>
        <button @click="toggleShowAll" class="toggle-button">
          {{ showAllAnnouncement ? '顯示較少' : '顯示全部公告' }}
        </button>
      </div>
    </section>

    <section class="rule-section">
      <h1 class="section-title">借用規則</h1>
      <ol class="rules-list">
        <li>每位學生每學期限借用一格系櫃，不得重複申請或轉借他人。</li>
        <li>系櫃借用期間為當學期第 1 週起至期末考週結束，請依公告時間準時清空。</li>
        <li>使用期間內須妥善保管櫃內物品，學校不負遺失或損壞之責任。</li>
        <li>禁止於系櫃內存放易腐爛物品、危險物品或違禁品，一經發現將取消借用資格。</li>
        <li>系櫃鑰匙（或密碼）遺失須立即通報系辦，補發鑰匙需自費。</li>
        <li>借用期滿未清空者，系辦有權代為清除，且不負保管責任。</li>
        <li>有違規紀錄者，將列入黑名單並停止下一學期借用資格。</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.section-title {
  color: black;
  font-size: 2.25rem;
  margin: 0.5rem;
}

.announcement-section,
.rule-section {
  display: flex;
  flex-direction: column;
}

.announcement-box {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #DFE1E6;
  border-radius: 0.75rem;
  padding: 1rem;
  gap: 0.5rem;
}

.announcement-item {
  display: flex;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.divider {
  width: 0.05rem;
  height: 80%;
  border-radius: 25%;
  background-color: #6B7280;     /* gray-500 */
  margin: auto 0;
}

.announcement-title {
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer; /* 游標變成手指 */
  color: black; /* 保持原本顏色 */
  text-decoration: none; /* 預設無底線 */
  transition: color 0.2s ease; /* 滑過時平滑變化 */
}

.announcement-title:hover {
  text-decoration: underline; /* 加上底線 */
}

@media (min-width: 640px) {
  .announcement-title {
    font-size: 1.5rem;
  }
}

.announcement-date {
  font-size: 0.875rem;
  color: #6B7280; /* gray-500 */
}


.toggle-button {
  font-size: 0.875rem;
  color: #9CA3AF; /* gray-400 */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
}

.rules-list {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #DFE1E6;
  border-radius: 0.75rem;
  padding: 1rem;
  list-style-position: inside;
  font-size: 1rem;
  line-height: 1.75rem;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .rules-list {
    font-size: 1.125rem;
  }
  .announcement-header {
    gap: 0.75rem;
  }

  .divider {
    width: 0.1rem;
  }
}
</style>