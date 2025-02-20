async function initMap() {
    // Load Google Maps libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { ColorScheme } = await google.maps.importLibrary("core");

    const center = { lat: 9.9, lng: -84.05 };

    const map = new Map(document.getElementById("map"), {
        zoom: 10,
        center,
        colorScheme: ColorScheme.DARK,
        mapId: "4504f8b37365c3d0",
    });

    let openMarker = null; // Store the currently open marker

    properties.forEach(property => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildContent(property),
            position: property.position,
            title: property.description,
        });

        marker.addListener("click", () => {
            // Close any previously open marker
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
    });

    // Close marker when clicking anywhere on the map
    map.addListener("click", () => {
        if (openMarker) {
            toggleHighlight(openMarker, false);
            openMarker = null;
        }
    });
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
          <i class="fa fa-${property.type}" title="${property.type}"></i>
      </div>
      <div class="details">
          <div class="price">${property.price}</div>
          <div class="address">${property.address}</div>
          <div class="features">
              <div>
                  <i class="fa fa-bed"></i> <span>${property.bed} Beds</span>
              </div>
              <div>
                  <i class="fa fa-bath"></i> <span>${property.bath} Baths</span>
              </div>
              <div>
                  <i class="fa fa-ruler"></i> <span>${property.size} ft²</span>
              </div>
          </div>
      </div>
    `;
    return content;
}

// Property data
const properties = [
    {
        address: "De la Pops, 50m sur, 25 oeste",
        description: "Single family house with modern design",
        price: "Gasolinera Galera San Jose",
        type: "gas-pump",
        bed: 5,
        bath: 4.5,
        size: 300,
        position: { lat: 9.9, lng: -84.0 },
    },
    {
        address: "108 Squirrel Ln 🐿️, Menlo Park, CA",
        description: "Townhouse with friendly neighbors",
        price: "$ 3,050,000",
        type: "gas-pump",
        bed: 4,
        bath: 3,
        size: 200,
        position: { lat: 9.8, lng: -84.2 },
    },
];

initMap();
