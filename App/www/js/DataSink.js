// Data Sink to handle raw data
// In parameter data serves as reference to actual data holder
function DataSink( data ) 
{
	// on receive raw current AQHI and Pollutant data
	this.onCurr = function ( raw )
	{
		alert(raw.query.count);
		var curr = raw.query.results.p;
		var iter=0;
		
		for(var i=0; i<data.config.numOfStation; ++i)
		{
			data.pollutant.current.NO2[i].SetValue( curr[iter++] );
			data.pollutant.current.O3[i].SetValue( curr[iter++] );
			data.pollutant.current.SO2[i].SetValue( curr[iter++] );
			data.pollutant.current.CO[i].SetValue( curr[iter++] );
			data.pollutant.current.PM10[i].SetValue( curr[iter++] );
			data.pollutant.current.PM2_5[i].SetValue( curr[iter++] );
			
			data.aqhi.current[i].SetValue( curr[iter++] );
		}
	};
	
	// on receive raw past 24 hours AQHI
	this.onAqhiPast24 = function ( raw )
	{
		alert(raw.query.count);
		var aqhiPast24 = raw.query.results.p;
		var iter=0;
		
		for(var i=0; i<data.config.numOfStation; ++i)
		{
			for(var j=0; j<24; ++j)
				data.aqhi.past24hrs[i][j].SetValue( aqhiPast24[iter++] );
		}
	};
	
	// on receive raw past 24 hours pollutant data
	this.onPltPast24 = function ( raw )
	{
		alert(raw.query.count);
		var pltPast24 = raw.query.results.p;
		var iter=0;
		
		for(var i=0; i<data.config.numOfStation; ++i)
		{
			for(var j=0; j<24; ++j)
			{
				data.pollutant.past24hrs.NO2[i][j].SetValue( pltPast24[iter++] );
				data.pollutant.past24hrs.O3[i][j].SetValue( pltPast24[iter++] );
				data.pollutant.past24hrs.SO2[i][j].SetValue( pltPast24[iter++] );
				data.pollutant.past24hrs.CO[i][j].SetValue( pltPast24[iter++] );
				data.pollutant.past24hrs.PM10[i][j].SetValue( pltPast24[iter++] );
				data.pollutant.past24hrs.PM2_5[i][j].SetValue( pltPast24[iter++] );
			}
		}
	};
	
	// on receive forecast data
	this.onForecast = function ( raw )
	{
		alert(raw.query.count);
		var forecast = raw.query.results.p;
		var iter=0;
		
		data.forecast.general[0].SetValue( forecast[iter++] );
		data.forecast.general[1].SetValue( forecast[iter++] );
		data.forecast.roadside[0].SetValue( forecast[iter++] );
		data.forecast.roadside[1].SetValue( forecast[iter++] );
	};
	
	// on receive weather data, TBC
	this.onWeather = function ( raw )
	{
		
	};
};
			