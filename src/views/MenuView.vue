<template>
    <div class="container">
        <h1 class="header">Outpainting</h1>

        <div class="list">
            <router-link
                v-if="addApiSection"
                class="link"
                :to="'/base/' + defaultProjects[0].link"
            >
                {{ defaultProjects[0].title }}
            </router-link>

            <template v-for="(project, index) in projects" :key="index">
                <router-link
                    class="link"
                    :to="'/base/' + project"
                >
                    {{ project }}
                </router-link>
            </template>
        </div>

        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">

import { axiosInstanceServe } from '@/composables/api';
import { onMounted, reactive } from 'vue';

const defaultProjects = [
    {
        title: 'News',
        link: '',
    }
];

const projects = reactive<string[]>([])
const addApiSection = import.meta.env.VITE_ADD_API_SECTION === 'true';

const loadProjects = async () => {
    const response = await axiosInstanceServe.get('/folders');
    projects.slice();
    projects.push(...response.data);
};

onMounted(async () => {
    await loadProjects();
});

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.header {
    color: #f6dab6;
    text-align: center;
    line-height: 1.25;
    font-family: 'Newsreader', serif;
    font-style: italic;
    font-weight: 600;

    font-size: 4rem;
    margin: 3rem 1rem 2rem;
}

.list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.link {
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: 'Newsreader', serif;
    color: #f6dab6;
    font-size: 2.25rem;
    margin: 1rem;

    border: 1px solid #f6dab6;
    border-radius: 20px;

    width: 25rem;
    height: 5rem;

    text-decoration: none;
}

.link:hover {
    background-color: #f6dab6;
    color: #121414;
    border: none;
}

.link:active {
    background-color: #c9ad8a;
    color: #121414;
    border: none;
}

</style>
