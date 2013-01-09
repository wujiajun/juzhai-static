$(document).ready(function(){
	var closeIdeaDetailTipsCookieName = 'C_IDEA_DETAIL_TIPS';
	//判断cookie是否显示tips
	var closeIdeaDetailTips= $.cookie(closeIdeaDetailTipsCookieName);
	if(null == closeIdeaDetailTips){
		$("div.tips_want").show();
	}
	$("div.tips_want > a.close").click(function(){
		$(this).parent().remove();
		$.cookie(closeIdeaDetailTipsCookieName, true, {expires: 0, path: '/', domain: '51juzhai.com', secure: false});
		return false;
	});
	
	$("#city-select").each(function(){
		var citySelect = new CitySelectInput(this, function(cityId){
			var gender = $("input[name='genderType']").val();
			var ideaId = $("div.wgo_title").attr("idea-id");
			window.location.href = "/idea/" + ideaId + "/user/" + cityId + "_" + gender + "/1";
			return false;
		});
		citySelect.bindBlur();
		citySelect.bindClick();
    });
	
	$("#gender-select").find("span > a").bind("click", function(){
		var cityId = $("input[name='cityId']").val();
		var gender = $(this).attr("value");
		var ideaId = $("div.wgo_title").attr("idea-id");
		window.location.href = "/idea/" + ideaId + "/user/" + cityId + "_" + gender + "/1";
		return false;
	});
	
	$("div.date > a").click(function(){
		var sendBtn = this;
		$(sendBtn).unbind("click").attr("class", "sending").text("发送中");
		var targetUid = $(this).attr("target-uid");
		var ideaId = $(this).attr("idea-id");
		sendDate(targetUid, null, ideaId, this, function(){
			$(sendBtn).attr("class", "date_done").text("已约");
		});
		return false;
	});
	$("a.send-message").bind("click", function(){
		var uid = $(this).attr("target-uid");
		var nickname = $(this).attr("target-nickname");
		openMessage(uid, nickname);
		return false;
	});
	$("div.user-remove-interest > a.done").bind("click", function() {
		var uid = $(this).attr("uid");
		removeInterestConfirm(uid, this, function(){
			$("div.remove-interest-" + uid).hide();
			$("div.interest-" + uid).attr("style", "");
		});
		return false;
	});
	$("div.user-add-interest > a").bind("click", function() {
		var uid = $(this).attr("uid");
		interest(this, uid, function(){
			$("div.interest-" + uid).hide();
			$("div.remove-interest-" + uid).attr("style", "");
		});
		return false;
	});
	
	
	var script = document.createElement("script");
	  script.src ="https://maps.google.com/maps/api/js?sensor=false&callback=initialize";
	  document.body.appendChild(script);
	
});

function initialize(){
	var ideaId=$("#map-view").attr("idea-id");
	$.ajax({
		url : "/idea/ajax/map",
		type : "get",
		data : {ideaId:ideaId},
		dataType : "html",
		success : function(result) {
			if(result.indexOf("container")!=-1){
				$("#map-view").show();
				$("#map-view").html(result);
				createMap("container");
				$("#map-view").find("div.view_map > a").bind("click", function() {
					var ideaId=$(this).attr("idea-id");
					$.ajax({
						url : "/idea/bigmap",
						type : "get",
						data : {ideaId:ideaId},
						dataType : "html",
						success : function(result) {
							if(result.indexOf("map_tcc")!=-1){
								var dialog = openDialog(null, "bigMap", result);
								createMap("big-map-container");
							}
						},
						statusCode : {
							401 : function() {
								window.location.href = "/login?turnTo=" + window.location.href;
							}
						}
					});
					return false;
				});
			}
		},
		statusCode : {
			401 : function() {
				window.location.href = "/login?turnTo=" + window.location.href;
			}
		}
	});
	return false;
}

function createMap(id){
	var lat=$("#"+id).attr("lat");
	var lng=$("#"+id).attr("lng");
	var ctiyName=$("#"+id).attr("city-name");
	var placeName=$("#"+id).attr("place-name");
	var townName=$("#"+id).attr("town-name");
	var myLatLng = new google.maps.LatLng(lat,lng);
	var opts = {
	  zoom:18,
	  center: myLatLng,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById(id),
			opts);
	var marker = new google.maps.Marker({
	      position: myLatLng,
	      title:ctiyName+townName+placeName
	  });
	marker.setMap(map); 
}
