<script setup>
import { ref, computed, onMounted } from 'vue'
import IconSearch from '@/components/icons/IconSearch.vue';
import PopupNewAnnounce from '@/components/popups/PopupNewAnnounce.vue';
import PopupEditAnnounce from '@/components/popups/PopupEditAnnounce.vue';
import { Announcement } from '@/api/main';
import dateFormatter from '@/utils/dateFormatter';

const searchValue = ref('');
const showNewPopup = ref(false);
const showEditPopup = ref(false);
const editAnnouncement = ref(null);

// sample data
const announcements = ref([]);
const rules = ref('');

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
  const today = new Date().setHours(0, 0, 0, 0);
  const announcementDate = new Date(date).setHours(0, 0, 0, 0);
  return today < announcementDate;
}

const fetchAnnounce = async () => {
  announcements.value = await Announcement.getAll({
    include_inactive: true
  });
}

const editAnnounce = (announce) => {
  showEditPopup.value = true;
  editAnnouncement.value = announce;
}

const handleNewAnnounce = async (announce) => {
  if(announce.title.length > 20){
    alert('標題長度不可超過20字');
    return;
  }

  await Announcement.postCreate(announce);
  await fetchAnnounce();
  showNewPopup.value = false;
};

const handleEditAnnounce = async (announce) => {
  if(announce.title.length > 20){
    alert('標題長度不可超過20字');
    return;
  }
  
  let updateAnnounce = {};
  if(announce.title !== editAnnouncement.value.title){
    updateAnnounce.title = announce.title;
  }
  if(announce.content !== editAnnouncement.value.content){
    updateAnnounce.content = announce.content;
  }
  if (announce.date !== editAnnouncement.value.date) {
    updateAnnounce.date = announce.date;
  }
  await Announcement.patchUpdate(announce.id, updateAnnounce);

  showEditPopup.value = false;
  editAnnouncement.value = null;
  await fetchAnnounce();
}

const deleteAnnounce = async (announce) => {
  try {
    await Announcement.deleteDelete(announce.id);
    await fetchAnnounce();
  } catch (err) {
    console.error('刪除公告失敗', err);
  }
}

const handleRuleUpdate = async () => {
  try {
    await Announcement.patchUpdate(1, {
      content: rules.value
    });
    alert('更新成功');
  } catch (err) {
    console.error('更新公告失敗', err);
  }
}

onMounted(async () => {
  try {
    await fetchAnnounce();
    const rulesResponse = await Announcement.getGet(1);
    rules.value = rulesResponse.content;
  } catch (err) {
    console.error('獲取公告失敗', err);
  }
})
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
          <td>{{ dateFormatter(announce.date) }}</td>
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
    <textarea id="rule" v-model="rules"></textarea>
    <button type="button" @click="handleRuleUpdate">儲存</button>
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
