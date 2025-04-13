import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { NgForOf, NgIf } from '@angular/common';
import {RouterLink} from '@angular/router';
import { Auth, onAuthStateChanged, User} from '@angular/fire/auth';

@Component({
  selector: 'app-map',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
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

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.initMap();
    this.initForm();
    onAuthStateChanged(this.auth, (user) =>{
      this.user = user;
    });
  }

  private initMap(): void {
    // Inicializar el mapa
    this.map = L.map('map', {
      zoomControl: false // Desactiva el control de zoom predeterminado
    }).setView([40.4168, -3.7038], 6); // Coordenadas de Madrid, España

    // Añadir una capa de tiles (por ejemplo, OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);


    // Mover el control de zoom a la esquina inferior derecha
    L.control.zoom({
      position: 'bottomright' // Puedes usar 'topleft', 'topright', 'bottomleft', o 'bottomright'
    }).addTo(this.map);

    // Evento para detectar clics en el mapa
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

    if (!title || !description) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Crear marcador en el mapa
    const marker = L.marker(this.selectedLatLng).addTo(this.map);
    let popupContent = `<h3>${title}</h3><p>${description}</p>`;
    if (imageUrl) {
      popupContent += `<img src="${imageUrl}" style="width: 100px; height: auto;">`;
    }
    marker.bindPopup(popupContent);

    // Ocultar el formulario
    this.activityForm.style.display = 'none';
    (document.getElementById('activity-form') as HTMLFormElement).reset();

    this.closeForm();
    (document.getElementById('activity-form') as HTMLFormElement).reset();
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
}
