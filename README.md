# Final Code Update

The final code is updated to the repo.

For your convenience, we also deploy the project on our server: http://www.jinmengrao.com/covid-19

# 75% Update

The code for 75% check-in is updated to the repo.

The progress List: https://github.com/uwcartlab/20_g575_Covid-19/blob/master/Final%20Project%20Progress%20List.pdf

For your convenience, we also deploy the current 75% check-in version on our server: http://www.jinmengrao.com/covid-19


# 575 Final Project Proposal
# Group: Jinmeng Rao, Jianxiang Qiu, Griffin Rock


### Team Members
1. Jinmeng Rao
2. Jianxiang Qiu
3. Griffin Rock

#### **Target User Profile (Persona)**

**Name and Position: Maria Mendoza, Mother (General Public)**

Maria is a mother of three residing in a small rural town in Oklahoma. Through various news outlets, she has heard of the COVID-19 virus outbreak on the East and West Coasts and is worried about its potential spread inward and its potential effect on her family. Maria needs to retrieve background information on COVID-19, such as identifying its symptoms to better understand the threat. She would also like to know how the COVID-19 developed in China at the early stage and how the epidemic started in the US. Besides, she also wants to compare the spread and the corresponding measures regarding COVID-19 being taken during different times in China and the US, as well as analyzing sequential trends or patterns in the number of cases confirmed. Lastly, she needs to retrieve the latest situation in China and the US such as the infected areas and the confirmed cases in order to achieve her goal of predicting when COVID-19 will impact her local community and family.


#### **User Case Scenarios**

Maria would first get a brief understanding of COVID-19, so Chpt.1 of the project provides her with some background information.

Then, Maria seeks information about China, especially how the COVID-19 epidemic developed in China in the early days. Chpt.2 brings her to the story of Wuhan City, Hubei Province, China (1/1/2020 - 1/23/2020). The story is about how the situation developed from the first case reported to the lockdown of the whole city. Since she is interested in the spread and the corresponding measures being taken during different times, Chpt.2 allows her to sequence through the timeline to retrieve news & reports. Key events are bound to specific time stamps. Cases will be represented at the city level (story starts with Wuhan City) at the beginning and at the province level at the end (zoomed out) with proportional symbol. Pan/Zoom will be automatically triggered to change the map view to specific scaling levels and locations as the story goes. Also, the story panel incorporates an inset of an updated exponential chart to support the tracking of the trends (how the case raises as the story goes).

After learning the complete story of Wuhan, China, Maria would have a better comprehension to open up Chpt.3 which works the same way but focusing on the situation in the US (1/23/2020 - 3/31/2020). The story is mainly about how the situation developed from the first case reported in the US to the situation that most of the states issued Stay at Home order, revealing how the COVID-19 and social distancing changed the US. Cases will be represented at the state level with proportional symbol. Chpt.2 and Chpt.3 together, help her associate the spread of COVID-19 with specific measures and judge the effectiveness of these measures.

Lastly, Maria wants to keep herself updated on the latest situation in China and the US. Chpt.4 presents a map showing the current confirmed cases of COVID-19 in China and the US at the state/province level with proportional symbols. Resymbolize the scale ratio by date when necessary. Every single proportional symbol is clickable to retrieve the detailed information (e.g., death cases, recovered cases). Pan/Zoom are restricted to two levels to avoid collision of map symbols. Maria can retrieve the cases of COVID-19 in different places to achieve her goal of predicting when COVID-19 will impact her family.

Maria is equipped with a MacBook Pro to display this website.


#### **Requirements Document**

![Requirements Document](reqdoc.png?raw=true "Requirements Document Table")



#### **Lo-Fi Wireframes**

**Design 1**
Cover Page (Intro). It includes the title and the brief introduction. The background chapter have the similar layouts.
![Requirements Document](lofi1.png?raw=true "lofi1")

**Design 2**
Chapter: China’s story – Wuhan 23 Days. Story Panel will show the story. Cases will be represented at the city level (story starts with Wuhan City) at the beginning and at the province level at the end (zoomed out) with proportional symbol.
![Requirements Document](lofi2.png?raw=true "lofi2")

**Design 3**
Chapter: China’s story – Wuhan 23 Days. Scroll on the story panel to read the full story and change the date. The map will automatically change its view (by zoom/pan) to match the events in the story. The exponential chart will be updated over time. 
![Requirements Document](lofi3.png?raw=true "lofi3")

**Design 4**
Chapter: US’s story – United States: A Nation in “Lockdown”. Click on the chapter name on the chapter menu to switch between different chapters.
![Requirements Document](lofi4.png?raw=true "lofi4")

**Design 5**
Chapter: Latest Situation. Users can explore the map (2-level Pan/Zoom, and Retrieve) in this chapter to get a bigger picture of the Covid-19 pandemic in China and the US today. Currently we plan to put the state/province-level data of China US on the map. Click on a proportional symbol to show the current information of cases (confirmed, death, etc.) in this area. Users can compare the cases between different areas.
![Requirements Document](lofi5.png?raw=true "lofi5")

**Design 6**
About. Users click the About button and see an About information dialogue (closable).
![Requirements Document](lofi6.png?raw=true "lofi6")
