<template>
    <main>

        <div class="row pb-5">
            <div
                v-if="!loading && image && image.length > 0"
                class="flex flex-col"
                style="width: 100%;"
            >
                <va-image
                    fit="contain"
                    class="w-full md:w-1/2 lg:w-1/3"
                    style="max-height: 500px; width: 90vw"
                    :src="image"
                />
            </div>

            <div
                v-else
                class="flex flex-col flex-center justify-center"
                style="width: 100%;"
            >
                <VaSkeleton
                    style="height: 500px; width: 90vw"
                />
            </div>
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
import { onMounted, ref } from 'vue';
import axios from 'axios';

const loading = ref<boolean>(true);
const image = ref<string>('');
const prompt = ref<string>('');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

const generateImage = async () => {
    resetVariables();
    loading.value = true;
    await axiosInstance.get('generate').catch()
    await init();
}

const loadImage = async () => {
    loading.value = true;
    const response = await axiosInstance.get('image', {
        responseType: 'arraybuffer'
    }).catch(() => {
        loading.value = false;
    })
    if (!response || !response.data) return;

    const binary = Array.from(new Uint8Array(response.data))
        .map(byte => String.fromCharCode(byte)).join('');
    const dataUrl = 'data:image/png;base64,' + btoa(binary);

    image.value = dataUrl;
    loading.value = false;
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
    image.value = '';
    prompt.value = '';
}

const init = async () => {
    await Promise.all([
        loadPrompts(),
        loadImage(),
    ]);
}

onMounted(async () => {
    resetVariables();
    await init();
});

</script>
