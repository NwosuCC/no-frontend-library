<?php
declare(strict_types=1);

session_start();

include_once('env.php');

defined('VARS') or define('VARS', $_ENV['app']);

// App Path
defined('APP_ROOT') or define('APP_ROOT', __DIR__ . '/');
defined('APP_URL') or define('APP_URL', VARS['app_url']);

// If set to true, saves image files in base64-encoded format
defined('IMG_BASE64') or define('IMG_BASE64', false);

if (isset($_GET['r'])) {
    // Handle route
    include_once('mock-api/controller.php');
    include_once('mock-api/route.php');
} else {
    // Go home
    header('location: ./index.html?r=index');
}
