try {
    //Reading source.json and convert it in JSON object if file is present.
    var fs = require("fs");
    var prompt = require('prompt');
    var builder = require( "xmlbuilder" );
    var sourceJSON;
    if( (fs === undefined) )
    	throw new Error( " Can't access fs module" );
    if( (prompt === undefined) )
        throw new Error( " Can't access prompt module" );
    if( (builder === undefined) )
        throw new Error( " Can't access builder module" );

    //check for the presence of source.json.
    fs.exists("source.json",function(exists){
    	if(!exists)
    		throw new Error( " source.json file is not present in current folder" );
    });
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
    var createOrOverwriteTextFile = function(){
        fs.writeFileSync( "destination.txt", "First Name | Last Name | Score\n" );
        //Getting Each element from an array and appending to txt file.
        studentArray.forEach( function (value) {
            fs.appendFile( "destination.txt", value.id + " | " + value.fName + " | " + value.lName + " | " + value.score + "\n", function (err) {
                if( err )
                    throw new Error( " Error in appending data" ); //throwing an user defined error.
            });
        });
        fs.exists("destination.txt",function(exists){
            if (!exists) console.log("destination.txt is not created.");
            console.log("destination.txt is created or modified.");
        });
    }
    //Created destination.xml using "xmlbuilder" module from arrayElements.
    var createOrOverwriteXMLFile = function(){
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
            if (!exists) console.log("destination.xml is not created.");
            console.log("destination.xml is created or modified.");
        });
    }




    //check for the presence of destination.txt and perform specific task on the response.
    if (fs.existsSync("destination.txt"))
    {
        console.log("destination.txt is already present...Do you want to overwrite???(y/n)");
        prompt.start();
        prompt.get(['reply'], function (err, result) {
            if (err) { return onErr(err); }
            if (result.reply == "y") createOrOverwriteTextFile();
            else if (result.reply == "n") console.log("File will remain unchanged.");
            else console.log("Please Enter only y or n ...Currently file will remain unchanged.");
        });
        function onErr(err) {
            console.log(err);
            return 1;
        }
    } else {
        createOrOverwriteTextFile();
    }//End of all code about destination.txt.


/*   
    //check for the presence of destination.xml and perform specific task on the response.
    if (fs.existsSync("destination.xml"))
    {
        console.log("destination.xml is already present...Do you want to overwrite???(y/n)");
        prompt.start();
        prompt.get(['reply'], function (err, result) {
            if (err) { return onErr(err); }
            if (result.reply == "y") createOrOverwriteXMLFile();
            else if (result.reply == "n") console.log("File will remain unchanged.");
            else console.log("Please Enter only y or n ...Currently file will remain unchanged.");
        });
        function onErr(err) {
            console.log(err);
            return 1;
        }
    } else {
        createOrOverwriteXMLFile();
    }//End of all code about destination.xml.
*/
}catch( errorMessage ) {
    console.log(errorMessage );
}
