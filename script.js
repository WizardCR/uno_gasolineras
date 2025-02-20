async function initMap() {
    // Load Google Maps libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { ColorScheme } = await google.maps.importLibrary("core");

    const center = { lat: 15.499, lng: -88.0284 };

    const map = new Map(document.getElementById("map"), {
        zoom: 13,
        center,
        colorScheme: ColorScheme.LIGHT,
        mapId: "4504f8b37365c3d0",
        disableDefaultUI: true,  // Removes default UI elements
        // styles: [  // Optional: Custom minimal style
        //     { featureType: "poi", stylers: [{ visibility: "off" }] },  // Hide POIs
        //     { featureType: "transit", stylers: [{ visibility: "off" }] },  // Hide transit
        //     { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] } // Hide road labels
        // ]
    });

    let openMarker = null; // Store the currently open marker
    const locationList = document.getElementById("location-list");

    properties.forEach((property, index) => {
        // Create marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildContent(property),
            position: property.position,
            title: property.description,
        });

        // Click marker to highlight & center
        marker.addListener("click", () => {
            if (openMarker && openMarker !== marker) {
                toggleHighlight(openMarker, false);
            }
                    // Toggle highlight on the clicked marker
                    const isHighlighted = marker.content.classList.contains("highlight");
                    toggleHighlight(marker, !isHighlighted);

                    // Smoothly pan the map to the clicked marker
                    map.panTo(marker.position);

                    // Update openMarker reference
                    openMarker = isHighlighted ? null : marker;
        });

        // Create list item for bottom menu
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="${property.image}" alt="Station Image">
            <div>
                <strong>${property.name}</strong>
                <p>${property.address}</p>
            </div>
        `;

        // Click list item to move to marker
        listItem.addEventListener("click", () => {
            google.maps.event.trigger(marker, "click");
            toggleBottomSheet("half"); // Close sheet when selecting
        });

        locationList.appendChild(listItem);
    });


    // Enable pull-up menu interactions
    enableBottomSheet();

    map.addListener("click", () => {
        if (openMarker) {
            toggleHighlight(openMarker, false);
            openMarker = null;
        }
    });
}
  // Drag the entire bottom sheet
function enableBottomSheet() {
    const sheet = document.getElementById("bottom-sheet");
    let startY = 0, currentTranslate = 60, isDragging = false;

    sheet.addEventListener("mousedown", startDrag);
    sheet.addEventListener("touchstart", startDrag);

    function startDrag(event) {
        startY = event.touches ? event.touches[0].clientY : event.clientY;
        isDragging = true;
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("touchend", endDrag);
    }

    function drag(event) {
        if (!isDragging) return;
        const newY = event.touches ? event.touches[0].clientY : event.clientY;
        let delta = ((newY - startY) / window.innerHeight) * 100;
        let newPosition = Math.max(0, Math.min(80, currentTranslate + delta));
        sheet.style.transform = `translateY(${newPosition}%)`;
    }

    function endDrag() {
        isDragging = false;
        currentTranslate = sheet.getBoundingClientRect().top / window.innerHeight * 100;
        toggleBottomSheet(currentTranslate < 40 ? "full" : "half");
    }
}

// Function to toggle between half and full screen
function toggleBottomSheet(state) {
    const sheet = document.getElementById("bottom-sheet");
    if (state === "full") {
        sheet.style.transform = `translateY(0%)`; // Full screen
    } else {
        sheet.style.transform = `translateY(60%)`; // Half screen
    }
}

// Toggle the marker highlight
function toggleHighlight(markerView, highlight) {
    if (highlight) {
        markerView.content.classList.add("highlight");
        markerView.zIndex = 1;
    } else {
        markerView.content.classList.remove("highlight");
        markerView.zIndex = null;
    }
}

// Build the marker content
function buildContent(property) {
    const content = document.createElement("div");
    content.classList.add("property");
    content.innerHTML = `
      <div class="icon">
          <img src="${property.logo}" width="50" style="width:100%;" />
      </div>

      <div class="details">
          <div class="name">${property.name}</div>
          <div class="address">${property.days}<br/>${property.hours}</div>
      </div>
       <div class="highlight-logo"><img src="${property.logo}" width="70"/></div>
    `;
    return content;
}

// Sample locations
const properties = [
    {
        name: "UNO Guadalupe",
        address: "Av. Principal, Francisco Morazán",
        days: "Lunes a Domingo",
        hours: "6:00 a 22:00",
        image: "images/gasolinera.webp",
        logo: "images/logo.uno.blue.svg",
        type: "gas-pump",
        position: { lat: 15.5184406, lng: -88.0458394 },
    },
    {
        name: "UNO Las Acacias Copantl",
        address: "Av. Principal, Francisco Morazán",
        days: "Lunes a Domingo",
        hours: "6:00 a 22:00",
        image: "images/pronto.png",
        logo: "images/logo.pronto.png",
        type: "gas-pump",
        position: {  lat: 15.5241336, lng: -88.0461299  },
    },
    {
        name: "UNO Copantl",
        address: "Av. Principal, Francisco Morazán",
        days: "Lunes a Domingo",
        hours: "6:00 a 22:00",
        image: "images/pronto.png",
        logo: "images/logo.pronto.png",
        type: "gas-pump",
        position: {  lat: 15.496841, lng: -88.0437266  },
    },
    {
        name: "UNO Santa Anita",
        address: "Santa Anita, 1 Calle, 6 Avenida SE",
        days: "Lunes a Domingo",
        hours: "24 Horas",
        image: "images/pronto.png",
        logo: "images/logo.pronto.png",
        type: "gas-pump",
        position: {  lat: 15.506841, lng: -88.01937266  },
    },
];

initMap();
