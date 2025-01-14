<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification Example</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
</head>
<body>
  <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
  <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
  <script>
    Pusher.logToConsole = true;

// Khởi tạo Pusher
var pusher = new Pusher('bbad5a8e394db843afe9', {
  cluster: 'ap1'
});

// Đăng ký channel
var channel = pusher.subscribe('my-channel');

// Lắng nghe sự kiện
channel.bind('my-confirmed', function(data) {
  // Kiểm tra dữ liệu hợp lệ
  if (data && data.type) {
    if (data.type === 2) {
      toastr.success(
        'New Notification:',
        `Title: ${data.title}<br>Content: ${data.content}`, // Hiển thị thông báo
        {
          timeOut: 5000,
          extendedTimeOut: 2000,
        }
      );
    } else if (data.type === 3) {
      toastr.error(
        'New Notification:',
        `Title: ${data.title}<br>Content: ${data.content}`, // Hiển thị thông báo
        {
          timeOut: 5000,
          extendedTimeOut: 2000,
        }
      );
    } else {
      console.warn('Unhandled type:', data.type);
    }
  } else {
    console.error('Invalid data structure received:', data);
  }
});

  </script>
</body>
</html>
