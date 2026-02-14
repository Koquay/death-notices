import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

export type ToastStatus = 'error' | 'success' | 'info';

@Injectable({
  providedIn: 'root'
})
export class ToastUtils {
  private toastConfig = {
    timeOut: 8000,
    extendedTimeOut: 2000,
    closeButton: true,
    progressBar: true
  };


  constructor(private toastr: ToastrService) { }

  show(
    status: ToastStatus,
    message?: string,
    title?: string
  ): void {

    let toast: ActiveToast<any> | undefined;

    switch (status) {
      case 'error':
        toast = this.toastr.error(message, title ?? 'Error', this.toastConfig);
        break;

      case 'success':
        toast = this.toastr.success(message, title ?? 'Success', this.toastConfig);
        break;

      case 'info':
        toast = this.toastr.info(message, title ?? 'Info', this.toastConfig);
        break;
    }


    // switch (status) {
    //   case 'error':
    //     toast = this.toastr.error(message, title ?? 'Error');
    //     break;

    //   case 'success':
    //     toast = this.toastr.success(message, title ?? 'Success');
    //     break;

    //   case 'info':
    //     toast = this.toastr.info(message, title ?? 'Info');
    //     break;
    // }

    toast?.onShown.subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
