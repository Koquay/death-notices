declare var bootstrap: any;

export class ModalUtil {
  static closeModal(modalId: string) {
    console.log('closeModal called')
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}