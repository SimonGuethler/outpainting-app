import { DateTime } from 'luxon';

export const formatDate = (timestamp: string) => {
    const dateTime = DateTime.fromISO(timestamp);
    return dateTime.toFormat('dd.MM.yyyy HH:mm');
}
