  
// API endpoint 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//  GET request to the query URL
d3.json(queryUrl, function(data) {
	// Once we get a response, send the data.features object to the createFeatures function
	createFeatures(data.features);
});


function createFeatures(earthquakeData) {

	function onEachFeature(feature, layer) {
		layer.bindPopup("<h3>" + feature.properties.place +
			"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
	}

	// function to create the circle radius based on the magnitude
	function radiusSize(magnitude) {
		return magnitude * 15000;
	}

	// function to set the circle color based on the magnitude
function c_color(magnitude) {
	if (magnitude <= 1) {
		return "#5bff9d"
	}
	else if (magnitude <= 2) {
		return "#74ff5b"
	}
	else if (magnitude <= 3) {
		return "#d8ff5b"
	}
	else if (magnitude <= 4) {
		return "#ff9a5b"
	}
	else if (magnitude <= 5) {
		return "#ff5b5b" 
	}
	else {
		return "#d62020"
	}
};


	// Create a GeoJSON layer containing the features array on the earthquakeData object
	// Run the onEachFeature function once for each piece of data in the array
	var earthquakes = L.geoJSON(earthquakeData, {
		pointToLayer: function(earthquakeData, latlng) {
			return L.circle(latlng, {
				radius: radiusSize(earthquakeData.properties.mag),
				color: c_color(earthquakeData.properties.mag),
				fillOpacity: 1
			});
		},
		onEachFeature: onEachFeature
	});

	// Sending our earthquakes layer to the createMap function
	createMap(earthquakes);
}

function createMap(earthquakes) {

	// Define layers
	var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.streets",
		accessToken: API_KEY
	});
	

	var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.satellite",
		accessToken: API_KEY
	});

	var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.dark",
		accessToken: API_KEY
	});
	
	
	//  base layers
	var baseMaps = {
		"Street Map": streetmap,
		"Dark Map": dark,
		"Satellite Map": satellite
	};

	// overlay layer
	var overlayMaps = {
		Earthquake: earthquakes,
	};
	
	// map with layers
	var myMap = L.map("mapid", {
		center: [38.69,-121.33],
		zoom: 3.5,
		layers: [dark, earthquakes,]
	});
	

	// layer control
	// Pass in our baseMaps and overlayMaps
	// Add the layer control to the map
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: true
	}).addTo(myMap);


	// legend
	var legend = L.control({position: "bottomright"});
	
	legend.onAdd = function (myMap) {
	
		var div = L.DomUtil.create("div", "info legend");
		
		var grades = [0, 1, 2, 3, 4, 5];
		var colors = ["#5bff9d", "#74ff5b", "#d8ff5b6", "#ff9a5b", "#ff5b5b", "#d62020"];
	
		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + 
			grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
		}
		return div;
	};
	
	// Add legend to the map
	legend.addTo(myMap);
};