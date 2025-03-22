import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private activityForm!: HTMLDivElement;
  private selectedLatLng!: L.LatLng;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
    this.initForm();
  }

  private initMap(): void {
    this.map = L.map('map').setView([40.4168, -3.7038], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
}
