//This file conreading source.json and convert it in JSON object if file is present.
try {
    "use strict";
    var fs = require("fs");
    var prompt = require('prompt');
    var builder = require("xmlbuilder");
    var async = require("async");

    //Throws an error if any of these modules are not required properly.
    if (fs === undefined) {
        throw new Error(" Can't access fs module");
    }
    if (prompt === undefined) {
        throw new Error(" Can't access prompt module");
    }
    if (builder === undefined) {
        throw new Error(" Can't access builder module");
    }
    if (async === undefined) {
        throw new Error(" Can't access async module");
    }


    if ( !fs.existsSync("source.json") ) {
        throw new Error(" source.json file is not present in current folder");
    }
    var sourceString = fs.readFileSync("source.json");
    var sourceJSON = JSON.parse( sourceString );
    var studentArray = sourceJSON.students;
    //Getting Each element from an array and checking for tags are present or not.
    for (x in studentArray) {
        if( studentArray[x].id === undefined ) {
            throw new Error(" id is not found in object");
        } else if( studentArray[x].fName === undefined ) {
            throw new Error(" fName is not found in object");
        } else if( studentArray[x].lName === undefined ) {
            throw new Error(" lName is not found in object");
        } else if( studentArray[x].score === undefined ) {
            throw new Error(" score is not found in object");
        }
    }

    //Descending sor of arrayElements using score.
    for ( var x = 0; x < studentArray.length-1; x++) {
        for ( var y = x+1; y < studentArray.length; y++) {
            if(studentArray[x].score < studentArray[y].score) {
                var tempScore = studentArray[x].score;
                studentArray[x].score = studentArray[y].score;
                studentArray[y].score = tempScore;
            }
        }
    }



    //Create destination.txt or modify if already present, from arrayElements.
    var createOrOverwriteTextFile = function(cb){
        fs.writeFileSync( "destination.txt", "First Name | Last Name | Score\n" );
        //Getting Each element from an array and appending to txt file.
        studentArray.forEach( function (value) {
            fs.appendFile( "destination.txt", value.id + " | " + value.fName + " | " + value.lName + " | " + value.score + "\n", function (err) {
                if( err )
                    throw new Error( " Error in appending data" ); //throwing an user defined error.
            });
        });
        fs.exists("destination.txt",function(exists){
            if (exists) return cb(null, "destination.txt is created or modified.");
            else return cb(1, "destination.txt is not created.");
        });
    }
    //Created destination.xml or modify using "xmlbuilder" module from arrayElements.
    var createOrOverwriteXMLFile = function(cb){
        var rootElement = builder.create( "Students" );
        //Getting Each element from an array and appending to xml file.
        studentArray.forEach( function(value) {
            var student = rootElement.ele( 'Student', {'id': value.id} );
            student.ele( 'name', value.fName + value.lName );
            student.ele( 'score', value.score  );
        });
        var xmlString = rootElement.end( {pretty: true} );
        //console.log(xmlString);
        fs.writeFileSync( 'destination.xml', xmlString );
        fs.exists("destination.xml",function(exists){
            if (exists) return cb(null, "destination.xml is created or modified.");
            else return cb(1, "destination.xml is not created.");
        });
    }


    //check for the presence of destination.txt and perform specific task on the response.
    var destTextFile = function(cb){
        if (fs.existsSync("destination.txt"))
        {
            console.log("destination.txt is already present...Do you want to overwrite???(y/n)");
            prompt.start();
            isPromptRunning = true;
            prompt.get(['text_reply'], function (err, result) {
                if (err) { return onErr(err); }
                if (result.text_reply == "y") { createOrOverwriteTextFile(cb); }
                else if (result.text_reply == "n"){ return cb(null, "txt file will remain unchanged."); }
                else  { return cb(1, "Please Enter only y or n ...Currently txt file will remain unchanged."); }
            });
            function onErr(err) {
                console.log(err);
                return cb(1, "Failed to get reply from user for txt file"); 
            }
        } else {
            createOrOverwriteTextFile(cb);
        }
    }//End of all code about destination.txt.
    //check for the presence of destination.xml and perform specific task on the response.
    var destXMLFile = function(cb){
        if (fs.existsSync("destination.xml"))
        {
            console.log("destination.xml is already present...Do you want to overwrite???(y/n)");
            prompt.start();
            prompt.get(['xml_reply'], function (err, result) {
                if (err) { return onErr(err); }
                if (result.xml_reply == "y") { createOrOverwriteXMLFile(cb); }
                else if (result.xml_reply == "n") { return cb(null, "xml file will remain unchanged."); }
                else  { return cb(1, "Please Enter only y or n ...Currently xml file will remain unchanged."); }
            });
            function onErr(err) {
                console.log(err);
                return cb(1, "Failed to get reply from user for xml file"); 
            }
        } else {
            createOrOverwriteXMLFile(cb);
        }
    }//End of all code about destination.xml.


    //Synchronous calling of two functions
    async.series ([
        function (callback) {
            destTextFile ( function (err, res) {
                if (err) {
                    console.log("Failed: "+ res);
                    callback(null, 'one failed');
                }
                console.log("Successful: "+ res);
                callback(null, 'one success');
            });
        },
        function (callback) {
            destXMLFile ( function (err, res) {
                if (err) {
                    console.log("Failed: "+ res);
                    callback(null, 'one failed');
                }
                console.log("Successful: "+ res);
                callback(null, 'one success');
            });
        }
    ],
    // optional callback 
    function(err, results){
        console.log("Final Result: " + results);
    });

}catch( errorMessage ) {
    console.log(errorMessage );
}
