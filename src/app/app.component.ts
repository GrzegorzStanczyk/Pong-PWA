import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`:host { display: block; }`]
})
export class AppComponent {
  title = 'app';
}
