<?php
declare(strict_types=1);

// --test: Sample controller

function newsIndex(int $page = null, int $limit = null): array
{
    // --test: Sample database table records

    if (empty($_SESSION['cache']['news'])) {
        $_SESSION['cache']['news'] = [
            [
                'id' => 4051,
                'title' => 'Why EQ matters at work',
                'body' => 'EQ is the ability to leverage and control one’s emotions while navigating relationships and stressful situations. Having a high EQ means a person uses good judgment and empathy in equal measure',
                'author' => 'Fred Gattuso',
                'avatar' => APP_URL . 'assets/images/profile/avatar_male.png',
            ],
            [
                'id' => 2986,
                'title' => 'CSS breakpoints',
                'body' => 'For the next minute or so, I want you to forget about CSS. Forget about web development. Forget about digital user interfaces. And as you forget these things, I want you to allow your mind to wander.',
                'author' => 'Mr. Eddy Brad',
                'avatar' => 'https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg',
            ],
            [
                'id' => 7430,
                'title' => 'Simple start to Serverless',
                'body' => "So how do I get those files up there on the internet? I use Netlify! I've LOVED Netlify for years. It's bonkers how quickly I can get a site up and running (with HTTPS) with Netlify and it's integration with GitHub is unmatched. I love it.",
                'author' => 'Ahmani Tarik',
                'avatar' => APP_URL . 'assets/images/profile/avatar_admin.jpg',
            ],
            [
                'id' => 4982,
                'title' => 'About IHHP',
                'body' => 'HHP provides science-based training and high energy keynote speaking and has been a leader in Emotional Intelligence for over twenty years. Our clients experience improved productivity, talent retention, a more agile workplace culture and higher engagement levels.',
                'author' => 'Brenel Dicoule',
                'avatar' => APP_URL . 'assets/images/profile/avatar_female.png',
            ],
            [
                'id' => 2019,
                'title' => 'A Little More About It',
                'body' => 'Go ahead. After checking that no one is watching, draw a circle around each of the five groups with your child-like finger.You probably came up with something like the below, right? (And whatever you do, don’t tell me you scrolled down without doing the exercise. I will face palm.)',
                'author' => 'Opewhou Ibhike',
                'avatar' => 'https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/118.jpg',
            ],
            [
                'id' => 4932,
                'title' => 'Global Employment Policies',
                'body' => 'This policy sets out to ensure that employees and line managers are aware of the range of Flexible Working Arrangements available at MyCompany and understand the roles and responsibilities of each person involved in the application and approval process',
                'author' => 'Gladys Elizabeth',
                'avatar' => APP_URL . 'assets/images/profile/avatar_female.png',
            ],
            [
                'id' => 3458,
                'title' => 'How Freelancers Can Help You',
                'body' => 'Our mentors love to help people, whether it\'s through live mentorship or a fixed cost freelance job. Bridge a skills gap, add an expertise, or extend the bandwidth of your team.',
                'author' => 'Eric Grands T.',
                'avatar' => APP_URL . 'assets/images/profile/avatar_male.png',
            ],
        ];
    }

    $news = $_SESSION['cache']['news'];
    $total = count($news);

    if ($page > 0) {
        if ($limit > 0) {
            $news = array_chunk($news, $limit);
        }
        $news = $news[$page - 1] ?? [];
    }

    return compact('page', 'limit', 'total') + ['items' => $news];
}

function newsView(int $id): array
{
    $news = newsIndex()['items'] ?? [];
    $rows = array_filter($news, static function ($row) use ($id) {
        return $row['id'] === $id;
    });
    return array_shift($rows);
}

function newsCreate(): array
{
    // ToDo: add _csrf token, etc
    // ...
    return [];
}

function newsStore(array $post, array $file = null): ?array
{
    try {
        $id = abs(random_int(1001, 9999));
        $avatarPath = upload($file['avatar']);
        addToRepo([
            'id' => $id,
            'title' => $post['title'],
            'body' => $post['body'],
            'author' => $post['author'],
            'avatar' => $avatarPath,
        ]);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
//    return newsView($id);
    return compact('id');
}

function newsDelete(int $id): bool
{
    try {
        return removeFromRepo($id) > 0;
    } catch (Exception $e) {
        return false;
    }
}

function addToRepo(array $news): void
{
    if (empty($_SESSION['cache']['news'])) {
        newsIndex();
    }
    $newsIDs = array_column($_SESSION['cache']['news'], 'id');
    if (!in_array($news['id'], $newsIDs, false)) {
        $_SESSION['cache']['news'][] = $news;
    }
}

function removeFromRepo(int $id): int
{
    if (empty($_SESSION['cache']['news'])) {
        newsIndex();
    }
    foreach ($_SESSION['cache']['news'] as $i => $row) {
        if ($row['id'] === $id) {
            unset($_SESSION['cache']['news'][$i]);
            return 1;
        }
    }
    return 0;
}

function upload($file): ?string
{
    if (!empty($file) && $file['error'] === 0) {
        $fileInfo = finfo_open();
        $ext = substr(finfo_file($fileInfo, $file['tmp_name'] , (int)FILEINFO_MIME), 6, 3);
        if ($ext === 'jpe') {
            $ext = 'jpg';
        }
        if (!in_array($ext, ['png', 'jpg'], true)) {
            throw new \RuntimeException('File type not supported');
        }
        if (IMG_BASE64 === true) {
            $fileData = base64_encode(file_get_contents($file['tmp_name']));
        } else {
            // ToDo: create a files-clean-up job for orphaned files
            $fileName = substr(md5($file['name'].microtime()), 3, 13) . '.' . $ext;
            $filePath = 'storage/u-pics/' . $fileName;
            $fileAbsPath = APP_ROOT . $filePath;
            try {
                move_uploaded_file($file['tmp_name'], $fileAbsPath);
                chmod($fileAbsPath, 0766);
                $fileData = APP_URL . $filePath;
            } catch (Exception | Error $e) {
                throw new \RuntimeException('File not saved');
            }
        }
    }
    return $fileData ?? null;
}
