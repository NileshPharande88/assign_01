try {
    //Reading source.json and convert it in JSON object if file is present.
    var fs = require("fs");
    var prompt = require('prompt');
    var builder = require( "xmlbuilder" );
    var async = require( "async" );
    var sourceJSON;
    if( (fs === undefined) )
    	throw new Error( " Can't access fs module" );
    if( (prompt === undefined) )
        throw new Error( " Can't access prompt module" );
    if( (builder === undefined) )
        throw new Error( " Can't access builder module" );
    if( (async === undefined) )
        throw new Error( " Can't access async module" );

    //check for the presence of source.json.
    if(!fs.existsSync("source.json"))
        throw new Error( " source.json file is not present in current folder" );


    var sourceString = fs.readFileSync("source.json");
    try{
    	sourceJSON = JSON.parse( sourceString );
    }catch(err){
    	throw new Error( " Can't parse json object" );
    }
    var studentArray = sourceJSON.students;


    //Sorting of arrayElements using score.
    studentArray.sort( function (a, b) {
        return b.score - a.score ;
    });
    //Getting Each element from an array and checking for tags are present or not.
    studentArray.forEach(function (value) {
    	if( (value.id === undefined) )
    		throw new Error( " id is not found in object" );
    	else if( (value.fName === undefined) )
    		throw new Error( " fName is not found in object" );
    	else if( (value.lName === undefined) )
    		throw new Error( " lName is not found in object" );
    	else if( (value.score === undefined) )
    		throw new Error( " score is not found in object" );
    });


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
            if (exists) {
                console.log("destination.txt is created or modified.");
                return cb(null, "Success");
            }
            else {
                console.log("destination.txt is not created.");
                return cb(1, "Failed");
            }
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
            if (exists) {
                console.log("destination.xml is created or modified.");
                return cb(null, "Success");
            }
            else {
                console.log("destination.xml is not created.");
                return cb(1, "Failed");
            }
        });
    }




    //check for the presence of destination.txt and perform specific task on the response.
    var destTextFile = function(cb){
        if (fs.existsSync("destination.txt"))
        {
            console.log("destination.txt is already present...Do you want to overwrite???(y/n)");
            prompt.start();
            isPromptRunning = true;
            prompt.get(['treply'], function (err, result) {
                if (err) { return onErr(err); }
                if (result.treply == "y") createOrOverwriteTextFile(cb);
                else if (result.treply == "n"){
                    console.log("File will remain unchanged.");
                    return cb(null, "Success"); 
                } else  {
                    console.log("Please Enter only y or n ...Currently file will remain unchanged.");
                    return cb(1, "Failed"); 
                }
            });
            function onErr(err) {
                console.log(err);
                return cb(1, "Failed"); 
            }
        } else {
            createOrOverwriteTextFile();
        }
    }//End of all code about destination.txt.


    //check for the presence of destination.xml and perform specific task on the response.
    var destXMLFile = function(cb){
        if (fs.existsSync("destination.xml"))
        {
            console.log("destination.xml is already present...Do you want to overwrite???(y/n)");
            //prompt.start();
            prompt.get(['xreply'], function (err, result) {
                if (err) { return onErr(err); }
                if (result.xreply == "y") createOrOverwriteXMLFile();
                else if (result.xreply == "n") {
                    console.log("File will remain unchanged.");
                    return cb(null, "Success"); 
                } else {
                    console.log("Please Enter only y or n ...Currently file will remain unchanged.");
                    return cb(1, "Failed"); 
                }
            });
            function onErr(err) {
                console.log(err);
                return cb(1, "Failed"); 
            }
        } else {
            createOrOverwriteXMLFile();
        }
    }//End of all code about destination.xml.



    async.series([
        function(callback){
            destTextFile(function(err, res){
                if(err){
                    callback(1, 'one failed');
                }else{
                    console.log("One function is successfully executed.");
                    callback(null, 'one success');
                }
            });
        },
        function(callback){
           destXMLFile(function(err, res){
                if(err){
                    callback(1, 'Second failed');
                }else{
                    console.log("Second function is successfully executed.");
                    callback(null, 'Second success');    
                }
            });
        }
    ],
    // optional callback 
    function(err, results){
        console.log("All functions are successfully executed." + results);
        // results is now equal to ['one', 'two'] 
    });  

}catch( errorMessage ) {
    console.log(errorMessage );
}
