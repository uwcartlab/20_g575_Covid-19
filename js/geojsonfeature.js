var geojsonMarkerOptions = {
radius: 6,
fillColor: 'orange',
color: "#FFF",
weight: 2,
opacity: 0.8,
fillOpacity: 1
};

var huananFeature = {
    "type": "Feature",
    "properties": {
        "name": "Huanan Seafood Market",
        "desc": "Huanan Seafood Market"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var chinacdcFeature = {
    "type": "Feature",
    "properties": {
        "name": "China CDC",
        "desc": "China CDC"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var chinacdcFeature_gene = {
    "type": "Feature",
    "properties": {
        "name": "China CDC",
        "desc": "<p style='text-align:center'>China CDC</p><p style='text-align:center;color:red'>China formally notified US on the outbreak.<br>Genetic Sequencing Completed.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var chinacdcFeature_emerres = {
    "type": "Feature",
    "properties": {
        "name": "China CDC",
        "desc": "<p style='text-align:center'>China CDC</p><p style='text-align:center;color:red'>Secondary Emergency Response</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var sphccFeature = {
    "type": "Feature",
    "properties": {
        "name": "Shanghai Public Health Clinical Center",
        "desc": "<p style='text-align:center'>Shanghai Public Health Clinical Center</p><p style='text-align:center;color:red'> The whole genome of the virus was obtained</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [121.3416806,30.7916153]
    }
};

var whoFeature = {
    "type": "Feature",
    "properties": {
        "name": "World Health Organization",
        "desc": "<p style='text-align:center'>World Health Organization</p><p style='text-align:center;color:red'>Further detailed information received.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [6.1341265,46.2326611]
    }
};

var whoFeature_emerpre = {
    "type": "Feature",
    "properties": {
        "name": "World Health Organization",
        "desc": "<p style='text-align:center'>World Health Organization</p><p style='text-align:center;color:red'> Urging Emergency Preparedness</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [6.1341265,46.2326611]
    }
};

var ccpFeature = {
    "type": "Feature",
    "properties": {
        "name": "CCP Politburo Standing Committee",
        "desc": "<p style='text-align:center'>CCP Politburo Standing Committee</p><p style='text-align:center;color:red'> President Xi raised demand on the prevention and control of the pneumonia in Wuhan</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.3766865,39.9097435]
    }
};

var wuhanFeature_1d = {
    "type": "Feature",
    "properties": {
        "name": "The first death",
        "desc": "<p style='text-align:center'>The first death</p><p style='text-align:center;color:red'> A 61-year-old man who was a regular customer at Huanan Seafood market.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var wuhanFeature_2d = {
    "type": "Feature",
    "properties": {
        "name": "The first death",
        "desc": "<p style='text-align:center'>The second death</p><p style='text-align:center;color:red'> A 69-year-old man.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var wuhanFeature_chunyun = {
    "type": "Feature",
    "properties": {
        "name": "Chunyun Started",
        "desc": "<p style='text-align:center'>Chunyun</p><p style='text-align:center;color:red'> Spring Festival travel season started.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var whoFeature_surdef = {
    "type": "Feature",
    "properties": {
        "name": "World Health Organization",
        "desc": "<p style='text-align:center'>World Health Organization</p><p style='text-align:center;color:red'> Surveillance case definitions</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [6.1341265,46.2326611]
    }
};

var sphccFeature_genome = {
    "type": "Feature",
    "properties": {
        "name": "Shanghai Public Health Clinical Center",
        "desc": "<p style='text-align:center'>Shanghai Public Health Clinical Center</p><p style='text-align:center;color:red'> The first viral genome sequence was shared</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [121.3416806,30.7916153]
    }
};

var whoFeature_surdef = {
    "type": "Feature",
    "properties": {
        "name": "World Health Organization",
        "desc": "<p style='text-align:center'>World Health Organization</p><p style='text-align:center;color:red'>Surveillance case definitions.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [6.1341265,46.2326611]
    }
};

var chinanhcFeature = {
    "type": "Feature",
    "properties": {
        "name": "China NHC",
        "desc": "<p style='text-align:center'>China NHC</p><p style='text-align:center;color:red'> ''The outbreak was associated with <br> exposures in Huanan Seafood Market.''</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var thaiFeature = {
    "type": "Feature",
    "properties": {
        "name": "Thailand",
        "desc": "<p style='text-align:center'>China NHC</p><p style='text-align:center;color:red'>First confirmed case in Thailand.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [100.5018,13.7563]
    }
};

var seattleFeature = {
    "type": "Feature",
    "properties": {
        "name": "Seattle",
        "desc": "<p style='text-align:center'>Seattle, U.S.</p><p style='text-align:center;color:red'>The first-known travel-related case <br> entered the U.S.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.3321,47.6062]
    }
};

var chinacdcFeature_emeres1 = {
    "type": "Feature",
    "properties": {
        "name": "China NHC",
        "desc": "<p style='text-align:center'>China NHC</p><p style='text-align:center;color:red'> Level 1 emergency response.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var japanFeature = {
    "type": "Feature",
    "properties": {
        "name": "Seattle",
        "desc": "<p style='text-align:center'>Japan</p><p style='text-align:center;color:red'>First confirmed case in Japan.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [139.2841,35.4914]
    }
};

var chinanhcFeature_expert = {
    "type": "Feature",
    "properties": {
        "name": "China NHC",
        "desc": "<p style='text-align:center'>China NHC</p><p style='text-align:center;color:red'>High-level expert panel sent to Wuhan.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var wuhanFeature_expert = {
    "type": "Feature",
    "properties": {
        "name": "Wuhan",
        "desc": "<p style='text-align:center'>Wuhan</p><p style='text-align:center;color:red'> Wuhan Municipal Health Commission <br> held a press conference.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var wuhanFeature_expert2 = {
    "type": "Feature",
    "properties": {
        "name": "Wuhan",
        "desc": "<p style='text-align:center'>Wuhan</p><p style='text-align:center;color:red'>Person-to-person transmission confirmed.<br>WHO five-member delegation arrived.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var xiFeature = {
    "type": "Feature",
    "properties": {
        "name": "President Xi",
        "desc": "<p style='text-align:center'>President Xi</p><p style='text-align:center;color:red'>“people’s lives and health should be given top priority and the spread of the outbreak should be resolutely curbed.”</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.3766865,39.9097435]
    }
};

var chinanhcFeature_firstanno = {
    "type": "Feature",
    "properties": {
        "name": "China NHC",
        "desc": "<p style='text-align:center'>China NHC</p><p style='text-align:center;color:red'>China NHC has released its first announcement.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.4137608,39.869741]
    }
};

var statecouncilFeature = {
    "type": "Feature",
    "properties": {
        "name": "State Council",
        "desc": "<p style='text-align:center'>State Council</p><p style='text-align:center;color:red'>Press Office of the State Council held a press conference on the prevention and control of pneumonia caused by new coronavirus.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [116.3766865,39.9097435]
    }
};

var hubeiFeature_emeres = {
    "type": "Feature",
    "properties": {
        "name": "Wuhan",
        "desc": "<p style='text-align:center'>Hubei</p><p style='text-align:center;color:red'>Level 2 emergency response.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};

var wuhanFeature_shutdown = {
    "type": "Feature",
    "properties": {
        "name": "Shutdown of Wuhan",
        "desc": "<h5 style='text-align:center;color:red'>Shutdown of Wuhan</h5><p style='text-align:center;color:red'>Officials announced a quarantine of the greater Wuhan, China area to commence on Jan 23 2020 at 10:00 a.m.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.2617,30.6178]
    }
};


//============================US==============================
var waFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "Washington State",
        "desc": "<p style='text-align:center'>Washington State</p><p style='text-align:center;color:red'>The first confirmed coronavirus case.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-120.844,47.273]
    }
};

var chicagoFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "Chicago",
        "desc": "<p style='text-align:center'>Chicago</p><p style='text-align:center;color:red'>The second confirmed coronavirus case.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-87.6257201,41.8757908]
    }
};

var chicagoFeature_p2p = {
    "type": "Feature",
    "properties": {
        "name": "Chicago",
        "desc": "<p style='text-align:center'>Chicago</p><p style='text-align:center;color:red'>The first case of person-to-person transmission was confirmed in Chicago.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-87.6257201,41.8757908]
    }
};

var calFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "California",
        "desc": "<p style='text-align:center'>California State</p><p style='text-align:center;color:red'>The first confirmed case in California.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-119.274,37.2715]
    }
};

var calFeature_13c = {
    "type": "Feature",
    "properties": {
        "name": "California",
        "desc": "<p style='text-align:center'>California State</p><p style='text-align:center;color:red'>The CDC confirmed the 13th U.S. coronavirus case.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-119.274,37.2715]
    }
};

var calFeature_lt = {
    "type": "Feature",
    "properties": {
        "name": "California",
        "desc": "<p style='text-align:center'>California State</p><p style='text-align:center;color:red'>The CDC announces that a patient in California has tested positive for COVID-19, potentially the first US case where the source of infection is due to local transmission.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-119.274,37.2715]
    }
};

var azFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "Arizona",
        "desc": "<p style='text-align:center'>Arizona State</p><p style='text-align:center;color:red'>The first confirmed case in Arizona.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-111.9295,34.168]
    }
};

var hhsFeature = {
    "type": "Feature",
    "properties": {
        "name": "Department of Health and Human Services",
        "desc": "<p style='text-align:center'>Department of Health and Human Services</p><p style='text-align:center;color:red'>Alex Azar: the U.S. has been monitoring this virus and preparing a response since back in December.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0143086,38.8865663]
    }
};

var hhsFeature_pubemer = {
    "type": "Feature",
    "properties": {
        "name": "Department of Health and Human Services",
        "desc": "<p style='text-align:center'>Department of Health and Human Services</p><p style='text-align:center;color:red'>Department of Health and Human Services declares a public health emergency.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0143086,38.8865663]
    }
};

var hhsFeature_n95 = {
    "type": "Feature",
    "properties": {
        "name": "Department of Health and Human Services",
        "desc": "<p style='text-align:center'>Department of Health and Human Services</p><p style='text-align:center;color:red'>U.S. Department of Health & Human Services (HHS) announces the intend to procure N95 respirators over the following 18 months to support healthcare workers.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0143086,38.8865663]
    }
};

var whFeature = {
    "type": "Feature",
    "properties": {
        "name": "The White House",
        "desc": "<p style='text-align:center'>The White House</p><p style='text-align:center;color:red'>The White House announces a taskforce to “monitor, contain and mitigate the spread of the virus”.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var whFeature = {
    "type": "Feature",
    "properties": {
        "name": "The White House",
        "desc": "<p style='text-align:center'>The White House</p><p style='text-align:center;color:red'>49 members of Congress sign a letter to CDC Director Redfield highlighting the urgency of distributing a rapid diagnostic kit that could be processed locally.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var congressFeature = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Congress",
        "desc": "<p style='text-align:center'>U.S. Congress</p><p style='text-align:center;color:red'>49 members of Congress sign a letter to CDC Director Redfield highlighting the urgency of distributing a rapid diagnostic kit that could be processed locally.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0090315,38.889797]
    }
};

var wisFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "Wisconsin State",
        "desc": "<p style='text-align:center'>Wisconsin State</p><p style='text-align:center;color:red'>Wisconsin’s first confirmed case.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-89.8265,44.7865]
    }
};

var santacFeature = {
    "type": "Feature",
    "properties": {
        "name": "First death from COVID-19",
        "desc": "<p style='text-align:center'>First death from COVID-19</p><p style='text-align:center;color:red'>First death from COVID-19, in Santa Clara County, California, as found by an autopsy and as reported two months later.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-121.9123676,37.348148]
    }
};

var uscdcFeature = {
    "type": "Feature",
    "properties": {
        "name": "U.S. CDC",
        "desc": "<p style='text-align:center'>U.S. CDC</p><p style='text-align:center;color:red'>U.S. health officials prepare for the coronavirus to become a pandemic.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0171759,38.8836242]
    }
};

var uscdcFeature_nd = {
    "type": "Feature",
    "properties": {
        "name": "U.S. CDC",
        "desc": "<p style='text-align:center'>U.S. CDC</p><p style='text-align:center;color:red'>The CDC issues a new guidance that allows anyone to be tested for the virus without restriction, instead of those only with severe symptoms.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0171759,38.8836242]
    }
};

var uscdcFeature_half = {
    "type": "Feature",
    "properties": {
        "name": "U.S. CDC",
        "desc": "<p style='text-align:center'>U.S. CDC</p><p style='text-align:center;color:red'>The CDC reports that the coronavirus now has confirmed cases in over half of the states in the US.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0171759,38.8836242]
    }
};

var uscdcFeature_50 = {
    "type": "Feature",
    "properties": {
        "name": "U.S. CDC",
        "desc": "<p style='text-align:center'>U.S. CDC</p><p style='text-align:center;color:red'>The CDC releases guidelines that recommend organizers cancel or postpone events of fifty people or more across the US for an eight-week period.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0171759,38.8836242]
    }
};

var uscdcFeature_flaw = {
    "type": "Feature",
    "properties": {
        "name": "U.S. CDC",
        "desc": "<p style='text-align:center'>U.S. CDC</p><p style='text-align:center;color:red'>Dr. Nancy Messonnier states that the CDC has taken steps to address problems with flawed test kits mailed to state and local labs.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0171759,38.8836242]
    }
};

var usgovFeature = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Government",
        "desc": "<p style='text-align:center'>U.S. Government</p><p style='text-align:center;color:red'>The government evacuates 338 U.S. nationals stranded aboard the cruise ship Diamond Princess.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var usgovFeature_erf = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Government",
        "desc": "<p style='text-align:center'>U.S. Government</p><p style='text-align:center;color:red'>The United States deploys <b>$37 million</b> from the Emergency Reserve Fund for Contagious Infectious Diseases for countries affected by COVID-19.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var usgovFeature_ef = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Government",
        "desc": "<p style='text-align:center'>U.S. Government</p><p style='text-align:center;color:red'>President Trump signs an $8.3 billion emergency funding package to try and alleviate the COVID-19 crisis.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var usgovFeature_ban = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Government",
        "desc": "<p style='text-align:center'>U.S. Government</p><p style='text-align:center;color:red'>President Trump decides to restrict travel from 26 countries in Europe, excluding the United Kingdom and Ireland for the next month.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var usgovFeature_ne = {
    "type": "Feature",
    "properties": {
        "name": "U.S. Government",
        "desc": "<p style='text-align:center'>U.S. Government</p><p style='text-align:center;color:red'>President Trump declares a national emergency due to the coronavirus.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.0365712,38.8976649]
    }
};

var wallstreetFeature = {
    "type": "Feature",
    "properties": {
        "name": "New York Stock Exchange",
        "desc": "<p style='text-align:center'>New York Stock Exchange</p><p style='text-align:center;color:red'>The US stock market plummets due to coronavirus fears.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-74.008802,40.70604]
    }
};

var wallstreetFeature_again = {
    "type": "Feature",
    "properties": {
        "name": "New York Stock Exchange",
        "desc": "<p style='text-align:center'>New York Stock Exchange</p><p style='text-align:center;color:red'>Despite the Federal Reserve Bank lowered interest rates the day prior, the stock market fell once again.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-74.008802,40.70604]
    }
};

var waFeature_1rd = {
    "type": "Feature",
    "properties": {
        "name": "First reported death",
        "desc": "<p style='text-align:center'>First reported death</p><p style='text-align:center;color:red'>The US government makes public what is then believed to be its first coronavirus-related death, a man in his 50s at Evergreen Health Medical Center in Kirkland, Washington.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.1796782,47.715643]
    }
};

var waFeature_school = {
    "type": "Feature",
    "properties": {
        "name": "Washington State",
        "desc": "<p style='text-align:center'>Washington State</p><p style='text-align:center;color:red'>Washington state orders its schools closed for the rest of the school year.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.1796782,47.715643]
    }
};

var riFeature_1c = {
    "type": "Feature",
    "properties": {
        "name": "Rhode Island",
        "desc": "<p style='text-align:center'>Rhode Island</p><p style='text-align:center;color:red'>The CDC confirms the first coronavirus cases in New Hampshire, New York, and Florida.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-71.5075,41.5865]
    }
};

var ohioFeature_se = {
    "type": "Feature",
    "properties": {
        "name": "Ohio",
        "desc": "<p style='text-align:center'>Ohio State</p><p style='text-align:center;color:red'>Ohio Governor Mike DeWine declares a state of emergency after Ohio reports its first three cases of COVID-19.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-82.6695,40.1925]
    }
};

var nbaFeature = {
    "type": "Feature",
    "properties": {
        "name": "National Basketball Association",
        "desc": "<p style='text-align:center'>National Basketball Association</p><p style='text-align:center;color:red'>The National Basketball Association (NBA) suspends its season after Rudy Gobert, an NBA player, contracts the disease.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-111.935453,40.6586638]
    }
};

var wvFeature = {
    "type": "Feature",
    "properties": {
        "name": "West Virginia State",
        "desc": "<p style='text-align:center'>West Virginia State</p><p style='text-align:center;color:red'>West Virginia is now the only state without confirmed COVID-19 cases.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-80.179,38.92]
    }
};

var wvFeature_final = {
    "type": "Feature",
    "properties": {
        "name": "West Virginia State",
        "desc": "<h5 style='text-align:center;color:red'>West Virginia State</h5><p style='text-align:center;color:red'>West Virginia, the last state without a confirmed COVID-19 case, finally records its first case, meaning the US now has infections in all 50 states, Puerto Rico, the US Virgin Islands, and Washington, DC.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-80.179,38.92]
    }
};

var sfFeature = {
    "type": "Feature",
    "properties": {
        "name": "San Francisco",
        "desc": "<p style='text-align:center'>San Francisco</p><p style='text-align:center;color:red'>The first city in America to implement “stay-at-home” restrictions in response to the coronavirus.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.4726194,37.7577627]
    }
};

var mlFeature = {
    "type": "Feature",
    "properties": {
        "name": "Maryland State",
        "desc": "<p style='text-align:center'>Maryland State</p><p style='text-align:center;color:red'>Maryland’s governor postpones the state’s primary election due to concerns of people gathering to vote in person.</p>"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-77.268,38.8175]
    }
};
