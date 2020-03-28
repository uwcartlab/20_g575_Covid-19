# 575 Final Project Proposal
# Group: Jinmeng Rao, Jianxiang Qiu, Griffin Rock


### Team Members
1. Jinmeng Rao
2. Jianxiang Qiu
3. Griffin Rock

#### **Target User Profile (Persona)**

**Name and Position: Maria Mendoza, Mother (General Public)**

Background Position: Maria is a mother of three residing in a small rural town in Oklahoma. Through various news outlets, she has heard of the COVID-19 virus outbreak on the East and West Coasts and is worried about its potential spread inward and its potential effect on her family. Maria needs to retrieve background information on COVID-19, such as identifying its origins and symptoms to better understand the threat. She would also like to compare and rank COVID-19 cases by country to gain perspective on the severity of the virus in the US. Maria would also like a timeline of cases in America by local regions to analyze sequential trends or patterns in the number of cases confirmed.  Lastly, she needs to identify spatial clusters of the outbreak locations in order to achieve her goal of predicting when COVID-19 will impact her local community and family.


#### **User Case Scenarios**

**1. For the general public who are interested in the outbreak of Covid-19 both inside China and the US.**

At the interface entrance, the user is required to select a country (either China or US) to look through (by clicking the corresponding chapter). This brings the user to the scrolling-style storytelling of that country, with a timeline appended on the left highlighting news & government announcement. Since the user wants to identify what happens at certain period, the interface allows him/her to scan through the content by clicking each date(retrieve). Pan/Zoom operation is restricted to the relevant scope of the event. 
The user concerns the growth of confirmed cases, so the interface incorporates an inset of an updated line chart (daily confirmed cases)to support comparison. Throughout the storytelling the user is intended to associate the measures and the spread of Covid-19 (reflected in map as number of cases vs date) and reach a general conclusion whether or not (or even to how much extent) these measures are effective.

**2. For the general public who worry about the worldwide pandemic Covid-19 (facts, figures, distribution of confirmed cases) **

The interface directly displays the map of current confirmed cases of Covid-19 in each country with a proportional symbol. Every single proportional symbol is clickable to support the identify primitive of the user since he/she wants to retrieve the current situation of a specific country. Pan/Zoom free to explore the world facts. The user can compare or rank the information of Covid-19(e.g. total number of cases, death rate, cured cases) across different countries. E.g. By selecting both Italy and China and applying the death rate the user can find out death rate in Italy is higher than that in China.

#### **Requirements Document**

![Requirements Document](img/reqdoc.png?raw=true "Requirements Document Table")



#### **Lo-Fi Wireframes**

**Design 1**

Cover Page. Includes titles (overall/chapter), brief introduction, etc. The background chapter and Conclusion chapter have the similar layouts.
![Requirements Document](img/lofi1.png?raw=true "lofi1")

**Design 2**

Chapter: China’s story (US’s story layout is similar). Events on the map will be presented by a popup callout. Detail information about the events will appear in the Event Panel. Click on the event legend to turn on/off the event layer overlaying on the map.
![Requirements Document](img/lofi2.png?raw=true "lofi2")

**Design 3**

Chapter: China’s story (US’s story layout is similar). Click on the Case Statistics panel (confirmed, suspected, death, recovered, etc.) to set different symbolization for different cases on the map. Hover over a region on the map to show the cases in this region. 
![Requirements Document](img/lofi3.png?raw=true "lofi3")

**Design 4**
Chapter: China’s story (US’s story layout is similar). Click on or Scroll via the timeline to change the date and see the cases and events every time stamps, as well as see how the epidemic changes overall.
![Requirements Document](img/lofi4.png?raw=true "lofi4")

**Design 5**
Chapter: Worldwide. Users can explore the world map (Pan/Zoom/Retrieve, etc.) in this chapter to get a bigger picture of the current Covid-19 pandemic worldwide (Rank/Compare). Currently we plan to put the data of China US and some European countries such as Italy on the map. 
![Requirements Document](img/lofi5.png?raw=true "lofi5")

**Design 6**
About and Export. Users click the About button and see an About information dialogue (closable). Users click the Export button and see an Export information dialogue (closable). The layouts are similar.
![Requirements Document](img/lofi6.png?raw=true "lofi6")
