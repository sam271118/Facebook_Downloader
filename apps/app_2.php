<?php
    require './func.php';
    $msg = [];
    header('Content-Type: application/json');
    try
    {
        $file = $_FILES['source'];
        if(empty($file))
        {
            throw new Exception('Please choose file.', 1);
        }
    }
    catch(Exception $e)
    {
        $msg['is_success'] = false;
        $msg['message'] = $e->getMessage();
    }
    $tmp = $file['tmp_name'];
    $data = file_get_contents($tmp);
    if(isset($data))
    {
        $msg['is_success'] = true;
    }
    else
    {
        $msg['is_success'] = false;
    }


    // Encode JSON
    if($sd_link = sd_link($data))
    {
        $msg['links']['sd_link'] = $sd_link;
    }
    else
    {
        $msg['links']['sd_link'] = '0 Links Found';
    }
    if($hd_link = hd_link($data))
    {
        $msg['links']['hd_link'] = $hd_link;
    }
    else
    {
        $msg['links']['hd_link'] = '0 Links Found';
    }
    $msg['title'] = get_title($data);
    echo json_encode($msg);
?>