<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>

	<link rel="manifest" href="manifest.json">

	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="application-name" content="GTBO">
	<meta name="apple-mobile-web-app-title" content="GTBO">
	<meta name="theme-color" content="#a77748">
	<meta name="msapplication-navbutton-color" content="#a77748">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="msapplication-starturl" content="http://www.getthebrewson.co.uk/">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>Get the brews on</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width">

	<link rel="apple-touch-icon" href="library/images/apple-icon-touch.png">
	<link rel="icon" href="favicon.png">
	<!--[if IE]>
		<link rel="shortcut icon" href="favicon.ico">
	<![endif]-->
	<meta name="msapplication-TileImage" content="library/images/win8-tile-icon.png">

	<script src="library/js/libs/modernizr.js"></script>

	<link href='http://fonts.googleapis.com/css?family=Amaranth:400,700italic' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="library/css/style.css">

	<?php

		$url = $_SERVER['HTTP_HOST'];

		if( $url == 'getthebrewson.co.uk' ){

	?>
	<!-- Google Tag Manager -->
	<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-N2M8QZ"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-N2M8QZ');</script>
	<!-- End Google Tag Manager -->
	<?php } ?>

</head>
<body>

	<header class="">
		<div class="wrap">

			<h1>Get The Brews On</h1>

		</div>
	</header>

	<section class="">
		<div class="wrap">

			<div class="brew--action">

				<div class="countdown">
					<p class="countdown--text">Next Brewer in:</p>
					<p class="countdown--timer"><span>0</span></p>
				</div>

				<p>Can't decide whose turn it is to make a brew? Add the contenders and let us pick for you!</p>
				<p>Not after a cuppa? Why not decide who is in control of the music instead!</p>

				<?php

					// Get all cookies
					$cookies = $_COOKIE;

					// Dump em all
					//var_dump($cookies);

					// If there are any cookies...
					if( isset($_COOKIE['brewer_existing']) ) {

						// ...get the total number of names
						$cookie_total = $_COOKIE['brewer_existing'];

					} else {

						// If none, set 0
						$cookie_total = 0;

					}

					// Set this varaible to equal the total number so that older names aren't replaced
					$id = $cookie_total;

				?>
				<ul class="brew-list" id="brewList">
				<?php

					if($cookie_total > 0){

						// Now that we have the numbers, lets start the loops.
						$i = 1;

						do {

							if(isset($_COOKIE['brewer_number_' . ($i)])) {

								$cookie = $_COOKIE['brewer_number_' . ($i)];

								if( $cookie != ""){

				?>
					<li class="option option-<?php echo $i; ?>" data-name="brewer_number_<?php echo $i; ?>"><span class="option--name"><?php echo $cookie; ?></span> <span class="option--delete">Remove this name</span></li>
				<?php

								}

							}

							$i++;


						} while ($i <= $cookie_total);

					}

				?>
				</ul>
				<?php

					include 'modules/form-addname.php';

				?>

				<form class="form--countdown">
					<p>Add a countdown timer for the next brew!</p>
					<input class="" id="countdownVal" min="0" max="300" type="number" value="0" /> <label class="" for="countdownVal">minutes.</label>
					<p><small><i>Remember: to get a browser notification make sure they are allowed and that you don't close this tab!</i></small></p>
				</form>

				<a class="btn" id="brews" href="#" title="Shuffle through the names and pick a brewer!">Pick a Brewer</a>
				<a class="btn btn--remove" id="clearbrewers" href="#" title="Start over, clear all brewers from the list">Remove all Brewers</a>

			</div>

			<div class="kettle--outer hidden">
				<div class="kettle">
					<span class="kettle--lid"></span>
					<span class="kettle--body"></span>
					<span class="kettle--stove"></span>
					<span class="kettle--flames"></span>
					<div class="kettle--name--wrap">
						<p class="kettle--name"></p>
					</div>
				</div>
			</div>

		</div>
	</section>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<?php
	/*
	<script src="library/js/libs/jquery.cookies.js"></script>
	*/
	?>
	<script src="library/js/min/all.min.js"></script>

</body>
</html>
