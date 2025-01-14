

Pusher.logToConsole = true;
    var pusher = new Pusher('bbad5a8e394db843afe9', {
    cluster: 'ap1'
    });
    var channel = pusher.subscribe('social-channel');
    channel.bind('new-post', function(data) {
    if (data && data.post ) {
        toastr.success('New Post Created', 'User Name ' + data.post.student_name + '<br>Title: ' + data.post.title, {
        timeOut: 0,
        extendedTimeOut: 0,
        });
    } else {
        console.error('Invalid Data Structure Received:', data);
    }
    });