<?php
declare(strict_types=1);

include_once('env.php');

defined('VARS') or define('VARS', $_ENV['app']);
defined('APP_URL') or define('APP_URL', VARS['app_url']);

if (isset($_GET['r'])) {
    // Handle route
    include_once('mock-api/controller.php');
    include_once('mock-api/route.php');
} else {
    // Go home
    header('location: ./index.html?r=index');
}
