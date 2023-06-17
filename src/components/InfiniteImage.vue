<template>
    <div id="scrollable" class="container page-fade-in">
        <div v-for="item of dataArray" :key="item.prompt" class="item">
            <img
                class="image"
                :class="{ imageBorder: showBorder }"
                :src="item.image"
                :alt="item.prompt"
                loading="lazy"
            />
            <div class="text-font prompt">
                {{ getTitle(item) }}
            </div>
            <div class="text-font source">
                {{ getSource(item) }}
            </div>
        </div>
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

const props = defineProps({
    project: {
        type: String,
        default: '',
    },
});

const dataStore = useDataStore();
const {
    loadData,
    getImageCount,
    resetVariables,
    getSource,
    getTitle,
} = dataStore;
const {
    imageCount,
    dataArray
} = storeToRefs(dataStore);


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

    if (props.project === '') {
        await init();
        pollData()
    } else {
        await loadData(props.project);
        scrollToRight();
    }
    enableHorizontalScroll();
    addKeyShortcuts();
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
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 75vh;
}

.text-font {
    color: #f6dab6;
    white-space: pre-wrap;
    text-align: center;
    line-height: 1.25;
    font-family: 'Newsreader', serif;
    font-style: italic;
    font-weight: 200;
}

.prompt {
    font-size: 4vh;
    padding-inline: 1rem;
    margin-top: 2vh;
    font-weight: 400;
}

.source {
    font-size: 3vh;
    padding-inline: 0.5rem;
    margin-top: 1vh;
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
