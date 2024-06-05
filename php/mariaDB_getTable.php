<?php
$link = mysqli_connect('localhost', 'RamonHdez', '1605', 'test');

//if connection is not successful you will see text error
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

$query = mysqli_query ($link, "SELECT * FROM myTable;");

$data = array();
while($enr = mysqli_fetch_assoc($query)){
    $a = array($enr['fecha'], $enr['hora'], $enr['id_dispositivo'], $enr['temperatura']);
    array_push($data, $a);
}

echo json_encode($data);
?>
