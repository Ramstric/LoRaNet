<?php
$link = mysqli_connect('localhost', 'RamonHdez', '1605', 'test');

//if connection is not successful you will see text error
if (!$link) {
       die('Could not connect: ' . mysql_error());
}

//$query = mysqli_query ($link, "SELECT * FROM myTable;");

$query = mysqli_query($link, "SELECT * FROM (SELECT * FROM myTable WHERE id_dispositivo = 1 ORDER BY id DESC LIMIT 15) AS temp ORDER BY id ASC;");



$data = array();
while($enr = mysqli_fetch_assoc($query)){
    $a = array($enr['hora'], $enr['temperatura']);
    array_push($data, $a);
}

echo json_encode($data);
?>
