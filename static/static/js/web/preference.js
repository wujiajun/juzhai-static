$(document).ready(function() {
	$("span.width250 >input").each(function(){
		registerInitMsg($(this));
	});

	$(".save").bind("click", function() {
		var preference_count=parseInt($("#preference_count").val());
		for(var i=0;i<(preference_count);i++){
			var preferenceId=$("#preferenceId_"+i).val();
			var type=$("#inputType_"+i).val();
			var minValidationValue=$("#minValidationValue_"+i).val();
			var maxValidationValue=$("#maxValidationValue_"+i).val();
			if(type==0){
					var checkedCount=0;
					$('input[name="userPreferences['+i+'].answer"]').each(function(){
						if(this.checked){
							checkedCount=checkedCount+1;
						}
					});
					if(checkedCount>maxValidationValue){
						$("#error_"+i).text("选择请不要超过"+maxValidationValue+"项").show();
				        return ;
					}else if(checkedCount<minValidationValue){
						$("#error_"+i).text("请至少选择"+minValidationValue+"项").show();
						return ;
					}else{
						$("#error_"+i).text("").hide();
					}
			}else if(type==2){
					var min=$("#minText_"+i).val();
					var max=$("#maxText_"+i).val();
					if(!isNum(min)||!isNum(max)){
						 $("#error_"+i).text("请输入数字").show();
					        return ;	
					}else{
						$("#error_"+i).text("").hide();
					}
					min=parseInt(min);
					max=parseInt(max);
					if(max<min){
						var t=0;
						t=max;
						max=min;
						min=t;
					}
					if(min<minValidationValue||max>maxValidationValue){
						 $("#error_"+i).text("请输入"+minValidationValue+"-"+maxValidationValue+"之间的数字！").show();
					        return ;	
					}else{
						$("#error_"+i).text("").hide();
					}
					$("#minText_"+i).val(min);
					$("#maxText_"+i).val(max);
			}else if(type==3){
				if(getByteLen($('textarea[name="userPreferences['+i+'].answer"]').val())>maxValidationValue){
					 $("#error_"+i).text("输入内容请不要超过"+maxValidationValue/2+"字").show();
				        return ;	
				}else if(getByteLen($('textarea[name="userPreferences['+i+'].answer"]').val())<minValidationValue){
					 $("#error_"+i).text("请输入内容").show();
				        return ;	
				}else{
					$("#error_"+i).text("").hide();
				}
			}else if(type==1){
					if(minValidationValue>0){
						var answer=$('select[name="userPreferences['+i+'].answer"]').val();
						if(answer==""){
							$("#error_"+i).text("至少选择一个选项").show();
					        return ;
						}else{
							$("#error_"+i).text("").hide();
						}
					}
			}
			var des=$('input[name="userPreferences['+i+'].description"]').val();
			if (undefined != des) {
				if(getByteLen(des)>100){
					 $("#error_"+i).text("补充内容请不要超过50字").show();
				        return ;	
				}else{
					$("#error_"+i).text("").hide();
				}
				var initDes=$('input[name="userPreferences['+i+'].description"]').attr("init-tip");
				if(des==initDes){
					des="";
				}
				$('input[name="userPreferences['+i+'].description"]').val(des);
			}
			$("#answerDiv_"+i).html("");
			var obj=$("#answerDiv_"+i)[0];
			var preferenceIdInput = document.createElement("input");   
			preferenceIdInput.name="userPreferences["+i+"].preferenceId";
			preferenceIdInput.type="hidden";
			preferenceIdInput.value=preferenceId;
	        obj.appendChild(preferenceIdInput);
		}
		setPreference($("#preferenceForm").serialize(),
		function(){
			var content = $("#dialog-success").html().replace("{0}", "保存成功！");
			showSuccess(null, content);
			$("div.error").text("");
			$("span.width250 >input").each(function(){
				$(this).trigger("blur");;
			});
		},
		function(){
			alert(result.errorInfo);
			$("span.width250 >input").each(function(){
				$(this).trigger("blur");;
			});
		}
		);
		return false;
	});
	
});