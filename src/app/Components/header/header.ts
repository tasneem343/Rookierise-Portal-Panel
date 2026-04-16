import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Languageservice } from '../../Services/LanguageService/Languageservice'; 

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isArabic = false;

  constructor(private langService: Languageservice) {
    effect(() => {
      this.isArabic = this.langService.isArabic();
    });
  }

  toggleLanguage() {
    this.langService.toggle();
  }
}