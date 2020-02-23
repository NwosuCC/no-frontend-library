<?php
declare(strict_types=1);

/**
 * @var string $baseUrl
 */

$url = explode('/', urldecode($_GET['r']));

switch ((string)$url[0]) {
    case 'index' :
        {
            // --test: mimics loading time on browser
            sleep(1);
            $data = newsIndex((int)$_GET['page'], (int)$_GET['limit']);
        }
        break;
    case 'view' :
        {
            // --test: mimics loading time on browser
            sleep(1);
            $data = newsView((int)$url[1]);
        }
        break;
    case 'image-default' :
        {
            $data = [
                'imageUrl' => APP_URL . 'assets/images/image-placeholder.png',
            ];
        }
        break;
}

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
