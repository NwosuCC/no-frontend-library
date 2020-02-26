<?php
$_ENV['app'] = [
    'env' => 'development',
    'timezone' => 'Africa/Lagos',
    'app_url' => 'http://127.0.0.1/news/',

    'database' => [
        'host' => '127.0.0.1',
        'db' => 'news',
        'user' => 'db_user',
        'password' => 'db_secret'
    ],
];

// Image Storage Permissions
// ====================================================
// In terminal, on project directory:
//
// Mac:
// sudo chgrp -R www ./storage
// sudo chmod -R 777 ./storage
//
// Ubuntu:
// sudo chgrp -R www-data ./storage
// sudo chmod -R 777 ./storage
