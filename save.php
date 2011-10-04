<?php
$bak_file_name = './data/bak/badminton_'. time() .'.json';
if (@copy('./data/badminton.json', $bak_file_name)) {
	if (@file_put_contents('./data/badminton.json', $_POST['data']) !== FALSE) {
		echo "success";
	}
}
else {
	echo "error";
}
