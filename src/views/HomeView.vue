<template>
    <main>

        <div class="row pb-5 flex flex-direction-row" style="width: 90vw">
            <template v-for="(image, index) in Object.entries(images)" :key="index">
                <va-image
                    v-if="image && image.length > 0"
                    fit="contain"
                    class="flex"
                    style="max-height: 512px; max-width: 512px;"
                    :src="image[1]"
                    lazy
                />
                <VaSkeleton
                    v-else
                    class="flex"
                    style="height: 512px; max-width: 512px;"
                />
            </template>
        </div>

        <div v-if="loading" class="row">
            <div
                class="flex flex-col"
                style="width: 100%; display: flex; justify-content: center"
            >
                <div style="display: flex; justify-content: center; align-items: center">
                    <h3>Loading ...</h3>
                    <va-progress-circle indeterminate/>
                </div>
            </div>
        </div>


        <div class="row flex">
            <div
                class="flex flex-col md10"
                style="width: 100%;"
            >
                <div style="display: flex; justify-content: center">
                    <va-input
                        v-model="prompt"
                        placeholder="Prompts ..."
                        readonly
                        outline
                        background="dark"
                        type="textarea"
                        :min-rows="5"
                        :max-rows="12"
                    />
                </div>
            </div>

            <div
                class="flex flex-col md2"
                style="width: 100%"
            >
                <div class="row" style="height: 50%">
                    <div
                        class="flex flex-col"
                        style="width: 100%; display: flex; justify-content: center"
                    >
                        <div style="display: flex; justify-content: center; align-items: center">
                            <va-button
                                color="dark"
                                style="height: 3rem; width: 8rem"
                                @click="generateImage"
                            >
                                Generate
                            </va-button>
                        </div>
                    </div>
                </div>
                <div class="row" style="height: 50%">
                    <div
                        class="flex flex-col"
                        style="width: 100%; display: flex; justify-content: center"
                    >
                        <div style="display: flex; justify-content: center; align-items: center">
                            <va-button
                                color="danger"
                                style="height: 3rem; width: 8rem"
                                @click="reset"
                            >
                                Reset
                            </va-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
import { VaButton, VaImage, VaInput, VaProgressCircle } from 'vuestic-ui';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const loading = ref<boolean>(true);
const prompt = ref<string>('');
const images = reactive<{ [key: string]: string }>({});

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

const generateImage = async () => {
    resetVariables();
    loading.value = true;
    await axiosInstance.get('generate').catch()
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
        prompts.push(key + 1 + ' | ' + value + '\n');
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

const init = async () => {
    await Promise.all([
        loadPrompts(),
        loadImages(),
    ]);
}

onMounted(async () => {
    resetVariables();
    await init();
});

</script>
