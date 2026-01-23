import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DeathNoticeGalleryOptions {
    public pageSize = 8;
    public pageNo = 1;
    public totalCount = 0;
    public year = '2026';

    // pagination = {
    //     totalCount: 0,
    //     pageNo: 1,
    //     pageSize: 12,
    //     totalPages: Math.ceil(totalCount / pageSize)
    //   }
}
