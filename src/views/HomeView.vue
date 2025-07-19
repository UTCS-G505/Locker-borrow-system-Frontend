<script setup>
    import data from '../assets/tempDatas/announcementData.json'
    import { ref } from 'vue';

    const showAllAnnouncement = ref( false );
    const toogleShowAll = () => {
        showAllAnnouncement.value = !showAllAnnouncement.value;
    }
</script>

<template>
  <div class="mt-20 gap-6 flex flex-col w-full px-6">
    <section class="flex flex-col">
        <h3 class="text-[#1A1A1A] text-4xl m-2">
            公告
        </h3>
        <div class="bg-white w-full flex flex-col items-start border-[#DFE1E6] border rounded-xl p-4">
            <div v-for="item in data.slice(0, showAllAnnouncement ? data.length : 4)" :key="item.id" class="mb-3 w-full">
                <div class="flex justify-between items-end">
                    <h3 class="[font-size:1.125rem;] sm:text-2xl font-semibold text-gray-800">• {{ item.title }}</h3>
                    <p class="text-gray-500 text-sm">{{ item.date }}</p>
                </div>
                <p class="text-gray-600 text-sm sm:text-lg mt-1">{{ item.content }}</p>
            </div>
            <button @click="toogleShowAll" class="text-gray-400 text-sm">{{ showAllAnnouncement ? '顯示較少' : '顯示全部公告' }}</button>
        </div>
    </section>


    <section class="flex flex-col">
        <h3 class="text-[#1A1A1A] text-4xl m-2">
            借用規則
        </h3>
        <ul class="bg-white w-full flex flex-col border-[#DFE1E6] border rounded-xl list-decimal p-2 pl-8 text-md sm:text-lg leading-loose">
            <li>每位學生每學期限借用一格系櫃，不得重複申請或轉借他人。</li>
            <li>系櫃借用期間為當學期第 1 週起至期末考週結束，請依公告時間準時清空。</li>
            <li>使用期間內須妥善保管櫃內物品，學校不負遺失或損壞之責任。</li>
            <li>禁止於系櫃內存放易腐爛物品、危險物品或違禁品，一經發現將取消借用資格。</li>
            <li>系櫃鑰匙（或密碼）遺失須立即通報系辦，補發鑰匙需自費。</li>
            <li>借用期滿未清空者，系辦有權代為清除，且不負保管責任。</li>
            <li>有違規紀錄者，將列入黑名單並停止下一學期借用資格。</li>
        </ul>
    </section>
  </div>
</template>