<?php
declare(strict_types=1);

// --test: Sample controller

function newsIndex(): array
{
    // --test: Sample database table records

    return [
        [
            'id' => 4051,
            'title' => 'Why EQ matters at work',
            'body' => 'EQ is the ability to leverage and control one’s emotions while navigating relationships and stressful situations. Having a high EQ means a person uses good judgment and empathy in equal measure',
            'author' => 'Mr. Eddy Brad',
//                'avatar' => 'https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg',
            'avatar' => APP_URL . 'assets/images/profile/avatar_female.png',
        ],
        [
            'id' => 2986,
            'title' => 'CSS breakpoints',
            'body' => 'For the next minute or so, I want you to forget about CSS. Forget about web development. Forget about digital user interfaces. And as you forget these things, I want you to allow your mind to wander.',
            'author' => 'Mr. Eddy Brad',
//                'avatar' => 'https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg',
            'avatar' => APP_URL . 'assets/images/profile/avatar_male.png',
        ],
        [
            'id' => 7430,
            'title' => 'Simple start to Serverless',
            'body' => "So how do I get those files up there on the internet? I use Netlify! I've LOVED Netlify for years. It's bonkers how quickly I can get a site up and running (with HTTPS) with Netlify and it's integration with GitHub is unmatched. I love it.",
            'author' => 'Mr. Eddy Brad',
//                'avatar' => 'https://s3.amazonaws.com/uifaces/faces/twitter/scott_riley/128.jpg',
            'avatar' => APP_URL . 'assets/images/profile/avatar_admin.jpg',
        ],
    ];
}

function newsView(int $id): array
{
    $rows = array_filter(newsIndex(), static function ($row) use ($id) {
        return $row['id'] === $id;
    });
    return array_shift($rows);
}
