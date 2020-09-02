<?php
declare(strict_types=1);

$url = explode('/', urldecode($_GET['r']));
$data = resolve((string)$url[0], $url[1] ?? '');

if ($data === null) {
    if (!empty($_POST)) {
        $responseCode = 400;
        $data = ['error' => 'Bad request'];
    } else {
        $responseCode = 404;
        $data = ['error' => 'Not Found'];
    }
} else {
    $responseCode = 200;
}

// --test: mimics API response that contains no data
//$data = [];

// Ajax Response Data
http_response_code($responseCode);
die(json_encode(['data' => $data]));


function resolve(string $route, string $id = '')
{
    // --test: mimics loading time on browser
    sleep(1);
    switch ($route) {
        case 'index':
            return newsIndex((int)$_GET['page'], (int)$_GET['limit']);
        case 'view' :
            return newsView((int)$id);
        case 'create' :
            return newsCreate();
        case 'store' :
            return newsStore($_POST, $_FILES);
        case 'delete' :
            return newsDelete((int)$id);
        case 'image-default' :
            return ['imageUrl' => APP_URL . 'assets/images/image-placeholder.png'];
        default:
            return null;
    }
}
