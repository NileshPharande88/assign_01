try {
    //Reading source.json and convert it in JSON object.
    var fs = require("fs");
    var sourceString = fs.readFileSync("source.json");
    var sourceJSON = JSON.parse( sourceString );
    var studentArray = sourceJSON.students;


    //Sorting of arrayElements using score.
    studentArray.sort( function (a, b) {
        return b.score - a.score ;
    });


    //Getting Each element from an array and checking for tags are present or not.
    studentArray.forEach(function (value) {
    	if( (value.id === undefined) )
    		throw new Error( "Error : Error in data" );
    	else if( (value.fName === undefined) )
    		throw new Error( "Error : Error in data" );
    	else if( (value.lName === undefined) )
    		throw new Error( "Error : Error in data" );
    	else if( (value.score === undefined) )
    		throw new Error( "Error : Error in data" );
    });

    //Creating destination.txt from arrayElements and throw Error for exceptional condition.
    fs.writeFileSync( "destination.txt", "First Name | Last Name | Score\n" );
    //Getting Each element from an array and appending to txt file.
    studentArray.forEach( function (value) {
    	fs.appendFile( "destination.txt", value.id + " | " + value.fName + " | " + value.lName + " | " + value.score + "\n", function (err) {
        	if( err )
                throw new Error( "Error : Error in appending data" ); //throwing an user defined error.
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
