import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Languageservice {
    isArabic = signal(false);

  toggle() {
    this.isArabic.set(!this.isArabic());
}
}