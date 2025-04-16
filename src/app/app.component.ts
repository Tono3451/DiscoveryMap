import { Component } from '@angular/core';
import {MainPageComponent} from './main-page/main-page.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DiscoveryMap';
}
