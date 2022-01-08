<?php
    // SD Link
    function sd_link($data)
    {
        $pattern = '/playable_url":"([^"]*)"/';

        if(preg_match($pattern, $data, $matches))
        {
            $link = stripslashes($matches[1]);
            return $link;
        }
        else
        {
            return false;
        }
    }

    // HD Link
    function hd_link($data)
    {
        $pattern = '/playable_url_quality_hd":"([^"]*)"/';

        if(preg_match($pattern, $data, $matches))
        {
            $link = stripslashes($matches[1]);
            return $link;
        }
        else
        {
            return false;
        }
    }

    // Get Title
    function get_title($data)
    {
        $title = '';
        $pattern_1 = '/<title>(.*?)<\/title>/';
        $pattern_2 = '/title id="pageTitle">(.*?)<\/title>/';

        if (preg_match($pattern_1, $data, $matches)) 
        {
            $title = $matches[1];
        } 
        elseif (preg_match($pattern_2, $data, $matches)) 
        {
            $title = $matches[1];
        }

        return $title;
    }
?>