<script setup>
import { ref, computed } from 'vue'
import IconSearch from './icons/IconSearch.vue';
import PopupNewAnnounce from './popups/PopupNewAnnounce.vue';
import PopupEditAnnounce from './popups/PopupEditAnnounce.vue';

const searchValue = ref('');
const showNewPopup = ref(false);
const showEditPopup = ref(false);
const editAnnouncement = ref(null);

// sample data
const announcements = ref([
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
    "date": "2025/09/25",
    "content": "歡迎新生參加 7 月 23 日中午 12:10 在 D201 教室舉辦的系櫃使用說明會。"
  }
]);

const handleNewAnnounce = (announce) => {
  alert(`日期：${announce.date}\n標題：${announce.title}\n內容：${announce.content}`);
  showNewPopup.value = false;
};

const filteredAnnounce = computed(() => {
  return announcements.value.filter((announce) => {
    return announce.title.toLowerCase().includes(searchValue.value.toLowerCase())
  }).sort((a, b) => {
    return dateStringToDate(b.date) - dateStringToDate(a.date);
  })
})

const dateStringToDate = (dateString) => {
  const stringSplit = dateString.split('/');
  return new Date(
    Number(stringSplit[0]),
    Number(stringSplit[1]) - 1,
    Number(stringSplit[2])
  );
}

const isDraft = (date) => {
  const today = new Date();
  const announcementDate = dateStringToDate(date);
  return today < announcementDate;
}

const editAnnounce = (announce) => {
  showEditPopup.value = true;
  editAnnouncement.value = announce;
}

const handleEditAnnounce = (announce) => {
  showEditPopup.value = false;
  editAnnouncement.value = null;
  alert(`日期：${announce.date}\n標題：${announce.title}\n內容：${announce.content}`);
  announcements.value[announce.id - 1] = announce;
  console.log(announcements.value);
}

const deleteAnnounce = (announce) => {
  announcements.value.pop(announcements.value.indexOf(announce));
}
</script>

<template>
  <div id="control">
    <div id="search-bar">
      <input
        type="text"
        id="search"
        name="search"
        placeholder="搜尋"
        v-model="searchValue"
      />
      <label for="search">
        <IconSearch />
      </label>
    </div>
    <button type="button" id="add-announce" @click="showNewPopup = true">新增公告＋</button>
  </div>

  <div id="announce-board">
    <table>
      <thead>
        <tr>
          <th>時間</th>
          <th>公告標題</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="announce in filteredAnnounce" :key="announce.id">
          <td>{{ announce.date }}</td>
          <td>
            {{ announce.title }}
            <span class="draft" v-if="isDraft(announce.date)">(草稿)</span>
          </td>
          <td>
            <button type="button" @click="editAnnounce(announce)">編輯</button>
            <button type="button" @click="deleteAnnounce(announce)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <hr>
  <div id="rule-board">
    <label for="rule">系櫃使用規則</label>
    <textarea id="rule"></textarea>
    <button type="button">儲存</button>
  </div>

  <PopupNewAnnounce
    v-if="showNewPopup"
    @close="showNewPopup = false"
    @submit="handleNewAnnounce"
  />
  <PopupEditAnnounce
    v-if="showEditPopup"
    @close="showEditPopup = false"
    @submit="handleEditAnnounce"
    :announcement="editAnnouncement"
  />
</template>

<style scoped>
#control {
  display: flex;
  max-width: 100%;
  flex-direction: row;
  align-items: center;
}

#search-bar {
  max-width: 100%;
}

#search-bar input{
  max-width: 100%;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 20px;
  box-shadow: 0 2px 4px #0000001a;
}

#search-bar svg {
  margin-left: -30px;
}

#add-announce {
  border-radius: 10px;
  margin-left: 30px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px #0000001a;
}

#announce-board {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 1024px;
  border-collapse: collapse;
  font-size: 20px;
}

thead {
  background-color: #EBF7FF;
  box-shadow: 0 2px 2px 0 #DFE1E6;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 25px;
  text-align: left;
}

tr {
  border-bottom: rgba(236,232,232,.35) solid 4px;
}

th, td {
  padding: 0.8rem;
}

th:first-child {
  border-top-left-radius: 10px;
}

th:last-child {
  border-top-right-radius: 10px;
}

th:first-child, td:first-child {
  width: 15%;
  min-width: 150px;
}

th:last-child, td:last-child {
  width: 30%;
  min-width: 300px;
}

.draft {
  color: #888;
}

button {
  color: #000;
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0 1.5rem;
  margin-right: 1rem;
  font-size: 20px;
  box-shadow: 0 2px 4px #0000001a;
}

button:hover {
  background-color: #DFE1E6;
  cursor: pointer;
}

hr {
  margin: 1rem 0;
  border: 1.5px solid #DFE1E6;
}

#rule-board {
  font-size: 25px;
}

#rule-board textarea {
  width: 100%;
  min-height: 200px;
  border: 1px solid #DFE1E6;
  border-radius: 14px;
  background-color: #fff;
  margin: 0.5rem 0;
  padding: 1rem;
  font-size: 20px;
  box-shadow: 0 2px 4px #0000001a;
  resize: vertical;
}

#rule-board button {
  width: 100%;
  padding: 0.5rem;
}

@media screen and (max-width: 600px) {
  #control {
    flex-direction: column;
    align-items: start;
  }

  #add-announce {
    margin-left: 0;
  }
}

@media screen and (max-width: 425px) {
  #add-announce {
    width: 100%;
  }

  #search-bar input::-webkit-input-placeholder {
    font-size: 16px;
  }

  table {
    min-width: 700px;
    font-size: 16px;
  }

  thead {
    font-size: 20px;
  }

  button {
    font-size: 16px;
  }
}
</style>
