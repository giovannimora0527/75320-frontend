import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private spinner: NgxSpinnerService) {}

  // Spinner methods
  async showSpinner() {
    await this.spinner.show(undefined, {
      type: 'pacman',
      size: 'large',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffd700',
      fullScreen: true
    });
  }

  async hideSpinner() {
    // Add a minimum delay of 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.spinner.hide();
  }

  // SweetAlert methods
  showSuccess(message: string, title: string = 'Éxito') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  showError(message: string, title: string = 'Error') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  showWarning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  showConfirmation(title: string, message: string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }
}