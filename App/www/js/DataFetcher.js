// Data Fetcher, implemented based on YQL with acceptable performance
function DataFetcher( sink )
{   
	// station code
	var station = 
	[ 
		// CW
		{ id : 80, magic : "45fd" },
		// ET
		{ id : 73, magic : "e1a6" },
		// KT
		{ id : 74, magic : "fb71" },
		// SSP
		{ id : 66, magic : "db46" },
		// KC
		{ id : 72, magic : "30e8" },
		// TW
		{ id : 77, magic : "228e" },
		// YL
		{ id : 70, magic : "1f2c" },
		// TM
		{ id : 82, magic : "537c" },
		// TC
		{ id : 78, magic : "f322" },
		// TP
		{ id : 69, magic : "6e9c" },
		// ST
		{ id : 75, magic : "2c5f" },
		// TAM
		{ id : 76, magic : "233a" },
		// CB
		{ id : 71, magic : "5ca5" },
		// CT
		{ id : 79, magic : "f9dd" },
		// MK
		{ id : 81, magic : "9c57" }
	];
	
	// YQL customised query string
	var query = 
	{
		Curr : "",
		AqhiPast24 : "",
		PltPast24 : "",
		Forecast : "",
		Weather : ""
	};
	
	// initializer
	this.init = function ()
	{
		// for fetchCurr()
		query.Curr = "select * from html where url='http://www.aqhi.gov.hk/gt/aqhi/pollutant-and-aqhi-distribution.html' and " +
					"xpath='//table[@class=\"tblPollutant\"]/tr[position()=3]/td[position()>2]/p | " + 
						   "//table[@class=\"tblPollutant\"]/tr[position()>3 and position()<15]/td[position()>1]/p | " + 
						   "//table[@class=\"tblPollutant\"]/tr[position()=15]/td[position()>2]/p | " + 
						   "//table[@class=\"tblPollutant\"]/tr[position()>15]/td[position()>1]/p '";
						   
		// for fetchAqhiPast24 & fetchPltPast24
		var urlAqhiPast24 = [ "http://www.aqhi.gov.hk/gt/aqhi/past-24-hours-aqhi", ".html?stationid=" ];
		query.AqhiPast24 = "select * from html where xpath='//table[@id=\"dd_stnh24_table\"]/tbody/tr[position()>1]/td[position()=2]/p' and url in (";
		query.AqhiPast24 += "'" + urlAqhiPast24[0] + station[0].magic + urlAqhiPast24[1] + station[0].id + "' ";

		var urlPltPast24 = [ "http://www.aqhi.gov.hk/gt/aqhi/past-24-hours-pollutant-concentration", ".html?stationid=" ];
		query.PltPast24 = "select * from html where xpath='//table[@class=\"tblNormal\"]/tbody/tr[position()>1]/td[position()>1]/p' and url in (";
		query.PltPast24 += "'" + urlPltPast24[0] + station[0].magic + urlPltPast24[1] + station[0].id + "' ";
		
		for(var i=1; i<station.length; ++i)
		{
			query.AqhiPast24 += ", '" + urlAqhiPast24[0] + station[i].magic + urlAqhiPast24[1] + station[i].id + "'";
			query.PltPast24 += ", '" + urlPltPast24[0] + station[i].magic + urlPltPast24[1] + station[i].id + "'";
		}
		
		query.AqhiPast24 += ")";
		query.PltPast24 += ")";
		
		// for fetchForecast
		query.Forecast = "select * from html where url='http://www.aqhi.gov.hk/gt.html' and " +
						"xpath='//table[@id=\"tblForecast\"]/tbody/tr[position()>2]/td[position()>1]/p'"; 
						
		// for fetchWeather
	};
	
	// fetch current AQHI and pollutant data
	this.fetchCurr = function (  )
	{
		var ajaxianPosts = new YQLQuery(query.Curr, sink.onCurr);
		ajaxianPosts.fetch();
	};
	
	// fetch past 24 hours AQHI data
	this.fetchAqhiPast24 = function (  )
	{	
		var ajaxianPosts = new YQLQuery(query.AqhiPast24, sink.onAqhiPast24);
		ajaxianPosts.fetch();
	};
	
	// fetch past 24 hours pollutant data
	this.fetchPltPast24 = function (  )
	{	
		var ajaxianPosts = new YQLQuery(query.PltPast24, sink.onPltPast24);
		ajaxianPosts.fetch();
	};

	// fetch weather data
	this.fetchWeather = function (  )
	{
		var ajaxianPosts = new YQLQuery(query.Weather, sink.onWeather);
		ajaxianPosts.fetch();
	};
	
	// fetch forecast AQHI data
	this.fetchForecast = function (  )
	{
		var ajaxianPosts = new YQLQuery(query.Forecast, sink.onForecast);
		ajaxianPosts.fetch();
	};
};

// YQL handler
function YQLQuery(query, callback) 
{
	this.query = query;
	this.callback = callback || function(){};
	this.fetch = function() {
 
		if (!this.query || !this.callback) {
			throw new Error('YQLQuery.fetch(): Parameters may be undefined');
		}
 
		var scriptEl = document.createElement('script'),
			uid = 'yql' + +new Date(),
			encodedQuery = encodeURIComponent(this.query),
			instance = this;
 
		YQLQuery[uid] = function(json) {
			instance.callback(json);
			delete YQLQuery[uid];
			document.body.removeChild(scriptEl);
		};
 
		scriptEl.src = 'http://query.yahooapis.com/v1/public/yql?q='
					 + encodedQuery + '&format=json&callback=YQLQuery.' + uid;
		  
		document.body.appendChild(scriptEl);
	};
};