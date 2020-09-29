function loadDoc() {
	  $.ajax({
			 url: "movies.xml",
			 dataType: "xml",
			 success: function(data) {
			    
			    alert("file is loaded");
			    /*
			    Table should have following information:
			    Title,
			    Genre (comma separated genres),
			    Director,
			    Cast (comma separated person name),
			    Short description (synopsis),
			    IMDB-rating (score)
			    */
			    var s = "<tr><td>Title</td><td>Genre</td><td>Director</td>" +
			    "<td>Cast</td><td>Short Description</td><td>IMDB-Rating</td></tr>"
			    $("#result").append(s);
			    $(data).find("movie").each(function(){
			    	s = "<tr>"
			    	var title = $(this).find("title").text();
			    	s += "<td>" + title + "</td>"
			    	var genre = []
			    	$(this).find("genre").each(function(){
			    		genre.push($(this).text())
			    	})
			    	s += "<td>" + genre.join(", ") + "</td>"
			    	var director = []// I am not sure whether there will be only one director
			    	$(this).find("director").each(function(){
			    		director.push($(this).text())
			    	})
			    	s += "<td>" + director.join(", ") + "</td>"
			    	var cast = []
			    	$(this).find("cast").find("person").each(function(){
			    		cast.push($(this).attr("name"))
			    	})
			    	s += "<td>" + cast.join(", ") + "</td>"
			    	var synopsis = $(this).find("imdb-info").find("synopsis").text();
			    	s += "<td>" + synopsis + "</td>"
			    	var score = $(this).find("imdb-info").find("score").text();
			    	s += "<td>" + score + "</td>"
			    	s += "</tr>"
					$("#result").append(s);
			    });
			    

			 },
			 error: function() { alert("error loading file");  }
	     });


	}