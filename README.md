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


#### **Requirements Document**

![Requirements Document](reqdoc.png?raw=true "Requirements Document Table")



#### **Lo-Fi Wireframes**

**Design 1**

Cover Page. Includes titles (overall/chapter), brief introduction, etc. The background chapter and Conclusion chapter have the similar layouts.
![Requirements Document](lofi1.png?raw=true "lofi1")

**Design 2**

Chapter: China’s story (US’s story layout is similar). Events on the map will be presented by a popup callout. Detail information about the events will appear in the Event Panel. Click on the event legend to turn on/off the event layer overlaying on the map.
![Requirements Document](lofi2.png?raw=true "lofi2")

**Design 3**

Chapter: China’s story (US’s story layout is similar). Click on the Case Statistics panel (confirmed, suspected, death, recovered, etc.) to set different symbolization for different cases on the map. Hover over a region on the map to show the cases in this region. 
![Requirements Document](lofi3.png?raw=true "lofi3")

**Design 4**
Chapter: China’s story (US’s story layout is similar). Click on or Scroll via the timeline to change the date and see the cases and events every time stamps, as well as see how the epidemic changes overall.
![Requirements Document](lofi4.png?raw=true "lofi4")

**Design 5**
Chapter: Worldwide. Users can explore the world map (Pan/Zoom/Retrieve, etc.) in this chapter to get a bigger picture of the current Covid-19 pandemic worldwide (Rank/Compare). Currently we plan to put the data of China US and some European countries such as Italy on the map. 
![Requirements Document](lofi5.png?raw=true "lofi5")

**Design 6**
About and Export. Users click the About button and see an About information dialogue (closable). Users click the Export button and see an Export information dialogue (closable). The layouts are similar.
![Requirements Document](lofi6.png?raw=true "lofi6")
