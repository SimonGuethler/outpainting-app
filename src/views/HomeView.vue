<template>
    <main id="scrollable" class="container">
        <div v-for="item of dataArray" :key="item.prompt"
             class="item" style="display: flex; flex-direction: column; align-items: center"
        >
            <va-image
                :src="item.data"
                :alt="item.prompt"
                :title="item.prompt"
                loading="lazy"
                style="height: 75vh; width: 75vh; pointer-events: none;"
            />
            <div style="font-size: 1.3rem; margin-top: 1rem; color: antiquewhite">
                {{ item.prompt }}
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const loading = ref<boolean>(true);
const prompt = ref<string>('');
const images = reactive<{ [key: string]: string }>({});

const imagesArray = computed<string[]>(() => Object.entries(images).map(([, value]) => value));
const promptArray = computed<string[]>(() =>
    prompt.value.split('\n').map((line) => line.trim()).filter((line) => line.length > 0)
);
const dataArray = computed<{ prompt: string, data: string }[]>(() => {
    return Object.entries(images).map(([key, value]) => ({
        prompt: promptArray.value[Number(key)],
        data: value,
    }));
});

const windowWidth = computed<number>(() => window.innerWidth);

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

    return Number(response.data);
}

const loadPrompts = async () => {
    const response = await axiosInstance.get('prompts').catch(() => {
    })
    if (!response || !response.data) return;

    const prompts: string[] = [];
    for (let [key, value] of response.data.entries()) {
        // prompts.push(key + 1 + ' | ' + value + '\n');
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

const horizontalScroll = () => {
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

const init = async () => {
    await Promise.all([
        loadPrompts(),
        loadImages(),
    ]);
}

onMounted(async () => {
    resetVariables();
    await init();
    horizontalScroll();
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

</style>
