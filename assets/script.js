async function get_video_link()
{
    $('#notification').css({'opacity': '0', 'visibility': 'hidden'});
    $('#result_box').css({'opacity': '0', 'visibility': 'hidden', 'transform': 'scaleY(0)', 'transform-origin': 'top'});
    $('#sd_link').empty();
    $('#hd_link').empty();
    $('.another_method').css({'opacity': '0', 'visibility': 'hidden'});
    $('#btn_how').css({'opacity': '0', 'visibility': 'hidden'});
    $('#group_source').css({'opacity': '0', 'visibility': 'hidden'});

    const url = $('#url').val();

    // Validate
    if(url === '')
    {
        $('#valid_input').css({'opacity': '1', 'visibility': 'visible', 'transform': 'translateY(-70%) scaleX(1)', 'transform-origin': 'left'});
        $('#valid_input').text('Please enter video URL.');
    }
    else if(!valid_url(url))
    {
        $('#valid_input').css({'opacity': '1', 'visibility': 'visible', 'transform': 'translateY(-70%) scaleX(1)', 'transform-origin': 'left'});
        $('#valid_input').text('URL is not valid. Please check again.');
    }
    else
    {
        // Play animation
        $('#btn_download').prop('disabled', true);
        $('#btn_download').text('Analyzing....');
        $('#btn_download').css('--state', 'running');
        $('#valid_input').css({'opacity': '0', 'visibility': 'hidden', 'transform': 'translateY(-70%) scaleX(0)', 'transform-origin': 'right'});
        $('#valid_input').text('');
    }


    // Fetch API
    const form_data = new FormData();
    form_data.append('video_url', url);
    let fetch_data = await fetch('apps/app_1.php', {
        method: 'POST',
        body: form_data
    })

    let response = await fetch_data.json();

    if(response.is_success)
    {
        // Paused animation
        $('#btn_download').prop('disabled', false);
        $('#btn_download').text('Submit');
        $('#btn_download').css('--state', 'paused');
        
        $('#try_it').css({'opacity': '1', 'visibility': 'visible'});
        $('#method_2').css({'opacity': '1', 'visibility': 'visible'});

        // Result
        $('#result_box').css({'opacity': '1', 'visibility': 'visible', 'transform': 'scaleY(1)', 'transform-origin': 'bottom'});
        $('#org_url').prop('href', url);
        $('#org_url').text(url);

        fetch_api(response, url);

        $('#url').val(null);
    }
    else
    {
        alert(response.message);
    }
}

// Reg URL
function valid_url(value)
{
    let pattern = /^(?:https:\/\/)?(?:fb.watch\/|www\.facebook\.com\/)?(?:[\w\d].*\/)?(?:videos\/)?(?:[\w\d]*\/)?$/;

    return pattern.test(value);
}

// Scroll navbar
$(function() {
    let navbar = $('.navbar');

    $(window).scroll(function(){
        if($(window).scrollTop() <= 150)
        {
            navbar.removeClass('scroll');
        }
        else
        {
            navbar.addClass('scroll');
        }
    });
});

// Method 2
$('#try_it').click(() => {
    $('#btn_how').css({'opacity': '1', 'visibility': 'visible'});
    $('#group_source').css({'opacity': '1', 'visibility': 'visible'});
}
);

async function method_2()
{
    $('#sd_link').empty();
    $('#hd_link').empty();
    const file = document.getElementById('file');
    const form_data = new FormData();
    form_data.append('source', file.files[0]);
    let fetch_data = await fetch('apps/app_2.php', {
        method: 'POST',
        body: form_data
    });
    let response = await fetch_data.json();

    if(response.is_success)
    {
        fetch_api(response);
        $('#file').val(null);
        $('#source').val(null);
        $('#copy_btn').text('Copy it.');
    }
}


function fetch_api(response, url)
{
     // Video Title
     $('#video_title').text(response.title);

     // Links
     let count = 0;
     let elements = '';
     // SD Link
     const links = response.links;
     Object.keys(links).forEach((key) => {

         // SD Link
         if(key === 'sd_link' && links[key] === '0 Links Found')
         {
             elements = '0 Links Found';
             $('#sd_link').append(elements);
         }
         else if(key === 'sd_link' && links[key] !== '0 Links Found')
         {
             elements = `<a href="${links[key]}">
             <button type="button" class="btn btn-primary download_btn" style="--i: #4cc9f0;">
               <span>Download SD Video</span>
             </button>
             </a>`;
             $('#sd_link').append(elements);
             count++;
         }
         // HD Link
         if(key === 'hd_link' && links[key] === '0 Links Found')
         {
             elements = '0 Links Found';
             $('#hd_link').append(elements);
         }
         else if(key === 'hd_link' && links[key] !== '0 Links Found')
         {
             elements = `<a href="${links[key]}">
             <button type="button" class="btn btn-primary download_btn" style="--i: #4361ee;">
               <span>Download HD Video</span>
             </button>
             </a>`;
             $('#hd_link').append(elements);
             count++;
         }
     });

     // Notification
     $('#notification').css({'opacity': '1', 'visibility': 'visible'});
     if(count == 0)
     {
         $('#notification').text('0 Links Found');
         $('#notification').css('background-color', 'var(--red)');
         $('.another_method').css({'opacity': '1', 'visibility': 'visible'});
         // Generate view-source
         document.getElementById('source').value = `view-source:${url}`;
         copy();
     }
     else if(count == 1)
     {
         $('#notification').text('1 Links Found');
         $('#notification').css('background-color', 'var(--green)');
         $('.another_method').css({'opacity': '1', 'visibility': 'visible'});
         // Generate view-source   
         document.getElementById('source').value = `view-source:${url}`;
         copy();
     }
     else if(count == 2)
     {
         $('#notification').text('2 Links Found');
         $('#notification').css('background-color', 'var(--green)');
         $('.another_method').css({'opacity': '0', 'visibility': 'hidden'});
         $('#source').val(null);
     }
}

function copy()
{
    const input = document.getElementById('source');
    $('#copy_btn').click(() => {
        $('#copy_btn').text('Copied!');
        input.select();
        document.execCommand('copy');
    });
}