var fs = require('fs');
var writemeasurestream=fs.createWriteStream("mymeasure.csv");
var writeactivitystream=fs.createWriteStream("myactivity.csv");
var writesleepstream=fs.createWriteStream("mysleep.csv");
var writebloodstream=fs.createWriteStream("myblood.csv");
writemeasurestream.write("User");
writemeasurestream.write(", Date");
writemeasurestream.write(", Weight");
writemeasurestream.write(", Body fat ratio");
writeactivitystream.write("User");
writeactivitystream.write(", Date");
writeactivitystream.write(", Steps");
writeactivitystream.write(", Distance");
writeactivitystream.write(", Calories");
writeactivitystream.write(", Elevation");
writeactivitystream.write(", Light activity");
writeactivitystream.write(", Moderate activity");
writeactivitystream.write(", Intense activity");
writesleepstream.write("User");
writeactivitystream.write(", Date");
writesleepstream.write(", Date");
writesleepstream.write(", Total time awake");
writesleepstream.write(", Number of times awake");
writesleepstream.write(", Total time light sleep");
writesleepstream.write(", Total time deep sleep");
writesleepstream.write(", Time taken to fall asleep");
writebloodstream.write("User");
writebloodstream.write(", Date")
writebloodstream.write(", Diastolic blood pressure");
writebloodstream.write(", Systolic blood pressure");
writebloodstream.write(", Heart Pulse");
function processUser(user, option) {
	console.log("PROCESSING " + user.Userid);
	var oauth = require("oauth");
		var withings = new oauth.OAuth(
			"https://oauth.withings.com/account/request_token",
			"https://oauth.withings.com/account/access_token",
			user.ckey,
			user.csecret,
			"1.0",
			null,
			"HMAC-SHA1"
		);
		if(option=="getactivity"||option=="getall"){
					var url = withings.signUrl("http://wbsapi.withings.net/v2/measure?action=getactivity&userid=" + user.Userid, user.otoken, user.osecret);
					withings.get(url, null, null, function(error, response) { 
								responsestring=JSON.parse(response);
								var count=0;
								console.log(JSON.stringify(responsestring));
									if(responsestring.body.activities[count]!==undefined){
										for (var prop in responsestring){
										writeactivitystream.write("\n"+user.Userid);
										writeactivitystream.write(","+responsestring.body.activities[count].date);
										writeactivitystream.write(","+responsestring.body.activities[count].steps);
										writeactivitystream.write(","+responsestring.body.activities[count].distance);
										writeactivitystream.write(","+responsestring.body.activities[count].calories);
										writeactivitystream.write(","+responsestring.body.activities[count].elevation);
										writeactivitystream.write(","+responsestring.body.activities[count].soft);
										writeactivitystream.write(","+responsestring.body.activities[count].moderate);
										writeactivitystream.write(","+responsestring.body.activities[count].intense);
											count=count+1;
										}
									}
									else {
										writeactivitystream.write("\n No data found for "+user.Userid);
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
										writeactivitystream.write(", No data found ");
									}
						});
				}
		if(option=="getmeas"||option=="getall"){
					var url = withings.signUrl("http://wbsapi.withings.net/measure?action=getmeas&userid=" + user.Userid, user.otoken, user.osecret);
					withings.get(url, null, null, function(error, response) { 
							console.log(response);
							responsestring=JSON.parse(response);
							var count=0;
							if(responsestring.body.measuregrps[count]!==undefined){
									writemeasurestream.write("\n"+user.Userid);
									writebloodstream.write("\n"+user.Userid);
									writemeasurestream.write(","+new Date(parseInt(responsestring.body.measuregrps[0].date)*1000)).toString();
									writebloodstream.write(","+new Date(parseInt(responsestring.body.measuregrps[0].date)*1000)).toString();
									for (var prop in responsestring.body.measuregrps){
										if(responsestring.body.measuregrps[count].measures[0].type=="1" && responsestring.body.measuregrps[count].measures[0].unit =="-2"){
												writemeasurestream.write(","+JSON.stringify(responsestring.body.measuregrps[count].measures[0].value) * (Math.pow(10, responsestring.body.measuregrps[count].measures[0].unit)));
											}
										if (responsestring.body.measuregrps[0].measures[count] && responsestring.body.measuregrps[count].measures[0].type != "1" &&responsestring.body.measuregrps[count].measures[0].type != "4"&&responsestring.body.measuregrps[count].measures[0].type != "5"&&responsestring.body.measuregrps[count].measures[0].type != "8"&&responsestring.body.measuregrps[count].measures[0].type != "9"&&responsestring.body.measuregrps[count].measures[0].type != "10"&&responsestring.body.measuregrps[count].measures[0].type != "11"&&responsestring.body.measuregrps[count].measures[0].type != "54") {
											writemeasurestream.write(","+JSON.stringify(responsestring.body.measuregrps[count].measures[0].value));
										}
											if (responsestring.body.measuregrps[0].measures[count] && responsestring.body.measuregrps[count].measures[0].type != "4"&&responsestring.body.measuregrps[count].measures[0].type != "5"&&responsestring.body.measuregrps[count].measures[0].type != "6"&&responsestring.body.measuregrps[count].measures[0].type != "8"&&responsestring.body.measuregrps[count].measures[0].type != "54") {
												writebloodstream.write("," + responsestring.body.measuregrps[0].measures[count].value);
											}
										
									count=count+1;
									}
							}
							else {
										writemeasurestream.write("\n No data found for "+user.Userid);
										writebloodstream.write("\n No data found for "+user.Userid);
										writemeasurestream.write(", No data found ");
										writemeasurestream.write(", No data found ");
										writemeasurestream.write(", No data found ");
										writebloodstream.write(", No data found ");
										writebloodstream.write(", No data found ");
										writebloodstream.write(", No data found ");
										writebloodstream.write(", No data found ");
										
										
									}
						});
				}
		if(option=="getsleep"||option=="getall"){
			var url = withings.signUrl("https://wbsapi.withings.net/v2/sleep?action=getsummary&userid=" + user.Userid, user.otoken, user.osecret);
			withings.get(url, null, null, function(error, response) {
					responsestring=JSON.parse(response);
					var count=0;
					console.log(JSON.stringify(responsestring));
								if(responsestring.body.series[count]!==undefined){
										
										for (var prop in responsestring.body.series){
										if(responsestring.body.series[count]!==undefined){
											writesleepstream.write("\n"+user.Userid);
											writesleepstream.write(","+responsestring.body.series[count].date);
											writesleepstream.write(","+responsestring.body.series[count].data.wakeupduration);
											writesleepstream.write(","+responsestring.body.series[count].data.wakeupcount);
											writesleepstream.write(","+responsestring.body.series[count].data.lightsleepduration);
											writesleepstream.write(","+responsestring.body.series[count].data.deepsleepduration);
											writesleepstream.write(","+responsestring.body.series[count].data.durationtosleep);
											count=count+1;
											}
										}
									}
									else {
										writesleepstream.write("\n No data found for "+user.Userid);
										writesleepstream.write(", No data found");
										writesleepstream.write(", No data found");
										writesleepstream.write(", No data found");
										writesleepstream.write(", No data found");
									}
					});
				}
			
		
			}
			
	var linereader=require('line-reader');
	var lineNum = 0;
	var columns = [];
	var user = [];
	
	linereader.eachLine('inputexcel.csv', function(line, last){
			// Get the column names
			if (lineNum == 0) {
				columns = line.toString().split(",");
			} else {
				var temp = {};
				var splitter = line.toString().split(",");
				// Create an object in the form of attributes
				for (var i = 0; i < splitter.length; i++)
					temp[columns[i]] = splitter[i];
				// Add this user set to our array
				user.push(temp);
	 		}
	 		lineNum++;
	 		if (last) {
	 			for (var i = 0; i < user.length; i++) {
	 			    processUser(user[i], "getall"); // pass just one user, in a for loop
	 			}
	 		}
	});