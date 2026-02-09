import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormatDateTimeUtils {
    formatDateForInput(date: string | Date): string {
        if (!date) return '';
        const date_str = new Date(date).toISOString().split('T')[0];
        console.log('formatDateForInput.date', date)
        console.log('formatDateForInput.date_str', date_str)
        return date_str;
    }

    formatTimeForInput(time: string | Date | null): string {
        if (!time) return '';

        // If already HH:mm, return as-is
        if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
            return time;
        }

        const d = new Date(time);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}