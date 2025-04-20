import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { NgForOf, NgIf } from '@angular/common';
import {RouterLink} from '@angular/router';
import { Auth, onAuthStateChanged, User} from '@angular/fire/auth';
import {EventService} from '../../services/event-data.service';
import {LateralBarComponent} from '../../lateral-bar/lateral-bar.component';
import {FilterCardComponent} from '../../lateral-bar/filter-card/filter-card.component';

@Component({
  selector: 'app-map',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    LateralBarComponent,
    FilterCardComponent
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true
})
export class MapComponent implements OnInit {

  private map!: L.Map;
  private provider = new OpenStreetMapProvider();
  public searchResults: any[] = [];
  private activityForm!: HTMLDivElement;
  private selectedLatLng!: L.LatLng;
  user: User | null = null;

  constructor(private auth: Auth, private eventService: EventService) { }

  ngOnInit(): void {
    this.initMap();
    this.initForm();
    onAuthStateChanged(this.auth, (user) =>{
      this.user = user;
    });
    this.loadEvents();
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false
    }).setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.selectedLatLng = event.latlng;
      this.showForm();
    });
  }

  private initForm(): void {
    this.activityForm = document.getElementById('activity-form') as HTMLDivElement;
  }

  private showForm(): void {
    this.activityForm.style.display = 'block';
  }

  closeForm(): void {
    this.activityForm.classList.remove('visible');
    setTimeout(() => (this.activityForm.style.display = 'none'), 10);
  }

  addActivity(): void {
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const imageUrl = imageInput.files?.length ? URL.createObjectURL(imageInput.files[0]) : '';
    const user = this.auth.currentUser;
    if (!user) {
      alert('No se ha encontrado al usuario. Asegúrate de que estés autenticado.');
      return;
    }

    const { uid } = user

    if (!title || !description) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newEvent = {
      title,
      description,
      lat: this.selectedLatLng.lat,
      lng: this.selectedLatLng.lng,
      imageUrl,
      createdAt: Date.now(),
      userId: uid
    };

    this.eventService.addEvent(newEvent).then(() => {
      console.log('Evento guardado en Firestore');
      this.loadEvents();

      const marker = L.marker(this.selectedLatLng).addTo(this.map);
      let popupContent = `<h3>${title}</h3><p>${description}</p>`;
      if (imageUrl) {
        popupContent += `<img alt="" src="${imageUrl}" style="width: 100px; height: auto;">`;
      }
      marker.bindPopup(popupContent);

      this.closeForm();
      (document.getElementById('activity-form') as HTMLFormElement).reset();
    }).catch(error => {
      console.error('Error al guardar el evento:', error);
      //alert('Error al guardar el evento.');
    });


  }

  onSearch(query: string): void {
    this.provider.search({ query }).then((results) => {
      this.searchResults = results;
    });
  }

  selectResult(result: any): void {
    const latlng = L.latLng(result.y, result.x);
    this.map.setView(latlng, 13);
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('dropdown');
    if (dropdown) {
      dropdown.classList.toggle('open');
    }
  }

  clearSearch(searchInput: HTMLInputElement): void {
    searchInput.value = '';
    this.searchResults = [];
  }

  private loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      events.forEach(event => {
        const marker = L.marker([event.lat, event.lng]).addTo(this.map);
        let popupContent = `<h3>${event.title}</h3><p>${event.description}</p>`;
        if (event.imageUrl) {
          popupContent += `<img alt="" src="${event.imageUrl}" style="width: 100px; height: auto;">`;
        }
        marker.bindPopup(popupContent);
      });
    });
  }

  showFilterComponent = false;

  toggleFilterComponent() {
    this.showFilterComponent = !this.showFilterComponent;
  }

  userClicked() {
    console.log('User clicked');
  }
}
