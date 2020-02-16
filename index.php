<?php
if (isset($_GET['r'])) {
    $route = urldecode($_GET['r']);
    // ToDo ...
} else {
    header('location: index.html');
}

