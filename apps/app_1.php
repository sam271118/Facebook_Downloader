<?php
    /*
        @name: A Function to get link video on Facebook.
        @author: Shin.
        @write_at: 2/1/2022 - 15:03':35".
    */


    require '../vendor/autoload.php';
    require './func.php';
    use Symfony\Component\HttpClient\HttpClient;
    use Symfony\Component\HttpClient\Exception\RedirectionException;

    header('Content-Type: application/json');

    // Message Box
    $msg = [];

    // Validate URL
    $pattern_input = '/^(?:https:\/\/)?(?:fb.watch\/|www\.facebook\.com\/)?(?:[\w\d].*\/)?(?:videos\/)?(?:[\w\d]*\/)?$/';
    $url = isset($_REQUEST['video_url']) ? $_REQUEST['video_url'] : '';

    if(empty($_REQUEST['video_url']))
    {
        $msg['message'] = 'Please enter video URL.';
    }
    else
    {
        $url = test_input($_REQUEST['video_url']);
        if(!preg_match($pattern_input, $url))
        {
            $msg['message'] = 'URL is not valid. Please check again.';
        }
    }
    
    // Test Input
    function test_input($value)
    {
        $value = trim($value);
        $value = stripslashes($value);
        $value = htmlspecialchars($value);

        return $value;
    }


    // Send Request
    function fetch_data($url)
    {
        $patt = '/^(?:https\:\/\/www\.facebook\.com\/)?([\w]*\/)?(?:videos\/)?([\w]*)\/$/';
        $user_agent = '';

        if(preg_match($patt, $url))
        {
            $user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15';
        }
        else
        {
            $user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36';
        }

        // Check Redirect
        $client = HttpClient::create();
        try
        {
            $response = $client -> request('GET', $url, ['max_redirects' => 0]) -> getContent();
        }
        catch(RedirectionException $err)
        {
            $redirect_url = $err -> getResponse() -> getInfo()['redirect_url'];
        }
        
        // Fetch Data if have redirect
        if(isset($redirect_url))
        {
            $url = $redirect_url;
        }

        $client = HttpClient::create([
            'headers' => [
                'accept' => 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'user-agent' => $user_agent
            ],
            'verify_peer' => false,
        ]);

        $response = $client -> request('GET', $url);
        $data = $response -> getContent();

        return $data;
    }

    // Encode JSON
    if($success = fetch_data($url))
    {
        $msg['is_success'] = true;
    }
    else
    {
        $msg['is_success'] = false;
    }

    if($sd_link = sd_link(fetch_data($url)))
    {
        $msg['links']['sd_link'] = $sd_link;
    }
    else
    {
        $msg['links']['sd_link'] = '0 Links Found';
    }
    if($hd_link = hd_link(fetch_data($url)))
    {
        $msg['links']['hd_link'] = $hd_link;
    }
    else
    {
        $msg['links']['hd_link'] = '0 Links Found';
    }

    $msg['title'] = get_title(fetch_data($url));

    echo json_encode($msg);
?>