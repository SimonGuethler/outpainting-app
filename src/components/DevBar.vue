<template>
    <div v-if="showDevBar" class="bar">
        <button
            class="button reset"
            @click="reset"
        >
            Reset
        </button>
        <button
            class="button generate"
            @click="generateImage"
        >
            Generate
        </button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';

const dataStore = useDataStore();
const {
    generateImage,
    reset,
} = dataStore;

const showDevBar = ref<boolean>(false);

const addKeyShortcuts = () => {
    const handleKeyPress = (event: { keyCode: number; }) => {
        if (event.keyCode === 84) { // T
            showDevBar.value = !showDevBar.value;
        }
    }
    document.addEventListener("keydown", handleKeyPress, { passive: true });
}


onMounted(() => {
    addKeyShortcuts();
})

</script>

<style scoped>

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
    height: 2.25rem;
    width: 7rem;
    margin-inline: 0.25rem;
    --va-button-font-size: 1.25rem;

    border: 0;
    border-radius: 5px;

    color: white;
    font-size: 20px;
}

.button:hover {
    cursor: pointer;
}

.reset {
    background-color: #e34b4a;
}

.reset:hover {
    background-color: #e76665;
}

.reset:active {
    background-color: #cb4645;
}

.generate {
    background-color: #34495e;
}

.generate:hover {
    background-color: #526476;
}

.generate:active {
    background-color: #324557;
}

</style>
