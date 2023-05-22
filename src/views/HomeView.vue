<template>
    <main id="scrollable" class="container">
        <div v-for="item of dataArray" :key="item.prompt"
             class="item" style="display: flex; flex-direction: column; align-items: center"
        >
            <va-image
                :class="{imageBorder: showBorder}"
                :src="item.data"
                :alt="item.prompt"
                :title="item.prompt"
                loading="lazy"
                style="height: 75vh; width: 75vh; pointer-events: none;"
            />
            <div class="text">
                {{ item.prompt }}
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
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const loading = ref<boolean>(true);
const prompt = ref<string>('');
const images = reactive<{ [key: string]: string }>({});
const imageCount = ref<number>(0);

const showDevBar = ref<boolean>(false);
const showBorder = ref<boolean>(false);

const promptArray = computed<string[]>(() =>
    prompt.value.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
);
const dataArray = computed<{ prompt: string, data: string }[]>(() => {
    return Object.entries(images).map(([key, value]) => ({
        prompt: promptArray.value[Number(key)],
        data: value,
    }));
});

const axiosInstance = axios.create({
    baseURL: 'http://10.40.2.30:8000',
    // baseURL: 'http://localhost:8000',
});


const generateImage = async () => {
    loading.value = true;
    await axiosInstance.get('generate').catch()
    resetVariables();
    await init();
}

const loadImage = async (index = 0) => {
    loading.value = true;
    images[index] = '';

    const response = await axiosInstance.get('image', {
        responseType: 'arraybuffer',
        params: {
            img: index,
        },
    }).catch(() => {
        loading.value = false;
    })
    if (!response || !response.data) return;

    const binary = Array.from(new Uint8Array(response.data))
        .map(byte => String.fromCharCode(byte)).join('');
    const dataUrl = 'data:image/png;base64,' + btoa(binary);

    images[index] = dataUrl;
    loading.value = false;
}

const loadImages = async () => {
    const count = await getImageCount();
    if (!count) return;

    for (let i = 0; i < count; i++) {
        await loadImage(i);
    }
    loading.value = false;
    scrollToRight();
}

const getImageCount = async (): Promise<number | undefined> => {
    const response = await axiosInstance.get('image_count').catch(() => {
    })
    if (!response || !response.data) return;

    const count = Number(response.data);
    imageCount.value = count;

    return count;
}

const loadPrompts = async () => {
    const response = await axiosInstance.get('prompts').catch(() => {
    })
    if (!response || !response.data) return;

    const prompts: string[] = [];
    for (let [_, value] of response.data.entries()) {
        prompts.push(value);
    }
    prompt.value = prompts.join('\n');
}

const reset = async () => {
    resetVariables();
    await axiosInstance.get('reset').catch()
}

const resetVariables = () => {
    Object.keys(images).forEach(key => delete images[key]);
    prompt.value = '';
}

const enableHorizontalScroll = () => {
    const scrollable = document.getElementById("scrollable");
    scrollable?.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scrollAmount = event.deltaY || event.deltaX;
        scrollable.scrollLeft += scrollAmount;
    });
}

const scrollToRight = () => {
    const scrollable = document.getElementById("scrollable");
    if (!scrollable) return;
    scrollable.scrollLeft = scrollable.scrollWidth;
}

const scrollToLeft = () => {
    const scrollable = document.getElementById("scrollable");
    if (!scrollable) return;
    scrollable.scrollLeft = 0;
}

enum ScrollDirection {
    Left,
    Right,
}

let requestId = 0;

const startScroll = (direction: ScrollDirection) => {
    if (requestId) return;

    const container = document.getElementById("scrollable")!;
    const scrollAmount = 0.25;

    const scroll = () => {
        if (direction === ScrollDirection.Left) {
            container.scrollLeft -= scrollAmount;
        } else if (direction === ScrollDirection.Right) {
            container.scrollLeft += scrollAmount;
        }
        requestId = requestAnimationFrame(scroll);
    }

    scroll();
}

function stopScroll() {
    cancelAnimationFrame(requestId);
    requestId = 0;
}

const addKeyShortcuts = () => {
    const handleKeyPress = (event: { keyCode: number; }) => {
        if (event.keyCode === 84) { // T
            showDevBar.value = !showDevBar.value;
        }
        if (event.keyCode === 81) { // Q
            scrollToLeft();
        }
        if (event.keyCode === 69) { // E
            scrollToRight();
        }
        if (event.keyCode === 65) { // A
            startScroll(ScrollDirection.Left);
        }
        if (event.keyCode === 68) { // D
            startScroll(ScrollDirection.Right);
        }
        if (event.keyCode === 83) { // S
            stopScroll();
        }
        if (event.keyCode === 71) { // G
            showBorder.value = !showBorder.value;
        }
    }

    document.addEventListener("keydown", handleKeyPress);
}

const init = async () => {
    await Promise.all([
        loadPrompts(),
        loadImages(),
    ]);
}

onMounted(async () => {
    resetVariables();
    await init();
    enableHorizontalScroll();
    addKeyShortcuts();
});

</script>

<style scoped>

.container {
    display: flex;
    white-space: nowrap;
    height: 100vh;
    overflow: hidden;
}

.item {
    height: 100%;
    width: 75vh;
}

.text {
    font-size: 2.5rem;
    padding-inline: 2rem;
    margin-top: 2rem;
    color: antiquewhite;
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
    border: 1px solid antiquewhite;
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

</style>
