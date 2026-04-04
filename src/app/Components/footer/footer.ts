import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Languageservice } from '../../Core/Services/languageservice';

@Component({
  selector: 'app-footer',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
    isArabic = false;
constructor(private langService: Languageservice, private cdr: ChangeDetectorRef) {

  
  effect(() => {
      this.isArabic = this.langService.isArabic();
      this.cdr.detectChanges();
    });
}
}
