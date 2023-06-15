import { DateTime } from 'luxon';

export const formatDate = (timestamp: string) => {
    const dateTime = DateTime.fromISO(timestamp);
    if (!dateTime.isValid) return timestamp;
    if (dateTime.toFormat('dd.MM.yyyy') === '01.01.' + dateTime.toFormat('yyyy')) return dateTime.toFormat('yyyy');
    return dateTime.toFormat('dd.MM.yyyy HH:mm');
}
