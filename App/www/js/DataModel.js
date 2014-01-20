// For performance, DataItem mainly serve as run time buffer,
// LoadFromLocal and StoreToLocal should be called on special
// event
function DataItem ( key, value )
{
	// assume all key are valid
	// prohibit setter of key
	var key = key;
	this.value = value;
	this.GetKey = function()
	{
		return key;
	};
};

// DataItem prototyped functions to save space
DataItem.prototype.SetValue = function( newVal )
{
	this.value = newVal;
};

// Exchange data between local storage and buffer
DataItem.prototype.LoadFromLocal = function ()
{
	this.value = localStorage[this.GetKey()];
};

DataItem.prototype.StoreToLocal = function ()
{
	localStorage[this.GetKey()] = this.value;
};

// Core Data Model
// Suposed to be instantialized only once by App
function CoreData ()
{    
	// Data model self configuration
	// No need to store to local
	// the order supposed to be fixed in all related member
	this.config =
	{
		stationName : 
		[
			// - General Station
			"Central/Western",
			"Eastern",
			"Kwun Tong",
			"Sham Shui Po",
			"Kwai Chung",
			"Tsuen Wan",
			"Yuen Long",
			"Tuen Mun",
			"Tung Chung",
			"Tai Po",
			"Sha Tin",
			"Tap Mun",
			// - Roadside Station
			"Causeway Bay",
			"Central",
			"Mong Kok"
		],
		
		numOfStation : 15,
		
		// Forecast Set
		// General Station 2 sets
		// Roadside Station 2 sets
		numOfForeSet : 4
	};
	
	// AQHI, by station
	this.aqhi = 
	{
		current : new Array( this.config.numOfStation ),
							
		past24hrs : new Array( this.config.numOfStation )
	};
	
	// Pollutant, by station
	this.pollutant =
	{
		current :
		{
			NO2   : new Array( this.config.numOfStation ),
			O3    : new Array( this.config.numOfStation ),
			SO2   : new Array( this.config.numOfStation ),
			CO    : new Array( this.config.numOfStation ),
			PM10  : new Array( this.config.numOfStation ),
			PM2_5 : new Array( this.config.numOfStation )
		},
		
		past24hrs :
		{
			NO2   : new Array( this.config.numOfStation ),
			O3    : new Array( this.config.numOfStation ),
			SO2   : new Array( this.config.numOfStation ),
			CO    : new Array( this.config.numOfStation ),
			PM10  : new Array( this.config.numOfStation ),
			PM2_5 : new Array( this.config.numOfStation )
		}
	},	
	
	// Weather, TBC
	this.weather =
	{
	};
	
	// Forecast, TBC
	this.forecast = 
	{
		general  : new Array(2),
		roadside : new Array(2)
	};
	
	// initializer
	this.init = function() 
	{
		for( var i=0; i<this.config.numOfStation; ++i)
		{	
			// aqhi
			this.aqhi.current[i] = new DataItem("k_aqhi_curr"+i, 0);
			this.aqhi.past24hrs[i] = new Array(24);
			
			// pollutant
			this.pollutant.current.NO2[i]     = new DataItem("k_plt_curr_NO2"  +i, 0);
			this.pollutant.current.O3[i]      = new DataItem("k_plt_curr_O3"   +i, 0);
			this.pollutant.current.SO2[i]     = new DataItem("k_plt_curr_SO2"  +i, 0);
			this.pollutant.current.CO[i]      = new DataItem("k_plt_curr_CO"   +i, 0);
			this.pollutant.current.PM10[i]    = new DataItem("k_plt_curr_PM10" +i, 0);
			this.pollutant.current.PM2_5[i]   = new DataItem("k_plt_curr_PM25" +i, 0);
			this.pollutant.past24hrs.NO2[i]   = new Array(24);
			this.pollutant.past24hrs.O3[i]    = new Array(24);
			this.pollutant.past24hrs.SO2[i]   = new Array(24);
			this.pollutant.past24hrs.CO[i]    = new Array(24);
			this.pollutant.past24hrs.PM10[i]  = new Array(24);
			this.pollutant.past24hrs.PM2_5[i] = new Array(24);
		
			// past 24 hours
			for(var j=0; j<24; ++j)
			{
				this.aqhi.past24hrs[i][j] 		     = new DataItem("k_aqhi_past24_s"+i+"_"+j, 0);
				
				this.pollutant.past24hrs.NO2[i][j]   = new DataItem("k_plt_past24_NO2_s" +i+"_"+j, 0);
				this.pollutant.past24hrs.O3[i][j]    = new DataItem("k_plt_past24_O3_s"  +i+"_"+j, 0);
				this.pollutant.past24hrs.SO2[i][j]   = new DataItem("k_plt_past24_SO2_s" +i+"_"+j, 0);
				this.pollutant.past24hrs.CO[i][j]    = new DataItem("k_plt_past24_CO_s"  +i+"_"+j, 0);
				this.pollutant.past24hrs.PM10[i][j]  = new DataItem("k_plt_past24_PM10_s"+i+"_"+j, 0);
				this.pollutant.past24hrs.PM2_5[i][j] = new DataItem("k_plt_past24_PM25_s"+i+"_"+j, 0);
			}
		}
		
		// forecast
		this.forecast.general[0]  = new DataItem("k_fore_g1", 0);
		this.forecast.general[1]  = new DataItem("k_fore_g2", 0);
		this.forecast.roadside[0] = new DataItem("k_fore_r1", 0);
		this.forecast.roadside[1] = new DataItem("k_fore_r2", 0);
			
		// weather
		
	};
	
	// load last data from local device to buffer
	this.LoadFromLocal = function()
	{
		for( var i=0; i<this.config.numOfStation; ++i)
		{	
			// aqhi
			this.aqhi.current[i].LoadFromLocal();
			
			// pollutant
			this.pollutant.current.NO2[i].LoadFromLocal();
			this.pollutant.current.O3[i].LoadFromLocal();
			this.pollutant.current.SO2[i].LoadFromLocal();
			this.pollutant.current.CO[i].LoadFromLocal();
			this.pollutant.current.PM10[i].LoadFromLocal();
			this.pollutant.current.PM2_5[i].LoadFromLocal();
		
			// past 24 hours
			for(var j=0; j<24; ++j)
			{
				this.aqhi.past24hrs[i][j].LoadFromLocal();
				
				this.pollutant.past24hrs.NO2[i][j].LoadFromLocal();
				this.pollutant.past24hrs.O3[i][j].LoadFromLocal();
				this.pollutant.past24hrs.SO2[i][j].LoadFromLocal();
				this.pollutant.past24hrs.CO[i][j].LoadFromLocal();
				this.pollutant.past24hrs.PM10[i][j].LoadFromLocal();
				this.pollutant.past24hrs.PM2_5[i][j].LoadFromLocal();
			}
		}
		
		// forecast
		this.forecast.general[0].LoadFromLocal();
		this.forecast.general[1].LoadFromLocal();
		this.forecast.roadside[0].LoadFromLocal();
		this.forecast.roadside[1].LoadFromLocal();
			
		// weather
		
	};
	
	// store data in buffer to local device
	this.StoreToLocal = function()
	{
		for( var i=0; i<this.config.numOfStation; ++i)
		{	
			// aqhi
			this.aqhi.current[i].StoreToLocal();
			
			// pollutant
			this.pollutant.current.NO2[i].StoreToLocal();
			this.pollutant.current.O3[i].StoreToLocal();
			this.pollutant.current.SO2[i].StoreToLocal();
			this.pollutant.current.CO[i].StoreToLocal();
			this.pollutant.current.PM10[i].StoreToLocal();
			this.pollutant.current.PM2_5[i].StoreToLocal();
		
			// past 24 hours
			for(var j=0; j<24; ++j)
			{
				this.aqhi.past24hrs[i][j].StoreToLocal();
				
				this.pollutant.past24hrs.NO2[i][j].StoreToLocal();
				this.pollutant.past24hrs.O3[i][j].StoreToLocal();
				this.pollutant.past24hrs.SO2[i][j].StoreToLocal();
				this.pollutant.past24hrs.CO[i][j].StoreToLocal();
				this.pollutant.past24hrs.PM10[i][j].StoreToLocal();
				this.pollutant.past24hrs.PM2_5[i][j].StoreToLocal();
			}
		}
		
		// forecast
		this.forecast.general[0].StoreToLocal();
		this.forecast.general[1].StoreToLocal();
		this.forecast.roadside[0].StoreToLocal();
		this.forecast.roadside[1].StoreToLocal();
			
		// weather
		
	};
};