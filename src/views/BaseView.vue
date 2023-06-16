<template>
    <InfiniteImage
        :project="project"
    />
    <DevBar v-if="project === ''"/>
</template>

<script setup lang="ts">
import DevBar from '@/components/DevBar.vue';
import InfiniteImage from '@/components/InfiniteImage.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const project = route.params.projectName as string || '';

</script>
