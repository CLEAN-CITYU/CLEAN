// main App class
function App() 
{	
	this.status =
	{
		// run time status
		isDeviceReady  : false,
		
		// persistent local data status
		isDataGood     : new DataItem("CLEAN_DATA_GOOD", false),
		isSettingsGood : new DataItem("CLEAN_SETTINGS_GOOD", false)
	};
	
	// TODO
	this.settings =
	{
	};
	
	this.data = new CoreData();
	
	this.dataSink = new DataSink( this.data );
	
	this.dataFetcher = new DataFetcher( this.dataSink );
	
	// TODO
	this.initialize = function()
	{
		alert("init");
		// init run time buffer
		this.data.init();
		
		// init data fetcher
		this.dataFetcher.init();
		
		// register event
		this.bindEvent();
	};
	
	// TODO
	this.bindEvent = function()
	{
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('online', this.onOnline, false);
		document.addEventListener('offline', this.onOffline, false);
		document.addEventListener('pause', this.onPause, false);
		document.addEventListener('resume', this.onResume, false);
	};
	
	// TODO
	this.loadLocalData = function()
	{
		this.data.LoadFromLocal();
	};
	
	// TODO
	this.storeLocalData = function()
	{
		this.data.StoreToLocal();
	};
	
	// TODO
	this.loadUserSettings = function()
	{
	};
	
	// TODO
	this.sstoreUserSettings = function()
	{
	};
	
	// TODO
	this.onDeviceReady = function()
	{
		alert("device ready!");
		this.status.isDeviceReady = true;
		
		// simple logic for test
		if ( localStorage["CLEAN_DATA_GOOD"] )
		{
			this.loadLocalData();
		}
		else
		{
			// fetch all data
			this.dataFetcher.fetchCurr();
			this.dataFetcher.fetchAqhiPast24();
			this.dataFetcher.fetchPltPast24();
			this.dataFetcher.fetchWeather();
			this.dataFetcher.fetchForecast();
			
			// init local storage
			localStorage["CLEAN_DATA_GOOD"] = true;
		}
	};
	
	// TODO
	this.onOnline = function()
	{
		alert("online!");
	};
	
	// TODO
	this.onOffline = function()
	{
		alert("offline!");
	};

	// TODO
		alert("onpause!");
	};
	
	// TODO
	this.onResume = function()
	{
		alert("resume!");
	};
};