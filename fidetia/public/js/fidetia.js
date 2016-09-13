$(document).ready(function() {
	$("#back-top").hide();
    // fade in #jm-back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
    //Tooltip
    $('[data-toggle="tooltip"]').tooltip()
});

// Sticky Bar
$(window).scroll(function() {
	if ($(this).scrollTop() > 200){  
	    $('#navbar').addClass("scrolled");
	    $('#navbar').addClass('animated fadeIn');
	    $('.hero-and-content').addClass("scrolled");
	  }
	  else{
	    $('#navbar').removeClass("scrolled");
	    $('#navbar').removeClass('fadeIn');
	    $('.hero-and-content').removeClass("scrolled");
	  }
});

if ($("#the-carousel").length > 0) {
	$("#page-title").addClass("page-title-abs");
}

function check_menu(menu) {
	$(".web-footer-copyright").html($(menu).parent().parent().html());
}

frappe.msgprint = function(html, title) {
    if(html.substr(0,1)==="[") html = JSON.parse(html);
    if($.isArray(html)) {
        html = html.join("<hr>")
    }
    return frappe.get_modal(title || "Mensaje", html).modal("show");
}