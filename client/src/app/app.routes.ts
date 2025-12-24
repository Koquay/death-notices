import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DeathNoticeComponent } from './death-notice/death-notice.component';
import { NoticeEntryComponent } from './notice-entry/notice-entry.component';
import { EditNoticeComponent } from './edit-notice/edit-notice.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'home'
    },
    { path: 'death-notice/:noticeId', component: DeathNoticeComponent },
    { path: 'notice-entry', component: NoticeEntryComponent },
    { path: 'edit-notice', component: EditNoticeComponent },


];

