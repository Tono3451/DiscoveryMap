import { Component } from '@angular/core';
import {MainPageComponent} from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    MainPageComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DiscoveryMap';
}
