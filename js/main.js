(function(){
  var map = L.map('map-canvas', {
    center: [30.6178, 90],
    zoom: 5,
    maxBoundsViscosity:.7,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    zoomControl: true
  });

  // variables for data statistics of China/US/Conclusion data
  var dataStats = {};
  var dataStatsUS = {};
  var dataStatsCon = {};

  // Legend
  var Legend;
  //Legend Control
  var LC;
  //Datapanel Control
  var DC;

  //Legend Control Content
  var chinaLCcontent = '';
  var usLCcontent = '';
  var conLCcontent = '';

  var currentChapter = 'China';

  var minValue;

  map.dragging.disable();

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=1fd655eb-e63c-4bf8-841a-1a8a3cfc6f79', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

    //popup layer group
    var layerGroup = L.layerGroup().addTo(map);

    var chinaPropLayerGroup = L.layerGroup().addTo(map);
    //L.markerClusterGroup().addTo(map);
    var usPropLayerGroup = L.layerGroup().addTo(map);
    //L.markerClusterGroup().addTo(map);
    var conPropLayerGroup = L.layerGroup().addTo(map);
    //L.markerClusterGroup().addTo(map);

    // getChinaData();
    // getUSData();
    // getConData();
    getData();

    // convert csv to object
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

    // set up popups
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.desc) {
            layer.bindPopup(feature.properties.desc).openPopup();
        }
    };

    // set up closed popups
    function onEachFeature_close(feature, layer) {
        if (feature.properties && feature.properties.desc) {
            layer.bindPopup(feature.properties.desc);
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

    function calcStatsUS(data){
        //create empty array to store all data values
        var allValues = [];

        //loop through each province
        for(var city of data.features){
             //loop through each year
             for(var day = 1; day <= 57; day+=1){
                   //get GDP for current year
                  var value = city.properties[String(day)];
                  //add value to array
                  allValues.push(value);
              }
        }

        //get min, max, mean stats for our array
       dataStatsUS.min = Math.min(...allValues);
       dataStatsUS.max = Math.max(...allValues);

       //calculate mean
       var sum = allValues.reduce(function(a, b){return a+b;});
       dataStatsUS.mean = sum/allValues.length;
    }

    function calcStatsCon(data){
        //create empty array to store all data values
        var allValues = [];

        //loop through each province
        for(var city of data.features){
             //loop through each year
            var value = city.properties['505'];
            //add value to array
            allValues.push(value);
        }

        //get min, max, mean stats for our array
       dataStatsCon.min = Math.min(...allValues);
       dataStatsCon.max = Math.max(...allValues);

       //calculate mean
       var sum = allValues.reduce(function(a, b){return a+b;});
       dataStatsCon.mean = sum/allValues.length;
    }

    //calculate the radius of each China proportional symbol
    function calcPropRadius(attValue) {

         //constant factor adjusts symbol sizes evenly
         var minRadius = 6;

         //Flannery Appearance Compensation formula
         var radius = Math.pow(attValue/dataStats.min,0.25) * minRadius

         return radius;
    };

    //calculate the radius of each US proportional symbol
    function calcUSPropRadius(attValue) {

         //constant factor adjusts symbol sizes evenly
         var minRadius = 6;

         //Flannery Appearance Compensation formula
         var radius = 0.7 * Math.pow(attValue/dataStatsUS.min,0.25) * minRadius

         return radius;
    };

    //calculate the radius of each Conclusion proportional symbol
    function calcConPropRadius(attValue) {

         //constant factor adjusts symbol sizes evenly
         var minRadius = 6;

         //Flannery Appearance Compensation formula
         var radius = 0.18 * Math.pow(attValue/dataStatsCon.min,0.25) * minRadius

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
        var popupContent = "<p><b>Admin Region:</b> " + properties["Province/State/Territory"] + "</p>";

        popupContent += "<p><b>Total Confirmed Cases:</b> " + properties[attribute] + "</p>";

        return popupContent;
    };

    //function to convert markers to circle markers
    function pointToLayer(feature, latlng, attributes, chapter){
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

    		 // Give each feature's circle marker a radius based on its attribute value

         switch(chapter) {
            case 'China':
              geojsonMarkerOptions.radius = calcPropRadius(attValue);
              break;
            case 'US':
              geojsonMarkerOptions.radius = calcUSPropRadius(attValue);
              break;
            case 'Conclusion':
              geojsonMarkerOptions.radius = calcConPropRadius(attValue);
              break;
            default:
              geojsonMarkerOptions.radius = calcConPropRadius(attValue);
          }

        // create circle marker layer
        var layer = L.circleMarker(latlng, geojsonMarkerOptions);

    		// build popup content by procedural refactoring
    		var popupContent = createPopupContent(feature.properties, attribute);

        // bind the popup to the circle marker
        layer.bindPopup(popupContent,{offset: new L.Point(0,-geojsonMarkerOptions.radius / 2)});

        // return the circle marker to the L.geoJson pointToLayer option
        return layer;
    };

    //circle markers for China point features to the map
    function createChinaPropSymbols(response,attributes){
    	// The data loading is complete when we call this function
    	// So the data can be printed in the console here.

    	// parse states geojson data
    	// generate circleMarker based on coordinates and geojsonMarkerOptions
    	// create a geojson layer and add it to the map
    	L.geoJson(response, {
              pointToLayer : function(feature, latlng){
    						return pointToLayer(feature, latlng, attributes, 'China');
    					}
         }).addTo(chinaPropLayerGroup);
    };

    //circle markers for US point features to the map
    function createUSPropSymbols(response,attributes){
      // The data loading is complete when we call this function
      // So the data can be printed in the console here.

      // parse states geojson data
      // generate circleMarker based on coordinates and geojsonMarkerOptions
      // create a geojson layer and add it to the map
      L.geoJson(response, {
              pointToLayer : function(feature, latlng){
                return pointToLayer(feature, latlng, attributes, 'US');
              }
         }).addTo(usPropLayerGroup);
    };

    //circle markers for Conclusion point features to the map
    function createConPropSymbols(response,attributes){
      // The data loading is complete when we call this function
      // So the data can be printed in the console here.

      // parse states geojson data
      // generate circleMarker based on coordinates and geojsonMarkerOptions
      // create a geojson layer and add it to the map
      L.geoJson(response, {
              pointToLayer : function(feature, latlng){
                return pointToLayer(feature, latlng, attributes, 'Conclusion');
              }
         }).addTo(conPropLayerGroup);
    };

    // Get China/US/Conclusion Data and set scrollwatchers for every section
    function getData(){
      $.when(
        //load the china data
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
              createChinaPropSymbols(response,attributes);
        }),
        //load the us data
            $.getJSON("data/covid_us.json", function(response){

              //create an attributes array
              var attributes = processData(response);

              //calculate minimum data value
              // minValue = calcMinValue(response);
              calcStatsUS(response);
              //console.log(dataStatsCon);
              if(dataStatsUS.min === 0)
              {
                dataStatsUS.min = 1
                // dataStats.mean = 200
              }

              //call function to create proportional symbols
              createUSPropSymbols(response,attributes);
        }),
        //load the con data
            $.getJSON("data/con0505.json", function(response){

              //create an attributes array
              var attributes = processData(response);

              //calculate minimum data value
              // minValue = calcMinValue(response);
              calcStatsCon(response);
              //console.log(dataStatsCon);
              if(dataStatsCon.min === 0)
              {
                dataStatsCon.min = 1
                // dataStats.mean = 200
              }

              //call function to create proportional symbols
              createConPropSymbols(response,attributes);
        })
      ).then(function() {
              Legend = createLegend();
              updateChinaPropSymbols(-1);
              updateUSPropSymbols(-1);
              updateConPropSymbols(-1);

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

                updateConPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(1);

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

                updateConPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(2);

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(3);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01022020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,105), 5, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(4);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01032020';
                $(selectedID).animate({backgroundColor: '#222222', left: "50px"});

                map.flyTo(new L.LatLng(37,105), 5, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(7);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01062020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,105), 5, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(8);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01072020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,105), 5, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(10);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01092020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,105), 5, {animate: true});

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

                  updateConPropSymbols(-1);
                  updateUSPropSymbols(-1);
                  currentChapter = 'China';
                  updateChinaPropSymbols(11);

                  $(selectedID).animate({backgroundColor: '#555555'});
                  selectedID = '#china01102020';
                  $(selectedID).animate({backgroundColor: '#222222'});

                  map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(12);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01112020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(13);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01122020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(14);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01132020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(16);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01152020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(17);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01162020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(19);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01182020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(20);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01192020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(21);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01202020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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
                      // //initialize the popup;
                      // var popup = new L.Popup();
                      // //set latlng
                      // popup.setLatLng(latlng);
                      // //set content
                      // popup.setContent(feature.properties.desc);
                      // popup.addTo(layerGroup);
                      return L.circleMarker(latlng, geojsonMarkerOptions)
                    },
                  onEachFeature: onEachFeature
                }).addTo(layerGroup);

              });

              var china01212020Watcher = scrollMonitor.create($('#china01212020'));

              china01212020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(22);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01212020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(23);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01222020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

                updateConPropSymbols(-1);
                updateUSPropSymbols(-1);
                currentChapter = 'China';
                updateChinaPropSymbols(24);

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#china01232020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37,90), 4, {animate: true});

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

              var us01212020Watcher = scrollMonitor.create($('#us01212020'));

              us01212020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(1);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01212020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(47,-125.844), 6, {animate: true});

                L.geoJSON(waFeature_1c, {
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

              var us01242020Watcher = scrollMonitor.create($('#us01242020'));

              us01242020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(4);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01242020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(42,-95), 6, {animate: true});

                L.geoJSON(chicagoFeature_1c, {
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

              var us01262020Watcher = scrollMonitor.create($('#us01262020'));

              us01262020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(6);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01262020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(37.2715,-125), 6, {animate: true});

                L.geoJSON(azFeature_1c, {
                  pointToLayer: function (feature, latlng) {
                      //initialize the popup;
                      // var popup = new L.Popup();
                      // //set latlng
                      // popup.setLatLng(latlng);
                      // //set content
                      // popup.setContent(feature.properties.desc);
                      // popup.addTo(layerGroup);
                      return L.circleMarker(latlng, geojsonMarkerOptions)
                    },
                  onEachFeature: onEachFeature
                }).addTo(layerGroup);

                L.geoJSON(calFeature_1c, {
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


              var us01282020Watcher = scrollMonitor.create($('#us01282020'));

              us01282020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(8);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01282020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-85), 6, {animate: true});

                L.geoJSON(hhsFeature, {
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

              var us01292020Watcher = scrollMonitor.create($('#us01292020'));

              us01292020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(9);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01292020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-85), 6, {animate: true});

                L.geoJSON(whFeature, {
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

              var us01302020Watcher = scrollMonitor.create($('#us01302020'));

              us01302020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(10);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01302020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(42,-95), 6, {animate: true});

                L.geoJSON(chicagoFeature_p2p, {
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

              var us01312020Watcher = scrollMonitor.create($('#us01312020'));

              us01312020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(11);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us01312020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(hhsFeature_pubemer, {
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

              var us02032020Watcher = scrollMonitor.create($('#us02032020'));

              us02032020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(14);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02032020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(congressFeature, {
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

              var us02062020Watcher = scrollMonitor.create($('#us02062020'));

              us02062020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(17);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02062020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(santacFeature, {
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

                L.geoJSON(wisFeature_1c, {
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

              var us02112020Watcher = scrollMonitor.create($('#us02112020'));

              us02112020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(22);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02112020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(calFeature_13c, {
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

              var us02152020Watcher = scrollMonitor.create($('#us02152020'));

              us02152020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(26);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02152020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(usgovFeature, {
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

              var us02212020Watcher = scrollMonitor.create($('#us02212020'));

              us02212020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(32);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02212020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(uscdcFeature, {
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

              var us02242020Watcher = scrollMonitor.create($('#us02242020'));

              us02242020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(35);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02242020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(wallstreetFeature, {
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

              var us02262020Watcher = scrollMonitor.create($('#us02262020'));

              us02262020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(37);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02262020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(calFeature_lt, {
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


              var us02282020Watcher = scrollMonitor.create($('#us02282020'));

              us02282020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(39);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02282020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(uscdcFeature_flaw, {
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

              var us02292020Watcher = scrollMonitor.create($('#us02292020'));

              us02292020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(40);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us02292020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(waFeature_1rd, {
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

              var us03012020Watcher = scrollMonitor.create($('#us03012020'));

              us03012020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(41);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03012020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(riFeature_1c, {
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

              var us03022020Watcher = scrollMonitor.create($('#us03022020'));

              us03022020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(42);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03022020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(usgovFeature_erf, {
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

              var us03032020Watcher = scrollMonitor.create($('#us03032020'));

              us03032020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(43);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03032020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(uscdcFeature_nd, {
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

              var us03042020Watcher = scrollMonitor.create($('#us03042020'));

              us03042020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(44);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03042020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(hhsFeature_n95, {
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

              var us03052020Watcher = scrollMonitor.create($('#us03052020'));

              us03052020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(45);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03052020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

              });

              var us03062020Watcher = scrollMonitor.create($('#us03062020'));

              us03062020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(46);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03062020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(usgovFeature_ef, {
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

              var us03072020Watcher = scrollMonitor.create($('#us03072020'));

              us03072020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(47);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03072020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

              });

              var us03082020Watcher = scrollMonitor.create($('#us03082020'));

              us03082020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(48);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03082020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(uscdcFeature_half, {
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

              var us03092020Watcher = scrollMonitor.create($('#us03092020'));

              us03092020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(49);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03092020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(ohioFeature_se, {
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

              var us03112020Watcher = scrollMonitor.create($('#us03112020'));

              us03112020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(51);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03112020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(usgovFeature_ban, {
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

                L.geoJSON(nbaFeature, {
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

              var us03122020Watcher = scrollMonitor.create($('#us03122020'));

              us03122020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(52);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03122020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});
              });

              var us03132020Watcher = scrollMonitor.create($('#us03132020'));

              us03132020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(53);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03132020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(usgovFeature_ne, {
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

                L.geoJSON(waFeature_school, {
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

              var us03142020Watcher = scrollMonitor.create($('#us03142020'));

              us03142020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(54);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03142020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(wvFeature, {
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

              var us03152020Watcher = scrollMonitor.create($('#us03152020'));

              us03152020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(55);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03152020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(uscdcFeature_50, {
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

              var us03162020Watcher = scrollMonitor.create($('#us03162020'));

              us03162020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(56);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03162020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(wallstreetFeature_again, {
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

                L.geoJSON(sfFeature, {
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

              var us03172020Watcher = scrollMonitor.create($('#us03172020'));

              us03172020Watcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                updateConPropSymbols(-1);
                updateChinaPropSymbols(-1);
                updateUSPropSymbols(57);
                currentChapter = 'US';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#us03172020';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 4, {animate: true});

                L.geoJSON(mlFeature, {
                  pointToLayer: function (feature, latlng) {
                      // //initialize the popup;
                      // var popup = new L.Popup();
                      // //set latlng
                      // popup.setLatLng(latlng);
                      // //set content
                      // popup.setContent(feature.properties.desc);
                      // popup.addTo(layerGroup);
                      return L.circleMarker(latlng, geojsonMarkerOptions)
                    },
                  onEachFeature: onEachFeature
                }).addTo(layerGroup);

                L.geoJSON(wvFeature_final, {
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


              var conWatcher = scrollMonitor.create($('#con'));

              conWatcher.fullyEnterViewport(function () {

                layerGroup.clearLayers();

                //DC.setContent('<p>Wait what</p>');

                updateChinaPropSymbols(-1);
                updateUSPropSymbols(-1);
                updateConPropSymbols(505);
                currentChapter = 'Conclusion';

                $(selectedID).animate({backgroundColor: '#555555'});
                selectedID = '#con';
                $(selectedID).animate({backgroundColor: '#222222'});

                map.flyTo(new L.LatLng(40,-125), 3.5, {animate: true});

              });
      });
    }

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

        return attributes;
    };

    // Resize China proportional symbols according to new attribute values
    function updateChinaPropSymbols(attribute){

      var sumcases = 0
      if(attribute !== -1)
      {
        LC.setContent(chinaLCcontent);
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.setMinZoom(1);
        map.setMaxZoom(15);
      }
        chinaPropLayerGroup.eachLayer(function(layer){
            for (var l in layer._layers) {
              if (layer._layers[l].feature){
                  //update the layer style and popup
                  //access feature properties

                  var props = layer._layers[l].feature.properties;

                  sumcases = sumcases + props[attribute];

                  //update each feature's radius based on new attribute values
                  var radius = 0

                  if(attribute !== -1)
                  {
                    radius = calcPropRadius(props[attribute]);
                  }

                  layer._layers[l].setRadius(radius);

                  //add city to popup content string by procedural refactoring
                  var popupContent = createPopupContent(props, attribute);

                  //update popup content
                  popup = layer._layers[l].getPopup();
                  popup.setContent(popupContent).update();
              };
            }
        });

        $('#datapanel').html('<span style="font-weight: bold;font-size: 45px;color:red;line-height: 55px;">' + sumcases + '</span>');
    };

    // Resize US proportional symbols according to new attribute values
    function updateUSPropSymbols(attribute){

      var sumcases = 0
      if(attribute !== -1)
      {
        LC.setContent(usLCcontent);
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.setMinZoom(1);
        map.setMaxZoom(15);
      }
        usPropLayerGroup.eachLayer(function(layer){
            for (var l in layer._layers) {
              if (layer._layers[l].feature){
                  //update the layer style and popup
                  //access feature properties

                  var props = layer._layers[l].feature.properties;

                  sumcases = sumcases + props[attribute];

                  //update each feature's radius based on new attribute values
                  var radius = 0

                  if(attribute !== -1)
                  {
                    radius = calcUSPropRadius(props[attribute]);
                  }

                  layer._layers[l].setRadius(radius);

                  //add city to popup content string by procedural refactoring
                  var popupContent = createPopupContent(props, attribute);

                  //update popup content
                  popup = layer._layers[l].getPopup();
                  popup.setContent(popupContent).update();
              };
            }
        });

        $('#datapanel').html('<span style="font-weight: bold;font-size: 45px;color:red;line-height: 55px;">' + sumcases + '</span>');
    };

    // Resize Conclusion proportional symbols according to new attribute values
    function updateConPropSymbols(attribute){

      var sumcases = 0

      if(attribute !== -1)
      {
        LC.setContent(conLCcontent);
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.setMinZoom(2.5);
        map.setMaxZoom(5);
      }
        conPropLayerGroup.eachLayer(function(layer){
            for (var l in layer._layers) {
              if (layer._layers[l].feature){
                  //update the layer style and popup
                  //access feature properties

                  var props = layer._layers[l].feature.properties;

                  sumcases = sumcases + props[attribute];

                  //update each feature's radius based on new attribute values

                  var radius = 0

                  if(attribute !== -1)
                  {
                    radius = calcConPropRadius(props[attribute]);
                  }

                  layer._layers[l].setRadius(radius);

                  //add city to popup content string by procedural refactoring
                  var popupContent = createPopupContent(props, attribute);

                  //update popup content
                  popup = layer._layers[l].getPopup();
                  popup.setContent(popupContent).update();
              };
            }
        });

        $('#datapanel').html('<span style="font-weight: bold;font-size: 45px;color:red;line-height: 55px;">' + sumcases + '</span>');
    };

    function createLegend(){
        var LegendControl = L.Control.extend({
            options: {
                position: 'bottomright'
            },

            onAdd: function () {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'legend-control-container');

                //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
    						$(container).append('<div id="legend"><span style="font-weight: bold;">Total Confirmed Cases in China</span></div>');

                chinaLCcontent += '<div id="legend"><span style="font-weight: bold;">Total Confirmed Cases (China)</span></div>';
                usLCcontent += '<div id="legend"><span style="font-weight: bold;">Total Confirmed Cases (U.S.)</span></div>';
                conLCcontent += '<div id="legend"><span style="font-weight: bold;">Total Confirmed Cases (China & US)</span></div>';

    						//Step 1: start attribute legend svg string
                var svg = '<br><svg id="attribute-legend" width="200px" height="60px">';
                var svgUS = '<br><svg id="attribute-legend" width="200px" height="60px">';
                var svgCon = '<br><svg id="attribute-legend" width="200px" height="60px">';

    						//array of circle names to base loop on
    						var circles = ["max", "mean", "min"];

    						//Step 2: loop to add each circle and text to svg string
    						for (var i=0; i<circles.length; i++){
    							//Step 3: assign the r and cy attributes
                    var radius = calcPropRadius(dataStats[circles[i]]);
                    var radiusUS = calcUSPropRadius(dataStatsUS[circles[i]]);
                    var radiusCon = calcConPropRadius(dataStatsCon[circles[i]]);

                    var cy = 60 - radius;
                    var cyUS = 60 - radiusUS;
                    var cyCon = 60 - radiusCon;

    		            //circle string
    		            svg += '<circle class="legend-circle" id="' + circles[i] +
    								'" r="' + radius + '"cy="' + cy + '" fill="red" fill-opacity="0.5" stroke="#000000" cx="60"/>';
                    svgUS += '<circle class="legend-circle" id="' + circles[i] +
    								'" r="' + radiusUS + '"cy="' + cyUS + '" fill="red" fill-opacity="0.5" stroke="#000000" cx="60"/>';
                    svgCon += '<circle class="legend-circle" id="' + circles[i] +
    								'" r="' + radiusCon + '"cy="' + cyCon + '" fill="red" fill-opacity="0.5" stroke="#000000" cx="60"/>';

    								//evenly space out labels
    								var textY = i * 20 + 20;

    								//text string
    								svg += '<text id="' + circles[i] + '-text" x="100" y="' + textY + '" fill="white">' + Math.round(dataStats[circles[i]])+ '</text>';
    								svgUS += '<text id="' + circles[i] + '-text" x="100" y="' + textY + '" fill="white">' + Math.round(dataStatsUS[circles[i]])+ '</text>';
    								svgCon += '<text id="' + circles[i] + '-text" x="100" y="' + textY + '" fill="white">' + Math.round(dataStatsCon[circles[i]])+ '</text>';

    						};

    						//close svg string
    						svg += "</svg>";
                svgUS += "</svg>";
                svgCon += "</svg>";

    						//add attribute legend svg to container
    						$(container).append(svg);

                chinaLCcontent += svg;
                usLCcontent += svgUS;
                conLCcontent += svgCon;

                return container;
            },
            // new method for setting innerHTML
            setContent: function(str) {
                this.getContainer().innerHTML = str;
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
            },
            // new method for setting innerHTML
            setContent: function(str) {
                this.getContainer().innerHTML = str;
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

        LC = new LegendControl();
        DC = new DataControl();

        map.addControl(DC);
        // map.addControl(new ChartControl());
        map.addControl(LC);
    		//updateLegend(map, attributes[0]);
    };

    // About dialog
    $( function() {
      $( "#about" ).dialog({
        autoOpen: true,
        modal: true,
        show: {
          effect: "blind",
          duration: 200
        },
        hide: {
          effect: "blind",
          duration: 200
        }
      });

      $( "#about-button" ).on( "click", function() {
        $( "#about" ).dialog( "open" );
      });
    } );


  // C3 Chart for China data
    chart = c3.generate({
        size: {
          height: 400,
          width: 550
        },
        data: {
          url: "data/covid_china_chart.csv",
          x: "Date",
          y: "Confirmed Cases in China",
          type: 'line',
          axes: {
            confirmed: 'y'
          },
          colors: {
            'Confirmed Cases in China': 'red',
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

  // C3 Chart for US data
      uschart = c3.generate({
          size: {
            height: 400,
            width: 550
          },
          data: {
            url: "data/covid_us_chart.csv",
            x: "Date",
            y: "Confirmed Cases in the U.S.",
            type: 'line',
            axes: {
              confirmed: 'y'
            },
            colors: {
              'Confirmed Cases in the U.S.': 'red',
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
          bindto: "#uschart"
        });

  // C3 Chart for 0505 China&US data
        var conchart = c3.generate({
            size: {
              height: 400,
              width: 550
            },
            data: {
              url: "data/con0505.csv",
              x: "State/Province",
              y: "Confirmed Cases in each state/province",
              type: 'bar',
              axes: {
                confirmed: 'y'
              },
              colors: {
                'Confirmed Cases in each state/province': 'red',
              }
            },
            zoom: {
              enabled: true,
              type: "scroll"
            },
            axis: {
              x: {
                type: "category",
                tick: {
                  values: []
                }
              },
              y: {
                label: {
                  text: 'Confirmed Cases in each state/province',
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
            bindto: "#conchart"
          });

})();
