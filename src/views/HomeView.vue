<template>
    <main id="scrollable" class="container page-fade-in">
        <div v-for="item of dataArray" :key="item.prompt"
             class="item" style="display: flex; flex-direction: column; align-items: center"
        >
            <va-image
                class="image"
                :class="{ imageBorder: showBorder }"
                :src="item.image"
                :alt="item.prompt"
                lazy
            />
            <div class="text">
                {{ getTitle(item) }}
            </div>
        </div>
    </main>
    <div v-if="showDevBar" class="bar">
        <va-button
            class="button"
            color="danger"
            @click="reset"
        >
            Reset
        </va-button>
        <va-button
            class="button"
            color="dark"
            @click="generateImage"
        >
            Generate
        </va-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    enableHorizontalScroll,
    scrollAmount,
    ScrollDirection,
    scrollToLeft,
    scrollToRight,
    startScroll,
    stopScroll
} from '@/composables/scrolling';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const {
    loadData,
    getImageCount,
    generateImage,
    reset,
    resetVariables,
    getTitle
} = dataStore;
const {
    imageCount,
    dataArray
} = storeToRefs(dataStore);

const showDevBar = ref<boolean>(false);
const showBorder = ref<boolean>(false);

const pollData = () => {
    setInterval(async () => {
        const oldImageCount = imageCount.value;
        await getImageCount();
        if (oldImageCount !== imageCount.value) loadData();
    }, 5000);
}


const addKeyShortcuts = () => {
    const scrollArrowAmount = 700;

    const handleKeyPress = (event: { keyCode: number; }) => {
        if (event.keyCode === 84) { // T
            showDevBar.value = !showDevBar.value;
        }
        if (event.keyCode === 81) { // Q
            stopScroll();
            scrollToLeft();
        }
        if (event.keyCode === 69) { // E
            stopScroll();
            scrollToRight();
        }
        if (event.keyCode === 65) { // A
            stopScroll();
            startScroll(ScrollDirection.Left);
        }
        if (event.keyCode === 68) { // D
            stopScroll();
            startScroll(ScrollDirection.Right);
        }
        if (event.keyCode === 83) { // S
            stopScroll();
        }
        if (event.keyCode === 71) { // G
            showBorder.value = !showBorder.value;
        }
        if (event.keyCode === 37) { // left arrow
            stopScroll();
            scrollAmount(-scrollArrowAmount);
        }
        if (event.keyCode === 39) { // right arrow
            stopScroll();
            scrollAmount(scrollArrowAmount);
        }
    }

    document.addEventListener("keydown", handleKeyPress, { passive: true });
}

const init = async () => {
    await loadData();
    await getImageCount();
    scrollToRight();
}

onMounted(async () => {
    resetVariables();
    await init();
    enableHorizontalScroll();
    addKeyShortcuts();
    pollData();
});

</script>

<style scoped>

.container {
    display: flex;
    white-space: nowrap;
    height: 100vh;
    overflow-y: hidden;
    overflow-x: scroll;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background-color: #222;
}

::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.item {
    height: 100%;
    width: 75vh;
}

.text {
    font-size: 4vh;
    padding-inline: 1rem;
    margin-top: 2vh;
    color: #f6dab6;
    white-space: pre-wrap;
    text-align: center;
    line-height: 1.25;
    font-family: 'Newsreader', serif;
}

.bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    border: 1px solid #f6dab6;
    background-color: #222222;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
}

.button {
    height: 2rem;
    width: 7rem;
    margin-inline: 0.25rem;
    --va-button-font-size: 1.25rem;
}

.imageBorder {
    border: 1px solid red;
}

.image {
    height: 75vh;
    width: 75vh;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.page-fade-in {
    animation: fade-in 0.5s ease-in-out;
}

</style>
