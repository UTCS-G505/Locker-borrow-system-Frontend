<script setup>
import { ref, watch, onMounted } from 'vue';
import ModalAnnouncement from '@/components/ModalAnnouncement.vue';
import { Announcement } from '@/api/main';
import dateFormatter from '@/utils/dateFormatter';

// 為方便展示，在此data使用10筆寫死的模擬公告。未來將改為透過axios載入動態資料
const data = ref([]);
const rules = ref([]);

// 此為boolean，true表示顯示全部、false表示只顯示部分(目前設定為4個)
const showAllAnnouncement = ref(false); 

// 目前被點擊的公告(物件)
const selectedAnnouncement = ref(null) 

// 此為供使用者切換「公告」顯示模式的funciton
const toggleShowAll = () => { 
  showAllAnnouncement.value = !showAllAnnouncement.value;
}

onMounted(async () => {
  try {
    const allAnnouncementsResponse = await Announcement.getAll();
    data.value = allAnnouncementsResponse;
    const rulesResponse = await Announcement.getGet(1);
    rules.value = rulesResponse.content.split('\n');
  } catch (err) {
    console.error('獲取公告失敗', err);
  }
})

// **監聽 Modal 開啟/關閉，鎖住背景滾動**
watch(selectedAnnouncement, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});
</script>

<template>
  <ModalAnnouncement :announcement="selectedAnnouncement" v-if="selectedAnnouncement!=null" @close="selectedAnnouncement = null"/>
  <div class="container">
    <section class="announcement-section">
      <h1 class="section-title">公告</h1>
      <div class="announcement-box">
        <p class="announcement-title" v-if="!data.length">目前沒有公告</p>
        <div
          v-for="item in data.slice(0, showAllAnnouncement ? data.length : 4)"
          :key="item.id"
          class="announcement-item"
        >
          <div class="announcement-header">
            <p class="announcement-date">{{ dateFormatter(item.date) }}</p>
            <span class="divider"></span>
            <h3 class="announcement-title" @click="selectedAnnouncement = item">{{ item.title }}</h3>
          </div>
        </div>
        <button @click="toggleShowAll" class="toggle-button" v-if="data.length > 4">
          {{ showAllAnnouncement ? '顯示較少' : '顯示全部公告' }}
        </button>
      </div>
    </section>

    <section class="rule-section">
      <h1 class="section-title">借用規則</h1>
      <ol class="rules-list">
        <li v-for="rule in rules" :key="rule">
          {{ rule }}
        </li>
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
  white-space: pre-wrap;
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