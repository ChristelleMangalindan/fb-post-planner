window.fbAsyncInit = function() {
	FB.init({
	  appId      : '365075190309550',
	  xfbml      : true,
	  version    : 'v2.0',
      cookie     : true
	});
	initialize();
};
(function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "//connect.facebook.net/en_US/sdk.js";
	 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

    var user;

function initialize() {


	var baseUrl = "https://graph.facebook.com/v2.1/";
	getLoginStatus();
    $("#fb-login").click(function(){
    	getLoginStatus(login);
    })
    $("#post-now").click(function(){
        $("#post-form").attr("action","/post-now").submit();
    })

    $("#fb-logout").click(logout);
    /*
    $("#post-form").submit(function(){
    	if(user){
    		var msg = $("#post-form textarea").val();
    		postToFB(msg);
    		return false;
    	}else{
    		alert("Please Login to post");
    		return false;
    	}
    });

*/
    $("#post-form [name='date_to_post']").keypress(function(ev){
        ev.preventDefault();
    });

    $("#post-form").submit(function(){
        if(!user){
            alert('Please Login');
            return false;
        }

        $("#post-form [name='access_token']").val(user.accessToken);
        $("#post-form [name='fbID']").val(user.userID);
        var date= new Date($("#post-form [name='date_to_post']").val());
        var msg = $("#post-form [name='message']").val();
        msg = reverseString(msg);
        $("#post-form [name='message']").val(msg);
        if(date<new Date()){
            alert('Invalid Date.');
            return false;
        }
    });

    function getLoginStatus(callback){
    	FB.getLoginStatus(function(response){
    		if(response.status=="connected"){
    			getFBresponse(response);
    			toggleLogin();
    		}else if(typeof callback === 'function' && callback()){
    			callback(response);
    		}
    	});
    }
    /*
    function postToFB(msg){
    	var url = baseUrl + user.userID + "/feed/";
    	var data = {
					method: "post",
					message: msg,
					access_token: user.accessToken
				};
		$.get(url,data,function(response){
					if(response.id){
						alert('Post Successful');
						var msg = $("#post-form textarea").val("");
					}else{
						alert('An error occured. Try to reload the page and try again.')
					}
				});	
    }
    */
    function getFBresponse(response){
    	user=response.authResponse;
        if(user){
            $("#list").attr("href","/list/"+user.userID);
        }else{
            alert("Please Login");
        }
        
    }
    function login(){
    	FB.login(function(response){
    		if(response.authResponse){
    			getFBresponse(response);
    			toggleLogin();
    		}
    	}, {scope: 'publish_actions',return_scopes:true});
    }
    function logout(){
    	FB.logout(function(){
    		toggleLogin();
    		user=null;
            window.location.assign("/")
    	});
	}

    function toggleLogin(){
		$("#fb-login,#fb-logout").toggle();
    }
    $("#list").click(function(){
        if(!user){
            alert('Please Login');  
        }
    });
}

$(function () {
    $('#datetimepicker').datetimepicker({ startDate: new Date() });
    $('#button').click(function(e){
        if(!$("[name='date_to_post']").val()){
            alert("Please indicate the time and date to post.");
            e.preventDefault();   
        }
    });
    $(".delete").click(function(){
        var a=confirm('Are you sure to delete this post??')
        if(!a){return false;}
    })
});
function reverseString(str){
    var out = "";
    for (var i=0;i<str.length;i++){
        out = out+ str.charAt(str.length-1-i);
    }
    return out;

}