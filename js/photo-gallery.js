$(document).ready(function(){{
		
		var html = ''; 

		for (i = 1; i < 147; ++i) {
		html += '<li class="col-lg-2 col-md-2 col-sm-4 col-xs-4">';
		html += '<img class="img-responsive" src="img/galeria/pic'+i+'.jpg">';
		html += '</li>';
		}
		
		$('#mama').html();
			$('#mama').html(html);

   };	
})

//============================================================================//
$(document).ready(function(){        
	$('li img').on('click',function(){
		var src = $(this).attr('src');
		var img = '<img src="' + src + '" class="img-responsive"/>';
		
		
		var index = $(this).parent('li').index();   
		
		var html = '';
		html += img;                
		html += '<div style="height:42px;clear:both;display:block;">';
		html += '<a class="controls next" href="'+ (index+2) + '">PRÓXIMO</a>';
		html += '<a class="controls previous" href="' + (index) + '">ANTERIOR</a>';
		html += '</div>';
		
		$('#myGaleria').modal();
		$('#myGaleria').on('shown.bs.modal', function(){
			$('#myGaleria .modal-body').html(html);
			//new code
			$('a.controls').trigger('click');
		})
		$('#myGaleria').on('hidden.bs.modal', function(){
			$('#myGaleria .modal-body').html('');
		});

   });	
})
        
         
$(document).on('click', 'a.controls', function(){
	var index = $(this).attr('href');
	var src = $('ul.row li:nth-child('+ index +') img').attr('src');             
	
	$('.modal-body img').attr('src', src);
	
	var newPrevIndex = parseInt(index) - 1; 
	var newNextIndex = parseInt(newPrevIndex) + 2; 
	
	if($(this).hasClass('previous')){               
		$(this).attr('href', newPrevIndex); 
		$('a.next').attr('href', newNextIndex);
	}else{
		$(this).attr('href', newNextIndex); 
		$('a.previous').attr('href', newPrevIndex);
	}
	
	var total = $('ul.row li').length + 1; 
	
	if(total === newNextIndex){
		$('a.next').hide();
	}else{
		$('a.next').show()
	}            
	
	if(newPrevIndex === 0){
		$('a.previous').hide();
	}else{
		$('a.previous').show()
	}
	
	
	return false;
});