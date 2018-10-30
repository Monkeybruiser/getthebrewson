/**
 * @author Alexander Manzyuk <admsev@gmail.com>
 * Copyright (c) 2012 Alexander Manzyuk - released under MIT License
 * https://github.com/admsev/jquery-play-sound
 * Usage: $.playSound('http://example.org/sound')
 * $.playSound('http://example.org/sound.wav')
 * $.playSound('/attachments/sounds/1234.wav')
 * $.playSound('/attachments/sounds/1234.mp3')
 * $.stopSound();
**/
/*
(function ($) {
    $.extend({
        playSound: function () {
            return $(
               '<audio class="sound-player" autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '" />' + '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>' + '</audio>'
			).appendTo('body');
        },
        stopSound: function () {
            $(".sound-player").remove();
        }
    });
})(jQuery);
*/



var countCookies 				= 0;
var totalNames 					= 0;
var id							= 0;
var cookies 					= '';
var notificationBrewTimer		= 0;
var notificationTimer			= 0;
var expires						= '';



jQuery(document).ready(function($) {



	$(".add-name").submit(function(e) {
		e.preventDefault();
	});



	// Set ID based on current number of list items
	countCookies	= $.cookie('brewer_existing');

	if(countCookies == 'NaN') {
		countCookies	= 0;
	}

	totalNames 		= $(".brew-list li").length;
	id				= countCookies++;
	var oButton		= document.getElementById('addBrewer');
	var data		= document.getElementById('dataInput');
	var display		= document.getElementById('brewList');

	oButton.onclick = function() {
		$.cookie('brewer_number_' + id, data.value);
		$.cookie('brewer_total', totalNames);
		$.cookie('brewer_existing', countCookies);
		display.innerHTML += '<li class="option option-' + id + '" data-name="brewer_number_' + id + '"><span class="option--name">' + data.value + '</span> <span class="option--delete">Remove this name</span></li>';
	};



	$('#addBrewer').click(function() {

		id++;
		if($('.brew-list li').length > 1 ) {
			$('#brews').addClass('brewme');
		}
		$('#dataInput').val('');

		totalNames++;
		countCookies++;

		$.cookie('brewer_total', totalNames);
		$.cookie('brewer_existing', countCookies);

		// console.log('Total Name = ' + totalNames);
		// console.log('Count cookies = ' + countCookies);

	});



	$('#brews').click(function() {

		rollForBrewer();

	});

	$('#clearbrewers').click(function() {

		clearBrewers();

		// Clear the display
		$( ".brew-list" ).empty();

	});

	$('#reRoll').click(function() {

		rollForBrewer();

	});



	$('body').on('click', '.option--delete', function () {

		$(this).closest('.option').slideUp('fast');
		var readyToDelete = $(this).closest('.option');
		setTimeout(function() {
			$(readyToDelete).remove();
		}, 1200);

		var cookieToMuch = $(this).closest('.option').data('name');

		eraseCookie( cookieToMuch );

		totalNames--;
		$.cookie('brewer_total', totalNames);

	});



	document.addEventListener('DOMContentLoaded', function () {

		if (Notification.permission !== "granted")
		Notification.requestPermission();

	});



});



/*

	Function which clears the list of names

*/
function clearBrewers(){

	cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++)
	  eraseCookie(cookies[i].split("=")[0]);
	id	= 1;
	totalNames = 0;
	countCookies = 0;
	$.cookie('brewer_total', totalNames);
	$.cookie('brewer_existing', countCookies);

}



/*

	Function which clears the cookies

*/
function eraseCookie(name) {

    createCookie(name,"",-1);

}



/*

	Function which creates the name cookie

*/
function createCookie(name,value,days) {

    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/";

}



/*

	Function which organises the selection animation

*/
function rollForBrewer() {

	if(jQuery('.countdown').hasClass('visible')) {

		jQuery('.countdown').removeClass('visible');

	}

	// $.playSound('http://getthebrewson.mb/library/audio/kettle-boil.mp3');

	if(jQuery('.kettle--outer').hasClass('hidden')) {

		jQuery('.brew--action').addClass('push');

		setTimeout(function() {
			jQuery('.kettle').addClass('fall-in');
			jQuery('.kettle--outer').removeClass('hidden');
		}, 500);

		setTimeout(function() {
			getBrewer();
		}, 1000);

		setTimeout(function() {
			jQuery('.kettle').removeClass('fall-in');
		}, 2000);

	} else {

		//jQuery('.kettle').removeClass('boiling');
		jQuery('.kettle').removeClass('boiled');
		jQuery('.kettle--name--wrap').removeClass('show');

		getBrewer();

	}

}



/*

	Function which get the selected name

*/
function getBrewer() {

	jQuery('.brew-list').addClass('brew-list__active');
	jQuery('.brew-list li').removeClass('itsme');

	var brewlist			= jQuery('.brew-list li').toArray();
	var elemlength			= brewlist.length;
	var randomnum			= Math.floor(Math.random()*elemlength);
	var randomitem			= brewlist[randomnum];
	var brewerName			= jQuery(randomitem).find('.option--name').text();
	var currentUrl			= jQuery(location).attr('href');

	jQuery(randomitem).addClass('itsme');

	setTimeout(function() {
		jQuery('.kettle--name').text(brewerName);
	}, 500);

	setTimeout(function() {
		jQuery('.kettle').addClass('boiling');
	}, 2000);

	setTimeout(function() {
		jQuery('.kettle').addClass('boiled');
		initCountdownTimer();
	}, 4000);

	setTimeout(function() {
		jQuery('.kettle--name--wrap').addClass('show');
		if(notificationBrewTimer > 0) {
			jQuery('.countdown').addClass('visible');
		}
	}, 6000);

}



/*

	Function for timer notifications

*/
function initCountdownTimer() {

	notificationBrewTimer 				= jQuery('#countdownVal').val();

	if(notificationBrewTimer > 0) {

		// console.log('Starting timer now');

		notificationTimer	= notificationBrewTimer + ':00';

		var interval 					= setInterval(function() {

			// console.log(notificationTimer);

			var timer 					= notificationTimer.split(':');
			var minutes 				= parseInt(timer[0], 10);
			var seconds 				= parseInt(timer[1], 10);
			--seconds;
			minutes 					= (seconds < 0) ? --minutes : minutes;

			seconds 					= (seconds < 0) ? 59 : seconds;
			seconds 					= (seconds < 10) ? '0' + seconds : seconds;

			jQuery('.countdown--timer span').html(minutes + ':' + seconds);
			notificationTimer			= minutes + ':' + seconds;

			if(minutes === 0 && seconds === 01) {

				notificationPopup();
				clearInterval(interval);

			}

		}, 1000);

	}

}

/*

	Function to init the browser notification

	Base code taken from:

		https://stackoverflow.com/questions/2271156/chrome-desktop-notification-example
		https://jsbin.com/ziwod/2/edit?html,js,output

*/
function notificationPopup() {

	if (Notification.permission !== "granted") {

		Notification.requestPermission();

	} else {

		var notification = new Notification('Time\'s up dude!', {
			icon: 'http://www.getthebrewson.co.uk/library/images/img-notification-tile.png',
			body: 'It\'s someone elses turn to make the brews. Click to give it another spin!',
		});

	}

	jQuery('.countdown').removeClass('visible');

}
