import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { QRCodeComponent } from "angular2-qrcode";

@Directive({
  selector: "[appQrCode]",
})
export class QrCodeDirective implements OnChanges {
  @Input() appQrCode: any; // URL input for the QR code

  private qrCodeComponent: QRCodeComponent;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appQrCode && this.appQrCode) {
      console.log("appQrCode", this.appQrCode);
      this.generateQRCode();
    }
  }

  private generateQRCode() {
    if (this.qrCodeComponent) {
      this.qrCodeComponent.value = this.appQrCode;
      this.qrCodeComponent.generate();
      console.log("appQrCode", this.qrCodeComponent);
    } else {
      this.qrCodeComponent = new QRCodeComponent(this.el);
    }
  }
}
