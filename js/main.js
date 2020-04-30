(function(){
  var map = L.map('map-canvas', {
    center: [30.6178, 90],
    zoom: 5,
    // maxBounds: bounds,
    maxBoundsViscosity:.7,
    //minZoom: 4,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    zoomControl: true
  });

  var dataStats = {};
  var Legend;
  var minValue;

  map.dragging.disable();

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=1fd655eb-e63c-4bf8-841a-1a8a3cfc6f79', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

    var layerGroup = L.layerGroup().addTo(map);

    getChinaData();

    function csvToObject(csvString){
        var csvarry = csvString.split("\r\n");
        var datas = [];
        var headers = csvarry[0].split(",");
        for(var i = 1;i<csvarry.length;i++){
            var data = {};
            var temp = csvarry[i].split(",");
                 for(var j = 0;j<temp.length;j++){
                     data[headers[j]] = temp[j];
                 }
            datas.push(data);
        }
         return datas;
    }

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.desc) {
            layer.bindPopup(feature.properties.desc).openPopup();
        }
    };

    function calcStats(data){

         //create empty array to store all data values
         var allValues = [];

         //loop through each province
         for(var city of data.features){
              //loop through each year
              for(var day = 1; day <= 24; day+=1){
                    //get GDP for current year
                   var value = city.properties[String(day)];
                   //add value to array
                   allValues.push(value);
               }
         }

    		 //get min, max, mean stats for our array
    		dataStats.min = Math.min(...allValues);
    		dataStats.max = Math.max(...allValues);

    		//calculate mean
    		var sum = allValues.reduce(function(a, b){return a+b;});
    		dataStats.mean = sum/ allValues.length;
    }

    //calculate the radius of each proportional symbol
    function calcPropRadius(attValue) {

         //constant factor adjusts symbol sizes evenly
         var minRadius = 6;

         //Flannery Appearance Compensation formula
         var radius = Math.pow(attValue/dataStats.min,0.25) * minRadius

         return radius;
    };

    // define a onEachFeature function and judge if both feature.properties exists
    // if exists, bind a popup with the popupContent (geojson properties) in the layer
    function onEachFeatureCovid(feature, layer) {
        //no property named popupContent; instead, create html string with all properties
        var popupContent = "";
        if (feature.properties) {
            //loop to add feature property names and values to html string
            for (var property in feature.properties){
                popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
            }
            layer.bindPopup(popupContent);
        };
    };

    function createPopupContent(properties, attribute){
        //add city to popup content string
        var popupContent = "<p><b>province</b> " + properties.Province + "</p>";

        popupContent += "<p><b>Total Confirmed Cases:</b> " + properties[attribute] + "</p>";

        return popupContent;
    };

    //function to convert markers to circle markers
    function pointToLayer(feature, latlng, attributes){
    		// Assign the current attribute based on the first index of the attributes array
    		var attribute = attributes[0];

    		// create a set of geojsonMarkerOptions used for customizing markers
    		var geojsonMarkerOptions = {
    				 fillColor: "red",
    				 color: "black",
    				 weight: 1,
    				 opacity: 1,
    				 fillOpacity: 0.5,
    				 radius: 8
    		 };

    		 // For each feature, determine its value for the selected attribute
    		 var attValue = Number(feature.properties[attribute]);

         console.log(calcPropRadius(attValue));

    		 // Give each feature's circle marker a radius based on its attribute value
    		 geojsonMarkerOptions.radius = calcPropRadius(attValue);

        // create circle marker layer
        var layer = L.circleMarker(latlng, geojsonMarkerOptions);

    		// build popup content by procedural refactoring
    		var popupContent = createPopupContent(feature.properties, attribute);

        // bind the popup to the circle marker
        layer.bindPopup(popupContent,{offset: new L.Point(0,-geojsonMarkerOptions.radius)});

        // return the circle marker to the L.geoJson pointToLayer option
        return layer;
    };

    //Step: Add circle markers for point features to the map
    function createPropSymbols(response,attributes){
    	// The data loading is complete when we call this function
    	// So the data can be printed in the console here.
    	console.log('This is the data: ', response);

    	// parse states geojson data
    	// generate circleMarker based on coordinates and geojsonMarkerOptions
    	// create a geojson layer and add it to the map
    	L.geoJson(response, {
              pointToLayer : function(feature, latlng){
    						return pointToLayer(feature, latlng, attributes);
    					}
         }).addTo(map);
    };

    // Import GeoJSON data
    function getChinaData(){
    // declaim the mydata variable
    	var mydata;
    	//load the data
    	    $.getJSON("data/covid_china.json", function(response){

    				//create an attributes array
            var attributes = processData(response);

    				//calculate minimum data value
    	      // minValue = calcMinValue(response);
    				calcStats(response);
            //console.log(dataStats);
            if(dataStats.min === 0)
            {
              dataStats.min = 1
              // dataStats.mean = 200
            }

            //call function to create proportional symbols
            createPropSymbols(response,attributes);

        		//add UI elements
        		Legend = createLegend(attributes);
      });
    };

    // Build an attributes array from the data
    function processData(data){
        //empty array to hold attributes
        var attributes = [];

        //properties of the first feature in the dataset
        var properties = data.features[0].properties;

        //push each attribute name into attributes array
        for (var attribute in properties){
            //only take attributes with GDP values
            if (attribute !== 'Province'){
                attributes.push(attribute);
            };
        };

        //check result
        console.log('attributes');
        console.log(attributes);

        return attributes;
    };

    // Resize proportional symbols according to new attribute values
    function updatePropSymbols(attribute){

      var sumcases = 0
        map.eachLayer(function(layer){
            if (layer.feature){
                //update the layer style and popup

    						//access feature properties
                var props = layer.feature.properties;

                sumcases = sumcases + props[attribute];

                //update each feature's radius based on new attribute values
                var radius = calcPropRadius(props[attribute]);
                layer.setRadius(radius);

                console.log(radius)

                //add city to popup content string by procedural refactoring
                var popupContent = createPopupContent(props, attribute);

                //update popup content
                popup = layer.getPopup();
                popup.setContent(popupContent).update();
            };
        });

        $('#datapanel').html('<span style="font-weight: bold;font-size: 45px;color:red;line-height: 55px;">' + sumcases + '</span>');
    };

    function createLegend(attributes){
        var LegendControl = L.Control.extend({
            options: {
                position: 'bottomright'
            },

            onAdd: function () {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'legend-control-container');

                //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
    						$(container).append('<div id="legend"><span style="font-weight: bold;">Total Confirmed Cases</span></div>');

    						//Step 1: start attribute legend svg string
                var svg = '<br><svg id="attribute-legend" width="200px" height="60px">';

    						//array of circle names to base loop on
    						var circles = ["max", "mean", "min"];

    						//Step 2: loop to add each circle and text to svg string
    						for (var i=0; i<circles.length; i++){
    							//Step 3: assign the r and cy attributes
                    var radius = calcPropRadius(dataStats[circles[i]]);
    								console.log(radius)
                    var cy = 60 - radius;

    								console.log(cy)

    		            //circle string
    		            svg += '<circle class="legend-circle" id="' + circles[i] +
    								'" r="' + radius + '"cy="' + cy + '" fill="red" fill-opacity="0.5" stroke="#000000" cx="60"/>';

    								//evenly space out labels
    								var textY = i * 20 + 20;

    								//text string
    								svg += '<text id="' + circles[i] + '-text" x="100" y="' + textY + '" fill="white">' + Math.round(dataStats[circles[i]])+ '</text>';

    						};

    						//close svg string
    						svg += "</svg>";

    						//add attribute legend svg to container
    						$(container).append(svg);

                return container;
            }
        });

        var DataControl = L.Control.extend({
            options: {
                position: 'topright'
            },

            onAdd: function () {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'data-control-container');

                //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
                $(container).append('<span style="font-weight: bold;">Total Confirmed Cases</span><br><div id="datapanel"><span style="font-weight: bold;font-size: 45px;color:red;line-height: 55px;">0</span></div>');

                return container;
            }
        });

        // var ChartControl = L.Control.extend({
        //     options: {
        //         position: 'topright'
        //     },
        //
        //     onAdd: function () {
        //         // create the control container with a particular class name
        //         var container = L.DomUtil.create('div', 'chart-control-container');
        //
        //         //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
        //         $(container).append('<div id="chart"></div>');
        //
        //         return container;
        //     }
        // });

        map.addControl(new DataControl());
        // map.addControl(new ChartControl());
        map.addControl(new LegendControl());
    		//updateLegend(map, attributes[0]);


    };


    var selectedID = '';

    var backgroundWatcher = scrollMonitor.create($('#background'));

    //return statement notifying when this happens
    backgroundWatcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      // video autoplay
        var videos = document.getElementsByTagName("video");
        videos[0].play();
    });

    backgroundWatcher.exitViewport(function () {
      // video autoplay
        var videos = document.getElementsByTagName("video");
        videos[0].pause();
    });

    var china12312019Watcher = scrollMonitor.create($('#china12312019'));

    china12312019Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(1);

      var videos = document.getElementsByTagName("video");
      videos[0].pause();

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china12312019';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(30,110), 6, {animate: true});

      L.geoJSON(huananFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01012020Watcher = scrollMonitor.create($('#china01012020'));

    china01012020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(2);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01012020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(30.6178,114), 10, {animate: true});

      L.geoJSON(huananFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });


    var china01022020Watcher = scrollMonitor.create($('#china01022020'));

    china01022020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(3);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01022020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,110), 6, {animate: true});

      var polyline = L.polyline([[30.6178,114.2617],[39.869741,116.4137608]], {color: 'yellow',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(huananFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      L.geoJSON(chinacdcFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });


    var china01032020Watcher = scrollMonitor.create($('#china01032020'));

    china01032020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(4);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01032020';
      $(selectedID).animate({backgroundColor: '#222222', left: "50px"});

      map.flyTo(new L.LatLng(37,110), 6, {animate: true});

      // var polyline = L.polyline([[39.869741,116.4137608],[38.8278915,-76.9439282]], {color: 'yellow',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(chinacdcFeature_gene, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      // L.geoJSON(uscdcFeature, {
      //   pointToLayer: function (feature, latlng) {
      //       //initialize the popup;
      //       var popup = new L.Popup();
      //       //set latlng
      //       popup.setLatLng(latlng);
      //       //set content
      //       popup.setContent(feature.properties.desc);
      //       popup.addTo(layerGroup);
      //       return L.circleMarker(latlng, geojsonMarkerOptions)
      //     },
      //   onEachFeature: onEachFeature
      // }).addTo(layerGroup);

    });

    var china01062020Watcher = scrollMonitor.create($('#china01062020'));

    china01062020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01062020';
      $(selectedID).animate({backgroundColor: '#222222'});

      layerGroup.clearLayers();

      map.flyTo(new L.LatLng(37,113), 6, {animate: true});

      L.geoJSON(chinacdcFeature_emerres, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      L.geoJSON(sphccFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      // L.geoJSON(whoFeature_emerpre, {
      //   pointToLayer: function (feature, latlng) {
      //       //initialize the popup;
      //       var popup = new L.Popup();
      //       //set latlng
      //       popup.setLatLng(latlng);
      //       //set content
      //       popup.setContent(feature.properties.desc);
      //       popup.addTo(layerGroup);
      //       return L.circleMarker(latlng, geojsonMarkerOptions)
      //     },
      //   onEachFeature: onEachFeature
      // }).addTo(layerGroup);

    });

    var china01072020Watcher = scrollMonitor.create($('#china01072020'));

    china01072020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(8);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01072020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,110), 6, {animate: true});

      L.geoJSON(ccpFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01092020Watcher = scrollMonitor.create($('#china01092020'));

    china01092020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(10);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01092020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,110), 6, {animate: true});

      L.geoJSON(wuhanFeature_1d, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01102020Watcher = scrollMonitor.create($('#china01102020'));

    china01102020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      d3.csv("data/chunyun.csv").then(function(data) {

        data.forEach(drawChunyunLines);

        function drawChunyunLines(item, index) {
          console.log(item)
          var polyline = L.polyline([[30.6178,114.2617],[item.Lat,item.Long]], {color: 'yellow',weight:item.prop * 25,opacity: 1}).addTo(layerGroup);

          var chunyunOptions = {
          radius: 2,
          fillColor: 'yellow',
          color: "yellow",
          weight: 1,
          opacity: item.prop* 25,
          fillOpacity: item.prop* 25
          };
          var point = L.circleMarker([item.Lat,item.Long], chunyunOptions).addTo(layerGroup);
        }

        updatePropSymbols(11);

        $(selectedID).animate({backgroundColor: '#555555'});
        selectedID = '#china01102020';
        $(selectedID).animate({backgroundColor: '#222222'});

        map.flyTo(new L.LatLng(37,92), 4.5, {animate: true});

        L.geoJSON(wuhanFeature_chunyun, {
          pointToLayer: function (feature, latlng) {
              //initialize the popup;
              var popup = new L.Popup();
              //set latlng
              popup.setLatLng(latlng);
              //set content
              popup.setContent(feature.properties.desc);
              popup.addTo(layerGroup);
              return L.circleMarker(latlng, geojsonMarkerOptions)
            },
          onEachFeature: onEachFeature
        }).addTo(layerGroup);

        L.geoJSON(whoFeature_surdef, {
          pointToLayer: function (feature, latlng) {
              //initialize the popup;
              var popup = new L.Popup();
              //set latlng
              popup.setLatLng(latlng);
              //set content
              popup.setContent(feature.properties.desc);
              popup.addTo(layerGroup);
              return L.circleMarker(latlng, geojsonMarkerOptions)
            },
          onEachFeature: onEachFeature
        }).addTo(layerGroup);

      });

    });

    var china01112020Watcher = scrollMonitor.create($('#china01112020'));

    china01112020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(12);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01112020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,92), 4.5, {animate: true});

      L.geoJSON(sphccFeature_genome, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01122020Watcher = scrollMonitor.create($('#china01122020'));

    china01122020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(13);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01122020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,92), 4.5, {animate: true});

      // var polyline = L.polyline([[46.2326611,6.1341265],[39.869741,116.4137608]], {color: 'yellow',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(chinanhcFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      // L.geoJSON(whoFeature, {
      //   pointToLayer: function (feature, latlng) {
      //       //initialize the popup;
      //       var popup = new L.Popup();
      //       //set latlng
      //       popup.setLatLng(latlng);
      //       //set content
      //       popup.setContent(feature.properties.desc);
      //       popup.addTo(layerGroup);
      //       return L.circleMarker(latlng, geojsonMarkerOptions)
      //     },
      //   onEachFeature: onEachFeature
      // }).addTo(layerGroup);

    });

    var china01132020Watcher = scrollMonitor.create($('#china01132020'));

    china01132020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(14);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01132020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,92), 4.5, {animate: true});

      var polyline = L.polyline([[30.6178,114.2617],[13.7563,100.5018]], {color: 'red',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(thaiFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01152020Watcher = scrollMonitor.create($('#china01152020'));

    china01152020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(16);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01152020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,92), 4.5, {animate: true});

      // var polyline = L.polyline([[30.6178,114.2617],[47.6062,-122.3321]], {color: 'red',opacity: 0.3}).addTo(layerGroup);

      // L.geoJSON(seattleFeature, {
      //   pointToLayer: function (feature, latlng) {
      //       //initialize the popup;
      //       var popup = new L.Popup();
      //       //set latlng
      //       popup.setLatLng(latlng);
      //       //set content
      //       popup.setContent(feature.properties.desc);
      //       popup.addTo(layerGroup);
      //       return L.circleMarker(latlng, geojsonMarkerOptions)
      //     },
      //   onEachFeature: onEachFeature
      // }).addTo(layerGroup);

      L.geoJSON(chinacdcFeature_emeres1, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01162020Watcher = scrollMonitor.create($('#china01162020'));

    china01162020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(17);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01162020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(37,100), 4.5, {animate: true});

      var polyline = L.polyline([[30.6178,114.2617],[35.4914,139.2841]], {color: 'red',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(japanFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });


    var china01182020Watcher = scrollMonitor.create($('#china01182020'));

    china01182020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(19);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01182020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      L.geoJSON(wuhanFeature_2d, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01192020Watcher = scrollMonitor.create($('#china01192020'));

    china01192020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(20);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01192020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      var polyline = L.polyline([[39.869741,116.4137608],[30.6178,114.2617]], {color: 'yellow',opacity: 0.3}).addTo(layerGroup);

      L.geoJSON(chinanhcFeature_expert, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      L.geoJSON(wuhanFeature_expert, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01202020Watcher = scrollMonitor.create($('#china01202020'));

    china01202020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(21);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01202020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      L.geoJSON(wuhanFeature_expert2, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      L.geoJSON(xiFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01212020Watcher = scrollMonitor.create($('#china01212020'));

    china01212020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(22);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01212020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      L.geoJSON(chinanhcFeature_firstanno, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01222020Watcher = scrollMonitor.create($('#china01222020'));

    china01222020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(23);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01222020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      L.geoJSON(hubeiFeature_emeres, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

      L.geoJSON(statecouncilFeature, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    var china01232020Watcher = scrollMonitor.create($('#china01232020'));

    china01232020Watcher.fullyEnterViewport(function () {

      layerGroup.clearLayers();

      updatePropSymbols(24);

      $(selectedID).animate({backgroundColor: '#555555'});
      selectedID = '#china01232020';
      $(selectedID).animate({backgroundColor: '#222222'});

      map.flyTo(new L.LatLng(35,90), 4.5, {animate: true});

      L.geoJSON(wuhanFeature_shutdown, {
        pointToLayer: function (feature, latlng) {
            //initialize the popup;
            var popup = new L.Popup();
            //set latlng
            popup.setLatLng(latlng);
            //set content
            popup.setContent(feature.properties.desc);
            popup.addTo(layerGroup);
            return L.circleMarker(latlng, geojsonMarkerOptions)
          },
        onEachFeature: onEachFeature
      }).addTo(layerGroup);

    });

    chart = c3.generate({
        size: {
          height: 400,
          width: 600
        },
        data: {
          url: "data/covid_china_chart.csv",
          x: "Date",
          y: "Confirmed",
          type: 'line',
          axes: {
            confirmed: 'y'
          },
          colors: {
            'Confirmed': 'red',
          }
        },
        zoom: {
          enabled: true,
          type: "scroll"
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: "%b %d",
              centered: true,
              fit: true,
            }
          },
          y: {
            label: {
              text: 'Total Confirmed Cases',
              position: 'outer-middle'
            },
            min: 0,
            padding: {
              bottom: 0
            },
            type: 'linear'
          }
        },
        point: {
          r: 3,
          focus: {
            expand: {
              r: 5
            }
          }
        },
        tooltip: {
          linked: true,
        },
        bindto: "#chart"
      });

})();
