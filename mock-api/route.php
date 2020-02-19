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
            $data = newsIndex();
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
    $result = ['error' => 'Bad request'];
    http_response_code(400);
    die(json_encode($result));
}

// --test: mimics API response that contains no data
//$data = [];

// Ajax Response Data
http_response_code(200);
die(json_encode(compact('data')));
