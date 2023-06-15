import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance } from '@/composables/api';
import { formatDate } from '@/composables/date';

export interface DataType {
    image: string;
    prompt: string;
    date: string;
    source: string;
    headline: string;
}

export const useDataStore = defineStore('data', () => {

    const imageCount = ref<number>(0);
    const dataArray = reactive<DataType[]>([])

    const loadData = async () => {
        const response = await axiosInstance.get('data').catch(() => {
        })
        if (!response || !response.data) return;
        const data: DataType[] = response.data;
        dataArray.splice(0);
        dataArray.push(...data);
    }

    const reset = async () => {
        resetVariables();
        await axiosInstance.get('reset').catch()
    }

    const getImageCount = async () => {
        const response = await axiosInstance.get('image_count').catch(() => {
        })
        if (!response || !response.data) return;

        imageCount.value = Number(response.data);
    }

    const generateImage = async () => {
        await axiosInstance.get('generate').catch()
    }

    const resetVariables = () => {
        dataArray.splice(0);
        imageCount.value = 0;
    }

    const getTitle = (item: DataType) => {
        if (!item) return '';
        return item.headline
    }

    const getSource = (item: DataType) => {
        if (!item) return '';
        if (item.prompt === '-') return '';
        if (item.date === '') return item.source;
        if (item.source === '') return formatDate(item.date);
        return formatDate(item.date) + ' - ' + item.source
    }

    return { loadData, reset, resetVariables, getImageCount, generateImage, getTitle, getSource, imageCount, dataArray }
})
