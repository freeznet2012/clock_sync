import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { UrlStateService } from '../../../core/services/url-state.service';

@Component({
  selector: 'app-qr-share',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  template: `
    <div class="qr-container">
      <p>Scan to Sync</p>
      <qrcode [qrdata]="qrData" [width]="200" [errorCorrectionLevel]="'M'"></qrcode>
      <div class="url-link">
        <a [href]="qrData" target="_blank">Open Link</a>
      </div>
    </div>
  `,
  styles: [`
    .qr-container {
      margin-top: 2rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 1rem;
    }
    .url-link {
      margin-top: 0.5rem;
    }
    a {
      color: #4facfe;
      text-decoration: none;
    }
  `]
})
export class QrShareComponent {
  get qrData(): string {
    return this.urlState.getLink();
  }

  constructor(public urlState: UrlStateService) { }
}
