import { inject, Injectable, signal } from '@angular/core';
import { NoticeEntryModel } from './notice-entry/notice-entry.model';
import { EditNoticeModel } from './edit-notice/edit-notice.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private noticeEntryModel = inject(NoticeEntryModel);
  private editNoticeModel = inject(EditNoticeModel);
  private memoriamEntryModel = inject(NoticeEntryModel);


  public restoreStateFromLocalStorage = () => {
    const stored = localStorage.getItem("deathNotice");
    const deathNotice = stored ? JSON.parse(stored) : null;

    Object.assign(this.noticeEntryModel, deathNotice?.noticeEntryModel ?? {});
    Object.assign(this.editNoticeModel, deathNotice?.editNoticeModel ?? {});
    Object.assign(this.memoriamEntryModel, deathNotice?.memoriamEntryModel ?? {});

    // if (temu?.auth?.token) {
    //   console.log("restoreStateFromLocalStorage: restoring auth from localStorage", temu.auth);
    //   this.cartService.getCartFromServer(temu?.auth?._id).subscribe(cartModel => {
    //     cartModel.cart = this.cartService.mergeCarts(cartModel.cart);
    //     this.cartService.cartSignal.set({ cartModel });
    //   });
    // }
    // else if (temu?.cartModel?.cart?.length) {
    //   console.log('restoreStateFromLocalStorage: restoring cart from localStorage', temu.cartModel);
    //   this.cartService.updateCartSignal(temu.cartModel);
    // }

    // this.appSignal.set({
    //   temu: {
    //     category: temu?.category ?? [],
    //     cartModel: temu?.cartModel
    //       ? Object.assign(new CartModel(), temu.cartModel)
    //       : new CartModel(),
    //     auth: temu?.auth
    //       ? Object.assign(new AuthModel(), temu.auth)
    //       : new AuthModel(),
    //     checkoutData: temu?.checkoutData
    //       ? Object.assign(new CheckoutModel(), temu.checkoutData)
    //       : new CheckoutModel()
    //   }
    // });

  };






}
