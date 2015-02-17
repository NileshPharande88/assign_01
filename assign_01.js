try {
    //Reading source.json and convert it in JSON object if file is present.
    var fs = require("fs");
    if( (fs === undefined) )
    	throw new Error( " Can't access fs module" );
    fs.exists("source.json",function(exists){
    	if(!exists)
    		throw new Error( " source.json file is not present in current folder" );
    });
    var sourceString = fs.readFileSync("source.json");
    var sourceJSON;
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


/*
    fs.exists("destination.txt",function(exists){
    	if(exists)
    		console.log("destination.txt is already present...Do you want to overwrite???");
    	else
    		console.log("destination.txt not present");
    });
*/



    //Creating destination.txt from arrayElements if it is already not present.
    fs.writeFileSync( "destination.txt", "First Name | Last Name | Score\n" );
    //Getting Each element from an array and appending to txt file.
    studentArray.forEach( function (value) {
    	fs.appendFile( "destination.txt", value.id + " | " + value.fName + " | " + value.lName + " | " + value.score + "\n", function (err) {
        	if( err )
                throw new Error( " Error in appending data" ); //throwing an user defined error.
        });
    });
    /*
    for(var ele in studentArray) {
        var student = studentArray[ele];
        fs.appendFile("destination.txt", student.id + " | " + student.fName + " | " + student.lName + " | " + student.score + "\n", function(err){
            if (err)
                throw new Error( "Error in appending data" ) ;
        });
    }
    */







    //Created destination.xml using "xmlbuilder" module.
    var builder = require( "xmlbuilder" );
    var rootElement = builder.create( "Students" );
    //Getting Each element from an array and appending to xml file.
    studentArray.forEach( function(value) {
        var student = rootElement.ele( 'Student', {'id': value.id} );
        student.ele( 'name', value.fName + value.lName );
        student.ele( 'score', value.score  );
    });
    var xmlString = rootElement.end( {pretty: true} );
    //console.log(xmlString);
    fs.writeFile( 'destination.xml', xmlString );
	
}catch( errorMessage ) {
    console.log(errorMessage );
}
