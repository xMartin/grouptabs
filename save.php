<?php
if (@file_put_contents('./data/badminton.json', $_POST['data']) !== FALSE) {
	echo "success";
}
else {
	echo "error";
}
